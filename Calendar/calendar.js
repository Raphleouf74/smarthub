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
}

function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('shown');
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



flatpickr("#eventDate", {
    dateFormat: "d-m-Y",
    locale: "fr"
});

// ...existing code...

let selectedDateForMenu = null;

// Fonction utilitaire pour formater la date en d-m-Y pour flatpickr
function formatDateDMY(dateStr) {
    const [year, month, day] = dateStr.split('-');
    return `${day}-${month}-${year}`;
}

// Fonction utilitaire pour formater la date en YYYY-MM-DD
function formatDateYMD(dateStr) {
    const [day, month, year] = dateStr.split('-');
    return `${year}-${month}-${day}`;
}

// ...existing code...

document.addEventListener('contextmenu', function (e) {


    e.preventDefault();
    // Vérifie si on a cliqué sur un jour du calendrier
    const dayDiv = e.target.closest('.calendar-day');
    if (!dayDiv) return;

    e.preventDefault();

    // Récupère le jour et le mois affichés
    const day = dayDiv.querySelector('span').textContent;
    const monthYearText = document.getElementById('month-year').textContent;
    const [monthName, year] = monthYearText.split(' ');
    const months = [
        'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
        'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'
    ];
    const month = (months.indexOf(monthName.toLowerCase()) + 1).toString().padStart(2, '0');
    const dateYMD = `${year}-${month}-${day.padStart(2, '0')}`;
    selectedDateForMenu = dateYMD;

    // Affiche le nombre d'événements ce jour-là
    const events = getEvents();
    const nb = events.filter(ev => ev.date === dateYMD).length;
    document.getElementById('EventNb').textContent = nb;
    // ...calcul de selectedDateForMenu et du nombre d'événements...

    const Appmenu = document.getElementById('AppMenu');
    Appmenu.style.display = 'flex';

    // Positionnement intelligent
    const menuWidth = Appmenu.offsetWidth || 250; // valeur par défaut si pas encore rendu
    const menuHeight = Appmenu.offsetHeight || 100;
    let left = e.pageX - 225;
    let top = e.pageY;

    // Ajuste si dépasse à droite
    if (left + menuWidth > window.innerWidth) {
        left = window.innerWidth - menuWidth - 10;
    }
    // Ajuste si dépasse à gauche
    if (left < 0) left = 10;

    // Ajuste si dépasse en bas
    if (top + menuHeight > window.innerHeight) {
        top = window.innerHeight - menuHeight - 10;
    }
    // Ajuste si dépasse en haut
    if (top < 0) top = 10;

    Appmenu.style.left = left + 'px';
    Appmenu.style.top = top + 'px';
});

// ...existing code...

// Fermer le menu si clic ailleurs
document.addEventListener('click', (e) => {
    const Appmenu = document.getElementById('AppMenu');
    if (!Appmenu.contains(e.target)) {
        Appmenu.style.display = 'none';
    }
});

// Quand on clique sur "Ajouter un évènement au jour sélectionné"
document.getElementById('AddEventToDayBtn').addEventListener('click', () => {
    if (!selectedDateForMenu) return;
    showModal('CreateEventModal');
    // Préremplir la date dans le format d-m-Y pour flatpickr
    const fp = document.getElementById('eventDate')._flatpickr;
    if (fp) {
        fp.setDate(formatDateDMY(selectedDateForMenu), true, "d-m-Y");
    } else {
        document.getElementById('eventDate').value = formatDateDMY(selectedDateForMenu);
    }
    document.getElementById('AppMenu').style.display = 'none';
});

// Ouvre le panneau de personnalisation de la page
document.getElementById('customizePageBtn').addEventListener('click', function () {
    SettingsModal.classList.remove('shown');

    document.getElementById('page-customizer').style.display = 'flex';
});

// Ferme le panneau
document.getElementById('closePageCustomizer').addEventListener('click', function () {
    document.getElementById('page-customizer').style.display = 'none';
});

// Applique les styles choisis
document.getElementById('applyPageStyle').addEventListener('click', function () {
    document.body.style.background = document.getElementById('pageBgColor').value;
    document.body.style.fontFamily = document.getElementById('pageFontFamily').value;
    document.body.style.fontSize = document.getElementById('pageFontSize').value + 'px';
});

