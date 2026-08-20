/**
 * TRAVEL PLANNER INDIA - SCROLL EFFECTS CONTROLLER
 * Manages UI changes that occur as the user scrolls down the page:
 * header 'scrolled' styling and the floating back-to-top button.
 */
export const initScrollEffects = () => {
    /* 'header' refers to the main navigation bar at the top of the page. */
    const header = document.getElementById('main-header');

    /* 'backToTopBtn' is the floating button that appears to let users jump back to the top quickly. */
    const backToTopBtn = document.getElementById('back-to-top');

    /* Safety Check: Only proceed if at least one target element exists. */
    if (!header && !backToTopBtn) return;

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
};