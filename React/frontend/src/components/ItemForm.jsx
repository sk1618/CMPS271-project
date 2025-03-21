import React, { useState } from "react";
import "../styles/inventory.css"; // Ensure the CSS file is correctly linked

const PopupForm = ({ isOpen, closePopup }) => {
  if (!isOpen) return null;

  return (
    <div className="popup show">
      <div className="popup-content">
        <div className="popup-left">
          <button onClick={closePopup}>Close</button>
        </div>
        <div className="popup-right">
          <h2>Item Form</h2>
          {/* Place your form here */}
          <form>
            <input type="text" placeholder="Item Name" />
            <button type="submit">Submit</button>
          </form>
        </div>
      </div>
    </div>
  );
};

const CategoryItem = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const openPopup = () => setIsPopupOpen(true);
  const closePopup = () => setIsPopupOpen(false);

  return (
    <div>
      <div id="categoryItems" onClick={openPopup}>
        {/* You can replace this with your dynamic categories */}
        <div className="category-block">
          <h3>Category Name</h3>
          <p>Some description</p>
          <button>View Items</button>
        </div>
      </div>

      {/* Popup component */}
      <PopupForm isOpen={isPopupOpen} closePopup={closePopup} />
    </div>
  );
};

export default CategoryItem;
