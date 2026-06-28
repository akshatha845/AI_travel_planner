/**
 * TRAVEL PLANNER INDIA - CORE JAVASCRIPT
 * This is the main logic file for the entire application.
 * It manages the global state, UI interactions, and component behavior.
 */

/* The 'DOMContentLoaded' event ensures that the DOM is fully loaded and parsed before any script runs.
   This prevents errors where the script tries to access HTML elements that haven't been created yet. */
document.addEventListener('DOMContentLoaded', () => {

    /* --- 1. MOBILE MENU & OVERLAY LOGIC --------------------------------------- 
       This section handles the responsiveness of the navigation bar on small screens (mobile/tablet).
    */

    /* 'hamburger' represents the visual toggle button (usually 3 horizontal lines) for mobile users. */
    const hamburger = document.getElementById('hamburger');

    /* 'navLinks' references the unordered list containing the site navigation links. */
    const navLinks = document.querySelector('.nav-links');

    /* 'navOverlay' is the full-screen semi-transparent backdrop that appears when the menu is open. */
    const navOverlay = document.getElementById('nav-overlay');

    /* 'navItems' is a list of all clickable link elements within the navigation bar. */
    const navItems = document.querySelectorAll('.nav-links a, .logo');

    /**
     * toggleMenu: A state switcher function for the navigation visibility.
     * It adds/removes the 'active' class which triggers CSS transitions.
     */
    const toggleMenu = () => {
        /* Flips the 'active' status of the menu list. */
        navLinks.classList.toggle('active');
        /* Flips the 'active' status of the button (e.g., for rotation animations). */
        hamburger.classList.toggle('active');
        /* Flips the 'active' status of the dimming overlay. */
        navOverlay.classList.toggle('active');
    };

    /* Safety Check: Only execute if the hamburger UI element exists in the current DOM. */
    if (hamburger) {
        /* Attach a standard click listener to trigger our toggle function. */
        hamburger.addEventListener('click', toggleMenu);
    }

    /* 
       Close-on-Click Behavior:
       We want the menu to close if the user clicks the overlay or any link.
       We use the spread operator (...) to combine the overlay and nav list into a single array for iteration.
    */
    [navOverlay, ...navItems].forEach(el => {
        /* Add a listener to every element in the combined list. */
        el.addEventListener('click', () => {
            /* Force the removal of 'active' class to ensure UI resets. */
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
            navOverlay.classList.remove('active');
        });
    });


    /* ─── 2. HEADER & BACK-TO-TOP SCROLL HANDLING ──────────────────────────────
       This section manages UI changes that occur as the user scrolls down the page.
    */

    /* 'header' refers to the main navigation bar at the top of the page. */
    const header = document.getElementById('main-header');
    /* 'backToTopBtn' is the floating button that appears to let users jump back to the top quickly. */
    const backToTopBtn = document.getElementById('back-to-top');

    /* We listen for the 'scroll' event on the window object to track the user's vertical scroll position. */
    window.addEventListener('scroll', () => {
        /* If the header exists, we check if the user has scrolled more than 50 pixels down. */
        if (header) {
            /* 'scrolled' class is toggled based on the boolean result of window.scrollY > 50.
               This typically changes the header from transparent to solid color for better readability against content. */
            header.classList.toggle('scrolled', window.scrollY > 50);
        }
        /* If the back-to-top button exists, we check if the user has scrolled more than 500 pixels (past the fold). */
        if (backToTopBtn) {
            /* 'visible' class is toggled to fade the button in once the user is deep into the page content. */
            backToTopBtn.classList.toggle('visible', window.scrollY > 500);
        }
    });

    /* If the back-to-top button exists, we handle the click event to perform the scroll action. */
    if (backToTopBtn) {
        /* On click, the window scrolls smoothly back to the top (coordinate 0). */
        backToTopBtn.addEventListener('click', () => {
            /* window.scrollTo is a native browser method to move the scrollbar position. */
            window.scrollTo({
                top: 0,            /* Target vertical position */
                behavior: 'smooth' /* Enables the smooth sliding effect instead of an instant jump */
            });
        });
    }

    /* ─── 3. SMOOTH SCROLLING WITH HEADER OFFSET ───────────────────────────────
       Custom logic for internal links (e.g., href="#about") to account for the fixed header height.
    */

    /* 'headerHeight' defines the offset needed so the fixed header doesn't cover the top of the target section. */
    const headerHeight = 80;

    /* Loop through every navigation item to check for anchor links. */
    navItems.forEach(link => {
        link.addEventListener('click', function (e) {
            /* Get the value of the 'href' attribute (e.g., "#services"). */
            const targetId = this.getAttribute('href');

            /* Check if the link is a hashtag link (internal anchor). */
            if (targetId && targetId.startsWith('#')) {
                /* 'preventDefault' stops the browser's default jump-to-top-anchor behavior. */
                e.preventDefault();
                /* Find the actual HTML element associated with that ID. */
                const targetSection = document.querySelector(targetId);

                /* If the section exists, scroll to it manually with the calculated offset. */
                if (targetSection) {
                    window.scrollTo({
                        /* 'offsetTop' is the pixel distance from the top of the page. We subtract headerHeight. */
                        top: targetSection.offsetTop - headerHeight,
                        behavior: 'smooth' /* Smooth animation for a premium feel. */
                    });
                }
            }
        });
    });

    /* ─── 4. ACTIVE NAV LINK HIGHLIGHTING ──────────────────────────────────────
       Identifies which page or section the user is currently viewing to highlight the corresponding nav link.
    */

    /* 'sections' finds all <section> elements that have an 'id' attribute, used for scroll tracking. */
    const sections = document.querySelectorAll('section[id]');

    /**
     * setActiveByPath: Highlights the nav link based on the current file URL.
     */
    const setActiveByPath = () => {
        /* Extract the horizontal file name from the URL path (e.g., 'destinations.html'). */
        const currentPath = window.location.pathname.split('/').pop() || 'index.html';

        /* Loop through all links and compare their href to the current path. */
        navItems.forEach(link => {
            const href = link.getAttribute('href');
            /* Toggle 'active' class if the href matches the current file name. */
            link.classList.toggle('active', href === currentPath);
        });
    };

    /**
     * highlightNavOnScroll: Updates the 'active' link as the user scrolls through sections of the index page.
     */
    const highlightNavOnScroll = () => {
        /* Only run this logic on the home page (index), as that's where multiple sections exist on one page. */
        const isHome = window.location.pathname.endsWith('index.html') ||
            window.location.pathname.endsWith('/') ||
            window.location.pathname === '';

        /* Exit the function if we aren't on the home page. */
        if (!isHome) return;

        /* Variable to store the ID of the section currently in view. */
        let currentSectionId = '';

        /* Loop through sections to find which one is currently at the top of the viewport. */
        sections.forEach(section => {
            /* We check if the scroll position has passed the section top (plus a small buffer/offset). */
            if (window.scrollY >= section.offsetTop - headerHeight - 100) {
                currentSectionId = section.getAttribute('id');
            }
        });

        /* If we found a section in view, update the navigation items' CSS classes. */
        if (currentSectionId) {
            navItems.forEach(link => {
                /* Compare link's href (like '#about') to the found section ID. */
                link.classList.toggle('active',
                    link.getAttribute('href') === `#${currentSectionId}`);
            });
        }
    };

    /* Initialize the initial link state on page load. */
    setActiveByPath();
    /* Add listener to update the highlight as the user scrolls. */
    window.addEventListener('scroll', highlightNavOnScroll);

    /* ─── 5. VIEWPORT ENTRANCE ANIMATIONS ──────────────────────────────────────
       Uses the Intersection Observer API to trigger 'fade-in' effects when elements enter the screen.
    */

    /* 'faders' are elements with the class '.fade-in-section' that we want to animate. */
    const faders = document.querySelectorAll('.fade-in-section');

    /* 'appearOnScroll' configuration:
       - 'entries': the elements being tracked.
       - 'observer': the instance of the observer.
       - 'threshold': 15% of the element must be visible before triggering.
       - 'rootMargin': adds a -50px margin to the bottom, triggering the animation slightly late for better impact.
    */
    const appearOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            /* If the element has scrolled into view... */
            if (entry.isIntersecting) {
                /* Add the 'visible' class which contains the CSS transition/opacity logic. */
                entry.target.classList.add('visible');
                /* Stop watching the element once it has faded in (only animate once). */
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

    /* Attach the observer to each targeted element. */
    faders.forEach(fader => appearOnScroll.observe(fader));

    /* ─── 6. VIDEO HERO AUTOPLAY FALLBACK ──────────────────────────────────────
       Ensures that the hero section looks good even if the background video fails to play.
    */

    /* 'heroVideo' is the <video> element used in the hero component. */
    const heroVideo = document.getElementById('hero-video');

    /* We try to play the video programmatically. */
    if (heroVideo) {
        heroVideo.play().catch(() => {
            /* If play() fails (e.g., due to browser security settings or low-power mode), 
               we find the container and add a fallback class to show a static image instead. */
            const container = heroVideo.closest('.video-container');
            if (container) container.classList.add('video-fallback');
        });
    }

    /* ─── 7. NAVBAR LOGIN STATE ─────────────────────────────────────────────────
       Shows/hides the navbar Logout button based on whether the user is logged in,
       and wires up the actual sign-out action.
    */
    /* 'isLoggedIn' checks the 'loggedIn' key in localStorage to see if a session exists. */
    const isLoggedIn = localStorage.getItem('loggedIn') === 'true';
    /* 'userName' retrieves the saved user's name or defaults to 'Traveler'. */
    const userName = localStorage.getItem('userName') || 'Traveler';

    /* 'logoutNavItem' is the <li> wrapping the Logout link, hidden by default in HTML. */
    const logoutNavItem = document.getElementById('logout-nav-item');
    /* 'logoutLink' is the actual clickable Logout text/link inside that <li>. */
    const logoutLink = document.getElementById('logout-link');

    if (logoutNavItem) {
        /* Only show the Logout link in the navbar if the user is currently logged in. */
        logoutNavItem.style.display = isLoggedIn ? 'block' : 'none';
    }

    if (logoutLink) {
        logoutLink.addEventListener('click', function (e) {
            e.preventDefault();

            /* Sign out of Firebase Auth if it's available on this page (e.g. via login.html's
               module script). If not available, we still clear localStorage as a fallback so
               the user is logged out of this site's UI either way. */
            if (window.firebaseAuth && window.firebaseSignOut) {
                window.firebaseSignOut(window.firebaseAuth)
                    .then(() => {
                        localStorage.clear();
                        window.location.href = 'index.html';
                    })
                    .catch((error) => {
                        console.error('Sign out error:', error);
                        /* Even if Firebase sign-out fails, clear local session so the UI updates. */
                        localStorage.clear();
                        window.location.href = 'index.html';
                    });
            } else {
                localStorage.clear();
                window.location.href = 'index.html';
            }
        });
    }

    /* ─── 8. AI CHATBOT LOGIC ───────────────────────────────────────────────────
       Handles the interactive AI assistance experience.
    */

    /* 'chatbotTrigger' is the small floating button (usually a robot icon) in the bottom corner. */
    const chatbotTrigger = document.getElementById('chatbot-trigger');
    /* 'chatbotWindow' is the main chat container that slides up. */
    const chatbotWindow = document.getElementById('chatbot-window');
    /* 'closeChat' is the 'X' button to hide the chat window. */
    const closeChat = document.getElementById('close-chat');
    /* 'chatMessages' is the scrollable area where messages appear. */
    const chatMessages = document.getElementById('chat-messages');
    /* 'chatForm' is the <form> element containing the input field. */
    const chatForm = document.getElementById('chat-form');
    /* 'chatInput' is the actual text box the user types into. */
    const chatInput = document.getElementById('chat-input');

    /**
     * handlePlanTripClick: Manages logic for 'Plan Trip' buttons.
     * Checks for authentication before allowing access to the chatbot.
     * @param {Event} e - The click event.
     */
    function handlePlanTripClick(e) {
        /* Prevent default link behavior if applicable. */
        if (e) e.preventDefault();

        /* If the user is logged in, show the chatbot. */
        if (localStorage.getItem('loggedIn') === 'true') {
            openChatbot();
        } else {
            /* Otherwise, redirect them to the login page to ensure security and personalization. */
            window.location.href = 'login.html';
        }
    }

    /**
     * openChatbot: Public method to display the chatbot interface.
     */
    function openChatbot() {
        if (chatbotWindow) {
            /* Add 'active' class to animate the window into view. */
            chatbotWindow.classList.add('active');
            /* Populate with existing messages from the session. */
            loadChatHistory();
            /* Ensure the user sees the latest message. */
            scrollToBottom();
        }
    }

    /**
     * toggleChatbot: Switches the chatbot visibility state.
     */
    function toggleChatbot() {
        if (chatbotWindow) {
            /* Flips the 'active' state. */
            chatbotWindow.classList.toggle('active');
            /* If it just became active, refresh history. */
            if (chatbotWindow.classList.contains('active')) {
                loadChatHistory();
                scrollToBottom();
            }
        }
    }

    /* Assign the click handler to the main chatbot icon button. */
    if (chatbotTrigger) {
        chatbotTrigger.addEventListener('click', handlePlanTripClick);
    }

    /* Handle clicking the 'X' button to close the panel. */
    if (closeChat) {
        closeChat.addEventListener('click', () => {
            chatbotWindow.classList.remove('active');
        });
    }

    /* "Click outside" listener: if the user clicks anywhere else on the screen, close the chat. 
       This is a standard UX pattern to unclutter the screen. */
    document.addEventListener('click', (e) => {
        /* Only check if the window is currently open. */
        if (chatbotWindow && chatbotWindow.classList.contains('active')) {
            /* If the click was NOT inside the window and NOT on the trigger button... */
            if (!chatbotWindow.contains(e.target) && !chatbotTrigger.contains(e.target)) {
                /* Hide the chat. */
                chatbotWindow.classList.remove('active');
            }
        }
    });

    /* Hero "Plan Your Journey with AI" button logic. */
    const heroBtn = document.querySelector('.btn-hero');
    if (heroBtn) {
        heroBtn.addEventListener('click', function (e) {
            /* Stop navigation. */
            e.preventDefault();

            /* If logged in, always open the chatbot directly. */
            if (localStorage.getItem('loggedIn') === 'true') {
                openChatbot();
            } else {
                /* If not logged in, go to login page. */
                window.location.href = 'login.html';
            }
        });
    }

    /* Secondary Call-To-Action (CTA) button logic. */
    const ctaBtn = document.querySelector('#cta .btn-primary');
    if (ctaBtn) {
        /* Reuses our helper function for consistent behavior. */
        ctaBtn.addEventListener('click', handlePlanTripClick);
    }

    /* Global click listener for dynamically added elements (like quick replies). */
    document.addEventListener('click', (e) => {
        /* Check if the clicked element has the 'quick-reply-btn' class. */
        if (e.target.classList.contains('quick-reply-btn')) {
            /* Get the text inside the button (e.g., "Best festivals to visit"). */
            const query = e.target.textContent;
            /* Add it to the UI as if the user typed it. */
            addUserMessage(query);
            /* Generate an automated response. */
            processBotResponse(query);
            /* Prevent further processing. */
            return;
        }
    });

    /* Handle the chat input form submission. */
    if (chatForm) {
        chatForm.addEventListener('submit', (e) => {
            /* Stop the page from refreshing (default form action). */
            e.preventDefault();
            /* Get the value and remove leading/trailing whitespace. */
            const message = chatInput.value.trim();
            /* Only send if there's actual text. */
            if (message) {
                /* 1. Add user's message to view. */
                addUserMessage(message);
                /* 2. Clear input box for next message. */
                chatInput.value = '';
                /* 3. Logic to determine bot reply. */
                processBotResponse(message);
            }
        });
    }

    /* ─── 9. AUTO OPEN CHATBOT AFTER LOGIN / SIGNUP ─────────────────────────────
       These checks provide a welcoming experience immediately after successful auth.
    */

    /* 'justLoggedIn' is a flag set in login.js during successful login. */
    if (localStorage.getItem('justLoggedIn') === 'true') {
        /* Remove flag immediately so it doesn't trigger again on refresh. */
        localStorage.removeItem('justLoggedIn');
        /* Slight delay for a smoother page load transition. */
        setTimeout(() => {
            /* Open the chat panel. */
            openChatbot();
            /* Add a personalized welcome message. */
            addBotMessage('Welcome back ' + userName + '! 🇮🇳 Great to see you again. Ready to plan your next India adventure?');
        }, 800);
    }

    /* Similar logic for new account sign-up events. */
    if (localStorage.getItem('justSignedUp') === 'true') {
        localStorage.removeItem('justSignedUp');
        setTimeout(() => {
            openChatbot();
            addBotMessage('Welcome ' + userName + '! 🇮🇳 I\'m your India Travel Assistant. Ready to plan your perfect Indian adventure. Where would you like to start?');
        }, 800);
    }

    /* ─── CHATBOT HELPER FUNCTIONS ──────────────────────────────────────────────
       Low-level UI methods for the chatbot experience.
    */

    /**
     * addUserMessage: Renders a user's message in the chat window.
     * @param {string} text - The message content.
     */
    function addUserMessage(text) {
        /* Create the message container div. */
        const msgDiv = document.createElement('div');
        /* Apply stylized 'user' message classes. */
        msgDiv.className = 'message user-message';
        /* Set the text content safely (escapes HTML). */
        msgDiv.textContent = text;
        /* Inject into the scrollable area. */
        chatMessages.appendChild(msgDiv);
        /* Save to session storage for persistence. */
        saveMessage('user', text);
        /* Scroll to show the new message. */
        scrollToBottom();
    }

    /**
     * addBotMessage: Renders the AI's response in the chat window.
     * @param {string} text - The message content.
     * @param {boolean} isHtml - Whether the content contains HTML tags (like <a> links).
     */
    function addBotMessage(text, isHtml = false) {
        /* Create the container. */
        const msgDiv = document.createElement('div');
        /* Apply stylized 'bot' message classes. */
        msgDiv.className = 'message bot-message';
        /* Differing logic for plain text vs formatted HTML content. */
        if (isHtml) {
            /* Set innerHTML to render links and formatting. */
            msgDiv.innerHTML = text;
        } else {
            /* Set textContent for plain strings. */
            msgDiv.textContent = text;
        }
        /* Append to messages list. */
        chatMessages.appendChild(msgDiv);
        /* Persistence. */
        saveMessage('bot', text, isHtml);
        /* Scroll adjustment. */
        scrollToBottom();
    }

    /**
     * showTypingIndicator: Displays a '...' animation to simulate AI thinking.
     * @returns {HTMLElement} The indicator element, to be removed later.
     */
    function showTypingIndicator() {
        /* Create the indicator bubble. */
        const indicator = document.createElement('div');
        /* Add specific styling classes. */
        indicator.className = 'typing-indicator message bot-message';
        /* Set ID for easy removal later. */
        indicator.id = 'typing-indicator';
        /* Inject animated dots. */
        indicator.innerHTML = '<div class="dot"></div><div class="dot"></div><div class="dot"></div>';
        /* Append to list. */
        chatMessages.appendChild(indicator);
        /* Sync scroll. */
        scrollToBottom();
        /* Return handle to the caller. */
        return indicator;
    }

    /**
     * processBotResponse: Simple rule-based logic to respond to user messages.
     * @param {string} query - The user's input.
     */
    function processBotResponse(query) {
        /* Step 1: Show the 'AI is typing' animation. */
        const indicator = showTypingIndicator();
        /* Normalize input for easier keyword matching. */
        const lowerQuery = query.toLowerCase();

        /* Simulate a 1.5 second network delay for a more realistic "AI" feel. */
        setTimeout(() => {
            /* Remove the typing animation. */
            indicator.remove();

            /* Keyword-based branching logic: */
            if (lowerQuery.includes('festival') || lowerQuery.includes('diwali') || lowerQuery.includes('holi')) {
                addBotMessage('🪔 India is a land of festivals! You can explore the grand celebrations of Holi, Diwali, and many more on our <a href="festivals.html">Festivals Page</a>. What\'s your favorite festival?', true);
            } else if (lowerQuery.includes('destination') || lowerQuery.includes('place') || lowerQuery.includes('visit')) {
                addBotMessage('📍 From the Taj Mahal to Kerala\'s backwaters, we cover all 28 states! Check out our <a href="destinations.html">Destinations Grid</a> for inspiration.', true);
            } else if (lowerQuery.includes('adventure') || lowerQuery.includes('trek') || lowerQuery.includes('rafting')) {
                addBotMessage('🏔️ Feeling adventurous? We have trekking, river rafting, and safaris listed on our <a href="adventure.html">Adventure Hub</a>.', true);
            } else if (lowerQuery.includes('plan') || lowerQuery.includes('trip') || lowerQuery.includes('itinerary')) {
                addBotMessage('✨ I can help with ideas! Tell me which state or type of experience interests you and I\'ll suggest the best options.');
            } else if (lowerQuery.includes('hi') || lowerQuery.includes('hello') || lowerQuery.includes('namaste')) {
                addBotMessage('🙏 Namaste! I\'m your AI assistant. How can I help you explore India today?');
            } else {
                /* Default fallback for unrecognized queries. */
                addBotMessage('That\'s a great question! For the most detailed info, I recommend checking our specialized pages: <a href="festivals.html">Festivals</a>, <a href="destinations.html">Destinations</a>, or <a href="adventure.html">Adventure</a>.', true);
            }
        }, 1500);
    }

    /**
     * scrollToBottom: Syncs the chat view to the most recent message.
     */
    function scrollToBottom() {
        if (chatMessages) {
            /* Sets scroll position to the extreme bottom of the element. */
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    }

    /**
     * saveMessage: Persists chat data into sessionStorage so it survives page reloads.
     * @param {string} sender - 'user' or 'bot'.
     * @param {string} text - Message content.
     * @param {boolean} isHtml - Format flag.
     */
    function saveMessage(sender, text, isHtml = false) {
        /* Retrieve existing history or start with empty array. */
        let history = JSON.parse(sessionStorage.getItem('chatHistory') || '[]');
        /* Add new data point. */
        history.push({ sender, text, isHtml });
        /* Save back to memory as a JSON string. */
        sessionStorage.setItem('chatHistory', JSON.stringify(history));
    }

    /**
     * loadChatHistory: Rebuilds the chat UI from sessionStorage on page load.
     */
    function loadChatHistory() {
        if (!chatMessages) return;

        /* Attempt to retrieve history. */
        const history = JSON.parse(sessionStorage.getItem('chatHistory') || '[]');

        /* If no previous messages exist (first visit), show the default welcome screen. */
        if (history.length === 0) {
            /* Multi-line string for the welcome prompt with quick reply options. */
            const welcomeMsg = `👋 Namaste! I'm your AI travel assistant for exploring India. I can help you with:
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

            /* Render the welcome message directly. */
            const msgDiv = document.createElement('div');
            msgDiv.className = 'message bot-message';
            msgDiv.innerHTML = welcomeMsg;
            chatMessages.appendChild(msgDiv);
            scrollToBottom();
        } else {
            /* If history exists, clear the messages area and rebuild from the array. */
            chatMessages.innerHTML = '';
            history.forEach(msg => {
                const msgDiv = document.createElement('div');
                /* Dynamically set the class based on sender ('user-message' or 'bot-message'). */
                msgDiv.className = `message ${msg.sender}-message`;
                if (msg.isHtml) {
                    msgDiv.innerHTML = msg.text;
                } else {
                    msgDiv.textContent = msg.text;
                }
                chatMessages.appendChild(msgDiv);
            });
        }
    }

    /* ─── 10. DESTINATIONS PAGE INTERACTION LOGIC ─────────────────────────────
       This section manages the state-specific destination galleries on the iconic destinations page.
       It dynamically builds the spot list based on the global 'destinationsData' object.
    */

    /* Reference all state cards on the destinations page grid. */
    const stateCards = document.querySelectorAll('.state-card');
    /* Reference the premium state gallery modal elements. */
    const stateSpotsModal = document.getElementById('state-spots-modal');
    const stateSpotsTitle = document.getElementById('state-spots-title');
    const stateSpotsContent = document.getElementById('state-spots-content');
    const stateSpotsClose = document.getElementById('state-spots-modal-close');

    /**
     * openStateSpots: Populates and displays the modal for a specific state.
     * @param {string} stateName - The key to look up in destinationsData.
     */
    function openStateSpots(stateName) {
        /* Determine which data source to use based on the current page filename. */
        const isAdventurePage = window.location.pathname.includes('adventure.html');
        const dataSource = isAdventurePage ? window.adventureData : window.destinationsData;

        /* Safety Check: Ensure the chosen data source and the requested state exist. */
        const stateData = dataSource && dataSource[stateName];

        if (stateData && stateSpotsModal) {
            /* 1. Set the Modal Header (Emoji + State Name). */
            stateSpotsTitle.innerHTML = `${stateData.emoji} ${stateName}`;

            /* 2. Clear previous content from the grid. */
            stateSpotsContent.innerHTML = '';

            /* 3. Loop through spots and generate HTML cards. */
            if (stateData.spots && stateData.spots.length > 0) {
                stateData.spots.forEach((spot, index) => {
                    /* Create a wrapper for the spot item. */
                    const spotEl = document.createElement('div');
                    spotEl.className = 'spot-item fade-in-section';
                    /* Slight delay for a staggered entrance effect. */
                    spotEl.style.transitionDelay = `${index * 0.1}s`;

                    /* Build the internal HTML structure for each spot. */
                    spotEl.innerHTML = `
                        <div class="spot-image-container">
                            <div class="spot-image" style="background-image: url('${spot.image}'); width: 100%; height: 100%; background-size: cover; background-position: center;"></div>
                        </div>
                        <div class="spot-info">
                            <h4>${spot.name}</h4>
                            <p>${spot.desc}</p>
                            <span class="spot-time">📅 Best Time: ${spot.time}</span>
                        </div>
                    `;

                    /* Append to the grid. */
                    stateSpotsContent.appendChild(spotEl);

                    /* Use the Intersection Observer logic (if applicable) or force visible. */
                    setTimeout(() => spotEl.classList.add('visible'), 50);
                });
            } else {
                /* Empty state message. */
                stateSpotsContent.innerHTML = '<p class="no-spots">Our explorers are still mapping out spots for this state. Check back soon!</p>';
            }

            /* 4. Display the Modal. */
            stateSpotsModal.classList.add('active');
            /* Lock the background body scroll for better focus. */
            document.body.style.overflow = 'hidden';
        }
    }

    /* Attach click listeners to all state cards. */
    stateCards.forEach(card => {
        card.addEventListener('click', function (e) {
            /* Block the default browser link navigation to non-existent HTML files. */
            e.preventDefault();

            /* The state name is stored in the <h3> within the card. */
            const h3 = this.querySelector('h3');
            if (h3) {
                const stateName = h3.textContent.trim();
                /* Trigger the modal logic. */
                openStateSpots(stateName);
            }
        });
    });

    /* Handler for closing the state modal. */
    if (stateSpotsClose) {
        stateSpotsClose.addEventListener('click', () => {
            stateSpotsModal.classList.remove('active');
            /* Unlock background scroll. */
            document.body.style.overflow = '';
        });
    }

    /* Close on background overlay click as well. */
    if (stateSpotsModal) {
        stateSpotsModal.addEventListener('click', (e) => {
            /* If the user clicked the dark overlay itself (not the panel inside it). */
            if (e.target === stateSpotsModal) {
                stateSpotsModal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    /* Generic listener for 'Plan a Trip' buttons inside modals or generated cards. */
    document.addEventListener('click', (e) => {
        /* Check if the clicked target or any of its parents has the 'plan-trip-btn' class. */
        const planBtn = e.target.closest('.plan-trip-btn');
        if (planBtn) {
            /* Revisit our centralized chatbot handler. */
            handlePlanTripClick(e);
        }
    });

    /* Final debug log to confirm initialization in the browser console. */
    console.log('Travel Planner India - Ready!');
});