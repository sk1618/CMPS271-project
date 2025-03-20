document.getElementById("login-form").addEventListener("submit", async function (event) {
    event.preventDefault();
    await login();
});

async function login() {
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    try {
        const response = await fetch("http://127.0.0.1:8000/login/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: email,  // FastAPI expects username; using email for login
                password: password
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        if (data.access_token) {
            localStorage.setItem("token", data.access_token);
            alert("Login successful!");
        } else {
            alert("Login failed: No access token received");
        }
    } catch (error) {
        alert("Login failed: " + error.message);
    }
}

async function getProtectedData() {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("No token found, please login.");
        return;
    }

    try {
        const response = await fetch("http://127.0.0.1:8000/protected/", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        document.getElementById("protected-data").textContent = JSON.stringify(data, null, 2);
    } catch (error) {
        alert("Failed to fetch protected data: " + error.message);
    }
}

function toggleForms() {
    const loginForm = document.getElementById("login-form");
    const signUpForm = document.getElementById("sign-up-form");

    if (loginForm.style.display === "none") {
        loginForm.style.display = "block";
        signUpForm.style.display = "none";
    } else {
        loginForm.style.display = "none";
        signUpForm.style.display = "block";
    }
}

document.getElementById('login-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const button = document.getElementById('login-button');
    const buttonText = document.getElementById('login-button-text');
    const spinner = document.getElementById('login-spinner');

    button.disabled = true;
    buttonText.textContent = 'Signing In...';
    spinner.style.display = 'inline-block';

    // Simulate form submission
    setTimeout(() => {
        button.disabled = false;
        buttonText.textContent = 'Sign In';
        spinner.style.display = 'none';
        alert('Sign In Successful!');
    }, 2000);
});

function togglePasswordVisibility(inputId) {
    const passwordInput = document.getElementById(inputId);
    const toggleIcon = document.getElementById('toggle-password');

    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleIcon.classList.remove('fa-eye');
        toggleIcon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        toggleIcon.classList.remove('fa-eye-slash');
        toggleIcon.classList.add('fa-eye');
    }
}