import React, { useEffect, useState } from 'react';
import Chart from 'chart.js/auto'; // For importing Chart.js functionality
import "../styles/dashboardStyle.css";
//import "../styles/homePageStyle.css"; // Import other CSS if necessary

const Dashboard = () => {
  const [salesData, setSalesData] = useState([]);
  const [labels, setLabels] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  
  useEffect(() => {
    // Generate calendar
    generateCalendar();

    // Load transactions and update sales data
    loadTransactions();

    // Handle dark mode
    if (localStorage.getItem("darkMode") === "enabled") {
      document.body.classList.add("dark-mode");
    }
  }, []);

  // Function to generate the calendar dynamically
  const generateCalendar = () => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    const firstDayOfWeek = firstDay.getDay();
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const currentMonthName = monthNames[currentMonth];
    document.getElementById('currentMonth').textContent = currentMonthName;

    let day = 1;
    const calendarBody = document.querySelector('.calendar table tbody');
    calendarBody.innerHTML = '';
    
    for (let i = 0; i < 6; i++) {
      const row = document.createElement('tr');
      for (let j = 0; j < 7; j++) {
        const cell = document.createElement('td');
        if (i === 0 && j < firstDayOfWeek) {
          row.appendChild(cell);
        } else if (day <= daysInMonth) {
          cell.textContent = day;
          row.appendChild(cell);
          day++;
        }
      }
      calendarBody.appendChild(row);
    }
    highlightToday();
  };

  const highlightToday = () => {
    const today = new Date();
    const todayDate = today.getDate();
    const days = document.querySelectorAll('.calendar td');
    days.forEach((day) => {
      if (day.textContent == todayDate) {
        day.classList.add('today');
      }
    });
  };

  // Fetch and display all transactions
  const loadTransactions = () => {
    fetch('http://127.0.0.1:8000/transactions')
      .then(response => response.json())
      .then(data => {
        let newSalesData = [];
        let newLabels = [];
        let total = 0;
        
        data.transactions.forEach((transaction, index) => {
          total += transaction.amount;
          newSalesData.push(total);
          newLabels.push(index + 1);
        });
        
        setSalesData(newSalesData);
        setLabels(newLabels);
        setTotalAmount(total);
        updateSalesChart();
      })
      .catch(error => {
        console.error('Error fetching transactions:', error);
      });
  };

  // Update the sales chart with dynamic data
  const updateSalesChart = () => {
    const ctx1 = document.getElementById("chart1").getContext("2d");
    const chart1 = new Chart(ctx1, {
      type: "line",
      data: {
        labels: labels,
        datasets: [{
          label: "Sales Amount Over Time",
          data: salesData,
          borderColor: "#007BFF",
          fill: false,
          tension: 0.1
        }]
      },
      options: {
        responsive: true,
        scales: {
          x: {
            title: {
              display: true,
              text: 'Transaction Order'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Sales Amount ($)'
            }
          }
        }
      }
    });
  };

  return (
    <div className="main-content">
      <header>
        <nav>
          <a href="homePage.html" className="logo">Finoria</a>
          <ul className="nav-links">
            <li><a href="dashboard.html">Dashboard</a></li>
            <li><a href="toBuy.html">Purchasing List</a></li>
            <li><a href="expenses.html">Transactions</a></li>
            <li><a href="#">Reports</a></li>
            <li className="dropdown">
              <a href="#">Who We Are</a>
              <div className="dropdown-content">
                <a href="teamSection.html">Our Team</a>
                <a href="#">Estez Wehbe</a>
                <a href="#">Our Services</a>
              </div>
            </li>
            <li><a href="settings.html">Settings</a></li>
            <li><a href="profile.html"><i className="fas fa-user"></i> Profile</a></li>
            <li><a href="#" id="logout">Logout</a></li>
          </ul>
        </nav>
      </header>

      <section className="dashboard-grid">
        <div className="card">
          <h3>Sales</h3>
          <p id="totalSalesAmount">${totalAmount.toFixed(2)}</p>
          <canvas id="chart1"></canvas>
        </div>

        <div className="card">
          <h3>Stats</h3>
          <canvas id="chart2"></canvas>
        </div>

        <div className="card">
          <h3>Progress</h3>
          <input type="range" min="0" max="100" value="50" />
        </div>

        <div className="card">
          <h3>Monthly Data</h3>
          <canvas id="chart3"></canvas>
        </div>

        <div className="card">
          <h3>To-Buy List 🛒</h3>
          <ul id="dashboard-toBuyList"></ul>
        </div>

        <div className="card">
          <h3>Calendar</h3>
          <div className="calendar">
            <p id="currentMonth"></p>
            <table>
              <thead>
                <tr>
                  <th>Su</th><th>Mo</th><th>Tu</th><th>We</th><th>Th</th><th>Fr</th><th>Sa</th>
                </tr>
              </thead>
              <tbody>
                {/* Calendar days will be populated here */}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
