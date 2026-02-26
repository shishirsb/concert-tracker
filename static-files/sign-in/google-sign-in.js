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
  // Decode the Encoded response from Google.
  const responsePayload = decodeJWT(response.credential);

  //Create POST data
  const body = {
    username: responsePayload.email,
    unique_id: responsePayload.sub,
  };

  // Send a POST request after user signs in with google.
  fetch("/api/google-signin", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })
    .then(async (response) => {
      const JSONResponse = await response.json();
      return JSONResponse;
      // if (response.text() === "success") {
      //   window.location.href = "/home/home.html";
      // }
    })
    .then((json_data) => {
      console.log(`Server response: ${json_data.username}`);
      if (json_data.message === "google_signin_was_successful") {
        // toggle display for all the user-authentication buttons (sign-in, sign-up....)
        hide_user_auth_buttons();
      } else {
        window.alert(json_data.message);
      }
    })
    .catch((error) => {
      console.log(`Could not fetch: ${error}`);
    });

  // document.href = console.log("Decoded JWT ID token fields:");
  // console.log("  Full Name: " + responsePayload.name);
  // console.log("  Given Name: " + responsePayload.given_name);
  // console.log("  Family Name: " + responsePayload.family_name);
  // console.log("  Unique ID: " + responsePayload.sub);
  // console.log("  Profile image URL: " + responsePayload.picture);
  // console.log("  Email: " + responsePayload.email);
}

// ------------------------------------------------------------------------------
// Function to hide user auth buttons
function hide_user_auth_buttons() {
  try {
    // Get google-sign-in elements
    const googleSignInElements = document.querySelectorAll(".g_id_signin");

    // Get all the sign-up forms
    const signUpForms = document.querySelectorAll(".sign-up");

    // Get all the sign-in forms
    const signInForms = document.querySelectorAll(".sign-in-form");

    // Get the sign-out button
    const signOutButton = document.querySelector("button#sign-out");

    // Get the sign-in button
    const signInButton = document.querySelector("button#sign-in");

    // Toggle class hidden for all the google-sign-in elements
    for (const element of googleSignInElements) {
      element.classList.add("hidden");
    }

    // Toggle class hidden for all the sign-up form elements
    for (const element of signUpForms) {
      element.classList.add("hidden");
    }

    // Toggle class hidden for all the sign-in form elements
    for (const element of signInForms) {
      element.classList.add("hidden");
    }

    // Display sign-out button
    signOutButton.classList.remove("hidden");

    if (signInButton) {
      // Toggle class hidden for sign-in button
      signInButton.classList.add("hidden");
    } else {
      console.log(`signInButton was not found.`);
    }
  } catch (err) {
    console.log(`Error in hide_user_auth_buttons function: ${err}`);
  }
}
