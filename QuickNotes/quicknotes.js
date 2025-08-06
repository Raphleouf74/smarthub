document.addEventListener('DOMContentLoaded', () => {
    // Initialisation de l'éditeur Quill
    const quill = new Quill('#NoteContentInput', {
        theme: 'snow',
        modules: {
            toolbar: '#toolbar'
        }
    });

    // Références DOM
    const notesContainer = document.getElementById('NotesContainer');
    const createNoteBtnButton = document.getElementById('createNoteBtn');
    const modal = document.getElementById('NoteModal');
    const titleInput = document.getElementById('NoteTitleInput');
    const createNoteBtn = document.getElementById('CreateNoteButton');
    const cancelNoteBtn = document.getElementById('CancelNoteButton');
    const emptyMessage = document.getElementById('EmptyMessage');
    const header = document.querySelector('header');

    let editingNoteElement = null;



    // Gestion modale d'ajout/édition de note
    createNoteBtnButton.addEventListener('click', () => {
        titleInput.value = '';
        quill.root.innerHTML = '';
        editingNoteElement = null;
        createNoteBtn.textContent = 'Créer la note';
        modal.classList.remove('hidden');
    });

    cancelNoteBtn.addEventListener('click', () => {
        modal.classList.add('hidden');
        editingNoteElement = null;
    });

    createNoteBtn.addEventListener('click', () => {
        const title = titleInput.value.trim() || "Sans titre";
        const content = quill.root.innerHTML;

        if (content === "") return;

        if (editingNoteElement) {
            editingNoteElement.querySelector('.NoteTitle').innerText = title;
            editingNoteElement.querySelector('.NoteContent').innerHTML = content;
            editingNoteElement.classList.add('highlight');
            setTimeout(() => editingNoteElement.classList.remove('highlight'), 600);
        } else {
            const newNote = createNoteElement(title, content);
            notesContainer.appendChild(newNote);
        }

        saveNotes();
        modal.classList.add('hidden');
        updateEmptyMessage();
    });

    // Fonction pour créer une note DOM
    function createNoteElement(title, content) {
        const noteDiv = document.createElement('div');
        noteDiv.className = 'NoteDiv';

        noteDiv.innerHTML = `
            <div class="NoteHeader">
                <div class="NoteTitle" contenteditable="true">${title}</div>
                <div class="NoteOptions">
                    <button class="option-button HideNote" title="Cacher la note">👁️‍🗨️</button>
                    <button class="option-button DeleteNote" title="Supprimer la note">🗑️</button>
                    <button class="option-button EditNote" title="Modifier la note">✏️</button>
                    <button class="option-button DuplicateNote" title="Dupliquer la note">📄</button>
                </div>
            </div>
            <div class="NoteContent">${content}</div>
        `;

        // Événements des boutons
        noteDiv.querySelector('.HideNote').addEventListener('click', () => {
            if (!getHiddenNotesPassword()) {
                const pwd = prompt("Définir un code pour cacher les notes (ex: 1234)");
                if (pwd && pwd.length === 4) {
                    setHiddenNotesPassword(pwd);
                    noteDiv.classList.add('hidden');
                } else {
                    alert("Le code doit contenir 4 chiffres.");
                    return;
                }
                if (pwd) setHiddenNotesPassword(pwd);
            }
            noteDiv.classList.add('hidden');
            noteDiv.classList.add('hiddenNote')
        });

        noteDiv.querySelector('.DeleteNote').addEventListener('click', () => {
            noteDiv.remove();
            saveNotes();
            updateEmptyMessage();
        });

        noteDiv.querySelector('.EditNote').addEventListener('click', () => {
            titleInput.value = title;
            quill.root.innerHTML = content;
            editingNoteElement = noteDiv;
            createNoteBtn.textContent = "Mettre à jour";
            modal.classList.remove('hidden');
        });

        noteDiv.querySelector('.DuplicateNote').addEventListener('click', () => {
            const copy = createNoteElement(title + ' (copie)', content);
            notesContainer.appendChild(copy);
            saveNotes();
        });

        noteDiv.querySelector('.NoteTitle').addEventListener('input', saveNotes);

        return noteDiv;
    }

    function saveNotes() {
        const notes = [...notesContainer.querySelectorAll('.NoteDiv')].map(note => ({
            title: note.querySelector('.NoteTitle').innerText,
            content: note.querySelector('.NoteContent').innerHTML
        }));
        localStorage.setItem('notes', JSON.stringify(notes));
    }

    function loadNotes() {
        const notes = JSON.parse(localStorage.getItem('notes') || '[]');
        notes.forEach(note => notesContainer.appendChild(createNoteElement(note.title, note.content)));
    }

    function updateEmptyMessage() {
        emptyMessage.style.display = notesContainer.children.length ? 'none' : 'block';
    }

    // Sécurité et mot de passe
    function setHiddenNotesPassword(pwd) {
        localStorage.setItem('hiddenNotesPassword', pwd);
    }

    function getHiddenNotesPassword() {
        return localStorage.getItem('hiddenNotesPassword');
    }

    function showUnlockModal() {
        document.getElementById('UnlockModal').classList.remove('hidden');
        const inputs = document.querySelectorAll('.code-digit');
        inputs.forEach(input => input.value = '');
        inputs[0].focus();
    }

    function hideUnlockModal() {
        document.getElementById('UnlockModal').classList.add('hidden');
    }

    function askToUnlockHiddenNotes() {
        showUnlockModal();
    }
    document.getElementById('HiddenNotesBtn').addEventListener( ('click'), () => {
        askToUnlockHiddenNotes();
    })
    document.getElementById('CancelUnlock').addEventListener('click', hideUnlockModal);

    const codeInputs = document.querySelectorAll('.code-digit');
    codeInputs.forEach((input, idx) => {
        input.addEventListener('input', () => {
            if (input.value.length && idx < 3) codeInputs[idx + 1].focus();
            checkCode();
        });
    });

    function checkCode() {
        const code = [...document.querySelectorAll('.code-digit')].map(i => i.value).join('');
        if (code.length === 4) {
            if (code === getHiddenNotesPassword()) {
                document.querySelectorAll('.NoteDiv.hidden').forEach(n => n.classList.remove('hidden'));
                hideUnlockModal();
            } else {
                codeInputs.forEach(i => i.style.borderColor = 'red');
                setTimeout(() => {
                    codeInputs.forEach(i => {
                        i.value = '';
                        i.style.borderColor = '';
                    });
                    codeInputs[0].focus();
                }, 500);
            }
        }
    }

    // Détection de scroll secret
    let scrollPattern = [], lastScrollTime = 0;
    window.addEventListener('scroll', () => {
        const now = Date.now();
        const y = window.scrollY;
        const direction = y > (window.lastScrollY || 0) ? 'down' : 'up';

        if (now - lastScrollTime < 600) {
            if (scrollPattern[scrollPattern.length - 1] !== direction) scrollPattern.push(direction);
            if (scrollPattern.slice(-4).join('-') === 'down-up-down-up') {
                askToUnlockHiddenNotes();
                scrollPattern = [];
            }
        } else scrollPattern = [];

        window.lastScrollY = y;
        lastScrollTime = now;
    });

    // Raccourci clavier Ctrl+Shift+H
    document.addEventListener('keydown', e => {
        if (e.ctrlKey && e.shiftKey && e.key === 'H') askToUnlockHiddenNotes();
        else if (e.metaKey && e.shiftKey && e.key === 'H') askToUnlockHiddenNotes();
    });

    document.getElementById('')





    // Chargement initial
    loadNotes();
    updateEmptyMessage();

    const resetBtn = document.getElementById('resetPasswordBtn');

    resetBtn.addEventListener('click', () => {
        const confirmation = confirm("⚠️ Cela effacera toutes les notes cachées et le mot de passe. Voulez-vous continuer ?");

        if (confirmation) {
            // Suppression de l'ancien mot de passe et notes cachées
            localStorage.removeItem('SmartLockPassword');
            localStorage.removeItem('hiddenNotes'); // adapte ce nom si besoin

            alert("Le mot de passe a été réinitialisé. Vous allez maintenant devoir en créer un nouveau.");

            // Forcer une reconnexion ou une redéfinition du mot de passe
            window.location.reload(); // recharge la page pour forcer l'interface à re-demander un mot de passe
        }
    });



});