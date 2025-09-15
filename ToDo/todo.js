let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

const taskForm = document.getElementById("taskForm");
const taskList = document.getElementById("taskList");

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
    taskList.innerHTML = "";
    const now = new Date();

    tasks.forEach((t, i) => {
        const div = document.createElement("div");
        div.className = "task";
        const deadlineDate = new Date(t.deadline);
        const diffTime = deadlineDate - now;
        const diffDays = diffTime / (1000 * 60 * 60 * 24);

        if (diffDays < 5 && diffDays > 0) {
            div.classList.add("almost");
        } else if (diffDays < 0) {
            div.classList.add("overdue");
        }

        div.innerHTML = `
      <div class="info">
        <strong>${t.title}</strong>
        <span class="meta"><span class="material-symbols-rounded">hourglass</span> ${t.deadline || "Aucune échéance"} |<span class="material-symbols-rounded">mode_heat</span> ${t.priority} | <span class="material-symbols-rounded">folder</span> ${t.category || "Général"}</span>
      </div>
      <div class="actions">
        <button onclick="deleteTask(${i})"><span style="color:red;" class="material-symbols-rounded">delete</span></button>
        <button onclick="changeToDoCategory(${i})"><span class="material-symbols-rounded">bookmark_manager</span></button>
        <button onclick="duplicateTask(${i})"><span class="material-symbols-rounded">content_copy</span></button>
        <button onclick="editTask(${i})"><span class="material-symbols-rounded">edit</span></button>
        <button onclick="shareTask(${i})"><span class="material-symbols-rounded">share</span></button>
      </div>
    `;
        taskList.appendChild(div);
    });
}

function deleteTask(index) {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
}

function changeToDoCategory(index) {
    const newCategory = prompt("Nouvelle catégorie :", tasks[index].category || "");
    if (newCategory !== null && newCategory.trim() !== "") {
        tasks[index].category = newCategory.trim();
        saveTasks();
        renderTasks();
    }
}

function duplicateTask(index) {
    const taskCopy = { ...tasks[index] };
    taskCopy.title += " (copie)";
    tasks.splice(index + 1, 0, taskCopy);
    saveTasks();
    renderTasks();
}

function editTask(index) {
    const t = tasks[index];
    const newTitle = prompt("Modifier le titre :", t.title);
    if (newTitle === null) return;
    const newDeadline = prompt("Nouvelle échéance :", t.deadline);
    if (newDeadline === null) return;
    const newPriority = prompt("Nouvelle priorité :", t.priority);
    if (newPriority === null) return;
    const newCategory = prompt("Nouvelle catégorie :", t.category);
    if (newCategory === null) return;

    tasks[index] = {
        title: newTitle,
        deadline: newDeadline,
        priority: newPriority,
        category: newCategory
    };
    saveTasks();
    renderTasks();
}

function shareTask(index) {
    const t = tasks[index];
    const text = `Tâche: ${t.title}\nÉchéance: ${t.deadline}\nPriorité: ${t.priority}\nCatégorie: ${t.category}`;
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            alert("Tâche copiée dans le presse-papiers !");
        });
    } else {
        alert(text);
    }
}

taskForm.addEventListener("submit", e => {
    e.preventDefault();
    const title = document.getElementById("taskTitle").value;
    const deadline = document.getElementById("taskDeadline").value;
    const priority = document.getElementById("taskPriority").value;
    const category = document.getElementById("taskCategory").value;

    tasks.push({ title, deadline, priority, category });
    saveTasks();
    renderTasks();
    taskForm.reset();
});

renderTasks();
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

