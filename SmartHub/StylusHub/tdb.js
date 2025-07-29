document.addEventListener('DOMContentLoaded', () => {
    function detectBrowser() {
        const userAgent = navigator.userAgent;
        let browserName;

        if (userAgent.includes("Chrome") && !userAgent.includes("Edg")) {
            browserName = "Google Chrome";
        } else if (userAgent.includes("Edg")) {
            browserName = "Microsoft Edge";
        } else if (userAgent.includes("OPR") || userAgent.includes("Opera")) {
            browserName = "Opera";
        } else if (userAgent.includes("Brave")) {
            browserName = "Brave";
        } else if (userAgent.includes("Vivaldi")) {
            browserName = "Vivaldi";
        } else {
            browserName = "Autre";
        }

        return browserName;
    }

    function checkBrowserCompatibility() {
        const browser = detectBrowser();
        if (browser === "Autre") {
            alert("Votre navigateur n'est pas compatible et le service ne pourrait pas fonctionner, veuillez privilégier les navigateurs Google Chrome, Microsoft Edge, Opera, Brave ou Vivaldi.");
            console.log("Navigateur non compatible");
        } else {
            console.log("Navigateur compatible");
        }
    }

    // Vérification de la compatibilité du navigateur
    checkBrowserCompatibility();

    const percentages = document.querySelectorAll('#data h1');
    const inputDiv = document.querySelector('#input');
    const inputDiv1 = document.querySelector('#input1');
    const start = document.querySelector('#start');
    const inputField = document.querySelector('#input input');
    const button = document.querySelector('#ipt');
    const content = document.querySelector('#content');
    const dashboardTitle = document.querySelector('#dashboardTitle');
    const inputFieldStart = document.getElementById('codeInput');

    const dataSection = document.getElementById('data');
    const restSection = document.getElementById('rest');
    const titleSection = document.getElementById('Titreet');

    inputFieldStart.addEventListener('input', function () {
        const length = inputFieldStart.value.length;
        const newSize = 1 + length * 0.07;
        const fontWeight = 300 + length * 100;
        const newrotate = length * 0.3;
        const borrad = 5 + length * 5;

        inputFieldStart.style.transform = `scale(${newSize}) rotate(${newrotate}deg)`;
        inputFieldStart.style.fontWeight = `${fontWeight}`;
        inputFieldStart.style.borderRadius = `${borrad}px`;
    });

    const aboutbtn = document.getElementById('About');
    const modalabout = document.getElementById('modalabout');

    aboutbtn.addEventListener('click', () => {
        modalabout.classList.toggle('shown');
    });
    modalabout.addEventListener('click', () => {
        modalabout.classList.toggle('shown');
    });

    button.addEventListener('click', () => {
        const inputValue = inputField.value;

        if (/^\d{6}$/.test(inputValue)) {
            start.style.display = 'none';

            const searchMessage = document.createElement('h1');
            searchMessage.textContent = `Recherche du stylo connecté ${inputValue}...`;
            searchMessage.style.textAlign = "center";
            searchMessage.style.marginTop = "20px";
            document.body.appendChild(searchMessage);

            setTimeout(() => {
                searchMessage.remove();
                content.style.display = 'block';
                dashboardTitle.textContent = `Tableau de bord du stylo ${inputValue} (dev/test mod)`;

                // Démarrer l'animation d'apparition avec effet glissant et fondu
                setTimeout(() => {
                    titleSection.classList.add('visible'); // Le h2.Titre
                }, 700);

                setTimeout(() => {
                    dataSection.classList.add('visible'); // La section #data
                }, 200);

                setTimeout(() => {
                    restSection.classList.add('visible'); // La section #rest
                }, 1000);

                // Démarrer l'animation après l'affichage du tableau de bord
                percentages.forEach(percentElement => {
                    const text = percentElement.textContent;
                    const isPercentage = text.includes('%');
                    const finalValue = parseInt(text.replace(/\D/g, '')); // Enlève les symboles
                    const suffix = isPercentage ? '%' : ' pages'; // Choisit le suffixe

                    // Animation progressive avec ralentissement final et suffixe
                    animateNumberWithSuffix(percentElement, finalValue, 2000, suffix);
                });

            }, 3500);
        } else {
            alert('Veuillez entrer un code à 6 chiffres.');
            content.style.display = 'none';
        }
    });

    // Fonction pour animer un nombre avec ralentissement final et suffixe
    function animateNumberWithSuffix(element, finalValue, duration, suffix) {
        let startValue = 0;
        let currentValue = startValue;
        const threshold = finalValue - 20; // Seuil pour ralentir
        const initialIncrement = finalValue / (duration / 30); // Pas d'incrément initial
        let currentIncrement = initialIncrement;

        const interval = setInterval(() => {
            // Si on atteint le seuil, on commence à réduire la vitesse d'incrémentation
            if (currentValue >= threshold) {
                currentIncrement *= 0.9; // Réduit l'incrément de 10% à chaque étape pour ralentir
            }

            currentValue += currentIncrement;

            if (currentValue >= finalValue) {
                currentValue = finalValue;
                clearInterval(interval);
            }

            element.textContent = `${Math.floor(currentValue)}${suffix}`; // Affiche le nombre + suffixe
        }, 30);
    }


});
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
    for (let i = 0; i < 125; i++) {
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