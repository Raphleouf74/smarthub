document.addEventListener('DOMContentLoaded', () => {
    let editingNoteElement = null; // <- pour savoir si on est en mode édition
    const notesContainer = document.getElementById('NotesContainer');
    const addNoteButton = document.getElementById('AddNote');

    const modal = document.getElementById('NoteModal');
    const titleInput = document.getElementById('NoteTitleInput');
    const contentInput = document.getElementById('NoteContentInput');
    const createNoteBtn = document.getElementById('CreateNoteButton');
    const cancelNoteBtn = document.getElementById('CancelNoteButton');

    const header = document.querySelector('header');
    const light = document.getElementById('cursorLight');

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


    addNoteButton.addEventListener('click', () => {
        titleInput.value = '';
        contentInput.value = '';
        createNoteBtn.textContent = "Créer la note";
        modal.classList.remove('hidden');
        editingNoteElement = null;
    });



    cancelNoteBtn.addEventListener('click', () => {
        modal.classList.add('hidden');
        editingNoteElement = null;
    });


    createNoteBtn.addEventListener('click', () => {
        const title = titleInput.value.trim() || "Sans titre";
        const content = contentInput.value.trim();
        if (content === "") return;

        if (editingNoteElement) {
            // Mode édition
            editingNoteElement.querySelector('.NoteTitle').innerText = title;
            editingNoteElement.querySelector('.NoteContent').innerText = content;

            // ✅ Ajout effet visuel
            editingNoteElement.classList.add('highlight');
            setTimeout(() => {
                editingNoteElement.classList.remove('highlight');
            }, 600);

            editingNoteElement = null;
        } else {
            // Mode création
            const newNote = createNoteElement(title, content);
            notesContainer.appendChild(newNote);
        }

        saveNotes();
        modal.classList.add('hidden');
        notesContainer.appendChild(newNote);
        updateEmptyMessage();

    });

    function saveNotes() {
        const notes = [];
        notesContainer.querySelectorAll('.NoteDiv').forEach(note => {
            notes.push({
                title: note.querySelector('.NoteTitle').textContent,
                content: note.querySelector('.NoteContent').textContent
            });
        });
        localStorage.setItem('notes', JSON.stringify(notes));
    }

    function createNoteElement(title = 'Titre de la note', content = 'Contenu...') {
        const noteDiv = document.createElement('div');
        noteDiv.className = 'NoteDiv';

        noteDiv.innerHTML = `
        <div class="NoteHeader">
            <div class="NoteTitle" contenteditable="true">${title}</div>
            <div class="NoteOptions">
                <button class="option-button HideNote" title="Cacher la note">👁️‍🗨️</button>
                <button class="option-button SendEMailNote" title="Envoyer la note par E-Mail">📧</button>
                <button class="option-button DeleteNote" title="Supprimer la note">🗑️</button>
                <button class="option-button EditNote" title="Modifier la note">✏️</button>
                <button class="option-button DuplicateNote" title="Dupliquer la note">📄</button>
            </div>
        </div>
        <div class="NoteContent" contenteditable="true">${content}</div>
    `;


        // Fonction Cacher
        noteDiv.querySelector('.HideNote').addEventListener('click', () => {
            noteDiv.classList.add('hidden');
        });

        // Fonction Envoyer par mail
        noteDiv.querySelector('.SendEMailNote').addEventListener('click', () => {
            const subject = encodeURIComponent("Partage de ma note: " + title);
            const body = encodeURIComponent(content);
            window.location.href = `mailto:?subject=${subject}&body=${body}`;
        });

        // Fonction Supprimer
        noteDiv.querySelector('.DeleteNote').addEventListener('click', () => {
            noteDiv.remove();
            saveNotes();
            updateEmptyMessage();
        });


        noteDiv.querySelector('.EditNote').addEventListener('click', () => {
            const title = noteDiv.querySelector('.NoteTitle').innerText;
            const content = noteDiv.querySelector('.NoteContent').innerText;

            titleInput.value = title;
            contentInput.value = content;
            editingNoteElement = noteDiv;

            createNoteBtn.textContent = "Mettre à jour";
            modal.classList.remove('hidden');
        });


        noteDiv.querySelector('.DuplicateNote').addEventListener('click', () => {
            const title = noteDiv.querySelector('.NoteTitle').innerText;
            const content = noteDiv.querySelector('.NoteContent').innerText;
            const duplicate = createNoteElement(title + " (copie)", content);
            notesContainer.appendChild(duplicate);
            saveNotes();
        });

        // Sauvegarde automatique au changement
        noteDiv.querySelector('.NoteTitle').addEventListener('input', saveNotes);
        noteDiv.querySelector('.NoteContent').addEventListener('input', saveNotes);

        return noteDiv;
    }


    // Charger les notes depuis localStorage
    const savedNotes = JSON.parse(localStorage.getItem('notes') || '[]');
    savedNotes.forEach(note => {
        const el = createNoteElement(note.title, note.content);
        notesContainer.appendChild(el);
    });
    savedNotes.forEach(note => {
        const el = createNoteElement(note.title, note.content);
        notesContainer.appendChild(el);
    });

    function updateEmptyMessage() {
        const emptyMessage = document.getElementById('EmptyMessage');
        const hasNotes = notesContainer.querySelectorAll('.NoteDiv').length > 0;

        emptyMessage.style.display = hasNotes ? 'none' : 'block';
    }
    updateEmptyMessage();

    const NotesSafetyBtn = document.getElementById('NotesSafety');
    const NotesSafetyModal = document.getElementById('NotesSafetyModal');

    NotesSafetyBtn.addEventListener('click', () => {
        NotesSafetyModal.classList.add('shown');
        NotesSafetyModal.classList.remove('hidden');
    });
    NotesSafetyModal.addEventListener('mouseover', () => {
        NotesSafetyModal.classList.add('shown');
        NotesSafetyModal.classList.remove('hidden');
    });
    NotesSafetyBtn.addEventListener('mouseleave', () => {
        NotesSafetyModal.classList.add('hidden');
        NotesSafetyModal.classList.remove('shown');
    });
    NotesSafetyModal.addEventListener('mouseleave', () => {
        NotesSafetyModal.classList.add('hidden');
        NotesSafetyModal.classList.remove('shown');
    });


});
