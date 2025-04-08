import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/homePageStyle.css";
import logo from "../assets/FinoriaLogo.png";
import budget3 from "../assets/budget3.png";
import budget4 from "../assets/future.png";
import contact from "../assets/contactus.png";

const HomePage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState("Guest");
  

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    const storedUserId = localStorage.getItem("currentUserId");
    const storedUsername = localStorage.getItem("username") || "Guest";
    setIsLoggedIn(loggedIn);
    setUserId(storedUserId);
    setUsername(storedUsername);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/signin";
  };

  return (
    <div>
      <section id="main">
        <div className="hero-text">
          Budget Smart, Live Better
          <br />
          With Finoria
        </div>
        <div className="image-main">
          <a href="/homePage">
            <img src={logo} alt="Budget 1" />
          </a>
          <div
            className="scroll-down"
            onClick={() => (window.location.href = "#about")}
          >
            ↓
          </div>
        </div>
      </section>

      <section id="about">
        <div className="about-container">
          <div className="about-text">
            <h2>About Us</h2>
            <p>
              Finoria helps you track your expenses, visualize your spending,
              and set realistic financial goals—all in one place.
            </p>
            <a href="/About" className="about-button">
              Learn More!
            </a>
          </div>
          <div className="image-about">
            <img src={budget3} alt="About Finoria" />
          </div>
          <div
            className="scroll-down"
            onClick={() => (window.location.href = "#features")}
          >
            ↓
          </div>
        </div>
      </section>

      <section id="features">
        <div className="internships-container">
          <div className="image-internships">
            <img src={budget4} alt="Features" />
          </div>
          <div className="internships-text">
            <p>
              Track every transaction, manage inventory, and monitor your budget
              in real-time with easy-to-use tools.
            </p>
            <div className="button-container">
              <Link to="/Transaction">
                <button>Add Transaction</button>
              </Link>
              <Link to="/Inventory">
                <button>View Inventory</button>
              </Link>
            </div>
          </div>
          <div
            className="scroll-down"
            onClick={() => (window.location.href = "#contact")}
          >
            ↓
          </div>
        </div>
      </section>

      <section id="contact">
        <div className="qas-container">
          <div className="image-qas">
            <img src={contact} alt="Contact Us" />
          </div>
          <div className="qas-text">
            <p>
              Have questions or need help? Reach out and our support team will
              be happy to assist you.
            </p>
            <div className="button-container">
             <Link to="/teamSection#email">
                <button>Contact us!</button>
              </Link>
            </div>
          </div>
          <div
            className="scroll-down"
            onClick={() => (window.location.href = "#main")}
          >
            ↑
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
