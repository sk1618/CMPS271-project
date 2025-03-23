import React, { useState } from "react";
import "../../styles/inventory.css";

const AddItemForm = ({ onSubmit, category_id }) => {
  const [formData, setFormData] = useState({
    name: "",
    category_id: category_id,
    bought_date: "",
    cost: "",
    sale_price: "",
    quantity: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      name: "",
      category_id: category_id,
      bought_date: "",
      cost: "",
      sale_price: "",
      quantity: "",
    });
  };

  return (
    <div className="add-item-form">
      <h3>Add New Item</h3>
      <form onSubmit={handleSubmit}>
        <label>Name:</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} required />

        <label>Bought Date:</label>
        <input type="date" name="bought_date" value={formData.bought_date} onChange={handleChange} required />

        <label>Cost:</label>
        <input type="number" name="cost" value={formData.cost} onChange={handleChange} required />

        <label>Sale Price:</label>
        <input type="number" name="sale_price" value={formData.sale_price} onChange={handleChange} required />

        <label>Quantity:</label>
        <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} required />

        <button type="submit">Add Item</button>
      </form>
    </div>
  );
};

const ItemsPopup = ({ isOpen, closePopup, items, setItems, category_id }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [showAddItemForm, setShowAddItemForm] = useState(false);

  const handleItemClick = (item) => {
    setSelectedItem(item);
    setShowAddItemForm(false);
  };

  const handleAddItemClick = () => {
    setSelectedItem(null);
    setShowAddItemForm(true);
  };

  const handleAddItemSubmit = async (newItem) => {
    try {
      // Send the new item to the backend
      const response = await fetch("http://127.0.0.1:8000/add_item/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newItem),
      });
  
      if (!response.ok) {
        throw new Error("Failed to add item");
      }
  
      const result = await response.json();
      console.log(result.message);
  
      // Refetch items for the current category
      const itemsResponse = await fetch(`http://127.0.0.1:8000/items/?category_id=${category_id}`);
      if (!itemsResponse.ok) {
        throw new Error("Failed to fetch updated items");
      }
  
      const itemsData = await itemsResponse.json();
      console.log("Updated items:", itemsData);
  
      // Update the local state with the fetched items
      setItems(itemsData);  // Ensure this updates the items state correctly
  
      // Close the form after submitting
      setShowAddItemForm(false);
    } catch (error) {
      console.error("Error adding item:", error);
    }
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
        <div className="popup-left">
          <button type="button" className="add-item-button" onClick={handleAddItemClick}>
            Add Item
          </button>
          <div className="delimiter"></div>
          <div className="item-block" id="itemList">
            {items.length === 0 ? (
              <p>No items available.</p>
            ) : (
              <div>
                {items.map((item) => (
                  <button key={item.id} onClick={() => handleItemClick(item)} className="item-button">
                    {item.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="popup-right">
          {showAddItemForm ? (
            <AddItemForm onSubmit={handleAddItemSubmit} category_id={category_id} />
          ) : selectedItem ? (
            <div className="item-info">
              <h3>Item Information</h3>
              <p><strong>Name:</strong> {selectedItem.name}</p>
              <p><strong>Bought Date:</strong> {selectedItem.bought_date}</p>
              <p><strong>Cost:</strong> ${selectedItem.cost}</p>
              <p><strong>Sale Price:</strong> ${selectedItem.sale_price}</p>
              <p><strong>Quantity:</strong> {selectedItem.quantity}</p>
            </div>
          ) : (
            <p>Select an item to see its details or add a new item.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemsPopup;