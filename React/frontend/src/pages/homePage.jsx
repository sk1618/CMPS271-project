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
      <section className="homepage-content">
        <h1>Welcome, <span>{username}</span>!</h1>
        <p>Your financial journey starts here.</p>
        <div className="quick-actions">
          <Link to="/Transaction" className="action-btn">Add Transaction</Link>
          <Link to="/Inventory" className="action-btn">View Inventory</Link>
        </div>
      </section>
    </>
  );
};

export default HomePage;
