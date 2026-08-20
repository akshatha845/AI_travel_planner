/**
 * TRAVEL PLANNER INDIA - CHATBOT CONTROLLER
 * Handles the interactive AI assistance experience: open/close/toggle,
 * plan-trip entry points, quick replies, form submission, and the
 * automatic welcome after login/signup.
 */
import { isLoggedIn, getUserName } from '../services/authService.js';
import { saveMessage, loadHistory, getWelcomeHtml } from '../services/chatHistoryService.js';
import { getBotReplyStreaming } from '../services/botService.js';

export const initChatbot = () => {
    const chatbotTrigger = document.getElementById('chatbot-trigger');
    const chatbotWindow = document.getElementById('chatbot-window');
    const closeChat = document.getElementById('close-chat');
    const chatMessages = document.getElementById('chat-messages');
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    let activeThreadId = null;

    function handlePlanTripClick(e) {
        if (e) e.preventDefault();
        if (isLoggedIn()) {
            openChatbot();
        } else {
            window.location.href = 'login.html';
        }
    }

    async function openChatbot() {
        if (chatbotWindow) {
            chatbotWindow.classList.add('active');
            
            // If no active thread, show empty state (no thread created yet)
            if (!activeThreadId) {
                switchToEmptyState();
            } else {
                switchToActiveChat();
            }
            
            loadThreads();
        }
    }

    if (chatbotTrigger) chatbotTrigger.addEventListener('click', handlePlanTripClick);
    if (closeChat) closeChat.addEventListener('click', () => chatbotWindow.classList.remove('active'));

    // Add toggle sidebar functionality
    document.querySelector('.sidebar-icon').addEventListener('click', () => {
        document.querySelector('.chat-sidebar').classList.toggle('collapsed');
    });

    document.addEventListener('click', (e) => {
        if (chatbotWindow && chatbotWindow.classList.contains('active')) {
            if (!chatbotWindow.contains(e.target) && !chatbotTrigger.contains(e.target)) {
                chatbotWindow.classList.remove('active');
            }
        }
    });

    async function loadThreads() {
        const response = await fetch('/api/threads');
        const threads = await response.json();
        const threadList = document.getElementById('thread-list');
        threadList.innerHTML = '';
        threads.forEach(thread => {
            const div = document.createElement('div');
            div.className = 'thread-item';
            div.textContent = thread.title;
            div.onclick = () => selectThread(thread.id);
            threadList.appendChild(div);
        });
    }

    async function selectThread(threadId) {
        activeThreadId = threadId;
        const response = await fetch(`/api/threads/${threadId}/messages`);
        const messages = await response.json();
        chatMessages.innerHTML = '';
        switchToActiveChat();
        messages.forEach(msg => {
            addBotMessageBubble(msg.sender, msg.text);
        });
    }

    function switchToActiveChat() {
        document.querySelector('.chat-empty-state').style.display = 'none';
        chatMessages.style.display = 'flex';
        // Move chatForm to chat-main
        document.getElementById('chat-main').appendChild(chatForm);
        chatForm.style.display = 'flex'; // Ensure input bar is shown
    }

    function switchToEmptyState() {
        activeThreadId = null;
        chatMessages.innerHTML = '';
        document.querySelector('.chat-empty-state').style.display = 'flex';
        chatMessages.style.display = 'none';
        // Move chatForm to chat-empty-state
        document.querySelector('.chat-empty-state').appendChild(chatForm);
        chatForm.style.display = 'flex'; // Ensure input bar is shown
    }

    document.getElementById('new-chat-btn').addEventListener('click', () => {
        switchToEmptyState();
        loadThreads();
    });

    if (chatForm) {
        chatForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const message = chatInput.value.trim();
            if (!message) return;

            if (!activeThreadId) {
                const response = await fetch('/api/threads', { method: 'POST' });
                const thread = await response.json();
                activeThreadId = thread.id;
            }

            addUserMessage(message);
            chatInput.value = '';
            
            if (document.querySelector('.chat-empty-state').style.display !== 'none') {
                switchToActiveChat();
            }
            
            processBotResponse(message);
        });
    }

    function formatMarkdown(text) {
        return text
            .replace(/^### (.*$)/gim, '<h3>$1</h3>')
            .replace(/^\- (.*$)/gim, '<li>$1</li>')
            .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
            .replace(/\n/gim, '<br>');
    }

    function addUserMessage(text) {
        const msgDiv = document.createElement('div');
        msgDiv.className = 'message user-message';
        msgDiv.textContent = text;
        chatMessages.appendChild(msgDiv);
        scrollToBottom();
    }

    function addBotMessageBubble(sender, text) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${sender}-message`;
        msgDiv.innerHTML = formatMarkdown(text);
        chatMessages.appendChild(msgDiv);
        scrollToBottom();
    }

    function showTypingIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'typing-indicator message bot-message';
        indicator.id = 'typing-indicator';
        indicator.innerHTML = '<div class="dot"></div><div class="dot"></div><div class="dot"></div>';
        chatMessages.appendChild(indicator);
        scrollToBottom();
        return indicator;
    }

    async function processBotResponse(query) {
        const indicator = showTypingIndicator();
        const msgDiv = document.createElement('div');
        msgDiv.className = 'message bot-message';
        chatMessages.appendChild(msgDiv);
        scrollToBottom();

        let fullResponse = "";
        await getBotReplyStreaming(query, activeThreadId,
            (chunk) => {
                fullResponse += chunk;
                msgDiv.innerHTML = formatMarkdown(fullResponse);
                scrollToBottom();
            },
            () => {
                indicator.remove();
                loadThreads();
            }
        );
    }

    function scrollToBottom() {
        if (chatMessages) {
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    }
};
