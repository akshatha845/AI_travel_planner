/**
 * TRAVEL PLANNER INDIA - NAV CONTROLLER
 * Handles internal anchor scrolling (with header offset) and
 * active nav link highlighting (by page path and by scroll section).
 */
export const initNav = () => {
    /* 'navItems' is a list of all clickable link elements within the navigation bar. */
    const navItems = document.querySelectorAll('.nav-links a, .logo');

    /* 'headerHeight' defines the offset needed so the fixed header doesn't cover the top of the target section. */
    const headerHeight = 80;

    /* 'sections' finds all <section> elements that have an 'id' attribute, used for scroll tracking. */
    const sections = document.querySelectorAll('section[id]');

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
};