function hideWelcome() {
    const welcome = document.getElementById("Welcome");
    welcome.style.transform = "translateY(-100vh)";
    welcome.style.transition = "transform 0.6s ease";
    setTimeout(() => welcome.style.display = "none", 600);
}
function addToCart(productName) {
    alert("🛒 " + productName + " ajouté au panier !");
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
// ✨ Animations welcome déjà en place dans ton HTML original

// Produits de démonstration
const products = [
    {
        name: "Stylus Basic",
        description: "Un stylo connecté simple et fiable.",
        price: 1.99
    },
    {
        name: "Stylus 4C",
        description: "Un stylo 4 couleurs innovant, connécté et rechargeable.",
        price: 8.99
    },
    {
        name: "Recharge 1 couleur",
        description: "Recharge pour 1 couleur au choix parmi Bleu, Noir, Rouge ou Vert (PRIX PAR RECHARGE)",
        price: 0.99
    },
    {
        name: "Recharge 4 couleurs",
        description: "Recharge pour les 4 couleurs du Stylus 4C.",
        price: 3.99
    },
    {
        name: "Pack 20 recharges",
        description: "5 recharges pour chaque couleur (Bleu, Noir, Rouge, Vert) pour n'importe quel stylo.",
        price: 14.99
    },
    {
        name: 'Pack Ultime',
        description: 'Pack ultime avec 2 Stylus 4C, 3 Stylus Basic et 40 recharges (10 de chaque couleur).',
        price: 89.99
    }
];

const productList = document.getElementById("product-list");
const cartCount = document.getElementById("cart-count");
const cartItems = document.getElementById("cart-items");
const totalPriceDisplay = document.getElementById("total-price");
const cartModal = document.getElementById("cart-modal");
const closeCartBtn = document.getElementById("close-cart-btn");
const checkoutBtn = document.getElementById("checkout-btn");

let cart = [];
let cartStack = []; // 🆕 Pile des ajouts

function updateCart() {
  cartItems.innerHTML = "";
  let total = 0;

  cart.forEach((item, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${item.name} - ${item.price.toFixed(2)}€ 
      
      <div class="qty-controls">
        <button class="qty-btn" onclick="changeQuantity(${index}, 1)">+</button>
        <strong>(x${item.quantity})</strong>
        <button class="qty-btn" onclick="changeQuantity(${index}, -1)">-</button>
      </div>
    `;
    cartItems.appendChild(li);
    total += item.price * item.quantity;
  });

  totalPriceDisplay.innerHTML = `Votre panier s'élève à: <strong>${total.toFixed(2)}€</strong>`;
  cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
}


function removeItem(index) {
    cart.splice(index, 1);
    updateCart();
}

function addToCart(product) {
  const existing = cart.find(item => item.name === product.name);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  bounceCartIcon();
  updateCart();
}


function changeQuantity(index, delta) {
  cart[index].quantity += delta;
  if (cart[index].quantity <= 0) {
    cart.splice(index, 1);
  }
  updateCart();
}


products.forEach(product => {
    const div = document.createElement("div");
    div.classList.add("product");

    div.innerHTML = `
    <h3>${product.name}</h3>
    <p>${product.description}</p>
    <p class="price">${product.price.toFixed(2)}€</p>
    <button >Ajouter au panier</button>
  `;

    // Fix for function stringification
    div.querySelector("button").addEventListener("click", () => addToCart(product));
    productList.appendChild(div);
});

document.querySelector(".cart").addEventListener("click", () => {
    cartModal.classList.toggle("shown");
});

closeCartBtn.addEventListener("click", () => {
    cartModal.classList.toggle("shown");
});

checkoutBtn.addEventListener("click", () => {
    alert("Merci pour votre commande !");
    cart = [];
    updateCart();
    cartModal.classList.add("hidden");
});

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
// Scroll animation for product cards
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.product').forEach(el => observer.observe(el));

function bounceCartIcon() {
  const cartIcon = document.querySelector('.cart-icon');
  if (cartIcon) {
    cartIcon.classList.add('bounce');
    setTimeout(() => cartIcon.classList.remove('bounce'), 500);
  }
}

// document.getElementById('sort-select').addEventListener('change', function() {
//   const sortBy = this.value;
//   products.sort((a, b) => {
//     if (sortBy === 'price-asc') return a.price - b.price;
//     if (sortBy === 'price-desc') return b.price - a.price;
//     return 0;
//   });
//   displayProducts(products);
// });
