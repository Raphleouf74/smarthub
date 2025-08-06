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

        const today = new Date().toISOString().split('T')[0]; // format YYYY-MM-DD

        if (dateStr === today) {
            div.classList.add("today");
        }

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
const SettingsModal = document.getElementById('SettingsModal');
const SettingsBtn = document.getElementById('SettingsBtn');
const CloseSettingsBtn = document.getElementById('CloseSettings');
SettingsModal.classList.remove('shown');
SettingsBtn.addEventListener(('click'), () => {
    SettingsModal.classList.add('shown');
});
CloseSettingsBtn.addEventListener(('click'), () => {
    SettingsModal.classList.remove('shown');
});

const cards = document.querySelectorAll(".category-card");
const contents = document.querySelectorAll(".category-content");
const Setgrid = document.querySelector(".category-grid");

cards.forEach(card => {
    card.addEventListener("click", () => {
        const targetId = card.dataset.category;

        // Cacher la grille et afficher la section ciblée
        Setgrid.style.display = "none";
        contents.forEach(content => {
            if (content.id === targetId) {
                content.classList.add("show");
            } else {
                content.classList.remove("show");
            }
        });
    });
});

document.querySelectorAll(".backBtn").forEach(btn => {
    btn.addEventListener("click", () => {
        contents.forEach(c => c.classList.remove("show"));
        Setgrid.style.display = "grid";
    });
});

