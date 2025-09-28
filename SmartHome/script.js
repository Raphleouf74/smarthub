const Thememenu = document.getElementById('ThemeMenu');
const $ = sel => document.querySelector(sel);

// afficher le menu au clic droit
document.querySelector('.theme-toggle-btn').addEventListener('contextmenu', (e) => {
    e.preventDefault(); // empêche le menu contextuel du navigateur
    Thememenu.style.left = e.pageX + 'px';
    Thememenu.style.top = e.pageY + 'px';
    Thememenu.style.display = 'flex';
});

// fermer menu si clic ailleurs
document.addEventListener('click', (e) => {
    if (!Thememenu.contains(e.target)) {
        Thememenu.style.display = 'none';
    }
});

// actions
$('#light').addEventListener('click', () => {
    document.body.classList.add('light-theme');
    document.body.classList.remove('dark-theme');
    Thememenu.style.display = 'none';
});

$('#dark').addEventListener('click', () => {
    document.body.classList.add('dark-theme');
    document.body.classList.remove('light-theme');
    Thememenu.style.display = 'none';
});

const Appmenu = document.getElementById('AppMenu');

// afficher le menu au clic droit
document.querySelector('.backbtn').addEventListener('contextmenu', (e) => {
    e.preventDefault(); // empêche le menu contextuel du navigateur
    Appmenu.style.left = (e.pageX - 225) + 'px';
    Appmenu.style.top = e.pageY + 'px';
    Appmenu.style.display = 'flex';
});

// fermer menu si clic ailleurs
document.addEventListener('click', (e) => {
    if (!Appmenu.contains(e.target)) {
        Appmenu.style.display = 'none';
    }
});

// ...existing code...

window.addEventListener('DOMContentLoaded', () => {
    const deviceList = document.getElementById('deviceList');
    const deviceDiv = document.getElementById('DeviceDiv');
    const connexionsDiv = document.getElementById('Connexions');
    if (!deviceDiv && connexionsDiv) {
        connexionsDiv.style.display = 'block';
    } else if (connexionsDiv) {
        connexionsDiv.style.display = 'none';
    }
});

// ...existing code...