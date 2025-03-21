// Inventory.js
import React, { useState } from "react";
import AddCategory from "../components/AddCategory";
import CategoryList from "../components/CategoryList";
import CategoryItem from "../components/ItemForm";
import PopupForm from "../components/ItemForm";
import "../styles/inventory.css"; // Import the CSS file

const Inventory = () => {
  const [shouldRefetch, setShouldRefetch] = useState(false);

  const triggerRefetch = () => {
    setShouldRefetch(prev => !prev);
  };

  return (
    <div className="homepage-content">
      <AddCategory onCategoryAdded={triggerRefetch} />
      <CategoryList shouldRefetch={shouldRefetch} />
      <CategoryItem />
      <PopupForm />

    </div>
  );
};

export default Inventory;
