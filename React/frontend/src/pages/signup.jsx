import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/signup.css";

function Signup() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Save email & password (demo only — never do this in production)
    localStorage.setItem("email", email);
    localStorage.setItem("password", password);

    navigate("/signin");
  };

  return (
    <div className="signup-container">
      <div className="signup-form-wrapper">
        <div className="website_title">
          <h1 className="heading1">Finoria</h1>
          <p className="Nice_quote">Let’s get you started.</p>
        </div>

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
            Already have an account? <Link to="/signin">Sign In</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Signup;
