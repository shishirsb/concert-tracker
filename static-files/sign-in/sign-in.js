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
      const JSONResponse = await response.json();
      // return the response.
      return JSONResponse;
      // }
    })
    // Get the text reponse
    .then((json_data) => {
      // Print the server reponse to console.
      console.log(`Server response: ${json_data.username}`);
      // Check if reponse is SUCCESS
      if (json_data.message === "SUCCESS") {
        // reroute user to the home page
        // window.location.href = "/static-files/home/home.html";
        toggle_display_for_user_auth_buttons();
        return;
        // Check if reponse is FAIL:USERNAME_NOT_FOUND
      } else if (json_data.message === "USERNAME_NOT_FOUND") {
        // alert user about the status
        window.alert("The username seems to be incorrect. Please try again.");
        return;
        // Check if reponse is FAIL:PASSWORD_NOT_MATCHING
      } else if (json_data.message === "PASSWORD_NOT_CORRECT") {
        // alert user about the status
        window.alert("The password seems to be incorrect. Please try again.");
        return;
      } else {
        // alert user about the status
        window.alert(json_data.message);
        return;
      }
    })
    .catch((error) => {
      console.log(`Could not fetch: ${error}`);
    });
});
// --------------------------------------------------------------------

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
      const JSONResponse = await response.json();
      return JSONResponse;
      // if (response.text() === "success") {
      //   window.location.href = "/home/home.html";
      // }
    })
    .then((json_data) => {
      console.log(`Server response: ${json_data.username}`);
      if (json_data.message === "SUCCESS_FROM_NEW_SERVER") {
        // toggle display for all the user-authentication buttons (sign-in, sign-up....)
        toggle_display_for_user_auth_buttons();
      } else {
        window.alert(json_data.message);
      }
    })
    .catch((error) => {
      console.log(`Could not fetch: ${error}`);
    });
});

// --------------------------------------------------------
// <!-- Second CTA Sign-up form article -->

// Register button functionality

//Listen for click event on the Register button

//Get the register form
const registerForm_2 = document.querySelector("form#register-user-form-2");

// Add a listner for Submit action on the register form
registerForm_2.addEventListener("submit", async (e) => {
  //Prevent default action
  e.preventDefault();

  // Get the form input fields
  const newUsername_field = document.querySelector(
    "form#register-user-form-2 input#new-username",
  );
  const newPassword_field = document.querySelector(
    "form#register-user-form-2 input#new-password",
  );
  const confirmPassword_field = document.querySelector(
    "form#register-user-form-2 input#confirm-password",
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
      const JSONResponse = await response.json();
      return JSONResponse;
      // if (response.text() === "success") {
      //   window.location.href = "/home/home.html";
      // }
    })
    .then((json_data) => {
      console.log(`Server response: ${json_data.username}`);
      if (json_data.message === "SUCCESS_FROM_NEW_SERVER") {
        // toggle display for all the user-authentication buttons (sign-in, sign-up....)
        toggle_display_for_user_auth_buttons();
      } else {
        window.alert(json_data.message);
      }
    })
    .catch((error) => {
      console.log(`Could not fetch: ${error}`);
    });
});

// ----------------------------------------------------------------

// Authenticate session with cookies
document.addEventListener("DOMContentLoaded", (evt) => {
  // Make GET request
  fetch("/api/auth-session")
    .then(async (response) => {
      // Get only the response status
      const status = response.status;
      // Handle based on status
      if (status === 200) {
        // Get response body as text
        const textResponse = await response.text();
        // return text body.
        return textResponse;
      } else {
        // Throw error
        throw new Error("Could not authenticate token.");
      }
    })
    .then((text) => {
      // toggle display for all the user-authentication buttons (sign-in, sign-up....)
      toggle_display_for_user_auth_buttons();

      // Log server response to console
      console.log(`Server response: ${text}`);
    })
    .catch((error) => {
      // Log Error to console
      console.log(`Error: ${error}`);
    });
});

// -------------------------------------------------------------
// Sign-out button feature
// Get the sign-out button
const signOutButton = document.querySelector("button#sign-out");

// Add Click event handler for sign-out button
signOutButton.addEventListener("click", (e) => {
  // Remove default action
  e.preventDefault();

  // Make GET request to delete cookies
  fetch("/api/logout")
    .then(async (response) => {
      // Get only the response status
      const status = response.status;
      // Handle based on status
      if (status === 200) {
        // Get response body as text
        const textResponse = await response.text();
        // return text body.
        return textResponse;
      } else {
        // Throw error
        throw new Error("Unsuccessfull logout");
      }
    })
    .then((text) => {
      // toggle display for all the user-authentication buttons (sign-in, sign-up....)
      toggle_display_for_user_auth_buttons();

      // Log server response to console
      console.log(`Server response: ${text}`);
    })
    .catch((error) => {
      // Log Error to console
      console.log(`Error: ${error}`);
    });
});

