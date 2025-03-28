import React, { useEffect, useState, useRef } from 'react';
import Chart from 'chart.js/auto';
import '../styles/dashboard.css';
import '../styles/homePageStyle.css';

const Dashboard = () => {
    const [totalSales, setTotalSales] = useState(0);
    const [salesData, setSalesData] = useState([]);
    const [labels, setLabels] = useState([]);
    const chartRef = useRef(null);

    useEffect(() => {
        loadTransactions();
        
        // Apply dark mode after a slight delay to ensure DOM is ready
        const timer = setTimeout(() => {
            applyDarkModeToDynamicElements();
        }, 100);
        
        return () => {
            clearTimeout(timer);
            if (chartRef.current) {
                chartRef.current.destroy();
            }
        };
    }, []);

    const generateCalendar = () => {
        const today = new Date();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();
        const firstDay = new Date(currentYear, currentMonth, 1);
        const lastDay = new Date(currentYear, currentMonth + 1, 0);

        const daysInMonth = lastDay.getDate();
        const firstDayOfWeek = firstDay.getDay();

        let calendarRows = [];
        let day = 1;
        for (let i = 0; i < 6; i++) {
            let row = [];
            for (let j = 0; j < 7; j++) {
                if (i === 0 && j < firstDayOfWeek) {
                    row.push(<td key={`empty-${i}-${j}`}></td>);
                } else if (day <= daysInMonth) {
                    const isToday = day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();
                    row.push(
                        <td key={`day-${day}`} className={isToday ? 'today' : ''}>
                            {day}
                        </td>
                    );
                    day++;
                } else {
                    row.push(<td key={`empty-end-${i}-${j}`}></td>);
                }
            }
            calendarRows.push(<tr key={`row-${i}`}>{row}</tr>);
            if (day > daysInMonth) break;
        }

        return calendarRows;
    };

    const loadTransactions = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/transactions');
            const data = await response.json();
            let total = 0;
            let newSalesData = [];
            let newLabels = [];
            data.transactions.forEach((transaction, index) => {
                total += transaction.amount;
                newSalesData.push(total);
                newLabels.push(index + 1);
            });
            setTotalSales(total);
            setSalesData(newSalesData);
            setLabels(newLabels);
            updateSalesChart(newSalesData, newLabels);
        } catch (error) {
            console.error('Error fetching transactions:', error);
            // Fallback data if API fails
            const fallbackData = [100, 200, 300, 400, 500];
            const fallbackLabels = [1, 2, 3, 4, 5];
            setTotalSales(500);
            setSalesData(fallbackData);
            setLabels(fallbackLabels);
            updateSalesChart(fallbackData, fallbackLabels);
        }
    };

    const updateSalesChart = (salesData, labels) => {
        const ctx = document.getElementById('chart1');
        if (!ctx) return;

        if (chartRef.current) {
            chartRef.current.destroy();
        }

        chartRef.current = new Chart(ctx, {
            type: 'line',
            data: {
                labels,
                datasets: [{
                    label: 'Sales Amount Over Time',
                    data: salesData,
                    borderColor: '#007BFF',
                    backgroundColor: 'rgba(0, 123, 255, 0.1)',
                    fill: true,
                    tension: 0.4
                }],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    };

    const applyDarkModeToDynamicElements = () => {
        if (localStorage.getItem('darkMode') === 'enabled') {
            document.body.classList.add('dark-mode');
        }
    };

    return (
        <div className="dashboard">
            <header>
                <nav>
                    <a href="/homePage" className="logo">Finoria</a>
                    <ul className="nav-links">
                        <li><a href="/dashboard">Dashboard</a></li>
                        <li><a href="/toBuy">Purchasing List</a></li>
                        <li><a href="/expenses">Transactions</a></li>
                        <li><a href="#">Reports</a></li>
                        <li><a href="/settings">Settings</a></li>
                        <li><a href="/profile"><i className="fas fa-user"></i> Profile</a></li>
                        <li><a href="#">Logout</a></li>
                    </ul>
                </nav>
            </header>
            <div className="main-content">
                <section className="dashboard-grid">
                    <div className="card chart-container">
                        <h3>Sales</h3>
                        <p>${totalSales.toFixed(2)}</p>
                        <div className="chart-wrapper">
                            <canvas id="chart1"></canvas>
                        </div>
                    </div>
                    <div className="card">
                        <h3>Calendar</h3>
                        <table className="calendar">
                            <thead>
                                <tr>
                                    <th>Su</th><th>Mo</th><th>Tu</th><th>We</th><th>Th</th><th>Fr</th><th>Sa</th>
                                </tr>
                            </thead>
                            <tbody>{generateCalendar()}</tbody>
                        </table>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Dashboard;