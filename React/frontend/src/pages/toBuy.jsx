import React, { useState } from 'react';
import '../styles/toBuyStyle.css';
//import '../styles/header.css';

const ToBuy = () => {
  const [inputValue, setInputValue] = useState('');
  const [items, setItems] = useState([]);

  // Add item to the list
  const handleAddItem = () => {
    if (inputValue.trim() !== '') {
      setItems([...items, inputValue]);
      setInputValue('');
    }
  };

  // Handle input change
  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  // Remove item from the list
  const handleDeleteItem = (indexToDelete) => {
    setItems(items.filter((_, index) => index !== indexToDelete));
  };

  return (
    <div className="container">
      <div className="todo-app">
        <h2>To-Buy List 🛒📋</h2>
        <div className="row">
          <input
            type="text"
            placeholder="Add your future purchase"
            value={inputValue}
            onChange={handleInputChange}
            autoComplete="off"
          />
          <button onClick={handleAddItem}>Add</button>
        </div>
        <ul>
          {items.map((item, index) => (
            <li key={index}>
              {item}
              <button className="delete-btn" onClick={() => handleDeleteItem(index)}>❌</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ToBuy;
