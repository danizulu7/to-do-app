document.addEventListener("DOMContentLoaded", () => {
  const taskInput = document.getElementById("task-input");
  const addTaskBtn = document.getElementById("add-task-btn");
  const taskList = document.getElementById("task-list");
  const filterBtns = document.querySelectorAll(".filter-btn");

  let tasks = [];
  let filter = "all";

  // Fetch tasks on page load
  fetchTasks();

  // Add task event listener
  addTaskBtn.addEventListener("click", addTask);

  // Filter tasks event listeners
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filter = btn.dataset.filter;
      renderTasks();
    });
  });

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

  function addTask() {
    const taskTitle = taskInput.value.trim();
    if (taskTitle === "") return;

    const newTask = {
      id: tasks.length ? Math.max(tasks.map((task) => task.id)) + 1 : 1,
      title: taskTitle,
      completed: false,
    };

    tasks.push(newTask);
    renderTasks();
    taskInput.value = "";
  }

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
                    <button onclick="toggleCompleteTask(${task.id})">${
        task.completed ? "Undo" : "Complete"
      }</button>
                    <button onclick="editTask(${task.id})">Edit</button>
                    <button onclick="deleteTask(${task.id})">Delete</button>
                </div>
            `;
      taskList.appendChild(taskItem);
    });
  }

  window.toggleCompleteTask = function (id) {
    const task = tasks.find((task) => task.id === id);
    if (!task) return;

    task.completed = !task.completed;
    renderTasks();
  };

  window.editTask = function (id) {
    const task = tasks.find((task) => task.id === id);
    if (!task) return;

    const newTitle = prompt("Edit task title:", task.title);
    if (!newTitle) return;

    task.title = newTitle;
    renderTasks();
  };

  window.deleteTask = function (id) {
    tasks = tasks.filter((task) => task.id !== id);
    renderTasks();
  };
});
