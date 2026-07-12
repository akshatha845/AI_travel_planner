(function() {
    var loggedIn = localStorage.getItem('loggedIn') === 'true';
    var userName = localStorage.getItem('userName') || 'Traveler';
    if (loggedIn && document.querySelector('[data-username-placeholder]')) {
        var els = document.querySelectorAll('[data-username-placeholder]');
        for (var i = 0; i < els.length; i++) {
            els[i].textContent = userName;
        }
    }
    var logoutLink = document.getElementById('logout-link') || document.querySelector('[data-action="logout"]');
    if (logoutLink) {
        logoutLink.addEventListener('click', function(e) {
            e.preventDefault();
            localStorage.clear();
            window.location.href = 'index.html';
        });
    }
})();
