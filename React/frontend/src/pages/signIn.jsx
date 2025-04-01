import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/signin.css";

function SignIn() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  async function handleSignIn() {
    // Extract username from email (since our backend expects username)
    const username = email.split('@')[0];  
    try {
        // For OAuth2 password flow, we need to use URLSearchParams for form data
        const formData = new URLSearchParams();
        formData.append('username', username);
        formData.append('password', password);
        
        const response = await fetch(`http://localhost:8000/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData,
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Login successful
            // Store the token and user info
            localStorage.setItem('access_token', data.access_token);
            localStorage.setItem('username', data.username);
            localStorage.setItem('email', data.email);
            
            // Redirect to dashboard or home page
            window.location.href = 'frontend/dashboard.html'; // Change this to your dashboard URL
        } else {
            // Login failed
            alert('Login failed: ' + (data.detail || 'Invalid credentials'));
        }
    } catch (error) {
        console.error('Error during sign in:', error);
        alert('An error occurred during sign in. Please try again.');
    }
}
  const handleSubmit = (e) => {
    e.preventDefault();
    handleSignIn();
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

        <form onSubmit={handleSubmit}>
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
