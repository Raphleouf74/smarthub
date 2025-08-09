document.addEventListener("keydown", (e) => {
    if (e.shiftKey) {
        document.getElementById("Assistant").classList.add("show");
    }
});
const commandInput = document.getElementById("commandInput");
document.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        if (commandInput.value.trim() === "") {
            document.getElementById("Assistant").classList.remove("show");
        } else {
            handleCommand();
        }
    }
});
function levenshtein(a, b) {
    const matrix = Array.from({ length: a.length + 1 }, (_, i) =>
        Array.from({ length: b.length + 1 }, (_, j) => i === 0 ? j : j === 0 ? i : 0)
    );

    for (let i = 1; i <= a.length; i++) {
        for (let j = 1; j <= b.length; j++) {
            if (a[i - 1] === b[j - 1]) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j] + 1,     // Suppression
                    matrix[i][j - 1] + 1,     // Insertion
                    matrix[i - 1][j - 1] + 1  // Substitution
                );
            }
        }
    }

    return matrix[a.length][b.length];
}

const commandMappings = [
    { cmd: "accueil", action: () => scrollToElement("Welcome") },
    { cmd: "outils", action: () => scrollToElement("ToolsDiv") },
    { cmd: "actualites", action: () => scrollToElement("News") },
    { cmd: "propos", action: () => scrollToElement("AboutUs") },
    { cmd: "connexion", action: () => location.href = "/Login-Register/login.html" },
    { cmd: "inscription", action: () => location.href = "/Login-Register/register.html" },
    { cmd: "compte", action: () => showElement("AccountSettings") },
    { cmd: "recharger", action: () => location.reload() },
    { cmd: "haut", action: () => window.scrollTo({ top: 0, behavior: "smooth" }) },
    { cmd: "bas", action: () => window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" }) },
    { cmd: "fermer", action: () => toggleAssistant() },
    { cmd: "menu", action: () => toggleMenu() },
    { cmd: "plateforme", action: () => scrollToPlatformState() },

    // Nouveaux exemples :
    {
        cmd: "creer une note",
        action: () => {
            location.href = "/QuickNotes/quicknotes.html";
            setTimeout(() => highlightElement("createNoteBtn"), 1000);
        }
    },
    {
        cmd: "ajouter un evenement",
        action: () => {
            location.href = "/Calendar/calendar.html";
            setTimeout(() => highlightElement("addEventBtn"), 1000);
        }
    }
];

function handleCommand() {
    const input = commandInput.value.trim().toLowerCase();
    if (!input) return alert("Veuillez entrer une commande.");

    let bestMatch = null;
    let lowestDistance = Infinity;

    for (let mapping of commandMappings) {
        const distance = levenshtein(input, mapping.cmd);
        if (distance < lowestDistance) {
            lowestDistance = distance;
            bestMatch = mapping;
        }
    }

    if (lowestDistance <= 3 && bestMatch) {
        bestMatch.action();
    } else {
        alert("Commande non reconnue.");
    }
}
function scrollToElement(id) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
}

function showElement(id) {
    const el = document.getElementById(id);
    if (el) el.style.display = "block";
}

function toggleAssistant() {
    document.getElementById("Assistant").classList.toggle("show");
}

function toggleMenu() {
    const header = document.getElementById("header");
    header.classList.toggle("hovered");
    header.addEventListener("mouseenter", () => header.classList.remove("hovered"));
}

function highlightElement(id) {
    const el = document.getElementById(id);
    if (!el) return;

    el.style.transition = "box-shadow 0.5s";
    el.style.boxShadow = "0 0 20px 5px yellow";
    setTimeout(() => el.style.boxShadow = "", 2000);
}

function toggleCommandModal() {
    const modal = document.getElementById("commandmodal");
    modal.style.transform =
        modal.style.transform === "translateY(0px) scale(1.1)"
            ? "translateY(150px) scale(1)"
            : "translateY(0px) scale(1.1)";
    modal.style.opacity = modal.style.opacity === "1" ? "0" : "1";
    modal.style.zIndex = modal.style.zIndex === "1000" ? "-1" : "1000";
}

