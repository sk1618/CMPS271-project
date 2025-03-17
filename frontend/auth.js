import {backend_url} from "./env.js"
// Function to handle form toggling
function toggleForms() {
    const loginForm = document.getElementById('login-form');
    const signUpForm = document.getElementById('sign-up-form');
    
    if (loginForm.style.display === 'none') {
        loginForm.style.display = 'block';
        signUpForm.style.display = 'none';
    } else {
        loginForm.style.display = 'none';
        signUpForm.style.display = 'block';
    }
}
document.querySelectorAll(".signup-toggle")
  .forEach(item => item.addEventListener("click", toggleForms));

// Function to handle sign-up form submission
async function handleSignUp(event) {
    event.preventDefault();
    console.log("hello")
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    
    // Extract username from email (or you could add a username field)
    const username = email.split('@')[0];
    
    // Show spinner, hide button text
    document.getElementById('signup-spinner').style.display = 'inline-block';
    document.getElementById('signup-button-text').style.display = 'none';
    
    try {
        const response = await fetch(`${backend_url}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                username: username,
                email: email, 
                password: password 
            }),
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Registration successful
            alert('Registration successful! Please sign in.');
            toggleForms(); // Switch to sign-in form
        } else {
            // Registration failed
            alert(`Registration failed: ${data.detail}`);
        }
    } catch (error) {
        console.error('Error during registration:', error);
        alert('An error occurred during registration. Please try again.');
    } finally {
        // Hide spinner, show button text
        document.getElementById('signup-spinner').style.display = 'none';
        document.getElementById('signup-button-text').style.display = 'inline';
    }
}

// Function to handle sign-in form submission
async function handleSignIn(event) {
    event.preventDefault();
    
    const email = document.getElementById('login-email').value;
    // Extract username from email (since our backend expects username)
    const username = email.split('@')[0];
    const password = document.getElementById('login-password').value;
    
    // Show spinner, hide button text
    document.getElementById('login-spinner').style.display = 'inline-block';
    document.getElementById('login-button-text').style.display = 'none';
    
    try {
        // For OAuth2 password flow, we need to use URLSearchParams for form data
        const formData = new URLSearchParams();
        formData.append('username', username);
        formData.append('password', password);
        
        const response = await fetch(`${backend_url}/login`, {
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
            window.location.href = '/dashboard.html'; // Change this to your dashboard URL
        } else {
            // Login failed
            alert('Login failed: ' + (data.detail || 'Invalid credentials'));
        }
    } catch (error) {
        console.error('Error during sign in:', error);
        alert('An error occurred during sign in. Please try again.');
    } finally {
        // Hide spinner, show button text
        document.getElementById('login-spinner').style.display = 'none';
        document.getElementById('login-button-text').style.display = 'inline';
    }
}

// Function to check if user is already logged in
function checkAuthStatus() {
    const token = localStorage.getItem('access_token');
    if (token) {
        // User is already logged in, redirect to dashboard
        window.location.href = '/dashboard.html'; // Change this to your dashboard URL
    }
}

// Add event listeners when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is already logged in
    checkAuthStatus();
    
    // Add event listeners to forms
    document.getElementById('login-form').addEventListener('submit', handleSignIn);
    document.getElementById('sign-up-form').addEventListener('submit', handleSignUp);
});

// Function to toggle password visibility
function togglePasswordVisibility(inputId) {
    const passwordInput = document.getElementById(inputId);
    const icon = document.querySelector(`#${inputId} + i`);
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}