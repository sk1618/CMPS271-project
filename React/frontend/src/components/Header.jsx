import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/header.css'; // Import CSS for styling

const Header = () => {
    return (
        <header>
            <nav>
                <Link to="/" className="logo">Finoria</Link>
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
                    <li className="dropdown">
                        <a href="#" className="dropbtn">About Us</a>
                        <div className="dropdown-content">
                            <Link to="/teamSection">Our Team</Link>
                            <Link to="/ourServices">Our Services</Link>
                        </div>
                    </li>
                    <li><Link to="/settings">Settings</Link></li>
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
