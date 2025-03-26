import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/signup.css"; // 👈 lowercase import to match file name

function Signup() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Save data (test/demo only)
    localStorage.setItem("email", email);
    localStorage.setItem("password", password);

    // Redirect to Sign In page
    navigate("/");
  };

  return (
    <div className="signup-container">
      <div className="signup-form-wrapper">
        <h2>Create Your Account</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              required
              minLength="6"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit">Sign Up</button>

          <p className="signin-link">
            Already have an account? <a href="/">Sign In</a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Signup;
