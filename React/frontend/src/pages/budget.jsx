import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/budget.css';

const API_URL ='https://backend-cmps271.onrender.com';

function Budget() {
  const [mainBudget, setMainBudget] = useState(null);
  const [subBudgets, setSubBudgets] = useState([]);
  const [amountInputs, setAmountInputs] = useState({});
  const [started, setStarted] = useState(
    () => localStorage.getItem('started') === 'true'
  );

  useEffect(() => {
    if (started) initBudgets();
  }, [started]);

  const initBudgets = async () => {
    const main = await fetchBudgets(0).then(b => b[0] || null);
    setMainBudget(main);
    localStorage.setItem('mainBudget', JSON.stringify(main));
    if (main) {
      const subs = await fetchBudgets(main.id);
      setSubBudgets(subs);
    }
  };

  const fetchBudgets = async parentId => {
    try {
      const resp = await axios.get(`${API_URL}/budgets/`, { params: { parent_id: parentId } });
      return resp.data.budgets;
    } catch (e) {
      console.error('Error fetching budgets', e);
      return [];
    }
  };

  const handleStart = async () => {
    try {
      const { data } = await axios.post(`${API_URL}/start/`);
      setStarted(true);
      setMainBudget(data);
      localStorage.setItem('started', 'true');
      initBudgets();
    } catch (e) {
      console.error('Error starting budget', e);
    }
  };

  const modifyAmount = async (budgetId, isAdd) => {
    const val = parseFloat(amountInputs[budgetId]) || 0;
    if (val <= 0) return;
    const endpoint = isAdd ? 'add_budget_amount' : 'remove_budget_amount';
    try {
      await axios.post(`${API_URL}/${endpoint}/${budgetId}`, { amount: val });
      initBudgets();
      setAmountInputs(prev => ({ ...prev, [budgetId]: '' }));
    } catch (e) {
      console.error('Error modifying amount', e);
    }
  };

  const handleCreateSubBudget = async () => {
    const name = prompt('New sub-budget name:');
    if (!name) return;
    try {
      await axios.post(`${API_URL}/create_sub_budget/${mainBudget.id}`, { name });
      initBudgets();
    } catch (e) {
      console.error('Error creating sub-budget', e);
    }
  };

  if (!started) {
    return (
      <div className="budget-containerlist">
        <button className="create-sub-budget-btnlist" onClick={handleStart}>
          Start Budget Management
        </button>
      </div>
    );
  }

  return (
    <div className="budget-containerlist">
      {/* Main Budget */}
      <div className="budget-itemlist">
        <h2>Main Budget</h2>
        <div className="budget-info">
          <span className="budget-amount">
            ${(mainBudget?.amount || 0).toFixed(2)}
          </span>
        </div>
        <div className="budget-actions">
          <input
            type="number"
            placeholder="Amount"
            value={amountInputs[mainBudget?.id] || ''}
            onChange={e =>
              setAmountInputs(prev => ({
                ...prev,
                [mainBudget.id]: e.target.value
              }))
            }
          />
          <button onClick={() => modifyAmount(mainBudget.id, true)}>
            Add
          </button>
          <button onClick={() => modifyAmount(mainBudget.id, false)}>
            Remove
          </button>
        </div>
      </div>

      {/* Create Sub-Budget Button */}
      <button
        className="create-sub-budget-btnlist"
        onClick={handleCreateSubBudget}
      >
        + Create Sub-Budget
      </button>

      {/* Sub-Budgets */}
      {subBudgets.map(sub => (
        <div key={sub.id} className="budget-itemlist">
          <h2>{sub.name}</h2>
          <div className="budget-info">
            <span className="budget-amount">${sub.amount.toFixed(2)}</span>
          </div>
          <div className="budget-actions">
            <input
              type="number"
              placeholder="Amount"
              value={amountInputs[sub.id] || ''}
              onChange={e =>
                setAmountInputs(prev => ({
                  ...prev,
                  [sub.id]: e.target.value
                }))
              }
            />
            <button onClick={() => modifyAmount(sub.id, true)}>Add</button>
            <button onClick={() => modifyAmount(sub.id, false)}>Remove</button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Budget;
