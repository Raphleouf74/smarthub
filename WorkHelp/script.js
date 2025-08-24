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

    if (notificationsContainer.children.length > 5) {
        const lastNotification = notificationsContainer.children[5];
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

    if (notificationsContainer.children.length > 5) {
        const lastNotification = notificationsContainer.children[5];
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


/* FocusSpace — JS (Pomodoro, Notes, Flashcards, Audio, Calc, Todo, Stats)
   Sauvegarde dans localStorage, UI minimale. */

/* ---------- helpers ---------- */
const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));
const save = (k, v) => localStorage.setItem(k, JSON.stringify(v));
const load = k => { try { return JSON.parse(localStorage.getItem(k)) } catch { return null } };


/* ---------- Tabs ---------- */
const tabs = $$('.tab');
const panels = $$('.panel');
tabs.forEach(t => t.addEventListener('click', e => {
    tabs.forEach(x => x.classList.remove('active'));
    t.classList.add('active');
    const target = t.dataset.tab;
    panels.forEach(p => {
        if (p.id === target) { p.classList.add('active'); p.hidden = false }
        else { p.classList.remove('active'); p.hidden = true }
    });
}));

/* ---------- Pomodoro ---------- */
let pomState = load('pomState') || {
    work: 25, short: 5, long: 15, cyclesBeforeLong: 4, autoNext: false,
    mode: 'work', remaining: 25 * 60, cyclesDone: 0, running: false
};
const timerDisplay = $('#timerDisplay');
const sessionType = $('#sessionType');
const startBtn = $('#startPom');
const pauseBtn = $('#pausePom');
const resetBtn = $('#resetPom');
const settingsBtn = $('#settingsPom');
const pomSettings = $('#pomSettings');
const pomodorodisplay = $('.pomodoro-display')
const fullscreenPom = $('#fullscreenPom');

function formatTime(sec) { const m = Math.floor(sec / 60).toString().padStart(2, '0'); const s = (sec % 60).toString().padStart(2, '0'); return `${m}:${s}`; }

function updatePomUI() {
    timerDisplay.textContent = formatTime(pomState.remaining);

    sessionType.textContent = pomState.mode === 'work' ? 'Travail' : (pomState.mode === 'short' ? 'Pause courte' : 'Pause longue');
    $('#sessionStatus').textContent = pomState.running ? 'Travail en cours...' : 'Prêt à commencer ?';
    $('#focusIndicator').textContent = pomState.running ? 'ON' : 'OFF';

    if (pomState.running) {
        localStorage.setItem('focusMode', 'true');

    } else {
        localStorage.setItem('focusMode', 'false');
    }

    save('pomState', pomState);
}


let pomInterval = null;
function tick() {
    if (!pomState.running) return;
    if (pomState.remaining > 0) {
        pomState.remaining--;
        updatePomUI();
    } else {
        // session ended
        pomState.running = false;
        // increment cycles if we finished work
        if (pomState.mode === 'work') {
            pomState.cyclesDone++;
            incrementStats(pomState.work);
        }
        // switch mode
        if (pomState.mode === 'work') {
            if (pomState.cyclesDone % pomState.cyclesBeforeLong === 0) {
                pomState.mode = 'long';
                pomState.remaining = pomState.long * 60;
            } else {
                pomState.mode = 'short';
                pomState.remaining = pomState.short * 60;
            }
        } else {
            pomState.mode = 'work';
            pomState.remaining = pomState.work * 60;
        }
        updatePomUI();
        // auto start next
        if (pomState.autoNext) {
            setTimeout(() => { startPom(); }, 1300);
        } else {
            // alert sonore simple
            beep();
        }
    }
}

function startPom() {
    if (pomState.running) return;
    pomState.running = true;
    if (!pomInterval) pomInterval = setInterval(tick, 1000);
    showNotification('<span class="material-symbols-outlined">check</span> Pomodoro activé', '');
    setTimeout(() => { showNotification('<span class="material-symbols-outlined">bedtime</span> Mode "Ne pas déranger" activé', "") }, 500);
    updatePomUI();
}
function pausePom() {
    pomState.running = false;
    clearInterval(pomInterval); pomInterval = null;
    updatePomUI();
    showNotification('<span class="material-symbols-outlined">check</span>Pomodoro mit en pause', '')
    setTimeout(() => { showNotification('<span class="material-symbols-outlined">bedtime_off</span> Mode "Ne pas déranger" désactivé', "") }, 500);

}
function resetPom() {
    pomState.running = false;
    pomState.mode = 'work';
    pomState.remaining = pomState.work * 60;
    pomState.cyclesDone = 0;
    clearInterval(pomInterval); pomInterval = null;
    updatePomUI();
    showNotification('<span class="material-symbols-outlined">check</span>Pomodoro réinitialisé', '')
}

