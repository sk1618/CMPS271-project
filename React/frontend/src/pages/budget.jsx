import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../styles/budget.css";


function Budget() {
  const [mainBudget, setMainBudget] = useState(null);
  const [subBudgets, setSubBudgets] = useState([]);
  const [amountInputs, setAmountInputs] = useState({});
  const [started, setStarted] = useState(() => localStorage.getItem('started') === 'true');

  // Fetch budgets based on parent_id
  const fetchBudgets = async (parentId = 0) => {
    try {
      const response = await axios.get('http://localhost:8000/budgets/', {
        params: { parent_id: parentId }
      });
      return response.data.budgets;
    } catch (error) {
      console.error('Error fetching budgets:', error);
      return [];
    }
  };

  // Fetch the main budget (with parent_id = 0) and its sub-budgets
  const fetchMainBudget = async () => {
    try {
      const response = await axios.get('http://localhost:8000/budgets/', {
        params: { parent_id: 0 }
      });
      const main = response.data.budgets[0]; // Assuming the first one is the main budget
      setMainBudget(main);
      localStorage.setItem('mainBudget', JSON.stringify(main));
      const subs = await fetchBudgets(main.id);
      setSubBudgets(subs);
    } catch (error) {
      console.error('Error fetching main budget:', error);
    }
  };

  // Function to start and create the main budget
  const handleStart = async () => {
    try {
      const response = await axios.post('http://localhost:8000/start/');
      setMainBudget(response.data);
      const subs = await fetchBudgets(response.data.id);
      setSubBudgets(subs);
      setStarted(true);
      localStorage.setItem('started', 'true');
      localStorage.setItem('mainBudget', JSON.stringify(response.data));
    } catch (error) {
      console.error('Error creating main budget:', error);
    }
  };

  // Function to create a sub-budget
  const handleCreateSubBudget = async (parentBudgetId) => {
    const name = prompt('Enter the name for the sub-budget');
    if (name) {
      try {
        await axios.post(`http://localhost:8000/create_sub_budget/${parentBudgetId}`, { name });
        // Re-fetch the main budget to update both the parent's amount and sub-budgets.
        await fetchMainBudget();
      } catch (error) {
        console.error('Error creating sub-budget:', error);
      }
    }
  };

  const handleAddAmount = async (budgetId) => {
    const amount = parseFloat(amountInputs[budgetId] || 0);
    if (amount <= 0) return;

    try {
      await axios.post(`http://localhost:8000/add_budget_amount/${budgetId}`, { amount });
      // For both main and sub-budgets, re-fetch the main budget and its sub-budgets
      await fetchMainBudget();
      setAmountInputs((prev) => ({ ...prev, [budgetId]: '' }));
    } catch (error) {
      console.error('Error adding amount:', error);
    }
  };

  const handleRemoveAmount = async (budgetId) => {
    const amount = parseFloat(amountInputs[budgetId] || 0);
    if (amount <= 0) return;

    try {
      await axios.post(`http://localhost:8000/remove_budget_amount/${budgetId}`, { amount });
      // For both main and sub-budgets, re-fetch the main budget and its sub-budgets
      await fetchMainBudget();
      setAmountInputs((prev) => ({ ...prev, [budgetId]: '' }));
    } catch (error) {
      console.error('Error removing amount:', error);
    }
  };

  // Load saved budget data from localStorage on first render
  useEffect(() => {
    if (started) {
      const savedMainBudget = localStorage.getItem('mainBudget');
      
      if (savedMainBudget) {
        try {
          const parsedBudget = JSON.parse(savedMainBudget);
          if (parsedBudget) {
            setMainBudget(parsedBudget);
            fetchBudgets(parsedBudget.id).then(setSubBudgets);
          } else {
            fetchMainBudget();
          }
        } catch (error) {
          console.error('Error parsing saved budget:', error);
          fetchMainBudget();  // Fallback if parsing fails
        }
      } else {
        fetchMainBudget();
      }
    }
  }, [started]);
  

  return (
    <div className="">
        <br /><br /><br />
      {!started ? (
        <div className="start-screen">
          <h1>Budget Management</h1>
          <button onClick={handleStart}>Start</button>
        </div>
      ) : (
        <div className="budget-containerlist">
          {/* Main Budget Section */}
          <div className="budget-itemlist">
            <h2>Main Budget:</h2>
            <div className="budget-info">
              
              <span className="budget-amount">${(mainBudget?.amount || 0).toFixed(2)}</span>
            </div>
            <div className="budget-actions">
              <input
                type="number"
                placeholder="Amount"
                value={amountInputs[mainBudget?.id] || ''}
                onChange={(e) =>
                  setAmountInputs((prev) => ({ ...prev, [mainBudget?.id]: e.target.value }))}
              />
              <button onClick={() => handleAddAmount(mainBudget.id)}>Add</button>
              <button onClick={() => handleRemoveAmount(mainBudget.id)}>Remove</button>
            </div>
          </div>

          {/* Sub-Budgets Section */}
          <button className="create-sub-budget-btnlist" onClick={() => handleCreateSubBudget(mainBudget.id)}>
            Create Sub-Budget
          </button>

          {subBudgets.length > 0 ? (
            <div className="sub-budget-containerlist">
              <h3>Sub-Budgets</h3>
              <ul>
                {subBudgets.map((subBudget) => (
                  <li key={subBudget.id}>
                    <div className="budget-itemlist">
                      <div className="budget-info">
                        <span className="budget-name">{subBudget.name}</span>
                        <span className="budget-amount">${subBudget.amount.toFixed(2)}</span>
                      </div>
                      <div className="budget-actions">
                        <input
                          type="number"
                          placeholder="Amount"
                          value={amountInputs[subBudget.id] || ''}
                          onChange={(e) =>
                            setAmountInputs((prev) => ({ ...prev, [subBudget.id]: e.target.value }))
                          }
                        />
                        <button onClick={() => handleAddAmount(subBudget.id)}>Add</button>
                        <button onClick={() => handleRemoveAmount(subBudget.id)}>Remove</button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p>No sub-budgets yet.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default Budget;
