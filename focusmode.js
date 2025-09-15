(function(){
    // Vérifie dans le localStorage si le mode focus est actif
    function checkFocusMode() {
        const isFocusMode = localStorage.getItem('focusMode') === 'true';
        if (isFocusMode) {
            document.body.classList.add('focus-mode');
            showCriticalNotification("Mode Focus Activé", "Toutes les distractions sont désactivées.");
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

function showNotification(title, body) {
    const notificationsContainer = document.getElementById("notifications-container");

    const notification = document.createElement("div");
    notification.classList.add("notification", "hidden");
    notification.innerHTML = `
              <div class="notiglow"></div>
              <div class="notiborderglow"></div>
              <div class="notititle"><b>${title}</b></div>
              <div class="notibody"><i>${body}</i></div>
            `;
    notificationsContainer.prepend(notification);

    setTimeout(() => {
        // Force un reflow ici avant d'ajouter la classe
        void notification.offsetWidth;
        notification.classList.remove("hidden");
        notification.classList.add("show");
        updateNotificationPositions();
    }, 100);

    setTimeout(() => {
        notification.classList.remove("show");
        notification.classList.add("hidden");
        setTimeout(() => {
            notification.remove();
            updateNotificationPositions();
        }, 200);
    }, 5000);

    if (notificationsContainer.children.length > 5) {
        const lastNotification = notificationsContainer.children[5];
        lastNotification.classList.remove("show");
        lastNotification.classList.add("hidden");
        setTimeout(() => {
            lastNotification.remove();
            updateNotificationPositions();
        }, 300);
    }
    notification.addEventListener("click", (e) => {
        notification.classList.remove("show");
        notification.classList.add("hidden");
        setTimeout(() => {
            notification.remove();
            updateNotificationPositions();
        }, 100);
    });
}

function showCriticalNotification(title, body) {
    const notificationsContainer = document.getElementById("notifications-container");

    const notification = document.createElement("div");
    notification.classList.add("notification", "hidden", "critical");
    notification.innerHTML = `
              <div class="notiglow"></div>
              <div class="notiborderglow"></div>
              <div class="notititle"><b>${title}</b></div>
              <div class="notibody"><i>${body}</i></div>
              <i class="notibody">Cliquez sur la notification pour la cacher</i>
            `;
    notificationsContainer.prepend(notification);

    setTimeout(() => {
        // Force un reflow ici avant d'ajouter la classe
        void notification.offsetWidth;
        notification.classList.remove("hidden");
        notification.classList.add("show");
        notification.classList.add("critical");
        updateNotificationPositions();
    }, 100);

    setTimeout(() => {
        notification.classList.remove("show");
        notification.classList.add("hidden");
        setTimeout(() => {
            notification.remove();
            updateNotificationPositions();
        }, 200);
    }, 9999999999999); // Notification critique, ne disparaît pas automatiquement

    if (notificationsContainer.children.length > 5) {
        const lastNotification = notificationsContainer.children[5];
        lastNotification.classList.remove("show");
        lastNotification.classList.add("hidden");
        setTimeout(() => {
            lastNotification.remove();
            updateNotificationPositions();
        }, 300);
    }
    notification.addEventListener("click", (e) => {
        notification.classList.remove("show");
        notification.classList.add("hidden");
        setTimeout(() => {
            notification.remove();
            updateNotificationPositions();
        }, 100);
    });
}

function showNetworkNotification(title) {
    const notification = document.createElement("div");
    notification.classList.add("notification", "hidden", "critical", "Work");
    notification.innerHTML = `
              <div class="notiglow"></div>
              <div class="notiborderglow"></div>
              <div class="notititle"><b>${title}</b></div>
            `;
    notificationsContainer.prepend(notification);

    setTimeout(() => {
        // Force un reflow ici avant d'ajouter la classe
        void notification.offsetWidth;
        notification.classList.remove("hidden");
        notification.classList.add("show");
        notification.classList.add("critical");
        updateNotificationPositions();
    }, 100);

    setTimeout(() => {
        notification.classList.remove("show");
        notification.classList.add("hidden");
        setTimeout(() => {
            notification.remove();
            updateNotificationPositions();
        }, 200);
    }, 10000); // Notification critique, ne disparaît pas automatiquement

    if (notificationsContainer.children.length > 5) {
        const lastNotification = notificationsContainer.children[5];
        lastNotification.classList.remove("show");
        lastNotification.classList.add("hidden");
        setTimeout(() => {
            lastNotification.remove();
            updateNotificationPositions();
        }, 300);
    }
    notification.addEventListener("click", (e) => {
        notification.classList.remove("show");
        notification.classList.add("hidden");
        setTimeout(() => {
            notification.remove();
            updateNotificationPositions();
        }, 100);
    });
}

function updateNotificationPositions() {
    const notificationsContainer = document.getElementById("notifications-container");

    const notifications = [...notificationsContainer.children];
    notifications.forEach((notification, index) => {
        notification.style.transform = `translateY(${index * (notification.offsetHeight + 10)
            }px)`;
    });
}


function checkConnection() {
    // si pas de réseau détecté
    if (!navigator.onLine) {
        showNetworkNotification("<span class='material-symbols-rounded'>signal_wifi_bad</span>Aucune connexion !", "");
        return;
    }

    // tester la vitesse avec un petit ping (ici google DNS)
    const start = Date.now();
    fetch("https://www.google.com/favicon.ico?_=" + Date.now(), { mode: "no-cors" })
        .then(() => {
            const ping = Date.now() - start;
            if (ping > 1500) { // au-dessus de 1.5 sec = connexion lente
                showNetworNotification("Votre connexion est lente !");
            }
        })
        .catch(() => {
            showNetworkNotification("Votre connexion est instable !");
        });
}

// vérification au chargement
checkConnection();

// recheck à chaque changement d’état
window.addEventListener('online', checkConnection);
window.addEventListener('offline', () => showNetworkNotification("Aucune connexion !"));

// tu peux aussi re-check toutes les x minutes
setInterval(checkConnection, 10_000);
