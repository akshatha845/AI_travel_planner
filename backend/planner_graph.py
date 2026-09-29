import os
import re
import json
import urllib.parse
import sqlite3
import logging
from pathlib import Path
from typing import Annotated, TypedDict, Optional
from langgraph.graph import StateGraph, END
from langgraph.graph.message import add_messages
from langgraph.checkpoint.sqlite import SqliteSaver
from langchain_ollama import ChatOllama
from langchain_core.messages import BaseMessage, HumanMessage, AIMessage
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.tools import tool

import wikipedia
wikipedia.set_user_agent("TravelPlannerBot/1.0 (https://travelplanner.in; contact@travelplanner.in)")
from langchain_community.tools import WikipediaQueryRun
from langchain_community.utilities import WikipediaAPIWrapper

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load prompts
PROMPTS_DIR = Path(__file__).parent / "prompts"

def load_prompt(filename: str) -> str:
    return (PROMPTS_DIR / filename).read_text()

REJECTION_MESSAGE = "I can only generate travel and itinerary plans. Please ask a travel-related question, such as exploring destinations, planning a trip itinerary, or discovering activities and attractions."

# Initialize Wikipedia Tool
api_wrapper = WikipediaAPIWrapper(top_k_results=1, doc_content_chars_max=1000)
wikipedia_tool = WikipediaQueryRun(api_wrapper=api_wrapper)

@tool
def fetch_wikipedia_images(query: str) -> list[str]:
    """Search Wikipedia for a topic and return a list of image URLs from the page."""
    try:
        # Get the Wikipedia page object
        page = wikipedia.page(query, auto_suggest=False)
        # page.images returns a list of all image URLs on that page
        return page.images 
    except Exception as e:
        try:
            page = wikipedia.page(query, auto_suggest=True)
            return page.images
        except Exception as e2:
            try:
                search_res = wikipedia.search(query)
                if search_res:
                    page = wikipedia.page(search_res[0], auto_suggest=False)
                    return page.images
            except Exception:
                pass
            return [f"Could not fetch images: {str(e2)}"]

def get_scenic_photo_candidates(query: str) -> list[str]:
    """Fetch raw images from Wikipedia for a specific landmark and pre-filter out text, maps, diagrams, and non-photos."""
    raw_images = []
    try:
        page = wikipedia.page(query, auto_suggest=False)
        raw_images = page.images
    except Exception:
        try:
            page = wikipedia.page(query, auto_suggest=True)
            raw_images = page.images
        except Exception:
            try:
                search_res = wikipedia.search(query)
                if search_res:
                    page = wikipedia.page(search_res[0], auto_suggest=False)
                    raw_images = page.images
            except Exception:
                pass

    if not isinstance(raw_images, list):
        return []

    valid_exts = ('.jpg', '.jpeg', '.png', '.webp')
    disallowed = (
        'text', 'quote', 'sign', 'signature', 'stamp', 'seal', 'coin', 'currency', 'rupee',
        'inscription', 'manuscript', 'script', 'document', 'letter', 'newspaper', 'poster',
        'plaque', 'statute', 'law', 'coat_of_arms', 'crest', 'flag', 'banner', 'logo', 'icon',
        'map', 'locator', 'chart', 'diagram', 'graph', 'census', 'demographics', 'route',
        'drawing', 'sketch', 'vector', 'silhouette', 'blank', 'placeholder', 'stub', 'ambox',
        'wikimedia', 'wikisource', 'wikiquote', 'wiktionary', 'commons-logo', 'portal',
        'disambig', 'scan', 'page', 'folio', 'book', 'plate', 'table', 'fig', 'figure',
        'elevation', 'plan', 'blueprint', 'layout', 'ground_plan', 'cross_section',
        'symbol', 'emblem', 'insignia', 'monogram', 'autograph', 'postmark', 'ticket',
        'label', 'cover', 'title_page', 'frontispiece', 'engraving', 'woodcut',
        'graph_bar', 'pie_chart', 'official', 'government', 'gazette', 'press_release'
    )

    clean_candidates = []
    seen = set()
    for u in raw_images:
        if not isinstance(u, str) or not u.startswith("http"):
            continue
        clean_u = u.split("?")[0]
        lower_u = clean_u.lower()
        if not any(lower_u.endswith(ext) for ext in valid_exts):
            continue
        fname = clean_u.split("/")[-1]
        decoded = urllib.parse.unquote(fname).lower()
        if any(bad in decoded for bad in disallowed):
            continue
        if clean_u in seen:
            continue
        seen.add(clean_u)
        clean_candidates.append(u)
        if len(clean_candidates) >= 8:
            break

    return clean_candidates

