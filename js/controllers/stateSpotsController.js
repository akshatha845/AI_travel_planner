/**
 * TRAVEL PLANNER INDIA - STATE SPOTS CONTROLLER
 * Manages the state-specific galleries shown in the modal.
 * Spot data is fetched from the backend content API via the content service.
 */
import { fetchDetail } from '../services/contentService.js';

export const initStateSpots = () => {
    /* Reference the premium state gallery modal elements. */
    const stateSpotsModal = document.getElementById('state-spots-modal');
    const stateSpotsTitle = document.getElementById('state-spots-title');
    const stateSpotsContent = document.getElementById('state-spots-content');
    const stateSpotsClose = document.getElementById('state-spots-modal-close');

    /* Safety Check: Only proceed if the modal exists in the current DOM. */
    if (!stateSpotsModal) return;

    /**
     * renderStateSpots: Populates the modal from an API response.
     * @param {object} stateData - { name, emoji, tagline, spots[] }
     */
    function renderStateSpots(stateData) {
        if (!stateData) return;

        /* 1. Set the Modal Header (Emoji + State Name). */
        stateSpotsTitle.innerHTML = `${stateData.emoji} ${stateData.name}`;

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

                /* Build a difficulty badge for adventure pages, if present. */
                let badgeHtml = '';
                if (spot.difficulty) {
                    const badgeClass = spot.difficulty === 'easy'
                        ? 'badge-easy'
                        : spot.difficulty === 'tough' ? 'badge-tough' : 'badge-moderate';
                    const label = spot.difficulty.charAt(0).toUpperCase() + spot.difficulty.slice(1);
                    badgeHtml = `<span class="badge ${badgeClass}">Difficulty: ${label}</span>`;
                }

                /* Build the internal HTML structure for each spot. */
                spotEl.innerHTML = `
                    <div class="spot-image-container">
                        <div class="spot-image" style="background-image: url('${spot.image}'); width: 100%; height: 100%; background-size: cover; background-position: center;"></div>
                    </div>
                    <div class="spot-info">
                        <h4>${spot.name}</h4>
                        <p>${spot.desc}</p>
                        <span class="spot-time">📅 Best Time: ${spot.time}</span>
                        ${badgeHtml}
                    </div>
                `;

                /* Append to the grid. */
                stateSpotsContent.appendChild(spotEl);

                /* Force the entrance effect immediately so the cards never stay hidden. */
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

    /**
     * openStateSpots: Fetches a state's content from the API, then renders the modal.
     * @param {string} slug - The state identifier (e.g. 'arunachal-pradesh').
     */
    function openStateSpots(slug) {
        fetchDetail(slug)
            .then(renderStateSpots)
            .catch(() => {
                if (stateSpotsContent) {
                    stateSpotsContent.innerHTML = '<p class="no-spots">Content temporarily unavailable. Please try again.</p>';
                }
            });
    }

    /**
     * closeStateSpots: Hides the modal and unlocks the background scroll.
     */
    function closeStateSpots() {
        stateSpotsModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    /* Attach click listeners to state cards (use delegation so dynamically-loaded cards work too). */
    document.addEventListener('click', function (e) {
        const card = e.target.closest('.state-card');
        if (!card) return;

        /* Block the default browser link navigation. */
        e.preventDefault();

        /* The state slug is stored in the card's data-slug attribute. */
        const slug = card.getAttribute('data-slug');
        if (slug) {
            openStateSpots(slug);
        }
    });

    /* Handler for closing the state modal. */
    if (stateSpotsClose) {
        stateSpotsClose.addEventListener('click', closeStateSpots);
    }

    /* Close on background overlay click as well. */
    stateSpotsModal.addEventListener('click', (e) => {
        /* If the user clicked the dark overlay itself (not the panel inside it). */
        if (e.target === stateSpotsModal) {
            closeStateSpots();
        }
    });
};