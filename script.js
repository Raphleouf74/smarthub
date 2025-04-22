//script.js
const header = document.querySelector('header');
const light = document.getElementById('cursorLight');
const accountbtn = document.getElementById('account');

header.addEventListener('mousemove', (e) => {
    const rect = header.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    light.style.left = `${x}px`;
    light.style.top = `${y}px`;
    light.style.display = 'block';
});

header.addEventListener('mouseleave', () => {
    light.style.display = 'none';
});

let menuTimeout;

window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (window.scrollY > 20) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});
