/**
 * TRAVEL PLANNER INDIA - MOBILE MENU CONTROLLER
 * Manages the hamburger toggle, overlay, and auto-close behavior
 * for the responsive navigation on small screens.
 */
export const initMenu = () => {
    /* 'hamburger' represents the visual toggle button (usually 3 horizontal lines) for mobile users. */
    const hamburger = document.getElementById('hamburger');

    /* 'navLinks' references the unordered list containing the site navigation links. */
    const navLinks = document.querySelector('.nav-links');

    /* 'navOverlay' is the full-screen semi-transparent backdrop that appears when the menu is open. */
    const navOverlay = document.getElementById('nav-overlay');

    /* 'navItems' is a list of all clickable link elements within the navigation bar. */
    const navItems = document.querySelectorAll('.nav-links a, .logo');

    /* Safety Check: Only proceed if the hamburger UI element exists in the current DOM. */
    if (!hamburger) return;

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

    /* Attach a standard click listener to trigger our toggle function. */
    hamburger.addEventListener('click', toggleMenu);

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
};