def select_best_image_for_spot(spot: str, candidates: list[str]) -> Optional[dict]:
    """Uses LLM to evaluate candidate photos and select the single best scenic photograph for the spot."""
    if not candidates:
        return None
    if len(candidates) == 1:
        return {"url": candidates[0], "title": spot}

    numbered_list = ""
    for idx, u in enumerate(candidates, 1):
        fname = urllib.parse.unquote(u.split("/")[-1].split("?")[0])
        numbered_list += f"{idx}. Filename: {fname} | URL: {u}\n"

    selection_prompt = (
        f"You are a travel photo curator. A traveler wants to view a scenic photograph of the specific landmark: \"{spot}\".\n"
        "Here are candidate image URLs found on Wikipedia:\n"
        f"{numbered_list}\n"
        "TASK:\n"
        f"Select the SINGLE best image URL that accurately and scenically depicts \"{spot}\" as a travel destination.\n"
        "STRICT CRITERIA:\n"
        "- The image MUST be an authentic scenic landscape, monument, temple, building, lake, or outdoor attraction photo.\n"
        "- REJECT any image that contains text, book pages, coins, stamps, seals, maps, charts, diagrams, or drawings.\n"
        "- Output ONLY the exact chosen URL from the list above. Do NOT include numbering, explanations, or quotes.\n"
        "- If none of the candidates are authentic scenic photos of the place, reply with 'NONE'.\n\n"
        "Chosen URL:"
    )

    try:
        response = structured_llm.invoke(selection_prompt)
        content = response.content.strip()

        if "NONE" in content.upper() and not any(cand in content for cand in candidates):
            logger.info(f"LLM determined no suitable scenic photo for '{spot}'")
            return None

        # Check if one of candidate URLs is in the response
        for u in candidates:
            if u in content or u.split("?")[0] in content:
                logger.info(f"LLM selected photo for '{spot}': {u}")
                return {"url": u, "title": spot}

        # Check for number index match
        match = re.search(r'\b([1-8])\b', content)
        if match:
            idx = int(match.group(1)) - 1
            if 0 <= idx < len(candidates):
                chosen = candidates[idx]
                logger.info(f"LLM selected candidate #{idx+1} for '{spot}': {chosen}")
                return {"url": chosen, "title": spot}
    except Exception as e:
        logger.warning(f"Error during LLM image selection for '{spot}': {e}")

    # Fallback to the first candidate photo
    logger.info(f"Fallback: selected first candidate photo for '{spot}': {candidates[0]}")
    return {"url": candidates[0], "title": spot}

# Define state
class State(TypedDict):
    messages: Annotated[list[BaseMessage], add_messages]
    plan: Optional[str]
    title: Optional[str]
    is_travel_related: Optional[bool]
    place: Optional[str]
    wiki_context: Optional[str]
    is_explore: Optional[bool]
    images: Optional[list[dict]]
    classification: Optional[str]

# Initialize LLM instances
structured_llm = ChatOllama(model="llama3.2:latest", streaming=False)
streaming_llm = ChatOllama(model="llama3.2:latest", streaming=True)

