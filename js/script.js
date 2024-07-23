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
        "https://jsonplaceholder.typicode.com/todos"
      );
      const data = await response.json();
      tasks = data.slice(0, 10);
      renderTasks();
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  }

  async function addTask() {
    const taskTitle = taskInput.value.trim();
    if (taskTitle === "") return;

    const newTask = {
      title: taskTitle,
      completed: false,
    };

    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/todos",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newTask),
        }
      );
      const addedTask = await response.json();
      tasks.push(addedTask);
      renderTasks();
      taskInput.value = "";
    } catch (error) {
      console.error("Error adding task:", error);
    }
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

  window.toggleCompleteTask = async function (id) {
    const task = tasks.find((task) => task.id === id);
    if (!task) return;

    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/todos/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...task, completed: !task.completed }),
        }
      );
      const updatedTask = await response.json();
      tasks = tasks.map((task) => (task.id === id ? updatedTask : task));
      renderTasks();
    } catch (error) {
      console.error("Error toggling complete task:", error);
    }
  };

  window.editTask = async function (id) {
    const task = tasks.find((task) => task.id === id);
    if (!task) return;

    const newTitle = prompt("Edit task title:", task.title);
    if (!newTitle) return;

    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/todos/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...task, title: newTitle }),
        }
      );
      const updatedTask = await response.json();
      tasks = tasks.map((task) => (task.id === id ? updatedTask : task));
      renderTasks();
    } catch (error) {
      console.error("Error editing task:", error);
    }
  };

  window.deleteTask = async function (id) {
    try {
      await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
        method: "DELETE",
      });
      tasks = tasks.filter((task) => task.id !== id);
      renderTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };
});
