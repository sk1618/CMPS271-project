import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/settingsStyle.css"; // Ensure this file exists

function Settings() {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "enabled"
  );

  const navigate = useNavigate();

  // Apply dark mode on initial load
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [darkMode]);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    localStorage.setItem("darkMode", darkMode ? "disabled" : "enabled");
  };

  // Handle account deletion confirmation
  const confirmDelete = () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      alert("Account deleted!");
      navigate("/signin"); // Redirect to sign-in page
    }
  };

  // Logout functionality
  const handleLogout = (event) => {
    event.preventDefault();
    localStorage.removeItem("username");
    navigate("/signin"); // Redirect to sign-in page
  };

  return (
    <div>
      {/* Settings Content */}
      <section className="settings-content">
        <h1>Settings</h1>

        {/* Theme Toggle */}
        <div className="settings-section">
          <h2>Theme</h2>
          <label>
            <input type="checkbox" checked={darkMode} onChange={toggleDarkMode} /> Dark Mode
          </label>
        </div>

        {/* Notification Preferences */}
        <div className="settings-section">
          <h2>Notification Preferences</h2>
          <label>
            <input type="checkbox" /> Email Notifications
          </label>
        </div>

        {/* Account Deletion */}
        <div className="settings-section">
          <h2>Account Settings</h2>
          {/*<button className="delete-btn" onClick={confirmDelete}>Delete Account</button>*/}
        </div>
      </section>
    </div>
  );
}

export default Settings;
