import React, { useEffect, useState } from 'react';
import './settingsStyle.css'; // Make sure your CSS file is imported

function Settings() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(false);

  useEffect(() => {
    // Check dark mode preference in localStorage and apply it
    const storedDarkMode = localStorage.getItem("darkMode");
    if (storedDarkMode === "enabled") {
      setIsDarkMode(true);
      document.body.classList.add("dark-mode");
    }

    // Set initial email notifications state (from localStorage or default)
    const storedEmailNotifications = localStorage.getItem("emailNotifications") === "enabled";
    setEmailNotifications(storedEmailNotifications);
  }, []);

  const handleDarkModeToggle = (event) => {
    const isChecked = event.target.checked;
    setIsDarkMode(isChecked);
    if (isChecked) {
      document.body.classList.add("dark-mode");
      localStorage.setItem("darkMode", "enabled");
    } else {
      document.body.classList.remove("dark-mode");
      localStorage.setItem("darkMode", "disabled");
    }
  };

  const handleEmailNotificationsToggle = (event) => {
    const isChecked = event.target.checked;
    setEmailNotifications(isChecked);
    localStorage.setItem("emailNotifications", isChecked ? "enabled" : "disabled");
  };

  const handleDeleteAccount = () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      // Proceed with account deletion logic
      alert("Account deleted!");
      // Optionally: Redirect to sign-in page after deletion
      window.location.href = "signin.html";
    }
  };

  const handleLogout = (event) => {
    event.preventDefault();
    localStorage.removeItem("username");
    window.location.href = "signin.html";
  };

  return (
    <div>
      <header>
        <nav>
          <a href="homePage.html" className="logo">Finoria</a>
          <ul className="nav-links">
            <li><a href="dashboard.html">Dashboard</a></li>
            <li><a href="toBuy.html">Purchasing List</a></li>
            <li><a href="expenses.html" className="transactions-link">Transactions</a></li>
            <li><a href="#">Reports</a></li>
            <li className="dropdown">
              <a href="#">Who We Are</a>
              <div className="dropdown-content">
                <a href="teamSection.html">Our Team</a>
                <a href="#">Estez Wehbe</a>
                <a href="#">Our Services</a>
              </div>
            </li>
            <li><a href="settings.html">Settings</a></li>
            <li><a href="profile.html"><i className="fas fa-user"></i> Profile</a></li>
            <li><a href="#" id="logout" onClick={handleLogout}>Logout</a></li>
          </ul>
        </nav>
      </header>

      <section className="settings-content">
        <h1>Settings</h1>

        {/* Theme Section */}
        <div className="settings-section">
          <h2>Theme</h2>
          <label htmlFor="theme-toggle">
            <input
              type="checkbox"
              id="theme-toggle"
              checked={isDarkMode}
              onChange={handleDarkModeToggle}
            />
            Dark Mode
          </label>
        </div>

        {/* Notification Preferences Section */}
        <div className="settings-section">
          <h2>Notification Preferences</h2>
          <label htmlFor="email-notifications">
            <input
              type="checkbox"
              id="email-notifications"
              checked={emailNotifications}
              onChange={handleEmailNotificationsToggle}
            />
            Email Notifications
          </label>
        </div>

        {/* Account Deletion Section */}
        <div className="settings-section">
          <h2>Account Settings</h2>
          <button className="delete-btn" onClick={handleDeleteAccount}>
            Delete Account
          </button>
        </div>
      </section>
    </div>
  );
}

export default Settings;
