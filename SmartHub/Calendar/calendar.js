const grid = document.getElementById("calendar-grid");
const monthYear = document.getElementById("month-year");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");

let currentDate = new Date();
function renderWeekDays() {
    const container = document.querySelector('.calendar-days');
    container.innerHTML = '';
    const firstDay = localStorage.getItem('firstDay') || 'lundi';
    const days = getOrderedWeekdays(firstDay);

    days.forEach(day => {
        const div = document.createElement('div');
        div.textContent = day.charAt(0).toUpperCase() + day.slice(1); // ex: Lundi
        container.appendChild(div);
    });
}


function renderCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const grid = document.getElementById('calendar-grid');
    grid.innerHTML = '';

    const firstDay = localStorage.getItem('firstDay') || 'lundi';
    let startOffset = new Date(year, month, 1).getDay(); // 0 = dimanche

    // Si lundi est le premier jour → on remappe l'offset
    if (firstDay === 'lundi') {
        startOffset = (startOffset + 6) % 7;
    }

    monthYear.textContent = currentDate.toLocaleDateString('fr-FR', {
        month: 'long',
        year: 'numeric'
    });

    // Cases vides avant le 1er jour
    for (let i = 0; i < startOffset; i++) {
        const empty = document.createElement('div');
        empty.classList.add('empty-day');
        grid.appendChild(empty);
    }

    const events = getEvents();

    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const hasEvent = events.some(ev => ev.date === dateStr);

        const div = document.createElement('div');
        div.classList.add('calendar-day');

        const span = document.createElement('span');
        span.textContent = day;
        div.appendChild(span);

        if (hasEvent) div.classList.add('has-event');
        grid.appendChild(div);
    }
}

if (!localStorage.getItem('firstDay')) {
    localStorage.setItem('firstDay', 'lundi');
}



function getWeekdayName(date) {
    const jsIndex = date.getDay(0); // 0 = dimanche, 1 = lundi...
    const days = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
    return days[jsIndex];
}


function getOrderedWeekdays(firstDay = 'lundi') {
    const allDays = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];
    const index = allDays.indexOf(firstDay.toLowerCase());
    return [...allDays.slice(index), ...allDays.slice(0, index)];
}


prevBtn.addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar(currentDate);
});

nextBtn.addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar(currentDate);
});

renderWeekDays();
renderCalendar();


//script.js
const header = document.querySelector('header');
let menuTimeout;


// Appliquer la valeur enregistrée
const savedFirstDay = localStorage.getItem('firstDay') || 'lundi';

function getEvents() {
    return JSON.parse(localStorage.getItem('events')) || [];
}

function saveEvents(events) {
    localStorage.setItem('events', JSON.stringify(events));
}
document.getElementById('saveEventBtn').addEventListener('click', () => {
    const title = document.getElementById('eventTitle').value;
    const date = document.getElementById('eventDate').value;
    const description = document.getElementById('eventDesc').value;

    if (!title || !date) return alert("Titre et date requis !");

    const events = getEvents();
    events.push({ title, date, description });
    saveEvents(events);

    alert("Événement ajouté !");
    renderEvents(); // Affiche les événements mis à jour
    location.reload() // Recharger la page pour bien afficher les événements
});
function renderEvents() {
    const container = document.getElementById('eventsList');
    const events = getEvents();
    container.innerHTML = '';

    events.forEach((event, index) => {
        const div = document.createElement('div');

        div.innerHTML = `
            <strong class="modal-item">${event.title}</strong> - ${event.date}<br/>
            <em class="modal-item">${event.description}</em><br/>
            <button id="deleteEventbtn" class="modal-item" onclick="deleteEvent(${index})">Supprimer</button>
            <hr/>
        `;

        container.appendChild(div);
        div.classList.add('modal-item');
    });
    updateEmptyMessage();
}
function deleteEvent(index) {
    const events = getEvents();
    events.splice(index, 1);
    saveEvents(events);
    renderEvents();
    updateEmptyMessage();
}
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('hidden');
    modal.classList.add('shown');

    // Optionnel : ajouter un délai pour déclencher une animation CSS
    setTimeout(() => modal.classList.add('show'), 10);
}