# Define nodes
def guardrail_node(state: State):
    logger.info("Guardrail Node: Checking if query is travel-related or follow-up")
    query = state["messages"][-1].content
    
    # Check if there are previous messages for this thread
    history_messages = state["messages"][:-1]
    if history_messages:
        logger.info(f"Guardrail Node: Found {len(history_messages)} previous messages in thread")
        recent = history_messages[-2:] # previous 2 messages (human and bot)
        prev_context = ""
        for m in recent:
            role = "User" if isinstance(m, HumanMessage) else "Assistant"
            snippet = m.content[:300] + ("..." if len(m.content) > 300 else "")
            prev_context += f"{role}: {snippet}\n"
    else:
        logger.info("Guardrail Node: No previous messages in thread")
        prev_context = "No previous messages in this conversation."

    prompt_template = ChatPromptTemplate.from_template(load_prompt("classifier_prompt.md"))
    prompt = prompt_template.format(query=query, previous_context=prev_context)
    
    response = structured_llm.invoke(prompt)
    raw_decision = response.content.strip().upper()
    logger.info(f"Guardrail Node: Raw classification is '{raw_decision}'")
    
    normalized = raw_decision.replace("_", "").replace("-", "").replace(" ", "").strip()
    if "FOLLOWUP" in normalized:
        is_travel = True
        classification = "FOLLOWUP"
    elif "NOT" in normalized or "NON" in normalized or normalized.startswith("NO"):
        is_travel = False
        classification = "NOT_TRAVEL"
    elif "TRAVEL" in normalized or "YES" in normalized:
        is_travel = True
        classification = "TRAVEL"
    else:
        is_travel = False
        classification = "NOT_TRAVEL"

    logger.info(f"Guardrail Node: Decision -> {classification} (is_travel_related={is_travel})")
    return {"is_travel_related": is_travel, "classification": classification}

def rejection_node(state: State):
    logger.info("Rejection Node: Returning strict out-of-scope response")
    return {
        "plan": REJECTION_MESSAGE,
        "messages": [AIMessage(content=REJECTION_MESSAGE)]
    }

def place_extraction_and_wiki_node(state: State):
    logger.info("Place Extraction & Wiki Node: Extracting main travel destination")
    query = state["messages"][-1].content
    history_messages = state["messages"][:-1]
    recent_history = ""
    if history_messages:
        for m in history_messages[-2:]:
            role = "User" if isinstance(m, HumanMessage) else "Assistant"
            recent_history += f"{role}: {m.content[:300]}\n"

    extract_prompt = (
        "You are a travel entity extractor. Extract the primary destination, city, state, region, attraction, or festival "
        "from the travel conversation for a Wikipedia search.\n"
        "If the current query refers to a previously discussed place (e.g. 'the same', 'this', 'yes', 'make it 3 days'), "
        "identify the destination from the recent conversation history.\n"
        "Respond with ONLY the exact name of the place or entity (1 to 4 words), and nothing else. No punctuation, no quotes, no conversational filler.\n\n"
        f"Recent Conversation History:\n{recent_history or 'None'}\n\n"
        f"Current Travel Query: {query}\n"
        "Extracted Place:"
    )
    place_response = structured_llm.invoke(extract_prompt)
    extracted_place = place_response.content.strip().strip('"\'')

    # Fallback to existing state place if extraction returned generic word
    if (not extracted_place or extracted_place.lower() in ("none", "n/a", "unknown", "the same", "same", "this")) and state.get("place"):
        extracted_place = state["place"]

    logger.info(f"Place Extraction Node: Extracted place '{extracted_place}'")

    wiki_context = ""
    if extracted_place and extracted_place.lower() not in ("none", "n/a", "unknown", ""):
        try:
            logger.info(f"Querying Wikipedia tool for: '{extracted_place}'")
            wiki_res = wikipedia_tool.run(extracted_place)
            if "No good Wikipedia Search Result was found" not in wiki_res:
                wiki_context = wiki_res
                logger.info(f"Wikipedia tool retrieved {len(wiki_context)} chars of context")
            else:
                logger.info(f"Wikipedia tool found no match for '{extracted_place}'")
        except Exception as e:
            logger.warning(f"Wikipedia tool lookup failed for '{extracted_place}': {e}")

    return {
        "place": extracted_place,
        "wiki_context": wiki_context
    }

def title_generation_node(state: State):
    logger.info("Title Generation Node: Starting")
    if state.get("title"):
        logger.info("Title already exists, skipping")
        return {}

    query = state["messages"][-1].content
    prompt = f"Generate a short, 3-5 word title for a travel planning conversation about: {query}. Output ONLY the title text, nothing else."
    response = structured_llm.invoke(prompt)
    
    title = response.content.strip().strip('"').strip("'")
    logger.info(f"Title Generation Node: Generated '{title}'")
    return {"title": title}

