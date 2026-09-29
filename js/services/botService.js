/**
 * TRAVEL PLANNER INDIA - BOT SERVICE
 * Handles communication with the backend graph API.
 */

export const getBotReplyStreaming = async (query, threadId, onChunk, onComplete, isExplore = false, onImages = null) => {
    try {
        const response = await fetch('/api/generate-itinerary', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query: query, thread_id: threadId, is_explore: isExplore }),
        });

        if (!response.body) return;

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';
            
            for (const line of lines) {
                const trimmed = line.trim();
                if (trimmed.startsWith('data: ')) {
                    try {
                        const data = JSON.parse(trimmed.substring(6));
                        if (data.content) {
                            onChunk(data.content);
                        }
                        if (data.images && typeof onImages === 'function') {
                            onImages(data.images);
                        }
                    } catch (e) {
                        // ignore malformed or partial line
                    }
                }
            }
        }
        if (buffer.trim().startsWith('data: ')) {
            try {
                const data = JSON.parse(buffer.trim().substring(6));
                if (data.content) {
                    onChunk(data.content);
                }
                if (data.images && typeof onImages === 'function') {
                    onImages(data.images);
                }
            } catch (e) {}
        }
        onComplete();
    } catch (error) {
        console.error("Error streaming from bot:", error);
        onChunk("Sorry, I encountered an error while planning your trip.");
        onComplete();
    }
};
