import React, { useState, useEffect } from 'react';
import "../styles/transaction.css";

const Transaction = () => {
    // State hooks for categories, items, transactions, and form data
    const [categories, setCategories] = useState([]);
    const [items, setItems] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [formData, setFormData] = useState({
        category_id: '',
        item_id: '',
        transaction_type: '',
        quantity: 1
    });

    // Function to load categories
    useEffect(() => {
        fetch('http://127.0.0.1:8000/categories/')
            .then((response) => response.json())
            .then((data) => {
                setCategories(data.categories);
            })
            .catch((error) => {
                console.error('Error loading categories:', error);
            });

        // Load transactions on page load
        loadTransactions();
    }, []);

    // Function to load transactions
    const loadTransactions = () => {
        fetch('http://127.0.0.1:8000/transactions/')
            .then((response) => response.json())
            .then((data) => {
                setTransactions(data.transactions);
            })
            .catch((error) => {
                console.error('Error loading transactions:', error);
            });
    };

    // Function to fetch items based on selected category
    const loadItems = (categoryId) => {
        if (!categoryId) return;
        fetch(`http://127.0.0.1:8000/category/${categoryId}`)
            .then((response) => response.json())
            .then((data) => {
                setItems(data.items);
            })
            .catch((error) => {
                console.error('Error loading items:', error);
            });
    };

    // Handle form data change
    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });

        if (name === 'category_id') {
            loadItems(value);
        }
    };

    // Submit transaction form
    const handleSubmit = (e) => {
        e.preventDefault();

        const formDataToSend = new URLSearchParams(new FormData(e.target));  // Convert FormData to URLSearchParams

        fetch('http://127.0.0.1:8000/add_transaction/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formDataToSend
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            alert(data.message);  // Show success message
            console.log('Transaction added:', data);
            setTransactions(prevTransactions => [data.transaction, ...prevTransactions]); // Add the new transaction without refreshing
        })
        .catch(error => {
            alert("Error processing transaction");
            console.error('Error:', error);
        });
    };

    return (
        <div>
           
            <div className="container">
                <div className="form-container">
                    <h2>Create a Transaction</h2>
                    <form id="transactionForm" onSubmit={handleSubmit}>
                        <label htmlFor="category">Category</label>
                        <select
                            id="category"
                            name="category_id"
                            value={formData.category_id}
                            onChange={handleFormChange}
                            required
                        >
                            <option value="">Select a Category</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>

                        <label htmlFor="item">Item</label>
                        <select
                            id="item"
                            name="item_id"
                            value={formData.item_id}
                            onChange={handleFormChange}
                            required
                        >
                            <option value="">Select an Item</option>
                            {items.map((item) => (
                                <option key={item.id} value={item.id}>
                                    {item.name}
                                </option>
                            ))}
                        </select>

                        <label htmlFor="transaction_type">Transaction Type</label>
                        <select
                            id="transaction_type"
                            name="transaction_type"
                            value={formData.transaction_type}
                            onChange={handleFormChange}
                            required
                        >
                            <option value="buy">Buy</option>
                            <option value="sell">Sell</option>
                            <option value="return">Return</option>
                        </select>

                        <label htmlFor="quantity">Quantity</label>
                        <input
                            type="number"
                            id="quantity"
                            name="quantity"
                            min="1"
                            value={formData.quantity}
                            onChange={handleFormChange}
                            required
                        />

                        <button type="submit" className="button">Submit Transaction</button>
                    </form>
                </div>

                <div className="transaction-list">
                    <h2>Recent Transactions</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Transaction Type</th>
                                <th>Item</th>
                                <th>Quantity</th>
                                <th>Amount</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map((transaction) => (
                                <tr key={transaction.id}>
                                    <td>{transaction.transaction_type || 'N/A'}</td>
                                    <td>{transaction.item || 'N/A'}</td>
                                    <td>{transaction.quantity || 'N/A'}</td>
                                    <td>{transaction.amount || 'N/A'}</td>
                                    <td>{transaction.date || 'N/A'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Transaction;
