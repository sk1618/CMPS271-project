import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/header.css'; // Import CSS for styling

const Header = () => {
  return (
    <header>
		<nav>
		  <a href="/frontend/homePage.html" class="logo">Finoria</a>
			  <ul class="nav-links">
				<li><a href="/frontend/dashboard.html">Dashboard</a></li>
				<li class="dropdown">
				  <a href="#" class="dropbtn">Inventory & Budget</a>
				  <div class="dropdown-content">
					<a href="/frontend/inventory.html">Inventory</a>
					<a href="/DEMO1/expenses.html">Budget</a>
				  </div>
				</li>
				<li class="dropdown">
				  <a href="#" class="dropbtn">Transactions & Purchasing</a>
				  <div class="dropdown-content">
					<a href="/frontend/transactions.html">Transactions</a>
					<a href="/DEMO1/toBuy.html">Purchasing List</a>
				  </div>
				</li>
				<li><a href="#">Reports</a></li>
				<li><a href="/DEMO1/settings.html">Settings</a></li>
				<li><a href="/frontend/profile.html"><i class="fas fa-user"></i> Profile</a></li>
				<li><a href="#" id="logout">Logout</a></li>
			  </ul>
		</nav>
	  </header>
  );
};

export default Header;
