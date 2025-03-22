import React, { useState } from "react";
import "../styles/inventory.css";

const PopupForm = ({ isOpen, closePopup, items }) => {
  const [selectedItem, setSelectedItem] = useState(null);

  const handleItemClick = (item) => {
    setSelectedItem(item);
  };

  if (!isOpen) return null;

  return (
    <div className="popup show">
      <span className="close" onClick={closePopup}>
        &times;
      </span>
      <div className="popup-header">
        <h2>Items in Category:</h2>
      </div>
      <div className="popup-content">
        {/* Left Pane: Item List */}
        <div className="popup-left">
          <button type="button" id="showAddItemFormButton" className="add-item-button">
            Add Item
          </button>
          
          {/* Delimiter between Add Item and item list */}
          <div className="delimiter"></div>

          <div id="itemList">
            {items.length === 0 ? (
              <p>No items available.</p>
            ) : (
              <div>
                {items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item)}
                    className="item-button"
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Pane: Item Details */}
        <div className="popup-right">
          <h3>Item Information</h3>
          {selectedItem ? (
            <div id="itemInfo" className="item-info">
              <p>
                <strong>Name:</strong> {selectedItem.name}
              </p>
              <p>
                <strong>Bought Date:</strong> {selectedItem.bought_date}
              </p>
              <p>
                <strong>Cost:</strong> ${selectedItem.cost}
              </p>
              <p>
                <strong>Sale Price:</strong> ${selectedItem.sale_price}
              </p>
              <p>
                <strong>Quantity:</strong> {selectedItem.quantity}
              </p>
            </div>
          ) : (
            <p>Select an item to see its details.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PopupForm;
