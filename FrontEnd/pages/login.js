// Selecting DOM elements
const form = document.querySelector(".form-login");
const logEmail = document.querySelector("#login-email");
const logPassword = document.querySelector("#login-password");
const submitBtn = document.querySelector(".submitbtn");
const spanWrongCredentials = document.querySelector(".wrong-credentials");

// Adding a submit event listener to the login form
form.addEventListener("submit", async (event) => {
  event.preventDefault(); // Prevent the default form submission behavior

  // Regular expression to validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Check if the entered email is in a valid format
  if (!emailRegex.test(logEmail.value)) {
    alert("Invalid email address");
    return false; // Stops form submission if the email is invalid
  }

  // Creating an object with email and password from the form inputs
  const data = {
    email: logEmail.value,
    password: logPassword.value,
  };

  try {
    // Sending a POST request to the server for user login
    const response = await fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data), // Sending user data in JSON format
    });

    if (response.status === 200) {
      // If the login is successful (status code 200), extract the JSON data
      const userData = await response.json();
      localStorage.setItem("token", userData.token); // Store the token in local storage
      document.location.href = "../index.html"; // Redirect to the index.html page
    } else {
      // If the login fails, throw an error
      throw new Error("Wrong password!");
    }
  } catch (error) {
    console.error(error);
    spanWrongCredentials.style.display = "block"; // Display an error message for wrong credentials
  }
});
