/**
 * TRAVEL PLANNER INDIA - CONTENT SERVICE
 * Single access point for the backend content API
 * (/api/destinations | /api/adventure).
 */

/**
 * resolveContentType: Determines the content type from the current page.
 * @returns {string} 'adventure' or 'destinations'.
 */
const resolveContentType = () => {
    /* The URL key is normalized to match both the API path and file names. */
    return window.location.pathname.includes('adventure.html') ? 'adventure' : 'destinations';
};

/**
 * fetchList: Retrieves the list of all entries for a content type.
 * @param {string} [type] - 'destinations' or 'adventure' (defaults to the current page).
 * @returns {Promise<Array>}
 */
export const fetchList = (type = resolveContentType()) => {
    return fetch(`/api/${type}`).then(resp => {
        if (!resp.ok) throw new Error('Failed to load list');
        return resp.json();
    });
};

/**
 * fetchDetail: Retrieves a single entry (with spots) by slug.
 * @param {string} slug - The state identifier (e.g. 'arunachal-pradesh').
 * @param {string} [type] - 'destinations' or 'adventure' (defaults to the current page).
 * @returns {Promise<Object>}
 */
export const fetchDetail = (slug, type = resolveContentType()) => {
    return fetch(`/api/${type}/${encodeURIComponent(slug)}`)
        .then(resp => {
            if (!resp.ok) throw new Error('Not found');
            return resp.json();
        });
};