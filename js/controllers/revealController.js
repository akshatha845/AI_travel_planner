/**
 * TRAVEL PLANNER INDIA - REVEAL CONTROLLER
 * Uses the Intersection Observer API to trigger 'fade-in' effects
 * when elements enter the screen.
 */
export const initReveal = () => {
    /* 'faders' are elements with the class '.fade-in-section' that we want to animate. */
    const faders = document.querySelectorAll('.fade-in-section');

    /* Safety Check: Only proceed if there is at least one element to animate. */
    if (faders.length === 0) return;

    /* 'appearOnScroll' configuration:
       - 'entries': the elements being tracked.
       - 'observer': the instance of the observer.
       - 'threshold': 15% of the element must be visible before triggering.
       - 'rootMargin': adds a -50px margin to the bottom, triggering the animation slightly late for better impact.
    */
    const appearOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            /* If the element has scrolled into view... */
            if (entry.isIntersecting) {
                /* Add the 'visible' class which contains the CSS transition/opacity logic. */
                entry.target.classList.add('visible');
                /* Stop watching the element once it has faded in (only animate once). */
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

    /* Attach the observer to each targeted element. */
    faders.forEach(fader => appearOnScroll.observe(fader));
};