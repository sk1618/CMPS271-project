import React, { useState } from "react";
import AddCategory from "../components/inventory/AddCategory";
import CategoryList from "../components/inventory/CategoryList";
import ItemsPopup from "../components/inventory/ItemsPopup"; // Ensure correct import
import "../styles/inventory.css";

const Inventory = () => {
  const [shouldRefetch, setShouldRefetch] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null); // Store selected category ID

  const triggerRefetch = () => {
    setShouldRefetch((prev) => !prev);
  };

  const openPopup = (categoryId) => {
    console.log("Category ID passed:", categoryId);
    setSelectedCategoryId(categoryId); // Store category ID in state
    setIsPopupOpen(true);
  };

  const closePopup = () => setIsPopupOpen(false);

  return (
    <div>
       <br /><br /><br />
    <div className="homepage-content">
     
      <AddCategory onCategoryAdded={triggerRefetch} />
      <CategoryList shouldRefetch={shouldRefetch} openPopup={openPopup} />
      <ItemsPopup
        isOpen={isPopupOpen}
        closePopup={closePopup}
        category_id={selectedCategoryId} // Pass the selected category ID
      />
    </div>
    </div>
  );
};

export default Inventory;