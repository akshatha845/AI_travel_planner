/**
 * TRAVEL PLANNER INDIA - HERO VIDEO CONTROLLER
 * Ensures that the hero section looks good even if the
 * background video fails to play.
 */
export const initHeroVideo = () => {
    /* 'heroVideo' is the <video> element used in the hero component. */
    const heroVideo = document.getElementById('hero-video');

    /* Safety Check: Only proceed if the video element exists in the current DOM. */
    if (!heroVideo) return;

    /* We try to play the video programmatically. */
    heroVideo.play().catch(() => {
        /* If play() fails (e.g., due to browser security settings or low-power mode),
           we find the container and add a fallback class to show a static image instead. */
        const container = heroVideo.closest('.video-container');
        if (container) container.classList.add('video-fallback');
    });
};