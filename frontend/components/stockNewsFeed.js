document.addEventListener("DOMContentLoaded", function () {
    // Chart-related code (from the first DOMContentLoaded)
    let chart1 = null;
    let salesData = [];
    let labels = [];
    let totalAmount = 0;

    loadTransactions();

    function loadTransactions() {
        fetch('http://127.0.0.1:8000/transactions',{headers: {
        'Authorization': `Bearer ${localStorage.getItem("access_token")}`,
        },})
            .then(response => response.json())
            .then(data => {
                data.transactions.forEach((transaction, index) => {
                    totalAmount += transaction.amount;
                    salesData.push(totalAmount);
                    labels.push(index + 1);
                    document.getElementById("totalSalesAmount").textContent = `$${totalAmount.toFixed(2)}`;
                    updateSalesChart();
                });
            })
            .catch(error => {
                console.error('Error fetching transactions:', error);
            });
    }

    function updateSalesChart() {
        let ctx1 = document.getElementById("chart1").getContext("2d");
        if (chart1) {
            chart1.destroy();
        }
        chart1 = new Chart(ctx1, {
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
    }

    // Optional additional charts
    let ctx2 = document.getElementById("chart2").getContext("2d");
    new Chart(ctx2, {
        type: "doughnut",
        data: {
            labels: ["Product A", "Product B", "Product C"],
            datasets: [{
                data: [30, 40, 30],
                backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"]
            }]
        }
    });

    let ctx3 = document.getElementById("chart3").getContext("2d");
    new Chart(ctx3, {
        type: "bar",
        data: {
            labels: ["Jan", "Feb", "Mar", "Apr", "May"],
            datasets: [{
                label: "Revenue",
                data: [1000, 2000, 1500, 1800, 2100],
                backgroundColor: "#8E44AD"
            }]
        }
    });

    // Stock News Feed Widget Code (from the second DOMContentLoaded)
    const gearIcon = document.getElementById('gear-icon');
    const stockModal = document.getElementById('stock-modal');
    const closeModal = document.querySelector('.close-modal');
    const saveSelectionButton = document.getElementById('save-selection');
    const newsFeed = document.getElementById('news-feed');
    const newsItems = document.getElementById('news-items');

    gearIcon.addEventListener('click', () => {
        stockModal.style.display = 'flex';
    });

    closeModal.addEventListener('click', () => {
        stockModal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === stockModal) {
            stockModal.style.display = 'none';
        }
    });

    saveSelectionButton.addEventListener('click', () => {
        const selectedStocks = Array.from(document.querySelectorAll('#stock-list input[type="checkbox"]:checked'))
            .map(checkbox => checkbox.value);

        if (selectedStocks.length > 0) {
            fetchStockNews(selectedStocks);
            stockModal.style.display = 'none';
        } else {
            alert('Please select at least one stock.');
        }
    });

    function fetchStockNews(stocks) {
        const apiUrl = `http://localhost:8000/fetch_stock_news?stocks=${stocks.join(',')}`;
    
        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('API Response:', data); // Log the API response
                newsItems.innerHTML = ''; // Clear previous news items
    
                // Display the limited news items
                data.articles.forEach(article => {
                    const li = document.createElement('li');
                    li.textContent = `${article.title} - ${article.source.name}`;
                    newsItems.appendChild(li);
                });
            })
            .catch(error => {
                console.error('Error fetching news:', error);
                alert('Failed to fetch news. Check the console for details.');
            });
    }
});