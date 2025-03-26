import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/signin.css"; // We'll create this file for styling
import { Link } from "react-router-dom";


function SignIn() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // Handle form submission
    const handleSignIn = (e) => {
        e.preventDefault();
        // In a real app, you'd make an API call or Firebase auth, etc.
        // For demonstration, we'll just store data in localStorage and navigate to the profile page.

        // Here we store in localStorage (like your existing code):
        localStorage.setItem("email", email);
        localStorage.setItem("password", password);

        // Navigate to profile page
        navigate("/profile");
    };

    // Toggle sign-up vs sign-in can be handled with internal state or separate components
    // For now, we just have a single sign-in form:
    return (
        <div className="sign-in-container">
            <div className="website_title">
                <h1 className="heading1">Finoria</h1>
                <p className="Nice_quote">Your financial journey starts here.</p>
            </div>

            <div className="form-wrapper">
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

                    <button type="submit">
                        Sign In
                    </button>
                    <div className="signup-link">
                        <p>
                            Don’t have an account?
                            <Link to="/signup">Sign Up</Link>
                        </p>

                    </div>
                </form>
            </div>
        </div>
    );
}

export default SignIn;
