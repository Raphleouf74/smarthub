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

function formatTime(sec) { const m = Math.floor(sec / 60).toString().padStart(2, '0'); const s = (sec % 60).toString().padStart(2, '0'); return `${m}:${s}`; }

function updatePomUI() {
    timerDisplay.textContent = formatTime(pomState.remaining);

    sessionType.textContent = pomState.mode === 'work' ? 'Travail' : (pomState.mode === 'short' ? 'Pause courte' : 'Pause longue');
    $('#sessionStatus').textContent = pomState.running ? 'En session' : 'Prêt';
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
    showNotification('Pomodoro activé', '');
    updatePomUI();
}
function pausePom() {
    pomState.running = false;
    clearInterval(pomInterval); pomInterval = null;
    updatePomUI();
    showNotification('Pomodoro mit en pause', '')
}
function resetPom() {
    pomState.running = false;
    pomState.mode = 'work';
    pomState.remaining = pomState.work * 60;
    pomState.cyclesDone = 0;
    clearInterval(pomInterval); pomInterval = null;
    updatePomUI();
    showNotification('Pomodoro réinitialisé', '')
}

startBtn.addEventListener('click', () => { startPom(); });
pauseBtn.addEventListener('click', () => { pausePom(); });
resetBtn.addEventListener('click', () => { resetPom(); });

