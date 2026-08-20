/**
 * TRAVEL PLANNER INDIA - STATE GRID CONTROLLER
 * Loads the destinations/adventure grid from the backend content API
 * and applies a staggered fade-in so dynamic cards are never hidden.
 * Replaces the standalone state-grid-loader.js.
 */
import { fetchList } from '../services/contentService.js';

export const initStateGrid = () => {
    /* 'grid' is the container where state cards are rendered. */
    const grid = document.getElementById('state-grid');

    /* Safety Check: Only proceed if the grid exists in the current DOM. */
    if (!grid) return;

    fetchList()
        .then(items => {
            if (!items || items.length === 0) {
                grid.innerHTML = '<p class="no-spots">Content coming soon. Check back shortly!</p>';
                return;
            }

            const html = items.map(item => {
                return '<a href="#" class="state-card fade-in-section" data-slug="' + item.slug + '"' +
                    ' style="background-image: url(\'' + item.heroImage + '\');">' +
                    '<div class="state-overlay"></div>' +
                    '<span class="state-icon">' + item.emoji + '</span>' +
                    '<div class="state-info">' +
                    '<h3>' + item.name + '</h3>' +
                    '<p>' + item.highlight + '</p>' +
                    '</div>' +
                    '</a>';
            }).join('');
            grid.innerHTML = html;

            /* Trigger the fade-in animation for the dynamically loaded cards.
               The cards are injected after the reveal controller sets up its IntersectionObserver,
               so they would otherwise stay hidden at opacity 0. */
            const cards = grid.querySelectorAll('.fade-in-section');
            cards.forEach((card, index) => {
                setTimeout(() => {
                    card.classList.add('visible');
                }, index * 60);
            });
        })
        .catch(() => {
            grid.innerHTML = '<p class="no-spots">Could not load content. Please try again.</p>';
        });
};