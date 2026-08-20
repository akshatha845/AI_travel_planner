import os
import sqlite3
import logging
from pathlib import Path
from typing import Annotated, TypedDict, Optional
from langgraph.graph import StateGraph, END
from langgraph.graph.message import add_messages
from langgraph.checkpoint.sqlite import SqliteSaver
from langchain_ollama import ChatOllama
from langchain_core.messages import BaseMessage, HumanMessage
from langchain_core.prompts import ChatPromptTemplate

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load prompts
PROMPTS_DIR = Path(__file__).parent / "prompts"

def load_prompt(filename: str):
    return (PROMPTS_DIR / filename).read_text()

# Define state
class State(TypedDict):
    messages: Annotated[list[BaseMessage], add_messages]
    plan: str
    requirements: str
    title: Optional[str]

# Initialize the LLM with streaming enabled
llm = ChatOllama(model="llama3.2:latest", streaming=True)

# Define nodes
def planner_node(state: State):
    logger.info("Planner Node: Starting")
    query = state["messages"][-1].content
    prompt_template = ChatPromptTemplate.from_template(load_prompt("planner_prompt.md"))
    prompt = prompt_template.format(query=query)
    
    response = llm.invoke(prompt)
    logger.info("Planner Node: Completed")
    return {"requirements": response.content}

def itinerary_planner_node(state: State):
    logger.info("Itinerary Planner Node: Starting")
    requirements = state["requirements"]
    prompt_template = ChatPromptTemplate.from_template(load_prompt("itinerary_prompt.md"))
    prompt = prompt_template.format(requirements=requirements)
    
    # Stream the response to build the state
    full_content = ""
    for chunk in llm.stream(prompt):
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
    response = llm.invoke(prompt)
    
    # Clean the response to ensure it's just the title
    title = response.content.strip().strip('"').strip("'")
    
    logger.info(f"Title Generation Node: Generated '{title}'")
    return {"title": title}

# Setup graph
builder = StateGraph(State)
builder.add_node("planner", planner_node)
builder.add_node("itinerary_planner", itinerary_planner_node)
builder.add_node("title_generator", title_generation_node)

builder.add_edge("planner", "title_generator")
builder.add_edge("title_generator", "itinerary_planner")
builder.add_edge("itinerary_planner", END)
builder.set_entry_point("planner")

# Persistence (Short term memory)
sqlite_path = os.path.join(os.path.dirname(__file__), "instance", "checkpoints.db")
conn = sqlite3.connect(sqlite_path, check_same_thread=False)
checkpointer = SqliteSaver(conn)
graph = builder.compile(checkpointer=checkpointer)

def run_graph(user_query, thread_id="1"):
    config = {"configurable": {"thread_id": thread_id}}
    
    # Run the graph and stream tokens directly from the itinerary_planner node
    # Use stream_mode="messages" to get token events
    for event in graph.stream({"messages": [HumanMessage(content=user_query)]}, config=config, stream_mode="messages"):
        msg, metadata = event
        if metadata.get("langgraph_node") == "itinerary_planner" and hasattr(msg, 'content') and msg.content:
            yield msg.content