def details_explorer_node(state: State):
    logger.info("Details Explorer Node: Starting exploration details generation")
    query = state["messages"][-1].content
    wiki_context = state.get("wiki_context") or "No specific Wikipedia context found. Rely on factual geographical and cultural knowledge."
    
    prompt_template = ChatPromptTemplate.from_template(load_prompt("details_explorer_prompt.md"))
    prompt = prompt_template.format(query=query, wiki_context=wiki_context)
    
    # Stream the response
    full_content = ""
    for chunk in streaming_llm.stream(prompt):
        full_content += chunk.content
        
    logger.info("Details Explorer Node: Completed")
    return {"plan": full_content}

def itinerary_planner_node(state: State):
    logger.info("Itinerary Planner Node: Starting itinerary generation")
    query = state["messages"][-1].content
    wiki_context = state.get("wiki_context") or "No specific Wikipedia context found. Rely on factual geographical and travel knowledge."
    
    # Extract last 2 previous messages (human and bot) to pass as conversation_history context
    history_messages = state["messages"][:-1]
    history_str = ""
    if history_messages:
        for m in history_messages[-2:]:
            role = "User" if isinstance(m, HumanMessage) else "Assistant"
            snippet = m.content[:500] + ("..." if len(m.content) > 500 else "")
            history_str += f"{role}: {snippet}\n\n"
    else:
        history_str = "None (Start of conversation)."

    prompt_template = ChatPromptTemplate.from_template(load_prompt("itinerary_prompt.md"))
    prompt = prompt_template.format(
        query=query,
        conversation_history=history_str,
        wiki_context=wiki_context
    )
    
    # Stream the response
    full_content = ""
    for chunk in streaming_llm.stream(prompt):
        full_content += chunk.content
        
    logger.info("Itinerary Planner Node: Completed")
    return {"plan": full_content}

def image_curator_node(state: State):
    """
    Extracts top 3 specific landmarks/places from the generated itinerary or exploration guide,
    queries Wikipedia for candidate photos, filters out text/maps/diagrams,
    and asks LLM to pick the single best photo per spot (max 3 total).
    """
    logger.info("Image Curator Node: Starting post-itinerary landmark extraction and image curation")
    plan = state.get("plan") or ""
    if not plan or plan == REJECTION_MESSAGE:
        return {"images": []}

    place = state.get("place") or ""
    user_query = state["messages"][-1].content if state.get("messages") else ""
    context_topic = place if place else user_query

    extraction_prompt = (
        f"You are an expert travel sight extractor.\n"
        f"Analyze the travel itinerary or travel guide content below regarding '{context_topic}' and extract the TOP 3 specific famous sights, "
        "landmarks, temples, pandals, monuments, lakes, forts, waterfalls, or attractions mentioned in or directly relevant to it.\n\n"
        "CRITICAL RULES:\n"
        f"1. Extract ONLY sights, attractions, and places relevant to '{context_topic}' and the travel content below.\n"
        "2. DO NOT extract sights from other unrelated regions of India (e.g. do not extract Goa, Rajasthan, or Tamil Nadu sights unless the travel content is specifically about them).\n"
        "3. Focus on specific individual attractions, temples, pandals, monuments, forts, lakes, valleys, bridges, or famous landmarks.\n"
        "4. Extract at most 3 distinct specific sights.\n"
        "5. Respond ONLY with a valid JSON array of strings, for example: [\"Sight 1\", \"Sight 2\", \"Sight 3\"]. Do not include markdown codeblocks, explanations, or any other text.\n\n"
        f"Travel Plan Content:\n{plan[:3000]}\n\n"
        "JSON Array:"
    )

    spots = []
    text = ""
    try:
        resp = structured_llm.invoke(extraction_prompt)
        text = resp.content.strip()
        match = re.search(r'\[\s*".*?"\s*(?:,\s*".*?"\s*)*\]', text, re.DOTALL)
        if match:
            spots = json.loads(match.group(0))
        else:
            clean_text = re.sub(r'^```[a-z]*', '', text).replace('```', '').strip()
            spots = json.loads(clean_text)
    except Exception as e:
        logger.warning(f"Error parsing extracted spots from LLM: {e}")
        spots = re.findall(r'"([^"]+)"', text)

    valid_spots = []
    generic_words = {"india", "goa", "kerala", "rajasthan", "arunachal pradesh", "himachal pradesh", "ladakh", "kashmir", "delhi", "mumbai"}
    for s in spots:
        if isinstance(s, str):
            clean_s = s.strip()
            if clean_s and clean_s.lower() not in generic_words and clean_s not in valid_spots:
                valid_spots.append(clean_s)
        if len(valid_spots) >= 3:
            break

    if not valid_spots and state.get("place"):
        valid_spots = [state["place"]]

    logger.info(f"Image Curator Node: Extracted top 3 specific sights: {valid_spots}")

    curated_images = []
    seen_urls = set()
    for spot in valid_spots[:3]:
        logger.info(f"Image Curator Node: Fetching and curating candidate photos for spot: '{spot}'")
        candidates = get_scenic_photo_candidates(spot)
        candidates = [c for c in candidates if c not in seen_urls]
        if candidates:
            best_img = select_best_image_for_spot(spot, candidates)
            if best_img and best_img.get("url") and best_img["url"] not in seen_urls:
                seen_urls.add(best_img["url"])
                curated_images.append(best_img)

    logger.info(f"Image Curator Node: Final curated images count = {len(curated_images)}")
    return {"images": curated_images}

