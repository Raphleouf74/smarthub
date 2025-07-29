//script.js
const accountbtn = document.getElementById('account');
const menuSettings = document.getElementById('MenuSettings');
const notificationsContainer = document.getElementById("notifications-container");



function updateNotificationPositions() {
    const notifications = [...notificationsContainer.children];
    notifications.forEach((notification, index) => {
        notification.style.transform = `translateY(${index * (notification.offsetHeight + 10)
            }px)`;
    });
}

function showNotification(title, body) {
    const notification = document.createElement("div");
    notification.classList.add("notification", "hidden");
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

    if (notificationsContainer.children.length > 3) {
        const lastNotification = notificationsContainer.children[3];
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
    const notification = document.createElement("div");
    notification.classList.add("notification", "hidden", "critical", "Work");
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

    if (notificationsContainer.children.length > 3) {
        const lastNotification = notificationsContainer.children[3];
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


showNotification("Bienvenue sur SmartHub", "Site propulsé par smartUI 1.3.1");
showCriticalNotification("Systèmes de Connexion et d'inscription désactivés","");


// Header scroll effect
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');

    if (window.scrollY > 30) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

window.addEventListener('scroll', () => {
    const scrolled = window.scrollY > 30;
    document.body.classList.toggle('scrolled', scrolled);
});



const UserSettingsBtn = document.getElementById('AccSettings');
const accountSettings = document.getElementById('AccountSettings');
const closeAccSettingsBtn = document.getElementById('CloseAccSett');
UserSettingsBtn.addEventListener('click', () => {
    showNotification("Créez un compte pour pouvoir modifier vos infos !", "Pour l'instant, vous ne pouvez pas modifier vos informations car vous n'avez pas de compte. Pour en créer un, rendez-vous dans la section 'Créer un compte' dans le menu !");

    accountSettings.classList.toggle('shown');
    setTimeout(() => accountSettings.classList.add('show'), 0); // un petit délai pour déclencher la transition
});

closeAccSettingsBtn.addEventListener('click', () => {
    accountSettings.classList.toggle('shown'); // attendre que l'anim sorte
});

// ----- Vérification de version -----
async function checkSiteVersion() {
    try {
        const res = await fetch('/version.json', { cache: 'no-cache' });
        const { version: latest } = await res.json();
        const current = localStorage.getItem('siteVersion');

        if (current && current !== latest) {
            showUpdateNotification();
        }
        localStorage.setItem('siteVersion', latest);
    } catch { }
}

function showUpdateNotification() {
    const notif = document.createElement('div');
    notif.className = 'update-notification';
    notif.innerHTML = `
        <p>Une nouvelle version du site est en ligne, cliquez sur le bouton pour recharger la page et la mettre à jour</p>
        <button onclick="location.reload()">Recharger la page</button>
    `;
    document.body.appendChild(notif);
}

const canvas = document.getElementById('welcomeCanvas');
const ctx = canvas.getContext('2d');
let particles = [];
let mouse = { x: null, y: null };

function resizeCanvas() {
    canvas.width = "100%";
    canvas.height = "100vh";
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// 🎨 Couleurs prédéfinies
document.addEventListener("DOMContentLoaded", () => {
    let showLines = true; // Par défaut, les lignes sont affichées

    const canvas = document.getElementById("welcomeCanvas");
    const ctx = canvas.getContext("2d");
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    let mouse = { x: null, y: null };
    window.addEventListener("mousemove", e => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    window.addEventListener("resize", () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.radius = Math.random() * 5 + 3;
            this.vx = Math.random() * 2 - 0.5;
            this.vy = Math.random() * 2 - 0.5;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
            ctx.fill();
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // rebond
            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;

            // interaction souris
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 300) {
                this.x -= dx * 0.005;
                this.y -= dy * 0.005;
            }

            this.draw();
        }
    }

    const particles = [];
    for (let i = 0; i < 75; i++) {
        particles.push(new Particle());
    }

    function connectParticles() {
        if (!showLines) return; // Ne rien faire si les lignes sont désactivées

        for (let a = 0; a < particles.length; a++) {
            for (let b = a + 2; b < particles.length; b++) {
                const dx = particles[a].x - particles[b].x;
                const dy = particles[a].y - particles[b].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 3000) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(50,50,150,${1 - dist / 250})`;
                    ctx.lineWidth = 5;
                    ctx.moveTo(particles[a].x, particles[a].y);
                    ctx.lineTo(particles[b].x, particles[b].y);
                    ctx.stroke();
                }
            }
        }
    }
    const toggleBtn = document.getElementById("toggleLinesBtn");
    toggleBtn.addEventListener("click", () => {
        showLines = !showLines;
        toggleBtn.textContent = showLines ? "Masquer les lignes" : "Afficher les lignes";
    });


    function animate() {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => p.update());
        connectParticles();
        requestAnimationFrame(animate);
    }
    const welcome = document.getElementById('Welcome');
    const elements = welcome.querySelectorAll('.interactive');

    welcome.addEventListener('mousemove', (e) => {
        const rect = welcome.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const offsetX = (mouseX - centerX) / centerX;
        const offsetY = (mouseY - centerY) / centerY;

        elements.forEach(el => {
            const intensity = el.dataset.intensity || 1; // px max de déplacement
            const xMove = offsetX * intensity;
            const yMove = offsetY * intensity;

            el.style.transform = `translate(${xMove}px, ${yMove}px)`;
        });
    });

    welcome.addEventListener('mouseleave', () => {
        elements.forEach(el => {
            el.style.transform = `translate(0, 0)`;
        });
    });


    animate();
});

function getTextContrastColor(backgroundColor) {
    // Extraire les valeurs R, G, B
    const rgb = backgroundColor.match(/\d+/g);
    if (!rgb) return '#000'; // Par défaut

    const [r, g, b] = rgb.map(Number);

    // Luminance perceptuelle (formule ITU-R BT.709)
    const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;

    return luminance > 127 ? '#000' : '#fff';
}

function adjustTextColorForElement(elem) {
    const bg = getComputedStyle(elem).backgroundColor;
    const color = getTextContrastColor(bg);
    elem.style.color = color;
}

const header = document.querySelector('header');
const notifs = document.querySelectorAll('.notification');

adjustTextColorForElement(header);
notifs.forEach(adjustTextColorForElement);


window.addEventListener('DOMContentLoaded', () => {
    checkSiteVersion();
    // registerServiceWorkerAndSetupPush();
});

// async function registerServiceWorkerAndSetupPush() {
//     const reg = await navigator.serviceWorker.register('/sw.js');
//     console.log('SW registered:', reg);

//     if (Notification.permission === 'default') {
//         if (confirm("Autoriser les notifications ?")) {
//             await Notification.requestPermission();
//         }
//     }

//     if (Notification.permission === 'granted') {
//         const sub = await reg.pushManager.subscribe({
//             userVisibleOnly: true,
//             applicationServerKey: urlBase64ToUint8Array('BItI9diKW9m5auaIa_V_ryMAxbCQwBdGkGK3XhNWQ8wO4y9LW92wXMVG2JtazM_CvTA0KwawOoGqlQmFxxcQK9E')

//         });
//         await fetch('/push/subscribe', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify(sub),
//         });
//     }
//     if (Notification.permission === 'denied') {
//         console.warn("Notifications denied by user");
//     }
// }

// // Utilitaire pour la clé VAPID
// function urlBase64ToUint8Array(base64String) { /* ... */ }





// Notifications intra-site

// A utiliser pour le debug !
// setTimeout(() => {
//     showNotification("ScriptJS chargé", "Dev: Le fichier JS à bien été chargé");
// }, 400);
// setTimeout(() => {
//     showNotification("Fichier Js exécuté", "Dev: Le fichier JS à bien été exécuté");
// }, 600);


// 🔔 Détection d'un événement aujourd'hui
function checkTodayEvents() {
    const today = new Date().toISOString().split('T')[0];
    const events = JSON.parse(localStorage.getItem('events')) || [];

    const todayEvents = events.filter(ev => ev.date === today);

    if (todayEvents.length > 0) {
        todayEvents.forEach(ev => {
            showCriticalNotification("📅 Événement aujourd'hui :", `${ev.title} — ${ev.description || ''}`);
        });
    }
}

window.addEventListener('DOMContentLoaded', checkTodayEvents);
const welcomebtn = document.getElementById("welcomebtn");
const welcometext = document.getElementById("welcometext");
const easteregg = document.getElementById("easteregg");
welcometext.style.transform = "translateY(75px)";
welcometext.style.transition = "all 0.3s ease-in-out";
welcometext.style.opacity = "0";
easteregg.style.transform = "translateY(50px)";
easteregg.style.transition = "all 0.3s ease-in-out";
easteregg.style.opacity = "0";
welcomebtn.style.opacity = "0";
welcomebtn.style.transform = "translateY(50px)";
setTimeout(() => {
    welcometext.style.opacity = "1";
    welcometext.style.transform = "translateY(50px) ";
}, 500);
setTimeout(() => {
    welcometext.style.transform = "translateY(0) ";
}, 4750);
setTimeout(() => {
    welcomebtn.style.transform = "translateY(0) ";
    welcomebtn.style.opacity = "1";
}, 5000);
setTimeout(() => {
    easteregg.style.transform = "translateY(0) ";
    easteregg.style.opacity = "1";
}, 50000);
function scrollToTools() {
    const toolsDiv = document.getElementById("ToolsDiv");
    toolsDiv.scrollIntoView({ behavior: "smooth" });
}
function scrollToWelcome() {
    const welcomeDiv = document.getElementById("Welcome");
    welcomeDiv.scrollIntoView({ behavior: "smooth" });
}

function scrollToAboutUs() {
    const aboutUsDiv = document.getElementById("AboutUs");
    aboutUsDiv.scrollIntoView({ behavior: "smooth" });
}

function scrollToPlatformState() {
    const platformStateDiv = document.getElementById("PlatformStatus");
    platformStateDiv.scrollIntoView({ behavior: "smooth" });
}

document.addEventListener("keydown", (e) => {
    if (e.shiftKey && e.key == "L") {
        scrollToWelcome();
    }
});