startBtn.addEventListener('click', () => { startPom(); });
pauseBtn.addEventListener('click', () => { pausePom(); });
resetBtn.addEventListener('click', () => { resetPom(); });
settingsBtn.addEventListener('click', () => {
    pomSettings.classList.toggle('shown');
});


$('#savePomSettings').addEventListener('click', () => {
    pomState.work = Number($('#workDuration').value) || 25;
    pomState.short = Number($('#shortBreak').value) || 5;
    pomState.long = Number($('#longBreak').value) || 15;
    pomState.cyclesBeforeLong = Number($('#cyclesBeforeLong').value) || 4;
    pomState.autoNext = $('#autoStartNext').checked;
    // reset remaining nicely
    pomState.remaining = pomState.mode === 'work' ? pomState.work * 60 : pomState.mode === 'short' ? pomState.short * 60 : pomState.long * 60;
    save('pomState', pomState);
    updatePomUI();
});

/* load settings into inputs */
$('#workDuration').value = pomState.work;
$('#shortBreak').value = pomState.short;
$('#longBreak').value = pomState.long;
$('#cyclesBeforeLong').value = pomState.cyclesBeforeLong;
$('#autoStartNext').checked = pomState.autoNext;
updatePomUI();

/* very small beep using WebAudio */
function beep() {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = 'sine'; o.frequency.setValueAtTime(880, ctx.currentTime);
        g.gain.setValueAtTime(0.0001, ctx.currentTime);
        o.connect(g); g.connect(ctx.destination);
        g.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.01);
        o.start();
        setTimeout(() => { g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.05); o.stop(ctx.currentTime + 0.06); }, 400);
    } catch (e) { }
}

/* ---------- Stats ---------- */
let stats = load('fsStats') || { sessions: 0, minutes: 0 };
function incrementStats(minutes) {
    stats.sessions = (stats.sessions || 0) + 1;
    stats.minutes = (stats.minutes || 0) + Math.round(minutes);
    save('fsStats', stats);
    renderStats();
}
function renderStats() {
    $('#statSessions').textContent = stats.sessions || 0;
    $('#statMinutes').textContent = stats.minutes || 0;
}
$('#resetStats').addEventListener('click', () => { stats = { sessions: 0, minutes: 0 }; save('fsStats', stats); renderStats(); });
renderStats();

/* ---------- Notes ---------- */
let notes = load('fsNotes') || [];
const notesList = $('#notesList'), noteEditor = $('#noteEditor'), noteTitle = $('#noteTitle');
function renderNotes() {
    notesList.innerHTML = '';
    notes.slice().reverse().forEach((n, i) => {
        if (!n) return; // <-- Ajouté pour ignorer les notes nulles
        const idx = notes.length - 1 - i;
        const div = document.createElement('div'); div.className = 'note-item';
        div.innerHTML = `
            <div>
                <strong>${n.title || 'Sans titre'}</strong><br><small>${new Date(n.t).toLocaleString()}</small>
            </div>
            <div>
                <button data-index="${idx}" class="editNote" title="Éditer la note"><span class="material-symbols-outlined">edit</span></button>
                <button data-index="${idx}" class="delNote" title="Supprimer la note"><span class="material-symbols-outlined">delete</span></button>
                <button data-index="${idx}" class="hideNote" title="Cacher la note"><span class="material-symbols-outlined">visibility_lock</span></button>
            </div>`;
        notesList.appendChild(div);
    });
}
notesList.addEventListener('click', (e) => {
    const ed = e.target.closest('.editNote');
    const del = e.target.closest('.delNote');
    const hide = e.target.closest('.hideNote');

    if (ed) {
        const idx = Number(ed.dataset.index);
        noteEditor.value = notes[idx].content;
        noteTitle.value = notes[idx].title;
        noteEditor.focus();
        noteEditor.dataset.editing = idx;

    } else if (del) {
        const idx = Number(del.dataset.index);
        const noteEl = del.closest('.note-item'); // élément DOM de la note

        noteEl.classList.add('deleting'); // déclenche l'animation

        // attendre la fin de l'animation avant de supprimer
        setTimeout(() => {
            notes.splice(idx, 1);
            save('fsNotes', notes);
            renderNotes();
        }, 400); // doit correspondre à la durée du CSS (0.4s)
    } else if (hide) {
        const idx = Number(hide.dataset.index);
        const noteHi = hide.closest('.note-item'); // élément DOM de la note

        noteHi.classList.add('hiding'); // déclenche l'animation

        // attendre la fin de l'animation avant de supprimer
        setTimeout(() => {
            notes.splice(idx, 1);
            save('fsNotes', notes);
            renderNotes();
        }, 400); // doit correspondre à la durée du CSS (0.4s)
    }
});

