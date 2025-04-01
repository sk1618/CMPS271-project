import React, { useState, useEffect } from 'react';
import "../styles/transaction.css";

const Transaction = () => {
    // State hooks for categories, items, transactions, budgets, and form data
    const [categories, setCategories] = useState([]);
    const [items, setItems] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [budgets, setBudgets] = useState([]); // State for all budgets
    const [formData, setFormData] = useState({
        category_id: '',
        item_id: '',
        transaction_type: '',
        quantity: 1,
        budget_id: '' // New field for budget ID
    });

    // Function to load categories, budgets, and transactions
    useEffect(() => {
        // Load categories
        fetch('http://127.0.0.1:8000/categories/',{headers:{
        'Authorization':`Bearer ${localStorage.getItem("access_token")}`
        }})
            .then((response) => response.json())
            .then((data) => {
                setCategories(data.categories);
            })
            .catch((error) => {
                console.error('Error loading categories:', error);
            });

        // Load all budgets using the new API
        fetch('http://127.0.0.1:8000/get_all_budgets/',{headers:{
            'Authorization':`Bearer ${localStorage.getItem("access_token")}`
            }})
            .then((response) => response.json())
            .then((data) => {
                setBudgets(data.budgets);  // Store all budgets in state
            })
            .catch((error) => {
                console.error('Error loading budgets:', error);
            });

        // Load transactions
        loadTransactions();
    }, []);

    // Function to load transactions
    const loadTransactions = () => {
        fetch('http://127.0.0.1:8000/transactions/',{headers:{
            'Authorization':`Bearer ${localStorage.getItem("access_token")}`
            }})
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
        fetch(`http://127.0.0.1:8000/category/${categoryId}`,{headers:{
            'Authorization':`Bearer ${localStorage.getItem("access_token")}`
            }})
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

    const handleSubmit = (e) => {
        e.preventDefault();
    
        const formDataToSend = new URLSearchParams({
            category_id: formData.category_id,
            ftype: formData.transaction_type,  
            fitem_id: formData.item_id,       // Corrected field name
            fquantity: formData.quantity,     // Corrected field name
            fbudget_id: formData.budget_id    // Corrected field name
        });
    
        console.log("Form Data to Send:", formDataToSend.toString());
    
        fetch('http://127.0.0.1:8000/add_transaction/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization':`Bearer ${localStorage.getItem("access_token")}`
            },
            body: formDataToSend.toString(),
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => { throw new Error(err.detail); });
            }
            return response.json();
        })
        .then(data => {
            alert(data.message);
            console.log('Transaction added:', data);
            loadTransactions();
        })
        .catch(error => {
            alert(`Error: ${error.message}`);
            console.error('Error:', error);
        });
    };
    
    
    return (
        <div>
            <br /><br /><br />
            <div className="container">
                <div className="form-container">
                    <h2>Create a Transaction</h2>
                    <form id="transactionForm"  onSubmit={handleSubmit}   style={{ gap: "3px"}}>
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
                            <option value="">Select a transaction type</option>
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

                        <label htmlFor="budget">Budget</label>
                        <select
                            id="budget"
                            name="budget_id"
                            value={formData.budget_id}
                            onChange={handleFormChange}
                            required
                        >
                            <option value="">Select a Budget</option>
                            {budgets.map((budget) => (
                                <option key={budget.id} value={budget.id}>
                                    {budget.name}
                                </option>
                            ))}
                        </select>

                        <button type="submit" className="button">Submit Transaction</button>
                    </form>
                </div>

                <div className="transaction-list">
                    <h2>Recent Transactions</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Type</th>
                                <th>Item</th>
                                <th>Quantity</th>
                                <th>Amount</th>
                                <th>Budget</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map((transaction) => (
                                <tr key={transaction.id}>
                                    <td>{transaction.type || 'N/A'}</td>
                                    <td>{transaction.item_id || 'N/A'}</td>
                                    <td>{transaction.quantity || 'N/A'}</td>
                                    <td>{transaction.amount || 'N/A'}</td>
                                    <td>{transaction.budget_id || 'N/A'}</td>
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
