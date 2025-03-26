import React, { useState, useEffect } from 'react';
import './toBuyStyle.css'; // Make sure your CSS file is imported

function ToBuy() {
  const [item, setItem] = useState('');
  const [list, setList] = useState([]);

  useEffect(() => {
    // Load the saved items from localStorage if available
    const savedItems = JSON.parse(localStorage.getItem('toBuyList')) || [];
    setList(savedItems);
  }, []);

  useEffect(() => {
    // Save the list to localStorage when it changes
    localStorage.setItem('toBuyList', JSON.stringify(list));
  }, [list]);

  const handleInputChange = (event) => {
    setItem(event.target.value);
  };

  const handleAddItem = () => {
    if (item.trim() !== '') {
      setList([...list, item]);
      setItem(''); // Reset input field
    }
  };

  const handleDeleteItem = (index) => {
    const updatedList = list.filter((_, idx) => idx !== index);
    setList(updatedList);
  };

  const handleLogout = (event) => {
    event.preventDefault();
    localStorage.removeItem('username');
    window.location.href = 'signin.html';
  };

  return (
    <div>
      <header>
        <nav>
          <a href="homePage.html" className="logo">Finoria</a>
          <ul className="nav-links">
            <li><a href="dashboard.html">Dashboard</a></li>
            <li><a href="toBuy.html">Purchasing List</a></li>
            <li><a href="expenses.html" className="transactions-link">Transactions</a></li>
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
            <li><a href="profile.html"><i className="fas fa-user"></i>Profile</a></li>
            <li><a href="#" id="logout" onClick={handleLogout}>Logout</a></li>
          </ul>
        </nav>
      </header>

      <div className="container">
        <div className="todo-app">
          <h2>To-Buy List 🛒📋</h2>
          <div className="row">
            <input
              type="text"
              id="input-box"
              value={item}
              onChange={handleInputChange}
              placeholder="Add your future purchase"
              autocomplete="off"
            />
            <button id="add-btn" onClick={handleAddItem}>Add</button>
          </div>
          <ul id="list-container">
            {list.map((purchase, index) => (
              <li key={index}>
                {purchase} 
                <button onClick={() => handleDeleteItem(index)}>Delete</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ToBuy;
