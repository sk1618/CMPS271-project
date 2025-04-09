import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/header.css'; // Import CSS for styling

const Header = () => {
	return (
		<header>
			<nav>
				<a href="/homePage" class="logo">Finoria</a>
				<ul class="nav-links">
					<li><a href="../dashboard">Dashboard</a></li>
					<li class="dropdown">
						<a href="#" class="dropbtn">Inventory & Budget</a>
						<div class="dropdown-content">
							<a href="../inventory">Inventory</a>
							<a href="../budget">Budget</a>
						</div>
					</li>
					<li class="dropdown">
						<a href="#" class="dropbtn">Transactions & Purchasing</a>
						<div class="dropdown-content">
							<a href="../transaction">Transactions</a>
							<a href="../toBuy">Purchasing List</a>
						</div>
					</li>
					<li class="dropdown">
						<a href="#" class="dropbtn">Who We Are</a>
						<div class="dropdown-content">
							<a href="../teamSection">Our Team</a>
							<a href="../ourServices">Our Services</a>
						</div>
					</li>
					<li><a href="/settings">Settings</a></li>
					<li><Link to="/profile">
						<i className="fas fa-user"></i>Profile
					</Link></li>
					<li><a href="#" id="logout">Logout</a></li>
				</ul>
			</nav>
		</header>
	);
};

export default Header;
