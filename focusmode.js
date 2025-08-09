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
