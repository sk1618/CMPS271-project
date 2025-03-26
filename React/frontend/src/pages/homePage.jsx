import React, { useEffect, useState } from "react";
import "../styles/homePageStyle.css"; // Importing CSS
import { Link } from "react-router-dom"; // For navigation

const HomePage = () => {
  const [username, setUsername] = useState("Guest");

  // Fetch username from localStorage on component mount
  useEffect(() => {
    const storedUsername = localStorage.getItem("username") || "Guest";
    setUsername(storedUsername);

    // Apply dark mode if enabled
    if (localStorage.getItem("darkMode") === "enabled") {
      document.body.classList.add("dark-mode");
    }
  }, []);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("username"); // Clear user data
    window.location.href = "/signin"; // Redirect to sign-in page
  };

  return (
    <>
      <header>
        <nav>
          <Link to="/" className="logo">Finoria</Link>
          <ul className="nav-links">
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/toBuy">Purchasing List</Link></li>
            <li><Link to="/expenses" className="transactions-link">Transactions</Link></li>
            <li><Link to="#">Reports</Link></li>
            <li className="dropdown">
              <Link to="#">Who We Are</Link>
              <div className="dropdown-content">
                <Link to="/teamSection">Our Team</Link>
                <Link to="#">Estez Wehbe</Link>
                <Link to="#">Our Services</Link>
              </div>
            </li>
            <li><Link to="/settings">Settings</Link></li>
            <li><Link to="/profile"><i className="fas fa-user"></i> Profile</Link></li>
            <li><button onClick={handleLogout} id="logout">Logout</button></li>
          </ul>
        </nav>
      </header>

      <section className="homepage-content">
        <h1>Welcome, <span>{username}</span>!</h1>
        <p>Your financial journey starts here.</p>
        <div className="quick-actions">
          <Link to="#" className="action-btn">Add Transaction</Link>
          <Link to="#" className="action-btn">View Reports</Link>
        </div>
      </section>
    </>
  );
};

export default HomePage;
