/**
 * TRAVEL PLANNER INDIA - CHATBOT CONTROLLER
 * Handles the interactive AI assistance experience: open/close/toggle,
 * thread switching, multi-turn AI streaming, plan-trip entry points,
 * and automatic welcome after login/signup.
 */
import { isLoggedIn, getUserName } from '../services/authService.js';
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

    if (chatbotTrigger) {
        chatbotTrigger.addEventListener('click', handlePlanTripClick);
    }

    if (closeChat && chatbotWindow) {
        closeChat.addEventListener('click', () => {
            chatbotWindow.classList.remove('active');
        });
    }

    // Toggle sidebar functionality with null checks
    const sidebarIcon = document.querySelector('.sidebar-icon');
    const chatSidebar = document.querySelector('.chat-sidebar');
    if (sidebarIcon && chatSidebar) {
        sidebarIcon.addEventListener('click', () => {
            chatSidebar.classList.toggle('collapsed');
        });
    }

    // Click outside chatbot window to close
    document.addEventListener('click', (e) => {
        if (chatbotWindow && chatbotWindow.classList.contains('active')) {
            if (!chatbotWindow.contains(e.target) && (!chatbotTrigger || !chatbotTrigger.contains(e.target)) && !e.target.closest('.plan-trip-btn, .btn-hero')) {
                chatbotWindow.classList.remove('active');
            }
        }
    });

    // Global listener for "Plan a Trip" buttons across modals and hero sections
    document.addEventListener('click', (e) => {
        const planBtn = e.target.closest('.plan-trip-btn, .btn-hero');
        if (planBtn) {
            handlePlanTripClick(e);
        }
    });

    async function loadThreads() {
        try {
            const response = await fetch('/api/threads');
            if (!response.ok) return;
            const threads = await response.json();
            const threadList = document.getElementById('thread-list');
            if (!threadList) return;
            threadList.innerHTML = '';
            threads.forEach(thread => {
                const div = document.createElement('div');
                div.className = 'thread-item' + (thread.id === activeThreadId ? ' active' : '');
                div.textContent = thread.title;
                div.onclick = () => selectThread(thread.id);
                threadList.appendChild(div);
            });
        } catch (err) {
            console.error('Failed to load threads:', err);
        }
    }

    async function selectThread(threadId) {
        try {
            activeThreadId = threadId;
            const response = await fetch(`/api/threads/${threadId}/messages`);
            if (!response.ok) return;
            const messages = await response.json();
            if (chatMessages) chatMessages.innerHTML = '';
            switchToActiveChat();
            messages.forEach(msg => {
                addBotMessageBubble(msg.sender, msg.text);
            });
            // Update active state in sidebar list
            loadThreads();
        } catch (err) {
            console.error('Failed to select thread:', err);
        }
    }

    function switchToActiveChat() {
        const emptyState = document.querySelector('.chat-empty-state');
        if (emptyState) emptyState.style.display = 'none';
        if (chatMessages) chatMessages.style.display = 'flex';
        const chatMain = document.getElementById('chat-main');
        if (chatMain && chatForm) {
            chatMain.appendChild(chatForm);
        }
        if (chatForm) chatForm.style.display = 'flex';
    }

    function switchToEmptyState() {
        activeThreadId = null;
        if (chatMessages) {
            chatMessages.innerHTML = '';
            chatMessages.style.display = 'none';
        }
        const emptyState = document.querySelector('.chat-empty-state');
        if (emptyState) {
            emptyState.style.display = 'flex';
            if (chatForm) emptyState.appendChild(chatForm);
        }
        if (chatForm) chatForm.style.display = 'flex';
    }

    const newChatBtn = document.getElementById('new-chat-btn');
    if (newChatBtn) {
        newChatBtn.addEventListener('click', () => {
            switchToEmptyState();
            loadThreads();
        });
    }

    if (chatForm) {
        chatForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (!chatInput) return;
            const message = chatInput.value.trim();
            if (!message) return;

            if (!activeThreadId) {
                try {
                    const response = await fetch('/api/threads', { method: 'POST' });
                    if (response.ok) {
                        const thread = await response.json();
                        activeThreadId = thread.id;
                    }
                } catch (err) {
                    console.error('Failed to create thread:', err);
                }
            }

            addUserMessage(message);
            chatInput.value = '';

            const emptyState = document.querySelector('.chat-empty-state');
            if (emptyState && emptyState.style.display !== 'none') {
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
        if (!chatMessages) return;
        const msgDiv = document.createElement('div');
        msgDiv.className = 'message user-message';
        msgDiv.textContent = text;
        chatMessages.appendChild(msgDiv);
        scrollToBottom();
    }

    function addBotMessageBubble(sender, text) {
        if (!chatMessages) return;
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${sender}-message`;
        msgDiv.innerHTML = formatMarkdown(text);
        chatMessages.appendChild(msgDiv);
        scrollToBottom();
    }

    function showTypingIndicator() {
        if (!chatMessages) return null;
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
        if (!chatMessages) return;
        const msgDiv = document.createElement('div');
        msgDiv.className = 'message bot-message';
        chatMessages.appendChild(msgDiv);
        scrollToBottom();

        let fullResponse = "";
        try {
            await getBotReplyStreaming(query, activeThreadId,
                (chunk) => {
                    fullResponse += chunk;
                    msgDiv.innerHTML = formatMarkdown(fullResponse);
                    scrollToBottom();
                },
                () => {
                    if (indicator) indicator.remove();
                    loadThreads();
                }
            );
        } catch (err) {
            console.error('Bot streaming error:', err);
            if (indicator) indicator.remove();
            msgDiv.innerHTML = '<p>Sorry, I encountered an issue while generating your response. Please try again.</p>';
        }
    }

    function scrollToBottom() {
        if (chatMessages) {
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    }

    // Auto open chatbot after login / signup
    if (localStorage.getItem('justLoggedIn') === 'true') {
        localStorage.removeItem('justLoggedIn');
        setTimeout(() => {
            openChatbot();
        }, 500);
    }

    if (localStorage.getItem('justSignedUp') === 'true') {
        localStorage.removeItem('justSignedUp');
        setTimeout(() => {
            openChatbot();
        }, 500);
    }
};
