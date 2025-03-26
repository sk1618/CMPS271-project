import React, { useEffect, useState } from 'react';
import './profileStyle.css'; 

function Profile() {
  const [userName, setUserName] = useState('Guest');
  const [userInfo, setUserInfo] = useState({
    name: 'John Doe',
    email: 'johndoe@example.com',
    accountType: 'Premium'
  });

  // Check if dark mode is enabled in localStorage
  useEffect(() => {
    if (localStorage.getItem("darkMode") === "enabled") {
      document.body.classList.add("dark-mode");
    }
    const storedUserName = localStorage.getItem("username");
    if (storedUserName) {
      setUserName(storedUserName);
    }

    // Example of dynamically setting user info (you could fetch this from an API)
    // For now, we'll use the static values as shown
    setUserInfo({
      name: 'John Doe',
      email: 'johndoe@example.com',
      accountType: 'Premium'
    });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("username"); // Clear stored user data
    window.location.href = "signin.html"; // Redirect to sign-in page
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

      <section className="profile-content">
        <h1>Welcome to your profile, <span id="username">{userName}</span>!</h1>

        <div className="profile-header">
          <div className="profile-picture">
            <img src="profile-picture.jpg" alt="Profile Image" />
          </div>
          <div className="profile-details">
            <p><strong>Name:</strong> <span id="profile-name">{userInfo.name}</span></p>
            <p><strong>Email:</strong> <span id="profile-email">{userInfo.email}</span></p>
            <p><strong>Account Type:</strong> <span id="profile-type">{userInfo.accountType}</span></p>
          </div>
        </div>

        <div className="profile-actions">
          <a href="editProfile.html" className="action-btn">Edit Profile</a>
          <a href="changePassword.html" className="action-btn">Change Password</a>
        </div>
      </section>
    </div>
  );
}

export default Profile;
