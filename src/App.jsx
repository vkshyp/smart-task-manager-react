import { useState, useEffect } from "react";

function App() {
  // Load tasks from localStorage on first render
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  const [taskText, setTaskText] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [filter, setFilter] = useState("all");

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // Add new task
  const addTask = () => {
    if (taskText.trim() === "" || dueDate === "") return;

    const newTask = {
      id: Date.now(),
      text: taskText,
      completed: false,
      dueDate: dueDate
    };

    setTasks([...tasks, newTask]);
    setTaskText("");
    setDueDate("");
  };

  // Delete task
  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  // Toggle completed
  const toggleTask = (id) => {
    setTasks(
      tasks.map(task =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  };

  // Filter logic
  const filteredTasks = tasks.filter(task => {
    if (filter === "completed") return task.completed;
    if (filter === "pending") return !task.completed;
    return true;
  });

  // Check overdue
  const isOverdue = (task) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return !task.completed && new Date(task.dueDate) < today;
  };

  return (
    <div className="app">
      <h1>Smart Task Manager</h1>

      {/* Task input */}
      <input
        type="text"
        placeholder="Enter task"
        value={taskText}
        onChange={(e) => setTaskText(e.target.value)}
      />

      {/* Due date */}
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
      />

      {/* Add button */}
      <button onClick={addTask}>Add Task</button>

      {/* Filters */}
      <div className="filters">
        <button onClick={() => setFilter("all")}>All</button>
        <button onClick={() => setFilter("completed")}>Completed</button>
        <button onClick={() => setFilter("pending")}>Pending</button>
      </div>

      {/* Task list */}
      <ul>
        {filteredTasks.map(task => (
          <li key={task.id}>
            <span
              onClick={() => toggleTask(task.id)}
              className={`task-text 
                ${task.completed ? "completed" : ""} 
                ${isOverdue(task) ? "overdue" : ""}
              `}
            >
              {task.text}
              <br />
              <small>Due: {task.dueDate}</small>
            </span>

            <button
              className="delete-btn"
              onClick={() => deleteTask(task.id)}
            >
              ❌
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
