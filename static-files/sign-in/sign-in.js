// Sign-in with Google

// Regular Sign-in Logic

// Get the sign-in button
const signInButton = document.querySelector("button#sign-in-button");

// Add click event listener to sign-in button
signInButton.addEventListener("click", (e) => {
  // Handle sign-in of user
  //Prevent default action
  e.preventDefault();

  // Get the form input fields
  const usernameField = document.querySelector("input#username");
  const passwordField = document.querySelector("input#password");

  // validate input fields
  if (usernameField.value === "") {
    window.alert("Please enter your Username");
    return;
  }

  if (passwordField.value === "") {
    window.alert("Please enter your Password");
    return;
  }

  const body = {
    usernameField: usernameField.value,
    passwordField: passwordField.value,
  };

  //Send a POST request to sign-in user.
  // Set endpoint url to call, specify method, headers and body
  fetch("/api/signin", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })
    // Retrieve response promise
    .then(async (response) => {
      // Get response body as a string
      const textResponse = await response.text();
      // return the response.
      return textResponse;
      // }
    })
    // Get the text reponse
    .then((text) => {
      // Print the server reponse to console.
      console.log(`Server response: ${text}`);
      // Check if reponse is SUCCESS
      if (text === "SUCCESS") {
        // reroute user to the home page
        window.location.href = "/static-files/home/home.html";
        return;
        // Check if reponse is FAIL:USERNAME_NOT_FOUND
      } else if (text === "FAIL:USERNAME_NOT_FOUND") {
        // alert user about the status
        window.alert("The username seems to be incorrect. Please try again.");
        return;
        // Check if reponse is FAIL:PASSWORD_NOT_MATCHING
      } else if (text === "FAIL:PASSWORD_NOT_MATCHING") {
        // alert user about the status
        window.alert("The password seems to be incorrect. Please try again.");
        return;
      } else {
        // alert user about the status
        window.alert(text);
        return;
      }
    })
    .catch((error) => {
      console.log(`Could not fetch: ${error}`);
    });
});
// --------------------------------------------------------------------
//

// Register button functionality

//Listen for click event on the Register button

//Get the register form
const registerForm = document.querySelector("form#register-user-form");

// Add a listner for Submit action on the register form
registerForm.addEventListener("submit", async (e) => {
  //Prevent default action
  e.preventDefault();

  // Get the form input fields
  const newUsername_field = document.querySelector("input#new-username");
  const newPassword_field = document.querySelector("input#new-password");
  const confirmPassword_field = document.querySelector(
    "input#confirm-password",
  );

  // validate input fields
  if (newUsername_field.value === "") {
    window.alert("Please enter a new Username");
    return;
  }

  if (newPassword_field.value === "") {
    window.alert("Please enter a new Password");
    return;
  }

  if (confirmPassword_field.value !== newPassword_field.value) {
    window.alert("The passwords are not matching.");
    return;
  }

  //Get form data from the form fields.
  const newUsername_value = newUsername_field.value;
  const newPassword_value = newPassword_field.value;
  const confirmPassword_value = confirmPassword_field.value;

  const body = {
    newUsername: newUsername_value,
    newPassword: newPassword_value,
    confirmPassword: confirmPassword_value,
  };

  //127.0.0.1:8000/signup
  // https://concert-tracker-nw6r.onrender.com/api/signup
  //send a POST request to register user.
  fetch("/api/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })
    .then(async (response) => {
      const textResponse = await response.text();
      return textResponse;
      // if (response.text() === "success") {
      //   window.location.href = "/home/home.html";
      // }
    })
    .then((text) => {
      console.log(`Server response: ${text}`);
      if (text === "SUCCESS_FROM_NEW_SERVER") {
        window.location.href = "/static-files/home/home.html";
      } else {
        window.alert(text);
      }
    })
    .catch((error) => {
      console.log(`Could not fetch: ${error}`);
    });
});

// --------------------------------------------------------
// Auto-login feature
