import React, { useState, useEffect } from 'react';

function TodoApp() {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    setTasks(savedTasks);
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = () => {
    if (task.trim() !== '') {
      setTasks([...tasks, { text: task, checked: false }]);
      setTask('');
    }
  };

  const handleToggleTask = index => {
    const updatedTasks = tasks.map((t, i) =>
      i === index ? { ...t, checked: !t.checked } : t
    );
    setTasks(updatedTasks);
  };

  const handleDeleteTask = index => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
  };

  return (
    <div className="todo-app">
      <h2>To-Buy List 🛒📋</h2>
      <div className="row">
        <input
          type="text"
          value={task}
          onChange={e => setTask(e.target.value)}
          placeholder="Add your future purchase"
          autoComplete="off"
        />
        <button onClick={handleAddTask}>Add</button>
      </div>
      <ul id="list-container">
        {tasks.map((task, index) => (
          <li key={index} className={task.checked ? 'checked' : ''}>
            {task.text}
            <button
              className="delete-btn"
              onClick={() => handleDeleteTask(index)}
            >
              🗑️
            </button>
            <button
              className="check-btn"
              onClick={() => handleToggleTask(index)}
            >
              ✅
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoApp;
