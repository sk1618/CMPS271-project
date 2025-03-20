/*// Check if dark mode is enabled in localStorage and apply it
if (localStorage.getItem("darkMode") === "enabled") {
	document.body.classList.add("dark-mode");
}

// Fetch username from localStorage
let userName = localStorage.getItem("username") || "Guest";
document.getElementById("username").textContent = userName;

// Logout functionality
document
	.getElementById("logout")
	.addEventListener("click", function (event) {
		event.preventDefault(); // Prevent default link behavior

		// Clear stored user data
		localStorage.removeItem("username");
		localStorage.removeItem("darkMode");

		// Show logout success message
		document.getElementById("logout-message").style.display = "block";
		document.querySelector(".homepage-content h1").style.display = "none";
		document.querySelector(".homepage-content p").style.display = "none";
		document.querySelector(".quick-actions").style.display = "none";

		// Redirect to index.html after 3 seconds
		setTimeout(function () {
			window.location.href = "index.html";
		}, 3000); // 3000 milliseconds = 3 seconds
	});

// Check if the user just logged out
if (sessionStorage.getItem("justLoggedOut") === "true") {
	// Show logout success message
	document.getElementById("logout-message").style.display = "block";
	document.querySelector(".homepage-content h1").style.display = "none";
	document.querySelector(".homepage-content p").style.display = "none";
	document.querySelector(".quick-actions").style.display = "none";

	// Clear the flag
	sessionStorage.removeItem("justLoggedOut");

	// Redirect to index.html after 3 seconds
	setTimeout(function () {
		window.location.href = "index.html";
	}, 3000);
}
*/

console.log("logout.js loaded"); // Check if the script is loaded

document
	.getElementById("logout")
	.addEventListener("click", function (event) {
		console.log("Logout button clicked"); // Check if the button click is detected
		event.preventDefault(); // Prevent default link behavior

		// Clear stored user data
		localStorage.removeItem("username");
		localStorage.removeItem("darkMode");

		// Redirect to sign-in page
		window.location.href = "index.html";
	});