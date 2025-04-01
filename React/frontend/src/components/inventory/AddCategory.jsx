import React, { useState } from 'react';
import axios from 'axios';

const AddCategory = ({ onCategoryAdded }) => {
  const [categoryName, setCategoryName] = useState('');

  const handleCategorySubmit = async () => {
    if (!categoryName) {
      alert('Please enter a category name');
      return;
    }

    try {
      const response = await axios.post('http://127.0.0.1:8000/add_category/', {
        name: categoryName,
      },{ headers:{
        'Authorization':`Bearer ${localStorage.getItem("access_token")}`
       }});
      alert(response.data.message);
      setCategoryName('');
      onCategoryAdded();
    } catch (error) {
      alert('Error adding category');
      console.error(error);
    }
  };

  return (
    <div className="form-container">
      <h2>Add a Category</h2>
      <form>
        <input
          type="text"
          id="category_name"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          placeholder="Enter category name"
          required
        />
        <button type="button" onClick={handleCategorySubmit}>
          Add Category
        </button>
      </form>
    </div>
  );
};

export default AddCategory;
