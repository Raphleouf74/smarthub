(function(){
    // Vérifie dans le localStorage si le mode focus est actif
    function checkFocusMode() {
        const isFocusMode = localStorage.getItem('focusMode') === 'true';
        if (isFocusMode) {
            document.body.classList.add('focus-mode');
        } else {
            document.body.classList.remove('focus-mode');
        }
    }

    // Surveille les changements du localStorage
    window.addEventListener('storage', checkFocusMode);

    // Lancer au chargement
    document.addEventListener('DOMContentLoaded', checkFocusMode);
})();
(function () {
    function applyTheme(theme) {
        if (theme === 'dark') {
            document.body.classList.add('dark-theme');
            document.body.classList.remove('light-theme');
        } else {
            document.body.classList.add('light-theme');
            document.body.classList.remove('dark-theme');
        }
    }

    // Vérifie et applique le thème au chargement
    function checkTheme() {
        const theme = localStorage.getItem('theme') || 'light';
        applyTheme(theme);
    }

    // Écoute les changements de localStorage (si plusieurs onglets)
    window.addEventListener('storage', checkTheme);

    // Lancer au chargement
    document.addEventListener('DOMContentLoaded', checkTheme);

    // Expose une fonction globale pour changer le thème
    window.toggleTheme = function () {
        const current = localStorage.getItem('theme') || 'light';
        const newTheme = current === 'light' ? 'dark' : 'light';
        localStorage.setItem('theme', newTheme);
        applyTheme(newTheme);
    };
})();
