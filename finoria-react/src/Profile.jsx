import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/profile.css";

function Profile() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("Guest");
  const [email, setEmail] = useState("user@example.com");
  const [accountType, setAccountType] = useState("Basic");

  // Fetch user data from localStorage
  useEffect(() => {
    const storedEmail = localStorage.getItem("email") || "user@example.com";
    const storedPass = localStorage.getItem("password") || ""; 
    // In a real app, you'd probably fetch user info from an API 
    // or decode a JWT for username, etc.

    // We'll simulate that "username" is just the email prefix for demonstration
    const userPrefix = storedEmail.split("@")[0];
    setUsername(userPrefix);

    // Also retrieve the account type if you store it
    // localStorage.setItem("accountType", "Premium"); // Example
    const storedType = localStorage.getItem("accountType") || "Basic";
    setAccountType(storedType);

    setEmail(storedEmail);
  }, []);

  const handleLogout = () => {
    // Clear localStorage or remove tokens
    localStorage.removeItem("email");
    localStorage.removeItem("password");
    localStorage.removeItem("accountType");
    // Then navigate back to the sign-in page
    navigate("/");
  };

  return (
    <div className="profile-container">
      <header className="profile-header">
        <nav>
          <a href="#" className="logo">Finoria</a>
          <ul className="nav-links">
            <li><a href="/dashboard">Dashboard</a></li>
            <li><a href="/transactions">Transactions</a></li>
            <li><a href="/inventory">Inventory</a></li>
            <li><a href="/reports">Reports</a></li>
            <li><a href="/settings">Settings</a></li>
            {/* Profile link - current page */}
            <li><a href="/profile"><i className="fas fa-user"></i> Profile</a></li>
            <li>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </header>

      <section className="profile-content">
        <h1>Welcome to your profile, <span id="username">{username}</span>!</h1>

        <div className="profile-info">
          <p><strong>Name:</strong> {username}</p>
          <p><strong>Email:</strong> {email}</p>
          <p><strong>Account Type:</strong> {accountType}</p>
        </div>

        <div className="profile-actions">
          {/* In a real app, you’d link to an edit form, etc. */}
          <button className="action-btn">Edit Profile</button>
          <button className="action-btn">Change Password</button>
        </div>
      </section>
    </div>
  );
}

export default Profile;
