import React, { useState, useEffect } from 'react';
import './App.css'; // Import your styles
import TodoApp from './components/TodoApp'; // Import TodoApp component
import ChatBot from './components/ChatBot';

function App() {
  const [darkMode, setDarkMode] = useState(localStorage.getItem("darkMode") === "enabled");

  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
    localStorage.setItem("darkMode", darkMode ? "enabled" : "disabled");
  }, [darkMode]);
  
  return (
    <div className={`app ${darkMode ? "dark-mode" : ""}`}>
      <header>
        <nav>
          <a href="homePage.html" className="logo">Finoria</a>
          <ul className="nav-links">
            <li><a href="dashboard.html">Dashboard</a></li>
            <li><a href="toBuy.html">Purchasing List</a></li>
            <li><a href="expenses.html">Transactions</a></li>
            <li><a href="#">Reports</a></li>
            <li className="dropdown">
              <a href="#">Who We Are</a>
              <div className="dropdown-content">
                <a href="teamSection.html">Our Team</a>
                <a href="#">Estez Wehbe</a>
                <a href="#">Our Services</a>
              </div>
            </li>
            <li><a href="settings.html">Settings</a></li>
            <li><a href="profile.html">Profile</a></li>
            <li><a href="#" id="logout">Logout</a></li>
          </ul>
        </nav>
      </header>

      <TodoApp />
      <ChatBot />
    </div>
  );
}

export default App;


