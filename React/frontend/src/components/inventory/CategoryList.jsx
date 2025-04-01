import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CategoryList = ({ shouldRefetch, openPopup }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/categories/',{ headers:{
          'Authorization':`Bearer ${localStorage.getItem("access_token")}`
         }});
        setCategories(response.data.categories);
      } catch (error) {
        console.error('Error fetching categories', error);
      }
    };

    fetchCategories();
  }, [shouldRefetch]);

  return (
    <div id="categoriesContainer">
      <h2>Categories</h2>
      {categories.length > 0 ? (
        <div id="categoryItems">
          {categories.map((category) => (
            <div key={category.id} className="category-block">
              <h3>{category.name}</h3>
              {/* Pass category.id to openPopup */}
              <button onClick={() => openPopup(category.id)}>
                View Items
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p>No categories found</p>
      )}
    </div>
  );
};

export default CategoryList;
