/**
 * TRAVEL PLANNER INDIA - AUTH SERVICE
 * Centralizes login/session state, user preferences, and session cleanup.
 */

export const isLoggedIn = () => localStorage.getItem('loggedIn') === 'true';

export const getUserName = () => localStorage.getItem('userName') || 'Traveler';

export const logout = () => {
    localStorage.clear();
    window.location.href = 'index.html';
};

/**
 * applyUsernamePlaceholders: Fills any [data-username-placeholder] elements
 * with the logged-in user's name (used across pages for personalization).
 */
export const applyUsernamePlaceholders = () => {
    if (!isLoggedIn()) return;
    const els = document.querySelectorAll('[data-username-placeholder]');
    const userName = getUserName();
    for (let i = 0; i < els.length; i++) {
        els[i].textContent = userName;
    }
};