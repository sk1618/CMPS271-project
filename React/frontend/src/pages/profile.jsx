import React from "react";
import "../styles/profile.css";
import { useNavigate } from "react-router-dom";

function Profile() {
  const navigate = useNavigate();

  const handleEdit = () => {
    alert("Edit profile clicked!");
    // You can navigate to an edit profile page here
    // navigate("/edit-profile");
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/signin"); // Adjust this to match your route
  };

  return (
    <div className="profile-container">
      <header className="profile-header">
        <nav>
          <a href="/" className="logo">Finoria</a>
          <ul className="nav-links">
            <li><a href="/dashboard">Dashboard</a></li>
            <li><a href="/transactions">Transactions</a></li>
            <li><a href="/inventory">Inventory</a></li>
            <li><a href="/reports">Reports</a></li>
            <li><a href="/settings">Settings</a></li>
            <li><button className="logout-btn" onClick={handleLogout}>Logout</button></li>
          </ul>
        </nav>
      </header>

      <main className="profile-content">
        <h1>My Profile</h1>
        <div className="profile-info">
          <p><strong>Name:</strong> John Doe</p>
          <p><strong>Email:</strong> johndoe@example.com</p>
          <p><strong>Joined:</strong> January 2024</p>
        </div>
        <div className="profile-actions">
          <button className="action-btn" onClick={handleEdit}>Edit Profile</button>
          <button className="action-btn" onClick={handleLogout}>Logout</button>
        </div>
      </main>
    </div>
  );
}

export default Profile;
