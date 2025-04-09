import React, { useEffect, useState, useRef } from 'react';
import Chart from 'chart.js/auto';
import '../styles/dashboard.css';
import '../styles/homePageStyle.css';

const Dashboard = () => {
    const [totalSales, setTotalSales] = useState(0);
    const [salesData, setSalesData] = useState([]);
    const [labels, setLabels] = useState([]);
    const [toBuyList, setToBuyList] = useState([]);
    const [calendarRows, setCalendarRows] = useState([]);
    const [monthName, setMonthName] = useState('');
    const [apiError, setApiError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const chart1Ref = useRef(null);
    const chart2Ref = useRef(null);
    const chart3Ref = useRef(null);
    const chartInstance1 = useRef(null);
    const chartInstance2 = useRef(null);
    const chartInstance3 = useRef(null);

    useEffect(() => {
        loadTransactions();
        generateCalendar();
        loadToBuyList();
        applyDarkModeToDynamicElements();

        return () => {
            chartInstance1.current?.destroy();
            chartInstance2.current?.destroy();
            chartInstance3.current?.destroy();
        };
    }, []);

    const loadTransactions = async () => {
        setApiError(null);
        setIsLoading(true);
        
        try {
            const response = await fetch('https://backend-cmps271.onrender.com/transactions');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            
            const data = await response.json();
            processTransactionData(data);
            initializeCharts();
        } catch (error) {
            console.error('API Error:', error);
            setApiError('Failed to load transaction data. Using demo data.');
            
            const mockData = {
                transactions: [
                    { amount: 150 }, { amount: 200 }, 
                    { amount: 300 }, { amount: 250 }, 
                    { amount: 400 }
                ]
            };
            processTransactionData(mockData);
            initializeCharts();
        } finally {
            setIsLoading(false);
        }
    };

    const processTransactionData = (data) => {
        let total = 0;
        const newSalesData = [];
        const newLabels = [];

        data.transactions.forEach((transaction, index) => {
            total += transaction.amount;
            newSalesData.push(total);
            newLabels.push(index + 1);
        });

        setTotalSales(total);
        setSalesData(newSalesData);
        setLabels(newLabels);
    };

    const initializeCharts = () => {
        // Sales Chart (Line)
        if (chartInstance1.current) chartInstance1.current.destroy();
        const ctx1 = chart1Ref.current.getContext('2d');
        chartInstance1.current = new Chart(ctx1, {
            type: 'line',
            data: {
                labels: labels.length > 0 ? labels : [1, 2, 3, 4, 5],
                datasets: [{
                    label: 'Sales Amount',
                    data: salesData.length > 0 ? salesData : [100, 200, 300, 400, 500],
                    borderColor: '#007BFF',
                    backgroundColor: 'rgba(0, 123, 255, 0.1)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } }
            }
        });

        // Stats Chart (Pie)
        if (chartInstance2.current) chartInstance2.current.destroy();
        const ctx2 = chart2Ref.current.getContext('2d');
        chartInstance2.current = new Chart(ctx2, {
            type: 'pie',
            data: {
                labels: ['Product A', 'Product B', 'Product C', 'Product D'],
                datasets: [{
                    data: [30, 25, 20, 25],
                    backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'bottom' } }
            }
        });

        // Monthly Chart (Bar)
        if (chartInstance3.current) chartInstance3.current.destroy();
        const ctx3 = chart3Ref.current.getContext('2d');
        chartInstance3.current = new Chart(ctx3, {
            type: 'bar',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Monthly Sales',
                    data: [1200, 1900, 1500, 2000, 1800, 2100],
                    backgroundColor: 'rgba(0, 123, 255, 0.7)',
                    borderColor: 'rgba(0, 123, 255, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } }
            }
        });
    };

    const generateCalendar = () => {
        const today = new Date();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();
        const firstDay = new Date(currentYear, currentMonth, 1);
        const lastDay = new Date(currentYear, currentMonth + 1, 0);

        const daysInMonth = lastDay.getDate();
        const firstDayOfWeek = firstDay.getDay();

        const monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        setMonthName(monthNames[currentMonth]);

        let rows = [];
        let day = 1;

        for (let i = 0; i < 6; i++) {
            let cells = [];
            for (let j = 0; j < 7; j++) {
                if (i === 0 && j < firstDayOfWeek) {
                    cells.push(<td key={`empty-${i}-${j}`}></td>);
                } else if (day <= daysInMonth) {
                    const isToday = day === today.getDate();
                    cells.push(
                        <td key={`day-${day}`} className={isToday ? 'today' : ''}>
                            {day}
                        </td>
                    );
                    day++;
                } else {
                    cells.push(<td key={`empty-end-${i}-${j}`}></td>);
                }
            }
            rows.push(<tr key={`row-${i}`}>{cells}</tr>);
            if (day > daysInMonth) break;
        }

        setCalendarRows(rows);
    };

    const loadToBuyList = () => {
        const savedList = localStorage.getItem("toBuyListItems");
        if (savedList) {
            try {
                setToBuyList(JSON.parse(savedList));
            } catch {
                setToBuyList([]);
            }
        } else {
            setToBuyList([]);
        }
    };

    const applyDarkModeToDynamicElements = () => {
        if (localStorage.getItem('darkMode') === 'enabled') {
            document.body.classList.add('dark-mode');
        }
    };

    return (
        <div className="dashboard">
            <div className="main-content">
                {apiError && (
                    <div className="error-message">
                        <p>{apiError}</p>
                    </div>
                )}

                <div className="dashboard-grid">
                    <div className="card sales-card">
                        <h3>Sales</h3>
                        {isLoading ? (
                            <p>Loading sales data...</p>
                        ) : (
                            <>
                                <p id="totalSalesAmount">${totalSales.toFixed(2)}</p>
                                <div className="chart-container">
                                    <canvas ref={chart1Ref}></canvas>
                                </div>
                            </>
                        )}
                    </div>

                    <div className="card stats-card">
                        <h3>Stats</h3>
                        <div className="chart-container">
                            <canvas ref={chart2Ref}></canvas>
                        </div>
                    </div>

                    <div className="card progress-card">
                        <h3>Progress</h3>
                        <input type="range" min="0" max="100" defaultValue="50" />
                        <div className="progress-labels">
                            <span>0%</span>
                            <span>50%</span>
                            <span>100%</span>
                        </div>
                    </div>

                    <div className="card monthly-card">
                        <h3>Monthly Data</h3>
                        <div className="chart-container">
                            <canvas ref={chart3Ref}></canvas>
                        </div>
                    </div>

                    <div className="card buy-list-card">
                        <h3>To-Buy List</h3>
                        <ul id="dashboard-toBuyList">
                            {toBuyList.length > 0 ? (
                                toBuyList.map((item, idx) => (
                                    <li key={idx}>{item}</li>
                                ))
                            ) : (
                                <li>No items yet</li>
                            )}
                        </ul>
                    </div>

                    <div className="card calendar-card">
                        <h3>Calendar</h3>
                        <div className="calendar">
                            <p id="currentMonth">{monthName}</p>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Su</th><th>Mo</th><th>Tu</th><th>We</th><th>Th</th><th>Fr</th><th>Sa</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {calendarRows}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;