// --------------------------------------------------------
// Create and use a function for toggling hidden class for user-auth buttons.
function toggle_display_for_user_auth_buttons() {
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
    element.classList.toggle("hidden");
  }

  // Toggle class hidden for all the sign-up form elements
  for (const element of signUpForms) {
    element.classList.toggle("hidden");
  }

  // Toggle class hidden for all the sign-in form elements
  for (const element of signInForms) {
    element.classList.add("hidden");
  }

  // Toggle class hidden for sign-out button
  signOutButton.classList.toggle("hidden");

  // Toggle class hidden for sign-out button
  signInButton.classList.toggle("hidden");
}

// ------------------------------------------
// <!-- Headline items -->
// Display headlines with javascript.
// Create a document load listener
document.addEventListener("DOMContentLoaded", async (evt) => {
  //Get the container element
  const containerElement = document.querySelector(
    "header.page article.headline",
  );

  // Initialize an empty list
  let headlinesList = [];

  // Get headlines by making a GET request
  await fetch("/api/headlines")
    .then(async (response) => {
      // Get only the response status
      const status = response.status;
      // Handle based on status
      if (status === 200) {
        // Get response body as text
        const JSONResponse = await response.json();
        // return text body.
        return JSONResponse;
      } else {
        // Throw error
        throw new Error("Error");
      }
    })
    .then((JSONResponse) => {
      // Get headlines
      headlinesList = JSONResponse.headlines;
    })
    .catch((error) => {
      // Log Error to console
      console.log(`Error: ${error}`);
    });

  // const headlinesList = [
  //   "A Grammy-winning artist just added India to their tour list.",
  //   "Midnight ticket drops are driving fans into a frenzy.",
  //   "An iconic 90s rock band is rumored to reunite in Mumbai.",
  //   "Festival season might start earlier than expected this year.",
  //   "VIP passes for a Bengaluru gig sold out in under 10 minutes.",
  // ];

  for (const item of headlinesList) {
    // Create a p element inside the container.
    const pElement = document.createElement("p");
    pElement.classList.add("headline-item");
    pElement.innerText = item;
    containerElement.append(pElement);
  }

  // Add class active to only first element
  const firstHeaderItem = document.querySelector(
    "header.page article.headline p.headline-item",
  );
  firstHeaderItem.classList.add("active");

  // ------------------------------
  // <!-- Headline -->

  // Trigger a function every 5 seconds

  //  Get all the headline items
  const headlineItems = document.querySelectorAll(
    "header.page article.headline p.headline-item",
  );

  // initialize an index to 0
  let index = 0;

  // Define a function to switch between headline items
  function switchHeadline() {
    // Remove active class from current element.
    headlineItems[index].classList.remove("active");

    // Get the next index. Reset to 0 at the end of list.
    index = (index + 1) % headlineItems.length;

    // Add active class to the next item
    headlineItems[index].classList.add("active");
  }

  window.setInterval(switchHeadline, 4000);
});
// ----------------------------------------------------

// ----------------------------------------------------
// <!-- Trending Preview -->
// Get event details.
// Create a document load listener
document.addEventListener("DOMContentLoaded", async (evt) => {
  //Capture the filter data on page load
  const citySelector = document.querySelector("#city-selector");
  const city = citySelector.value;

  // Initialize events list
  let events = [];

  // Make a GET request to get all the matching events
  // Set query parameters
  const params = new URLSearchParams();
  params.set("city", city);

  // Make a GET request to get all the matching events
  await fetch(`/api/concert-events?${params.toString()}`)
    .then(async (response) => {
      // Get only the response status
      const status = response.status;
      // Handle based on status
      if (status === 200) {
        // Get response body as text
        const JSONResponse = await response.json();
        // return text body.
        return JSONResponse;
      } else {
        // Throw error
        throw new Error("Error");
      }
    })
    .then((JSONResponse) => {
      // Get headlines
      events = JSONResponse.events;
    })
    .catch((error) => {
      // Log Error to console
      console.log(`Error: ${error}`);
    });

  // Insert events as separate cards.

  // Get the container element of event cards
  const containerEventCards = document.querySelector(
    "section.trending-preview",
  );

  // Get the first html template
  const eventCardTemplate = document.querySelector("article.event-card");

  // Clear old cards.
  containerEventCards.innerHTML = "";

  // For each event
  for (const event of events) {
    // Greate a clone
    const cloneCard = eventCardTemplate.cloneNode(true);
    // Insert data
    const title = cloneCard.querySelector("h2");
    const image = cloneCard.querySelector("img");
    title.innerText = event.title;
    image.setAttribute("src", event.thumbnail);
    image.setAttribute("alt", event.title);

    containerEventCards.append(cloneCard);
    cloneCard.classList.remove("hidden");
  }
});
