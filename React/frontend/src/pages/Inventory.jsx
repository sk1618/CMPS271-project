import React, { useState, useEffect } from "react";
import AddCategory from "../components/inventory/AddCategory";
import CategoryList from "../components/inventory/CategoryList";
import ItemsPopup from "../components/inventory/ItemsPopup"; // Ensure correct import
import "../styles/inventory.css";

const Inventory = () => {
  const [shouldRefetch, setShouldRefetch] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null); // Store selected category ID

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
    setSelectedCategoryId(categoryId); // Store category ID in state
    fetchItems(categoryId); // Fetch the items for the selected category
    setIsPopupOpen(true);
  };

  const closePopup = () => setIsPopupOpen(false);

  return (
    <div className="homepage-content">
      <AddCategory onCategoryAdded={triggerRefetch} />
      <CategoryList shouldRefetch={shouldRefetch} openPopup={openPopup} />
      <ItemsPopup
        isOpen={isPopupOpen}
        closePopup={closePopup}
        items={items}
        category_id={selectedCategoryId} // Pass the selected category ID
      />
    </div>
  );
};

export default Inventory;
