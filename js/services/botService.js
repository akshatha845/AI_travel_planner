/**
 * TRAVEL PLANNER INDIA - BOT SERVICE
 * Handles communication with the backend graph API.
 */

export const getBotReplyStreaming = async (query, threadId, onChunk, onComplete) => {
    try {
        const response = await fetch('/api/generate-itinerary', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query: query, thread_id: threadId }),
        });

        if (!response.body) return;

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            
            const chunk = decoder.decode(value, { stream: true });
            
            // The backend sends SSE format: "data: {"content": "..."}\n\n"
            const lines = chunk.split('\n');
            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    const data = JSON.parse(line.substring(6));
                    if (data.content) {
                        onChunk(data.content);
                    }
                }
            }
        }
        onComplete();
    } catch (error) {
        console.error("Error streaming from bot:", error);
        onChunk("Sorry, I encountered an error while planning your trip.");
        onComplete();
    }
};
