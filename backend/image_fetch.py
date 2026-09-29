from langchain_core.tools import tool
import wikipedia

wikipedia.set_user_agent("MyTravelPlannerApp/1.0 (contact@example.com)")

@tool
def fetch_wikipedia_images(query: str) -> list[str]:
    """Search Wikipedia for a topic and return a list of image URLs from the page."""
    try:
        # Get the Wikipedia page object
        page = wikipedia.page(query, auto_suggest=False)
        # page.images returns a list of all image URLs on that page
        return page.images 
    except Exception as e:
        return [f"Could not fetch images: {str(e)}"]

print(fetch_wikipedia_images.invoke("Paris"))