settingsBtn.addEventListener('click', () => {
    pomSettings.style.display = pomSettings.style.display === 'grid' ? 'none' : 'grid';
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
        const idx = notes.length - 1 - i;
        const div = document.createElement('div'); div.className = 'note-item';
        div.innerHTML = `<div>
      <strong>${n.title || 'Sans titre'}</strong><br><small>${new Date(n.t).toLocaleString()}</small>
    </div>
    <div>
      <button data-index="${idx}" class="editNote">✏️</button>
      <button data-index="${idx}" class="delNote">🗑️</button>
    </div>`;
        notesList.appendChild(div);
    });
}
notesList.addEventListener('click', (e) => {
    const ed = e.target.closest('.editNote');
    const del = e.target.closest('.delNote');
    if (ed) {
        const idx = Number(ed.dataset.index);
        noteEditor.value = notes[idx].content;
        noteTitle.value = notes[idx].title;
        // move cursor focus
        noteEditor.focus();
        // store editing index
        noteEditor.dataset.editing = idx;
    } else if (del) {
        const idx = Number(del.dataset.index);
        notes.splice(idx, 1); save('fsNotes', notes); renderNotes();
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
$('#exportNotes').addEventListener('click', () => {
    const text = notes.map(n => `${n.title || 'Sans titre'}\n${n.content}\n---\n`).join('\n');
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'notes.txt'; document.body.appendChild(a); a.click(); a.remove();
});
renderNotes();

/* ---------- Flashcards ---------- */
let cards = load('fsCards') || [];
const cardArea = $('#cardArea');
function renderCards() {
    cardArea.innerHTML = '';
    cards.forEach((c, i) => {
        const el = document.createElement('div'); el.className = 'flash-card';
        el.innerHTML = `<div class="front">${c.front}</div><div class="back">${c.back}</div>`;
        el.addEventListener('click', () => el.classList.toggle('flipped'));
        cardArea.appendChild(el);
    });
}
$('#addCard').addEventListener('click', () => {
    const f = $('#cardFront').value.trim(); const b = $('#cardBack').value.trim();
    if (!f || !b) return alert('Remplis recto et verso.');
    cards.push({ front: f, back: b }); save('fsCards', cards); $('#cardFront').value = ''; $('#cardBack').value = ''; renderCards();
});
$('#clearCards').addEventListener('click', () => { if (confirm('Supprimer toutes les fiches ?')) { cards = []; save('fsCards', cards); renderCards(); } });
renderCards();

/* ---------- Audio Recorder ---------- */
// let mediaRecorder, chunks = [], recs = load('fsRecs') || [];
// const recordingsList = $('#recordingsList');

// async function initRec() {
//     if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return alert('Enregistreur non supporté.');
//     try {
//         const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//         mediaRecorder = new MediaRecorder(stream);
//         mediaRecorder.ondataavailable = e => chunks.push(e.data);
//         mediaRecorder.onstop = () => {
//             const blob = new Blob(chunks, { type: 'audio/webm' });
//             chunks = [];
//             const url = URL.createObjectURL(blob);
//             const name = `rec-${Date.now()}.webm`;
//             recs.push({ url, name, t: Date.now(), blobSize: blob.size });
//             save('fsRecs', recs.map(r => ({ name: r.name, t: r.t, blobSize: r.blobSize }))); // store metadata only
//             // keep blob in-memory for this session (ok for small app)
//             recs[recs.length - 1].blob = blob;
//             renderRecs();
//         };
//         $('#startRec').addEventListener('click', () => { if (mediaRecorder && mediaRecorder.state === 'inactive') { mediaRecorder.start(); $('#startRec').disabled = true; $('#stopRec').disabled = false; } });
//         $('#stopRec').addEventListener('click', () => { if (mediaRecorder && mediaRecorder.state === 'recording') { mediaRecorder.stop(); $('#startRec').disabled = false; $('#stopRec').disabled = true; } });
//         $('#downloadAll').addEventListener('click', () => {
//             recs.forEach(r => {
//                 if (!r.blob) return;
//                 const a = document.createElement('a'); a.href = URL.createObjectURL(r.blob); a.download = r.name; document.body.appendChild(a); a.click(); a.remove();
//             });
//         });
//     } catch (e) { console.warn(e); alert('Impossible d’accéder au micro.'); }
// }
// function renderRecs() {
//     recordingsList.innerHTML = '';
//     recs.forEach((r, i) => {
//         const div = document.createElement('div'); div.className = 'recording';
//         const btnPlay = document.createElement('button');
//         btnPlay.textContent = '▶️';
//         const a = document.createElement('a'); a.textContent = r.name; a.href = r.url || '#';
//         const dl = document.createElement('button'); dl.textContent = '⬇︎';
//         btnPlay.addEventListener('click', () => {
//             const audio = new Audio(r.blob ? URL.createObjectURL(r.blob) : r.url);
//             audio.play();
//         });
//         dl.addEventListener('click', () => {
//             if (!r.blob) return alert('Enregistrement non disponible (reload perdu).');
//             const a2 = document.createElement('a'); a2.href = URL.createObjectURL(r.blob); a2.download = r.name; document.body.appendChild(a2); a2.click(); a2.remove();
//         });
//         div.appendChild(btnPlay); div.appendChild(a); div.appendChild(dl);
//         recordingsList.appendChild(div);
//     });
// }
// initRec();
// renderRecs();

/* ---------- Calculator ---------- */
let calcExp = '';
const calcDisplay = $('#calcDisplay');
$$('.calc-grid button').forEach(b => {
    b.addEventListener('click', () => {
        const v = b.dataset.val;
        if (!v) return;
        calcExp += v;
        calcDisplay.value = calcExp;
    });
});
$('#calcClear').addEventListener('click', () => { calcExp = ''; calcDisplay.value = ''; });
$('#calcEquals').addEventListener('click', () => {
    try {
        // safe eval replacement: allow only numbers and operators
        if (!/^[0-9+\-*/().\s]+$/.test(calcExp)) throw new Error('Expression invalide');
        const res = Function(`return (${calcExp})`)();
        calcDisplay.value = String(res);
        calcExp = String(res);
    } catch (e) { calcDisplay.value = 'Erreur'; calcExp = ''; }
});

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

/* ---------- persistent data migrations ---------- */
/* Ensure recs have urls (for persistent display) */
// (function hydrateRecs() {
//     const meta = load('fsRecs') || [];
//     // we only stored metadata previously — keep that but recordings cannot survive a reload unless stored with IndexedDB
//     if (meta.length && !recs.length) {
//         // just copy meta to recs with placeholder url (won't play)
//         recs = meta.map(m => ({ name: m.name, t: m.t, url: '', blobSize: m.blobSize }));
//         save('fsRecs', meta);
//         renderRecs();
//     }
// })();

/* ---------- accessibility small improvements ---------- */


/* ---------- Initialize UI ---------- */
updatePomUI();
renderNotes();
renderCards();
// renderRecs();
renderTodos();
renderStats();

/* End of file */