def route_after_guardrail(state: State):
    if state.get("is_travel_related", False):
        return "place_info"
    return "rejection_handler"

def route_after_title(state: State):
    if state.get("is_explore", False):
        logger.info("Routing to 'details_explorer' because is_explore is True")
        return "details_explorer"
    logger.info("Routing to 'itinerary_planner' because is_explore is False")
    return "itinerary_planner"

# Setup graph
builder = StateGraph(State)
builder.add_node("guardrail", guardrail_node)
builder.add_node("rejection_handler", rejection_node)
builder.add_node("place_info", place_extraction_and_wiki_node)
builder.add_node("title_generator", title_generation_node)
builder.add_node("details_explorer", details_explorer_node)
builder.add_node("itinerary_planner", itinerary_planner_node)
builder.add_node("image_curator", image_curator_node)

builder.set_entry_point("guardrail")
builder.add_conditional_edges(
    "guardrail",
    route_after_guardrail,
    {
        "place_info": "place_info",
        "rejection_handler": "rejection_handler"
    }
)
builder.add_edge("place_info", "title_generator")
builder.add_conditional_edges(
    "title_generator",
    route_after_title,
    {
        "details_explorer": "details_explorer",
        "itinerary_planner": "itinerary_planner"
    }
)
builder.add_edge("details_explorer", "image_curator")
builder.add_edge("itinerary_planner", "image_curator")
builder.add_edge("image_curator", END)
builder.add_edge("rejection_handler", END)

# Persistence (Short term memory)
sqlite_path = os.path.join(os.path.dirname(__file__), "instance", "checkpoints.db")
os.makedirs(os.path.dirname(sqlite_path), exist_ok=True)
conn = sqlite3.connect(sqlite_path, check_same_thread=False)
checkpointer = SqliteSaver(conn)
graph = builder.compile(checkpointer=checkpointer)

def run_graph(user_query, thread_id="1", is_explore=False):
    config = {"configurable": {"thread_id": thread_id}}
    
    # Run the graph and stream tokens directly from details_explorer, itinerary_planner, or rejection_handler node
    input_state = {
        "messages": [HumanMessage(content=user_query)],
        "is_explore": is_explore
    }
    for event in graph.stream(input_state, config=config, stream_mode="messages"):
        msg, metadata = event
        node = metadata.get("langgraph_node")
        if node in ("details_explorer", "itinerary_planner", "rejection_handler") and hasattr(msg, 'content') and msg.content:
            yield msg.content
