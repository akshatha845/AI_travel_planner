/**
 * TRAVEL PLANNER INDIA - CHATBOT CONTROLLER
 * Handles the interactive AI assistance experience: open/close/toggle,
 * thread switching, multi-turn AI streaming, contextual premeditated planning
 * from cards, and automatic welcome after login/signup.
 */
import { isLoggedIn, getUserName } from '../services/authService.js';
import { getBotReplyStreaming } from '../services/botService.js';

let openChatWithPromptFn = null;
export const openChatWithPrompt = (promptText, isExplore = false) => {
    if (openChatWithPromptFn) {
        openChatWithPromptFn(promptText, isExplore);
    }
};

export const initChatbot = () => {
    const chatbotTrigger = document.getElementById('chatbot-trigger');
    const chatbotWindow = document.getElementById('chatbot-window');
    const closeChat = document.getElementById('close-chat');
    const chatMessages = document.getElementById('chat-messages');
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const toggleImagesBtn = document.getElementById('toggle-images-btn');
    const closeImagesSidebarBtn = document.getElementById('close-images-sidebar');
    const chatImagesSidebar = document.getElementById('chat-images-sidebar');
    const imagesSidebarContent = document.getElementById('images-sidebar-content');
    const imagesCountBadge = document.getElementById('images-count-badge');
    const headerImagesBadge = document.getElementById('header-images-badge');

    let activeThreadId = null;
    let currentThreadImages = [];

    function toggleImagesSidebar(forceOpen = null) {
        if (!chatImagesSidebar) return;
        const shouldOpen = forceOpen !== null ? forceOpen : chatImagesSidebar.classList.contains('collapsed');
        if (shouldOpen) {
            chatImagesSidebar.classList.remove('collapsed');
            if (toggleImagesBtn) toggleImagesBtn.classList.add('active');
        } else {
            chatImagesSidebar.classList.add('collapsed');
            if (toggleImagesBtn) toggleImagesBtn.classList.remove('active');
        }
    }

    if (toggleImagesBtn) {
        toggleImagesBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleImagesSidebar();
        });
    }

    if (closeImagesSidebarBtn) {
        closeImagesSidebarBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleImagesSidebar(false);
        });
    }

    function renderThreadImages(images) {
        if (!imagesSidebarContent) return;
        currentThreadImages = images || [];
        const count = currentThreadImages.length;
        if (imagesCountBadge) imagesCountBadge.textContent = count;
        if (headerImagesBadge) {
            headerImagesBadge.textContent = count;
            headerImagesBadge.style.display = count > 0 ? 'inline-block' : 'none';
        }

        if (currentThreadImages.length === 0) {
            if (toggleImagesBtn) {
                toggleImagesBtn.style.display = 'none';
                toggleImagesBtn.classList.remove('visible');
            }
            if (headerImagesBadge) {
                headerImagesBadge.style.display = 'none';
            }
            toggleImagesSidebar(false);
            imagesSidebarContent.innerHTML = `
                <div class="images-empty-state">
                    <span class="empty-gallery-icon">🏞️</span>
                    <p>No photos yet for this plan.<br>Ask for an itinerary or explore places to display photos!</p>
                </div>
            `;
            return;
        }

        // When images are present, display the Photos button
        if (toggleImagesBtn) {
            toggleImagesBtn.style.display = 'inline-flex';
            toggleImagesBtn.classList.add('visible');
        }

        imagesSidebarContent.innerHTML = currentThreadImages.map(img => {
            const url = img.imageUrl || img.url || '';
            const title = img.title || 'Travel Photo';
            return `
                <div class="gallery-card">
                    <div class="gallery-img-wrap" onclick="window.open('${url}', '_blank')">
                        <img src="${url}" alt="${title}" loading="lazy" referrerpolicy="no-referrer" onerror="this.src='https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=600&q=80'">
                    </div>
                    <div class="gallery-card-body">
                        <div class="gallery-card-title">📍 ${title}</div>
                    </div>
                </div>
            `;
        }).join('');
    }

    function appendImagesToGallery(newImages) {
        if (!newImages || !Array.isArray(newImages) || newImages.length === 0) return;
        const existingUrls = new Set(currentThreadImages.map(i => (i.imageUrl || i.url)));
        const toAdd = [];
        for (const img of newImages) {
            const url = img.imageUrl || img.url;
            if (url && !existingUrls.has(url)) {
                existingUrls.add(url);
                toAdd.push(img);
            }
        }
        if (toAdd.length > 0) {
            currentThreadImages = [...currentThreadImages, ...toAdd];
            renderThreadImages(currentThreadImages);
            // Do NOT auto-open sidebar; the Photos button is now visible for the user to toggle
        }
    }

    async function loadThreadImages(threadId) {
        if (!threadId) {
            renderThreadImages([]);
            return;
        }
        try {
            const response = await fetch(`/api/threads/${threadId}/images`);
            if (response.ok) {
                const images = await response.json();
                renderThreadImages(images);
            }
        } catch (err) {
            console.error('Failed to load thread images:', err);
        }
    }

    function handleTriggerClick(e) {
        if (e) e.preventDefault();
        openChatbot();
    }

    async function openChatbot() {
        if (chatbotWindow) {
            chatbotWindow.classList.add('active');

            // If no active thread, show empty state (no thread created yet)
            if (!activeThreadId) {
                switchToEmptyState();
            } else {
                switchToActiveChat();
                loadThreadImages(activeThreadId);
            }

            loadThreads();
        }
    }

    async function handleOpenWithPrompt(promptText, isExplore = false) {
        if (!promptText) return;

        // 1. Close any open destination/spots modal so the chatbot is clearly visible
        if (window.closeStateSpotsModal) {
            window.closeStateSpotsModal();
        }
        const stateSpotsModal = document.getElementById('state-spots-modal');
        if (stateSpotsModal) {
            stateSpotsModal.classList.remove('active');
        }
        const dynamicModal = document.getElementById('dynamic-place-modal');
        if (dynamicModal) {
            dynamicModal.classList.remove('active');
        }
        document.body.style.overflow = '';

        // 2. Open chatbot window
        if (!chatbotWindow) return;
        chatbotWindow.classList.add('active');

        // 3. Create a brand-new thread for this premeditated plan request
        try {
            const response = await fetch('/api/threads', { method: 'POST' });
            if (response.ok) {
                const thread = await response.json();
                activeThreadId = thread.id;
                renderThreadImages([]);
                toggleImagesSidebar(false);
            }
        } catch (err) {
            console.error('Failed to create thread:', err);
        }

        // 4. Switch from empty state to active chat
        switchToActiveChat();

        // 5. Render user message bubble
        addUserMessage(promptText);

        // 6. Send to backend LangGraph agent and stream response
        processBotResponse(promptText, isExplore);
    }

    openChatWithPromptFn = handleOpenWithPrompt;
    window.openChatWithPrompt = handleOpenWithPrompt;

    if (chatbotTrigger) {
        chatbotTrigger.addEventListener('click', handleTriggerClick);
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
            if (
                !chatbotWindow.contains(e.target) &&
                (!chatbotTrigger || !chatbotTrigger.contains(e.target)) &&
                !e.target.closest(
                    '.plan-trip-btn, .btn-hero, #cta-btn, .explore-festival-btn, .festival-card, .guide-plan-btn, .season-plan-btn, .card-plan-btn, .spot-plan-btn'
                )
            ) {
                chatbotWindow.classList.remove('active');
            }
        }
    });

    // Global listener for card actions, buttons, and premeditated planning
    document.addEventListener('click', (e) => {
        // State card plan button (destinations & adventure)
        const cardPlanBtn = e.target.closest('.card-plan-btn');
        if (cardPlanBtn) {
            e.preventDefault();
            e.stopPropagation();
            const card = cardPlanBtn.closest('.state-card');
            const name = cardPlanBtn.getAttribute('data-name') || card?.querySelector('h3')?.textContent.trim() || 'this destination';
            const highlight = cardPlanBtn.getAttribute('data-highlight') || card?.querySelector('p')?.textContent.trim() || '';
            const type = cardPlanBtn.getAttribute('data-type') || (window.location.pathname.includes('adventure') ? 'adventure' : 'destination');

            let prompt = '';
            if (type === 'adventure') {
                prompt = `Explore adventure in ${name}${highlight ? ' (' + highlight + ')' : ''}. In which places is this adventure most famous, what are other places where these are followed/experienced, and what is special about them?`;
            } else {
                prompt = `Explore ${name}${highlight ? ' (' + highlight + ')' : ''}. In which places is this destination most famous, what are other places to explore around here, and what is special about them?`;
            }
            handleOpenWithPrompt(prompt, true);
            return;
        }

        // Spot item plan button inside state modal
        const spotPlanBtn = e.target.closest('.spot-plan-btn');
        if (spotPlanBtn) {
            e.preventDefault();
            e.stopPropagation();
            const spot = spotPlanBtn.getAttribute('data-spot') || 'this spot';
            const state = spotPlanBtn.getAttribute('data-state') || '';
            const desc = spotPlanBtn.getAttribute('data-desc') || '';
            const time = spotPlanBtn.getAttribute('data-time') || '';
            const prompt = `Explore ${spot}${state ? ' in ' + state : ''}.${desc ? ' Highlights: ' + desc + '.' : ''}${time ? ' Best time: ' + time + '.' : ''} In which place is this most famous, what are other notable places where this is experienced, and what is special about them?`;
            handleOpenWithPrompt(prompt, true);
            return;
        }

        // State spots modal footer plan button
        const stateModalPlanBtn = e.target.closest('#state-spots-modal .plan-trip-btn');
        if (stateModalPlanBtn) {
            e.preventDefault();
            e.stopPropagation();
            const rawTitle = document.getElementById('state-spots-title')?.textContent.trim() || 'India';
            const cleanTitle = rawTitle.replace(/^[\p{Emoji}\s]+/u, '').trim() || rawTitle;
            const prompt = `Explore the top attractions and highlights of ${cleanTitle}. In which places is this most famous, what are other places to visit, and what is special about each of them?`;
            handleOpenWithPrompt(prompt, true);
            return;
        }

        // Dynamic place modal plan button
        const dynamicModalPlanBtn = e.target.closest('#dynamic-place-modal .plan-trip-btn');
        if (dynamicModalPlanBtn) {
            e.preventDefault();
            e.stopPropagation();
            const placeTitle = document.getElementById('dynamic-place-title')?.textContent.trim() || 'this place';
            const highlights = document.getElementById('dynamic-place-highlights')?.textContent.trim() || '';
            const time = document.getElementById('dynamic-place-time')?.textContent.trim() || '';
            const desc = document.getElementById('dynamic-place-desc')?.textContent.trim() || '';
            const prompt = `Explore ${placeTitle}.${highlights ? ' Highlights: ' + highlights + '.' : ''}${time ? ' Best Time: ' + time + '.' : ''}${desc ? ' ' + desc : ''} Where is this most famous, what other places can be explored, and what is special about them?`;
            handleOpenWithPrompt(prompt, true);
            return;
        }

        // Festival explore button or festival card click
        const festivalBtn = e.target.closest('.explore-festival-btn');
        const festivalCard = e.target.closest('.festival-card');
        if (festivalBtn || (festivalCard && !e.target.closest('a'))) {
            const card = festivalCard || festivalBtn.closest('.festival-card');
            if (card) {
                e.preventDefault();
                e.stopPropagation();
                const name = card.getAttribute('data-festival') || card.querySelector('h3')?.textContent.trim() || 'Festival';
                const subtitle = card.querySelector('.festival-subtitle')?.textContent.trim() || '';
                const season = card.querySelector('.season-badge')?.textContent.trim() || '';
                const desc = card.querySelector('.festival-desc')?.textContent.trim() || '';
                const prompt = `Explore the festival of ${name}${subtitle ? ' (' + subtitle + ')' : ''} in India${season ? ' during ' + season : ''}.${desc ? ' Highlights: ' + desc + '.' : ''} In which place is this festival most famous, what are other places where it is celebrated, and what is special about the traditions in each place?`;
                handleOpenWithPrompt(prompt, true);
                return;
            }
        }

        // Guide card plan button
        const guidePlanBtn = e.target.closest('.guide-plan-btn');
        if (guidePlanBtn) {
            e.preventDefault();
            e.stopPropagation();
            const card = guidePlanBtn.closest('.guide-card');
            const title = card?.querySelector('h3')?.textContent.trim() || 'Festival Guide';
            const duration = card?.querySelector('.duration-badge')?.textContent.trim() || '';
            const desc = card?.querySelector('p')?.textContent.trim() || '';
            const prompt = `Explore ${title}${duration ? ' (' + duration + ')' : ''}.${desc ? ' Summary: ' + desc : ''} In which places is this celebration most famous, what are other places where it is followed, and what is special about them?`;
            handleOpenWithPrompt(prompt, true);
            return;
        }

        // Seasonal festival card plan button
        const seasonPlanBtn = e.target.closest('.season-plan-btn');
        if (seasonPlanBtn) {
            e.preventDefault();
            e.stopPropagation();
            const card = seasonPlanBtn.closest('.season-festival-card');
            const title = card?.querySelector('h3')?.textContent.trim() || 'Seasonal Festivals';
            const range = card?.querySelector('.season-range')?.textContent.trim() || '';
            const list = card?.querySelector('.festivals-list')?.textContent.trim() || '';
            const desc = card?.querySelector('.season-desc')?.textContent.trim() || '';
            const prompt = `Explore ${title}${range ? ' (' + range + ')' : ''} in India${list ? ', featuring ' + list : ''}.${desc ? ' ' + desc : ''} Where are these festivals most famously celebrated, what other places observe them, and what is special about them?`;
            handleOpenWithPrompt(prompt, true);
            return;
        }

        // Hero or CTA button on index.html
        const heroPlanBtn = e.target.closest('.btn-hero, #cta-btn');
        if (heroPlanBtn) {
            e.preventDefault();
            e.stopPropagation();
            openChatbot();
            return;
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
                addBotMessageBubble(msg.sender, msg.text, msg.images);
            });
            // Load and display images for this selected thread
            loadThreadImages(threadId);
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
        renderThreadImages([]);
        toggleImagesSidebar(false);
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
        if (!text) return '';
        let clean = text.trim();
        // Strip markdown code fences if response is wrapped
        clean = clean.replace(/^```(?:markdown)?\s*\n?/i, '').replace(/\n?```\s*$/i, '');

        if (window.marked && typeof window.marked.parse === 'function') {
            try {
                return window.marked.parse(clean, { breaks: true, gfm: true });
            } catch (e) {
                console.warn('Error parsing markdown with marked:', e);
            }
        }

        // Comprehensive regex fallback if marked is not available
        return clean
            .replace(/^# (.*$)/gim, '<h1>$1</h1>')
            .replace(/^## (.*$)/gim, '<h2>$1</h2>')
            .replace(/^### (.*$)/gim, '<h3>$1</h3>')
            .replace(/^#### (.*$)/gim, '<h4>$1</h4>')
            .replace(/^---$/gim, '<hr>')
            .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/gim, '<em>$1</em>')
            .replace(/^\- (.*$)/gim, '<li>$1</li>')
            .replace(/\n/gim, '<br>');
    }

    function renderInlineGallery(images) {
        if (!images || !Array.isArray(images) || images.length === 0) return '';
        const cardsHtml = images.map(img => {
            const url = img.imageUrl || img.url || '';
            const title = img.title || 'Attraction Photo';
            if (!url) return '';
            return `
                <div class="bot-inline-card">
                    <div class="bot-inline-img-wrap" onclick="window.open('${url}', '_blank')">
                        <img src="${url}" alt="${title}" class="bot-inline-card-img" loading="lazy" referrerpolicy="no-referrer" onerror="this.src='https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=600&q=80'">
                    </div>
                    <div class="bot-inline-card-body">
                        <div class="bot-inline-card-title">📍 ${title}</div>
                    </div>
                </div>
            `;
        }).join('');

        return `
            <div class="bot-inline-gallery">
                <div class="bot-inline-gallery-header">
                    <span>📸 Curated Sights & Photos</span>
                </div>
                <div class="bot-inline-gallery-cards">
                    ${cardsHtml}
                </div>
            </div>
        `;
    }

    function addUserMessage(text) {
        if (!chatMessages) return;
        const msgDiv = document.createElement('div');
        msgDiv.className = 'message user-message';
        msgDiv.textContent = text;
        chatMessages.appendChild(msgDiv);
        scrollToBottom();
    }

    function addBotMessageBubble(sender, text, images = []) {
        if (!chatMessages) return;
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${sender}-message`;
        if (sender === 'bot') {
            let html = `<div class="bot-avatar">🌴 AI Travel Assistant</div>${formatMarkdown(text)}`;
            if (images && images.length > 0) {
                html += renderInlineGallery(images);
            }
            msgDiv.innerHTML = html;
        } else {
            msgDiv.textContent = text;
        }
        chatMessages.appendChild(msgDiv);
        scrollToBottom();
    }

    function showTypingIndicator() {
        if (!chatMessages) return null;
        const indicator = document.createElement('div');
        indicator.className = 'typing-indicator message bot-message';
        indicator.id = 'typing-indicator';
        indicator.innerHTML = '<div class="bot-avatar" style="margin-bottom:0;margin-right:8px;">🌴</div><div class="dot"></div><div class="dot"></div><div class="dot"></div>';
        chatMessages.appendChild(indicator);
        scrollToBottom();
        return indicator;
    }

    async function processBotResponse(query, isExplore = false) {
        const indicator = showTypingIndicator();
        if (!chatMessages) return;
        const msgDiv = document.createElement('div');
        msgDiv.className = 'message bot-message';
        msgDiv.innerHTML = `<div class="bot-avatar">🌴 AI Travel Assistant</div>`;
        chatMessages.appendChild(msgDiv);
        scrollToBottom();

        let fullResponse = "";
        let responseImages = [];

        function updateBotMessageHtml() {
            let html = `<div class="bot-avatar">🌴 AI Travel Assistant</div>${formatMarkdown(fullResponse)}`;
            if (responseImages && responseImages.length > 0) {
                html += renderInlineGallery(responseImages);
            }
            msgDiv.innerHTML = html;
        }

        try {
            await getBotReplyStreaming(
                query,
                activeThreadId,
                (chunk) => {
                    fullResponse += chunk;
                    if (indicator) {
                        indicator.remove();
                    }
                    updateBotMessageHtml();
                    scrollToBottom();
                },
                async () => {
                    if (indicator) indicator.remove();
                    loadThreads();
                    if (activeThreadId) {
                        loadThreadImages(activeThreadId);
                        // If images weren't received during the stream, check if they exist on the thread
                        if (responseImages.length === 0) {
                            try {
                                const resp = await fetch(`/api/threads/${activeThreadId}/images`);
                                if (resp.ok) {
                                    const imgs = await resp.json();
                                    if (imgs && imgs.length > 0) {
                                        responseImages = imgs;
                                        updateBotMessageHtml();
                                        scrollToBottom();
                                    }
                                }
                            } catch (e) {
                                console.warn('Could not fetch thread images post-stream:', e);
                            }
                        }
                    }
                },
                isExplore,
                (images) => {
                    if (images && Array.isArray(images) && images.length > 0) {
                        responseImages = images;
                        appendImagesToGallery(images);
                        updateBotMessageHtml();
                        scrollToBottom();
                    }
                }
            );
        } catch (err) {
            console.error('Bot streaming error:', err);
            if (indicator) indicator.remove();
            msgDiv.innerHTML = '<div class="bot-avatar">🌴 AI Travel Assistant</div><p>Sorry, I encountered an issue while generating your response. Please try again.</p>';
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
