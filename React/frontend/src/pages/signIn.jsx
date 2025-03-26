import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/signin.css";

function SignIn() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = (e) => {
    e.preventDefault();
    localStorage.setItem("email", email);
    localStorage.setItem("password", password);
    navigate("/profile");
  };

  return (
    <div className="sign-in-container">
      <div className="form-wrapper">
        <div className="website_title">
          <h1 className="heading1">Finoria</h1>
          <p className="Nice_quote">Your financial journey starts here.</p>
        </div>

        <form onSubmit={handleSignIn}>
          <h2>Sign In</h2>
          <div className="input-group">
            <input
              type="email"
              id="login-email"
              placeholder="Email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              id="login-password"
              placeholder="Password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="remember">
            <label>
              <input type="checkbox" /> Remember me
            </label>
          </div>

          <button type="submit">Sign In</button>

          <div className="signup-link">
            <p>
              Don’t have an account? <Link to="/signup">Sign Up</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignIn;
