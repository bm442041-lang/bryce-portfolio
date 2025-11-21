// Basic enhancements shared across pages
(function () {
    // Highlight active nav link
    try {
        var links = document.querySelectorAll('nav a');
        var here = location.pathname.split('/').pop() || 'index.html';
        links.forEach(function (a) {
            if (a.getAttribute('href') === here) {
                a.style.background = 'rgba(124, 58, 237, 0.25)';
            }
        });
    } catch (e) { /* no-op */ }

    // Smooth scroll for internal anchors
    document.addEventListener('click', function (e) {
        var el = e.target;
        if (el.tagName === 'A' && el.getAttribute('href') && el.getAttribute('href').startsWith('#')) {
            var target = document.querySelector(el.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    });
})();