function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('shown');
    modal.classList.remove('show');
    modal.classList.add('hidden');
}

document.getElementById('CreateEventBtn').addEventListener('click', () => {
    showModal('CreateEventModal');
    renderEvents();
});
const emptyMessage = document.getElementById('emptyEvent')
function updateEmptyMessage() {
    const emptyMessage = document.getElementById('emptyEvent');
    const eventsList = document.getElementById('eventsList');
    if (!emptyMessage || !eventsList) return;

    const visibleEvents = [...eventsList.children].filter(child => child.tagName !== 'HR');
    emptyMessage.style.display = visibleEvents.length > 0 ? 'none' : 'block';
}



document.getElementById('EventBtn').addEventListener('click', () => {
    showModal('EventModal');
    renderEvents();
});

document.getElementById('closeCreateEventModal').addEventListener('click', () => {
    hideModal('CreateEventModal');
});

document.getElementById('closeEventModal').addEventListener('click', () => {
    hideModal('EventModal');
});

document.addEventListener('keydown', e => {
    if (e.shiftKey && e.key === 'E') {
        showModal('CreateEventModal');
        renderEvents();
    }
});

document.addEventListener('keydown', e => {
    if (e.shiftKey && e.key === 'R') {
        showModal('EventModal');
        renderEvents();
    }
});
updateEmptyMessage();

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
function showCriticalNotification(title, body) {
    const notification = document.createElement("div");
    notification.classList.add("notification", "hidden", "critical");
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
const customizeBtn = document.getElementById('customizeWidgetBtn');
const customizer = document.getElementById('customizer-content');
const applyBtn = document.getElementById('applyWidgetSettings');
const widget = document.getElementById('clockWidget');

// Animation : passer en mode plein écran
customizeBtn.addEventListener('click', () => {
    widget.classList.toggle('modif');
});
widget.addEventListener('click', () => {
    widget.classList.toggle('full');
})
widget.addEventListener('mouseleave', () => {
    widget.classList.remove('full');
})
// Appliquer les paramètres
applyBtn.addEventListener('click', () => {
    const textColor = document.getElementById('textColorPicker').value;
    const bold = document.getElementById('boldText').checked ? 'bold' : 'normal';
    const italic = document.getElementById('italicText').checked ? 'italic' : 'normal';
    const background = document.getElementById('backgroundType').value;

    widget.style.color = textColor;
    widget.style.fontWeight = bold;
    widget.style.fontStyle = italic;

    if (background === 'solid') widget.style.background = '#333';
    else if (background === 'gradient') widget.style.background = 'linear-gradient(135deg, #222, #444)';
    else widget.style.background = 'transparent';

    localStorage.setItem('clockWidgetSettings', JSON.stringify({ textColor, bold, italic, background }));

    // Fermer en revenant au petit widget
    widget.classList.remove('modif');
});

// Mise à jour sans détruire les boutons
function updateClockWidget() {
    const timeSpan = document.getElementById('clock-time');
    const dateSpan = document.getElementById('clock-date');
    const eventsSpan = document.getElementById('clock-events');

    const now = new Date();
    const dateStr = now.toLocaleDateString('fr-FR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });
    const timeStr = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    const today = new Date().toISOString().split('T')[0];
    const events = JSON.parse(localStorage.getItem('events')) || [];
    const todayEvents = events.filter(ev => ev.date === today);

    timeSpan.textContent = timeStr;
    dateSpan.textContent = `Aujourd'hui : ${dateStr}`;
    eventsSpan.innerHTML = todayEvents.length > 0
        ? `Vous avez <strong>${todayEvents.length}</strong> événement(s) aujourd'hui<br>${todayEvents.map(ev => `• ${ev.title}`).join('<br>')}`
        : `Vous n'avez pas d'évènement prévu aujourd'hui.`;
}


setInterval(updateClockWidget, 1000);
updateClockWidget();