$('#addNote').addEventListener('click', () => {
    const title = noteTitle.value.trim();
    const content = noteEditor.value.trim();
    if (!content) return alert('La note est vide.');
    if (noteEditor.dataset.editing !== undefined) {
        const idx = Number(noteEditor.dataset.editing);
        notes[idx] = { title, content, t: Date.now() };
        delete noteEditor.dataset.editing;
    } else {
        notes.push({ title, content, t: Date.now() });
    }
    save('fsNotes', notes);
    noteTitle.value = ''; noteEditor.value = ''; renderNotes();
});

renderNotes();

/* ---------- Flashcards ---------- */
let cards = load('fsCards') || [];
const cardArea = $('#cardArea');

function renderCards() {
    cardArea.innerHTML = '';
    cards.forEach((c, i) => {
        const el = document.createElement('div');
        el.className = 'flash-card';
        el.style.animationDelay = `${i * 0.1}s`; // décalage 100ms par carte
        el.innerHTML = `
          <div class="flash-card-inner">
            <div class="front">${c.front}</div>
            <div class="back">${c.back}</div>
          </div>
        `;
        // flip au clic gauche
        el.addEventListener('click', () => el.classList.toggle('flipped'));

        // clic droit -> menu contextuel custom
        el.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            showCardMenu(e.pageX, e.pageY, i);
        });

        cardArea.appendChild(el);
    });
}


$('#addCard').addEventListener('click', () => {
    const f = $('#cardFront').value.trim(); 
    const b = $('#cardBack').value.trim();
    if (!f || !b) return alert('Remplis recto et verso.');

    cards.push({ front: f, back: b });
    save('fsCards', cards);
    $('#cardFront').value = '';
    $('#cardBack').value = '';
    renderCards();
});

$('#clearCards').addEventListener('click', () => {
    if (confirm('Supprimer toutes les fiches ?')) {
        cards = [];
        save('fsCards', cards);
        renderCards();
    }
});

renderCards();


const menu = document.getElementById('cardMenu');
let currentCardIndex = null;

function showCardMenu(x, y, index) {
    currentCardIndex = index;
    menu.style.left = x + 'px';
    menu.style.top = (y - 250) + 'px';
    menu.style.display = 'flex';
}

// fermer menu si clic ailleurs
document.addEventListener('click', () => menu.style.display = 'none');

// actions
$('#dupCard').addEventListener('click', () => {
    if (currentCardIndex !== null) {
        const card = cards[currentCardIndex];
        cards.push({ front: card.front, back: card.back });
        save('fsCards', cards);
        renderCards();
    }
    menu.style.display = 'none';
});

$('#delCard').addEventListener('click', () => {
    if (currentCardIndex !== null) {
        cards.splice(currentCardIndex, 1);
        save('fsCards', cards);
        renderCards();
    }
    menu.style.display = 'none';
});



