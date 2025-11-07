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



const body = document.querySelector('body');
// Placer ici les notifications et les notifications critiques

// showNotification();
// showCriticalNotification();

// Header scroll effect
const header = document.querySelector('header');
body.classList.add('scroll-hidden');
window.addEventListener('scroll', () => {

    if (window.scrollY > 30) {
        header.classList.add('scrolled');


    } else {
        header.classList.remove('scrolled');
    }
});

const cookiesdiv = document.getElementById('cookiesdiv');
cookiesdiv.classList.add('hidden');
setTimeout(() => {

    cookiesdiv.classList.add('show');
    cookiesdiv.classList.remove('hidden');

}, 5000);

header.addEventListener('click', () => {
    header.classList.toggle('hover');
});
document.addEventListener('click', (e) => {
    const header = document.querySelector('header');
    if (!header.contains(e.target)) {
        header.classList.remove('hover');
    }
});

// ----- Vérification de version -----
async function checkSiteVersion() {
    const SiteVersion = document.getElementById("SiteVersion");
    const BuildVersion = document.getElementById("BuildVersion");
    try {
        const res = await fetch('../version.json');
        

        const data = await res.json();
        const latest = data.version;
        const latestBuild = data.build;

        const current = localStorage.getItem('siteVersion');
        const currentBuild = localStorage.getItem('buildVersion');

        // Mise à jour de l'affichage
        SiteVersion.innerText = latest;
        BuildVersion.innerText = latestBuild;


        // Vérification des mises à jour
        if (current && current !== latest || currentBuild && currentBuild !== latestBuild) {
            showUpdateNotification();
        }
        localStorage.setItem('siteVersion', latest);
    } catch { 
        console.error("Erreur")
    }
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

function scrollToTools() {
    const toolsDiv = document.getElementById("ToolsDiv");
    toolsDiv.scrollIntoView({ behavior: "smooth" });
}


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

const notifs = document.querySelectorAll('.notification');

adjustTextColorForElement(header);
notifs.forEach(adjustTextColorForElement);


window.addEventListener('DOMContentLoaded', () => {
    checkSiteVersion();
});


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

const ToolsNo = document.getElementById('ToolsNo');
const tools = document.querySelectorAll('#ToolsContent a');

ToolsNo.innerHTML = `Il y a ${tools.length - 1} outils disponibles`;


function acceptCookies() {
    localStorage.setItem('cookiesAccepted', 'true');
    const cookiesdiv = document.getElementById('cookiesdiv');
    cookiesdiv.classList.add('hidden');
    cookiesdiv.classList.remove('show');
}

function rejectCookies() {
    localStorage.setItem('cookiesAccepted', 'false');
    const cookiesdiv = document.getElementById('cookiesdiv');
    cookiesdiv.classList.add('hidden');
    cookiesdiv.classList.remove('show');
}