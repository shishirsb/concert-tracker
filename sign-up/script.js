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

  //send a POST request to register user.
  fetch("http://127.0.0.1:8000/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })
    .then(async (response) => {
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }
      const textResponse = await response.text();
      return textResponse;
      // if (response.text() === "success") {
      //   window.location.href = "/home/home.html";
      // }
    })
    .then((text) => {
      console.log(`Server response: ${text}`);
      if (text === "SUCCESS_FROM_NEW_SERVER") {
        window.location.href = "/home/home.html";
      } else {
        window.alert(text);
      }
    })
    .catch((error) => {
      console.log(`Could not fetch: ${error}`);
    });
});

// Development flow:
// -----------------
// -> Add task in Todoist
// -> (Optional) Describe task to chatgpt and read through the response.
// -> (Opt.) Search for solution from documention/source
// -> (Opt.) Use solution from the documentation
// -> Implement solution
// -> Test solution
// -> (Optional) Debug the code for any errors.
// -> (Optional) Describe problem to ChatGPT and make corrections.