/* ---------- Calculator ---------- */
(function () {
    const screen = document.getElementById('screen');
    const historyLine = document.getElementById('historyLine');
    const histList = document.getElementById('histList');

    const modeBasic = document.getElementById('modeBasic');
    const modeSci = document.getElementById('modeSci');
    const copyBtn = document.getElementById('copyResult');
    const clearHist = document.getElementById('clearHistory');

    const sciKeys = () => Array.from(document.querySelectorAll('.key.sci'));

    // état
    let memory = 0;
    let history = JSON.parse(localStorage.getItem('calcHistory') || '[]');

    // helpers
    const setScreen = v => screen.value = v;
    const insertAtCursor = (txt) => {
        const el = screen;
        const start = el.selectionStart ?? el.value.length;
        const end = el.selectionEnd ?? el.value.length;
        const before = el.value.slice(0, start);
        const after = el.value.slice(end);
        const cleanTxt = txt === ',' ? '.' : txt;
        el.value = before + cleanTxt + after;
        const pos = start + cleanTxt.length;
        el.setSelectionRange(pos, pos);
        el.focus();
    };

    function formatForEval(expr) {
        // remplacements autorisés
        let s = expr.replace(/,/g, '.')
            .replace(/π/g, 'PI')
            .replace(/×/g, '*')
            .replace(/÷/g, '/')
            .replace(/\^/g, '**')
            .replace(/%/g, '*0.01');

        // Factorielle n!  -> fact(n)
        s = s.replace(/(\d+|\))!/g, (m) => {
            // transforme "n!" en fact(n) en traitant )! aussi: ( ... )!
            if (m.endsWith(')!')) {
                // on compte les parenthèses pour retrouver l'ouverture
                // simple: remplace ")!" par "))fact(" puis réorganise ; plus sûr: marqueur
                // on fait simple ici: ")!" => " ) )fact(" n'est pas fiable -> on gère uniquement nombre!
                // pour fiabilité: laissons seulement 123! cas
                return m; // fallback
            }
            const n = m.slice(0, -1);
            return `fact(${n})`;
        });

        // Fonctions vers Math.*
        s = s.replace(/\b(sin|cos|tan|sqrt|abs)\(/g, 'Math.$1(')
            .replace(/\bln\(/g, 'Math.log(')
            .replace(/\blog10\(/g, 'Math.log10(')
            .replace(/\bPI\b/g, 'Math.PI')
            .replace(/\be\b/g, 'Math.E');

        // Sanitize rudimentaire : caractères autorisés uniquement
        if (/[^0-9+\-*/().,%^ a-zA-Z_]/.test(expr.replace(/π/g, ''))) {
            throw new Error('Caractère non autorisé');
        }
        return s;
    }

    function fact(n) {
        n = Number(n);
        if (!Number.isFinite(n) || n < 0 || Math.floor(n) !== n) throw new Error('n! nécessite un entier ≥ 0');
        let r = 1; for (let i = 2; i <= n; i++) r *= i; return r;
    }

    function evaluate() {
        let input = screen.value.trim();
        if (!input) return;
        try {
            const prepared = formatForEval(input);
            // remplace les cas (...)! qu'on a laissé passer (facultatif)
            // Ici, on ne gère pas (expr)! pour rester simple.

            // eslint-disable-next-line no-new-func
            const result = Function('fact', 'return (' + prepared + ')')(fact);
            if (result === undefined) throw new Error('Expression invalide');
            const pretty = (v) => Number.isFinite(v) ? +(+v).toFixed(12) : v;
            const out = pretty(result);

            historyLine.textContent = input + ' =';
            setScreen(String(out));

            // historiser
            history.unshift({ expr: input, res: String(out), ts: Date.now() });
            history = history.slice(0, 50);
            localStorage.setItem('calcHistory', JSON.stringify(history));
            renderHistory();
        } catch (e) {
            historyLine.textContent = 'Erreur : ' + e.message;
        }
    }

    function renderHistory() {
        histList.innerHTML = '';
        history.forEach((h, i) => {
            const li = document.createElement('li');
            li.innerHTML = `<small>${h.expr}</small><strong>= ${h.res}</strong>`;
            li.title = new Date(h.ts).toLocaleString();
            li.addEventListener('click', () => {
                setScreen(h.res);
                historyLine.textContent = h.expr + ' =';
            });
            histList.appendChild(li);
        });
    }
    document.querySelectorAll('.key').forEach((btn, index) => {
        btn.style.animationDelay = `${index * 15}ms`; // 150ms entre chaque
    });

    // boutons
    document.querySelectorAll('#calc .key').forEach(btn => {
        const ins = btn.dataset.insert;
        const act = btn.dataset.act;


        if (ins) {
            btn.addEventListener('click', () => insertAtCursor(ins));
        } else if (act) {
            btn.addEventListener('click', () => {
                switch (act) {
                    case 'C': setScreen(''); historyLine.textContent = ''; break;
                    case 'CE': {
                        // efface le dernier "token" (nombre ou opérateur)
                        const v = screen.value;
                        const nv = v.replace(/(\s*[+\-*/^%]\s*|\d+\.?\d*|\.\d+)$/, '');
                        setScreen(nv);
                        break;
                    }
                    case 'DEL': {
                        const v = screen.value; setScreen(v.slice(0, -1)); break;
                    }
                    case '=': evaluate(); break;
                    case 'sign': {
                        // transforme le dernier nombre en ±
                        const v = screen.value;
                        const m = v.match(/(-?\d*\.?\d+)(?!.*\d)/);
                        if (m) {
                            const num = m[0].startsWith('-') ? m[0].slice(1) : '-' + m[0];
                            setScreen(v.slice(0, m.index) + num);
                        }
                        break;
                    }
                    case 'MC': memory = 0; break;
                    case 'MR': insertAtCursor(String(memory)); break;
                    case 'M+': memory += Number(screen.value || 0) || 0; break;
                    case 'M-': memory -= Number(screen.value || 0) || 0; break;
                }
            });
        }
    });

    // modes
    function setMode(sci) {
        sciKeys().forEach(k => k.style.display = sci ? 'block' : 'none');
        modeBasic.classList.toggle('active', !sci);
        modeSci.classList.toggle('active', sci);
    }
    modeBasic.addEventListener('click', () => setMode(false));
    modeSci.addEventListener('click', () => setMode(true));
    setMode(false);

    // clavier
    screen.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') { e.preventDefault(); evaluate(); }
    });

    document.addEventListener('keydown', (e) => {
        // touches globales utiles
        if (e.ctrlKey && e.key.toLowerCase() === 'm') { // Ctrl+M = bascule mode
            setMode(!modeSci.classList.contains('active'));
        }
    });

    // outils top
    document.getElementById('copyResult').addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(screen.value || '');
            const old = copyBtn.textContent;
            copyBtn.textContent = '✅';
            setTimeout(() => copyBtn.textContent = old, 700);
        } catch { }
    });

    clearHist.addEventListener('click', () => {
        history = [];
        localStorage.removeItem('calcHistory');
        renderHistory();
    });


    // init
    setScreen('');
    renderHistory();
})();

