document.addEventListener("DOMContentLoaded", () => {
  const taskInput = document.getElementById("task-input");
  const addTaskBtn = document.getElementById("add-task-btn");
  const taskList = document.getElementById("task-list");
  const filterBtns = document.querySelectorAll(".filter-btn");

  let tasks = [];
  let filter = "all";

  // Fetch tasks on page load
  fetchTasks();

  // Add task with clic event listener
  addTaskBtn.addEventListener("click", addTask);

  // Add task with Enter key
  taskInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      addTask();
    }
  });

  // Filter tasks buttons event listeners
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filter = btn.dataset.filter;
      renderTasks();
    });
  });

  // Event delegation for task actions
  document.addEventListener("click", (event) => {
    const target = event.target;
    const taskItem = target.closest(".task-item");
    if (!taskItem) return;

    const taskId = parseInt(taskItem.dataset.id);

    if (target.classList.contains("complete-btn")) {
      toggleCompleteTask(taskId);
    } else if (target.classList.contains("edit-btn")) {
      editTask(taskId);
    } else if (target.classList.contains("delete-btn")) {
      deleteTask(taskId);
    }
  });

  //fetch to API
  async function fetchTasks() {
    try {
      const response = await fetch(
        "https://my-json-server.typicode.com/danizulu7/to-do-app/post"
      );
      const data = await response.json();
      tasks = data.slice(0, 10);
      renderTasks();
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  }

  //add new tasks
  function addTask() {
    const taskTitle = taskInput.value.trim();
    if (taskTitle === "") return;

    const newTask = {
      id: tasks.length ? Math.max(...tasks.map((task) => task.id)) + 1 : 1,
      title: taskTitle,
      completed: false,
    };

    tasks.push(newTask);
    renderTasks();
    taskInput.value = "";
  }

  //filter and render tasks
  function renderTasks() {
    taskList.innerHTML = "";

    const filteredTasks = tasks.filter((task) => {
      if (filter === "all") return true;
      if (filter === "completed") return task.completed;
      if (filter === "pending") return !task.completed;
    });

    filteredTasks.forEach((task) => {
      const taskItem = document.createElement("li");
      taskItem.classList.add("task-item");
      if (task.completed) taskItem.classList.add("completed");
      taskItem.innerHTML = `
        <span>${task.title}</span>
        <div>
          <button class="icon-button complete-btn">
            <img src="${
              task.completed
                ? "./images/icons/cancel.png"
                : "./images/icons/complete.png"
            }" alt="Icon" class="icon-image">
          </button>
          <button class="icon-button edit-btn">
            <img src="./images/icons/edit.png" alt="Icon" class="icon-image">
          </button>
          <button class="icon-button delete-btn">
            <img src="./images/icons/delete.png" alt="Icon" class="icon-image">
          </button>
        </div>
      `;

      taskList.appendChild(taskItem);

      // Event listeners for task buttons
      taskItem.querySelector(".complete-btn").addEventListener("click", () => {
        toggleCompleteTask(task.id);
      });

      taskItem.querySelector(".edit-btn").addEventListener("click", () => {
        editTask(task.id);
      });

      taskItem.querySelector(".delete-btn").addEventListener("click", () => {
        deleteTask(task.id);
      });
    });
  }

  //toggle complete tasks
  function toggleCompleteTask(id) {
    const task = tasks.find((task) => task.id === id);
    if (!task) return;

    task.completed = !task.completed;
    renderTasks();
  }

  // edit tasks
  function editTask(id) {
    const task = tasks.find((task) => task.id === id);
    if (!task) return;

    const newTitle = prompt("Edit task title:", task.title);
    if (newTitle !== null && newTitle.trim() !== "") {
      task.title = newTitle;
      renderTasks();
    }
  }

  //delete tasks
  function deleteTask(id) {
    tasks = tasks.filter((task) => task.id !== id);
    renderTasks();
  }
});
