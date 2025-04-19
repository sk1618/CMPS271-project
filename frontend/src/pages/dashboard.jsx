import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Chart from 'chart.js/auto';
import '../styles/dashboard.css';
import '../styles/homePageStyle.css';

// API base URL (adjust to your deployed backend)
const API_URL = 'https://backend-cmps271.onrender.com';

// Helper to include auth header
function getAuthHeaders() {
  const token = localStorage.getItem('access_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

const Dashboard = () => {
  const [totalSales, setTotalSales]         = useState(0);
  const [salesData, setSalesData]           = useState([]);
  const [salesLabels, setSalesLabels]       = useState([]);
  const [categoryLabels, setCategoryLabels] = useState([]);
  const [categoryCounts, setCategoryCounts] = useState([]);
  const [budgetLabels, setBudgetLabels]     = useState([]);
  const [budgetAmounts, setBudgetAmounts]   = useState([]);
  const [toBuyList, setToBuyList]           = useState([]);
  const [calendarRows, setCalendarRows]     = useState([]);
  const [monthName, setMonthName]           = useState('');
  const [apiError, setApiError]             = useState(null);
  const [isLoading, setIsLoading]           = useState(true);

  const salesRef  = useRef(null);
  const statsRef  = useRef(null);
  const budgetRef = useRef(null);
  const salesChartRef  = useRef(null);
  const statsChartRef  = useRef(null);
  const budgetChartRef = useRef(null);

  useEffect(() => {
    fetchAllData();
    generateCalendar();
    loadToBuyList();
    applyDarkMode();
    return () => {
      salesChartRef.current?.destroy();
      statsChartRef.current?.destroy();
      budgetChartRef.current?.destroy();
    };
  }, []);

  useEffect(() => {
    if (!isLoading && salesData.length) drawSalesChart();
  }, [salesData, salesLabels, isLoading]);

  useEffect(() => {
    if (categoryCounts.length) drawStatsChart();
  }, [categoryCounts, categoryLabels]);

  useEffect(() => {
    if (budgetAmounts.length) drawBudgetChart();
  }, [budgetAmounts, budgetLabels]);

  const fetchAllData = async () => {
    setApiError(null);
    setIsLoading(true);
    try {
      await Promise.all([
        loadTransactions(),
        loadCategoryStats(),
        loadBudgetAllocations()
      ]);
    } catch (err) {
      console.error(err);
      setApiError('Failed to load some data.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadTransactions = async () => {
    const resp = await axios.get(`${API_URL}/transactions/`, { headers: getAuthHeaders() });
    const { transactions } = resp.data;
    let total = 0, cum = [], lbl = [];
    transactions.forEach((t,i) => {
      total += t.amount;
      cum.push(total);
      lbl.push(i+1);
    });
    setTotalSales(total);
    setSalesData(cum);
    setSalesLabels(lbl);
  };

  const loadCategoryStats = async () => {
    const resp = await axios.get(`${API_URL}/categories/`, { headers: getAuthHeaders() });
    const { categories } = resp.data;
    const counts = await Promise.all(
      categories.map(async cat => {
        const r = await axios.get(`${API_URL}/category/${cat.id}`, { headers: getAuthHeaders() });
        return r.data.items.length;
      })
    );
    setCategoryLabels(categories.map(c => c.name));
    setCategoryCounts(counts);
  };

  // Updated: fetch all budgets (including sub-budgets)
  const loadBudgetAllocations = async () => {
    const resp = await axios.get(`${API_URL}/get_all_budgets/`, { headers: getAuthHeaders() });
    const { budgets } = resp.data;
    // Optionally filter out the main budget: keep parent_budget_id !== 0 or include all
    // For now, include all budgets
    setBudgetLabels(budgets.map(b => b.name));
    setBudgetAmounts(budgets.map(b => b.amount));
  };

  const drawSalesChart = () => {
    salesChartRef.current?.destroy();
    if (!salesRef.current) return;
    const ctx = salesRef.current.getContext('2d');
    salesChartRef.current = new Chart(ctx, {
      type: 'line',
      data: { labels: salesLabels, datasets: [{
        label: 'Cumulative Sales',
        data: salesData,
        borderColor: '#007BFF',
        backgroundColor: 'rgba(0,123,255,0.1)',
        fill: true,
        tension: 0.4
      }] },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
    });
  };

  const drawStatsChart = () => {
    statsChartRef.current?.destroy();
    if (!statsRef.current) return;
    const ctx = statsRef.current.getContext('2d');
    statsChartRef.current = new Chart(ctx, {
      type: 'pie',
      data: { labels: categoryLabels, datasets: [{
        data: categoryCounts,
        backgroundColor: categoryLabels.map((_,i) => `hsl(${i*60},70%,60%)`),
        borderWidth: 1
      }] },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }
    });
  };

  const drawBudgetChart = () => {
    budgetChartRef.current?.destroy();
    if (!budgetRef.current) return;
    const ctx = budgetRef.current.getContext('2d');
    budgetChartRef.current = new Chart(ctx, {
      type: 'bar',
      data: { labels: budgetLabels, datasets: [{
        label: 'Budget Amount',
        data: budgetAmounts,
        backgroundColor: 'rgba(0,123,255,0.7)',
        borderColor: 'rgba(0,123,255,1)',
        borderWidth: 1
      }] },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
    });
  };

  const loadToBuyList = () => {
    try {
      const saved = localStorage.getItem('toBuyListItems');
      setToBuyList(saved ? JSON.parse(saved) : []);
    } catch { setToBuyList([]); }
  };

  const applyDarkMode = () => {
    if (localStorage.getItem('darkMode') === 'enabled') {
      document.body.classList.add('dark-mode');
    }
  };

  const generateCalendar = () => {
    const today = new Date(), mm = today.getMonth(), yy = today.getFullYear();
    const first = new Date(yy, mm, 1).getDay();
    const days  = new Date(yy, mm+1, 0).getDate();
    const monthNames = [
      'January','February','March','April','May','June',
      'July','August','September','October','November','December'
    ];
    setMonthName(monthNames[mm]);

    const rows = [];
    let day = 1;
    for (let i=0; i<6; i++) {
      const cells = [];
      for (let j=0; j<7; j++) {
        if ((i===0 && j<first) || day>days) {
          cells.push(<td key={`empty-${i}-${j}`}/>);
        } else {
          const isToday = day === today.getDate();
          cells.push(<td key={day} className={isToday?'today':''}>{day}</td>);
          day++;
        }
      }
      rows.push(<tr key={i}>{cells}</tr>);
      if (day>days) break;
    }
    setCalendarRows(rows);
  };

  return (
    <div className="dashboard">
      {apiError && <div className="error-message"><p>{apiError}</p></div>}
      <div className="dashboard-grid">
        <div className="card sales-card">
          <h3>Sales</h3>
          <p id="totalSalesAmount">${totalSales.toFixed(2)}</p>
          {isLoading && <p>Loading…</p>}
          <div className="chart-container"><canvas ref={salesRef} /></div>
        </div>
        <div className="card stats-card">
          <h3>Items per Category</h3>
          <div className="chart-container"><canvas ref={statsRef} /></div>
        </div>
        <div className="card monthly-card">
          <h3>Budget Allocations</h3>
          <div className="chart-container"><canvas ref={budgetRef} /></div>
        </div>
        <div className="card buy-list-card">
          <h3>To‑Buy List</h3>
          <ul>
            {toBuyList.length
              ? toBuyList.map((itm,i) => <li key={i}>{itm}</li>)
              : <li>No items yet</li>}
          </ul>
        </div>
        <div className="card calendar-card">
          <h3>Calendar – {monthName}</h3>
          <table>
            <thead><tr>{['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => <th key={d}>{d}</th>)}</tr></thead>
            <tbody>{calendarRows}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