/* ---------- Todo ---------- */
let todos = load('fsTodos') || [];
const todoList = $('#todoList');
function renderTodos() {
    todoList.innerHTML = '';
    todos.forEach((t, i) => {
        const li = document.createElement('li'); li.className = 'todo-item' + (t.done ? ' done' : '');
        li.innerHTML = `<input type="checkbox" data-i="${i}" ${t.done ? 'checked' : ''}/> <span>${t.text}</span> <button data-i="${i}" class="delTodo">🗑️</button>`;
        todoList.appendChild(li);
    });
}
$('#addTodo').addEventListener('click', () => {
    const v = $('#todoInput').value.trim(); if (!v) return;
    todos.push({ text: v, done: false }); $('#todoInput').value = ''; save('fsTodos', todos); renderTodos();
});
todoList.addEventListener('change', (e) => {
    if (e.target.matches('input[type=checkbox]')) {
        const i = Number(e.target.dataset.i); todos[i].done = e.target.checked; save('fsTodos', todos); renderTodos();
    }
});
todoList.addEventListener('click', (e) => {
    if (e.target.matches('.delTodo')) { const i = Number(e.target.dataset.i); todos.splice(i, 1); save('fsTodos', todos); renderTodos(); }
});
$('#clearTodos').addEventListener('click', () => { todos = todos.filter(t => !t.done); save('fsTodos', todos); renderTodos(); });
renderTodos();
document.querySelectorAll(".pom-controls button").forEach(btn => {
    const spans = btn.querySelectorAll("span");

    // Animation initiale au chargement
    spans.forEach(span => {
        span.classList.add("init-anim");

        span.addEventListener("animationend", () => {
            span.classList.remove("init-anim");
        }, { once: true });
    });

    // Animation uniquement au survol
    btn.addEventListener("mouseenter", () => {
        btn.classList.add("hover-anim");
    });
    btn.addEventListener("mouseleave", () => {
        btn.classList.remove("hover-anim");
    });
});

/* ---------- Initialize UI ---------- */
updatePomUI();
renderNotes();
renderCards();
// renderRecs();
renderTodos();
renderStats();

const Thememenu = document.getElementById('ThemeMenu');

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
    Appmenu.style.left = (e.pageX - 225 )+ 'px';
    Appmenu.style.top = e.pageY + 'px';
    Appmenu.style.display = 'flex';
});

// fermer menu si clic ailleurs
document.addEventListener('click', (e) => {
    if (!Appmenu.contains(e.target)) {
        Appmenu.style.display = 'none';
    }
});

