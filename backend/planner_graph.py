import os
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

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load prompts
PROMPTS_DIR = Path(__file__).parent / "prompts"

def load_prompt(filename: str) -> str:
    return (PROMPTS_DIR / filename).read_text()

REJECTION_MESSAGE = "I can only generate travel and itinerary plans. Please ask a travel-related question, such as exploring destinations, planning a trip itinerary, or discovering activities and attractions."

# Define state
class State(TypedDict):
    messages: Annotated[list[BaseMessage], add_messages]
    plan: Optional[str]
    requirements: Optional[str]
    title: Optional[str]
    is_travel_related: Optional[bool]

# Initialize LLM instances
structured_llm = ChatOllama(model="llama3.2:latest", streaming=False)
streaming_llm = ChatOllama(model="llama3.2:latest", streaming=True)

# Define nodes
def guardrail_node(state: State):
    logger.info("Guardrail Node: Checking if query is travel-related")
    query = state["messages"][-1].content
    prompt_template = ChatPromptTemplate.from_template(load_prompt("classifier_prompt.md"))
    prompt = prompt_template.format(query=query)
    
    response = structured_llm.invoke(prompt)
    raw_decision = response.content.strip().upper()
    logger.info(f"Guardrail Node: Raw classification is '{raw_decision}'")
    
    normalized = raw_decision.replace("_", "").replace("-", "").replace(" ", "").strip()
    if "NOT" in normalized or "NON" in normalized or normalized.startswith("NO"):
        is_travel = False
    elif "TRAVEL" in normalized or "YES" in normalized:
        is_travel = True
    else:
        is_travel = False

    logger.info(f"Guardrail Node: Is travel related -> {is_travel}")
    return {"is_travel_related": is_travel}

def rejection_node(state: State):
    logger.info("Rejection Node: Returning strict out-of-scope response")
    return {
        "plan": REJECTION_MESSAGE,
        "messages": [AIMessage(content=REJECTION_MESSAGE)]
    }

def planner_node(state: State):
    logger.info("Planner Node: Starting requirements extraction")
    query = state["messages"][-1].content
    prompt_template = ChatPromptTemplate.from_template(load_prompt("planner_prompt.md"))
    prompt = prompt_template.format(query=query)
    
    response = structured_llm.invoke(prompt)
    logger.info("Planner Node: Requirements extraction completed")
    return {"requirements": response.content}

def itinerary_planner_node(state: State):
    logger.info("Itinerary Planner Node: Starting itinerary generation")
    requirements = state.get("requirements", "")
    prompt_template = ChatPromptTemplate.from_template(load_prompt("itinerary_prompt.md"))
    prompt = prompt_template.format(requirements=requirements)
    
    # Stream the response to build the state
    full_content = ""
    for chunk in streaming_llm.stream(prompt):
        full_content += chunk.content
        
    logger.info("Itinerary Planner Node: Completed")
    return {"plan": full_content}

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

def route_after_guardrail(state: State):
    if state.get("is_travel_related", False):
        return "planner"
    return "rejection_handler"

# Setup graph
builder = StateGraph(State)
builder.add_node("guardrail", guardrail_node)
builder.add_node("rejection_handler", rejection_node)
builder.add_node("planner", planner_node)
builder.add_node("title_generator", title_generation_node)
builder.add_node("itinerary_planner", itinerary_planner_node)

builder.set_entry_point("guardrail")
builder.add_conditional_edges(
    "guardrail",
    route_after_guardrail,
    {
        "planner": "planner",
        "rejection_handler": "rejection_handler"
    }
)
builder.add_edge("planner", "title_generator")
builder.add_edge("title_generator", "itinerary_planner")
builder.add_edge("itinerary_planner", END)
builder.add_edge("rejection_handler", END)

# Persistence (Short term memory)
sqlite_path = os.path.join(os.path.dirname(__file__), "instance", "checkpoints.db")
os.makedirs(os.path.dirname(sqlite_path), exist_ok=True)
conn = sqlite3.connect(sqlite_path, check_same_thread=False)
checkpointer = SqliteSaver(conn)
graph = builder.compile(checkpointer=checkpointer)

def run_graph(user_query, thread_id="1"):
    config = {"configurable": {"thread_id": thread_id}}
    
    # Run the graph and stream tokens directly from the itinerary_planner or rejection_handler node
    # Use stream_mode="messages" to get token events
    for event in graph.stream({"messages": [HumanMessage(content=user_query)]}, config=config, stream_mode="messages"):
        msg, metadata = event
        node = metadata.get("langgraph_node")
        if node in ("itinerary_planner", "rejection_handler") and hasattr(msg, 'content') and msg.content:
            yield msg.content
