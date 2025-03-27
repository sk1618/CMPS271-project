import React from "react";
import "../styles/profile.css";
import { useNavigate } from "react-router-dom";

function Profile() {
  const navigate = useNavigate();

  const handleEdit = () => {
    alert("Edit profile clicked!");
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/signin");
  };

  return (
    <div className="profile-container">
       <br /><br /><br />
      <main className="profile-content">
        <h1>My Profile</h1>

        <div className="profile-main">
          <div className="profile-info">
            <p><strong>Name:</strong> John Doe</p>
            <p><strong>Email:</strong> johndoe@example.com</p>
            <p><strong>Joined:</strong> January 2024</p>
          </div>

          <div className="profile-actions">
            <button className="action-btn" onClick={handleEdit}>Edit Profile</button>
            <button className="action-btn" onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Profile;

