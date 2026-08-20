/**
 * TRAVEL PLANNER INDIA - MAIN ENTRY
 * Wires together all controllers. Each controller guards on the
 * presence of its DOM dependencies, so one entry works across every page.
 */
import { initMenu } from './controllers/menuController.js';
import { initScrollEffects } from './controllers/scrollEffects.js';
import { initNav } from './controllers/navController.js';
import { initReveal } from './controllers/revealController.js';
import { initHeroVideo } from './controllers/heroVideoController.js';
import { initAuthNav } from './controllers/authNavController.js';
import { initChatbot } from './controllers/chatbotController.js';
import { initStateSpots } from './controllers/stateSpotsController.js';
import { initStateGrid } from './controllers/stateGridController.js';

/* Module scripts are deferred, so the DOM is fully parsed before this runs.
   This replaces the former 'DOMContentLoaded' wrapper in app.js. */
initMenu();
initScrollEffects();
initNav();
initReveal();
initHeroVideo();
initAuthNav();
initChatbot();
initStateSpots();
initStateGrid();

/* Final debug log to confirm initialization in the browser console. */
console.log('Travel Planner India - Ready!');