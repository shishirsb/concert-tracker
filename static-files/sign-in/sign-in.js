// Sign-in with Google

// Function to convert the JSON Web Token (JWT) credential into just plain JSON.
// The below code snippets were directly taken from Google's official documentation
function decodeJWT(token) {
  let base64Url = token.split(".")[1];
  let base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  let jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join(""),
  );
  return JSON.parse(jsonPayload);
}

// JavaScript callback function handler named handleCredentialResponse to receive user sign-in credential from Google.
// The below code snippets were directly taken from Google's official documentation.
function handleCredentialResponse(response) {
  console.log("Encoded JWT ID token: " + response.credential);

  const responsePayload = decodeJWT(response.credential);

  // Redirect user to homepage
  window.location.href = "/static-files/home/home.html";

  // document.href = console.log("Decoded JWT ID token fields:");
  // console.log("  Full Name: " + responsePayload.name);
  // console.log("  Given Name: " + responsePayload.given_name);
  // console.log("  Family Name: " + responsePayload.family_name);
  // console.log("  Unique ID: " + responsePayload.sub);
  // console.log("  Profile image URL: " + responsePayload.picture);
  // console.log("  Email: " + responsePayload.email);
}

// Sign-in Logic

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

//
