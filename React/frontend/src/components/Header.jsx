import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/header.css'; // Import CSS for styling

const Header = () => {
  return (
    <header>
      <nav>
        <Link to="/homePage" className="logo">Finoria</Link>
        <ul className="nav-links">
          <li><Link to="/dashboard">Dashboard</Link></li>
          <li className="dropdown">
            <a href="#" className="dropbtn">Inventory & Budget</a>
            <div className="dropdown-content">
              <Link to="/inventory">Inventory</Link>
              <Link to="/budget">Budget</Link>
            </div>
          </li>
          <li className="dropdown">
            <a href="#" className="dropbtn">Transactions & Purchasing</a>
            <div className="dropdown-content">
              <Link to="/transaction">Transactions</Link>
              <Link to="/toBuy">Purchasing List</Link>
            </div>
          </li>
          <li><Link to="#">Reports</Link></li>
          <li><Link to="/settings">Settings</Link></li>
          <li><Link to="/profile">
            <i className="fas fa-user"></i>Profile
          </Link></li>
          <li><Link to="#" id="logout">Logout</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
