// <!-- Button for Submit & Login -->
// Get button element
const submitAndLoginButton = document.querySelector(
  "article#set-new-credentials form button",
);

// Add click event listener to button
submitAndLoginButton.addEventListener("click", () => {
  // Network request for registering new user
  fetch(url).then((response) => {
    // If statement to check response status
    if (!response.ok) {
      // Throw error
      throw new Error(`HTTP error: ${response.status}`);
    }
  });
});
