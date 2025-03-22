import React, { useState, useEffect } from "react";
import AddCategory from "../components/AddCategory";
import CategoryList from "../components/CategoryList";
import PopupForm from "../components/PopupForm"; // Ensure correct import
import "../styles/inventory.css";

const Inventory = () => {
  const [shouldRefetch, setShouldRefetch] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [items, setItems] = useState([]);

  // Fetch items based on category
  const fetchItems = async (categoryId) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/category/${categoryId}`);
      const data = await response.json();
      setItems(data.items);
      console.log("Fetched items:", data.items); 
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  const triggerRefetch = () => {
    setShouldRefetch((prev) => !prev);
  };

  const openPopup = (categoryId) => {
    console.log("Category ID passed:", categoryId); 
    fetchItems(categoryId); // Fetch the items for the category when the popup is opened
    setIsPopupOpen(true);
  };

  const closePopup = () => setIsPopupOpen(false);

  return (
    <div className="homepage-content">
      <AddCategory onCategoryAdded={triggerRefetch} />
      <CategoryList shouldRefetch={shouldRefetch} openPopup={openPopup} />
      <PopupForm
        isOpen={isPopupOpen}
        closePopup={closePopup}
        items={items} // Passing items to PopupForm
      />
    </div>
  );
};

export default Inventory;
