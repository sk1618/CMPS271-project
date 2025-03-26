console.log("logout.js loaded");

document.addEventListener("DOMContentLoaded", function () {
	const logoutBtn = document.getElementById("logout");
	if (!logoutBtn) {
		console.warn("Logout button not found.");
		return;
	}

	logoutBtn.addEventListener("click", function (event) {
		console.log("Logout button clicked");
		event.preventDefault();

		// Clear localStorage
		localStorage.removeItem("username");
		localStorage.removeItem("darkMode");
		localStorage.removeItem("token");

		// Try redirecting explicitly
		window.location.replace("/frontend/signin.html");
	});
});

