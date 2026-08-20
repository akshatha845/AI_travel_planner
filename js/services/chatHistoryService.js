/**
 * TRAVEL PLANNER INDIA - CHAT HISTORY SERVICE
 * Handles persistence of the chatbot conversation in sessionStorage
 * so it survives page reloads within the same tab session.
 */

const HISTORY_KEY = 'chatHistory';

/**
 * saveMessage: Appends a new message to the stored chat history.
 * @param {string} sender - 'user' or 'bot'.
 * @param {string} text - Message content.
 * @param {boolean} isHtml - Format flag.
 */
export const saveMessage = (sender, text, isHtml = false) => {
    let history = loadHistory();
    history.push({ sender, text, isHtml });
    sessionStorage.setItem(HISTORY_KEY, JSON.stringify(history));
};

/**
 * loadHistory: Retrieves the stored conversation array.
 * @returns {Array} The chat history, or an empty array if none exists.
 */
export const loadHistory = () => {
    try {
        return JSON.parse(sessionStorage.getItem(HISTORY_KEY) || '[]');
    } catch (e) {
        return [];
    }
};

/**
 * getWelcomeHtml: Builds the default welcome message shown on first visit.
 * @returns {string} HTML string with quick-reply buttons.
 */
export const getWelcomeHtml = () => `
    👋 Namaste! I'm your AI travel assistant for exploring India. I can help you with:
    <br><br>
    • Festival recommendations<br>
    • Destination suggestions<br>
    • Adventure activities
    <br><br>
    What would you like to know about India?
    <div class="quick-replies">
        <button class="quick-reply-btn">Best festivals to visit</button>
        <button class="quick-reply-btn">Top destinations</button>
        <button class="quick-reply-btn">Adventure activities</button>
        <button class="quick-reply-btn">Plan a trip</button>
    </div>`;