/**
 * TRAVEL PLANNER INDIA - AUTH NAV CONTROLLER
 * Shows/hides the navbar Logout button based on whether the user is logged in,
 * wires up the actual sign-out action, and personalizes the username placeholders.
 */
import { isLoggedIn, logout, applyUsernamePlaceholders } from '../services/authService.js';

export const initAuthNav = () => {
    /* Personalize any username placeholders (e.g., in the navbar or welcome text). */
    applyUsernamePlaceholders();

    /* 'logoutNavItem' is the <li> wrapping the Logout link, hidden by default in HTML. */
    const logoutNavItem = document.getElementById('logout-nav-item');
    /* 'logoutLink' is the actual clickable Logout text/link inside that <li>. */
    const logoutLink = document.getElementById('logout-link');

    if (logoutNavItem) {
        /* Only show the Logout link in the navbar if the user is currently logged in. */
        logoutNavItem.style.display = isLoggedIn() ? 'block' : 'none';
    }

    if (logoutLink) {
        logoutLink.addEventListener('click', function (e) {
            e.preventDefault();
            logout();
        });
    }
};