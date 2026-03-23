// <!-- Add more price category button -->
// // Add click event listener to the button
// document
//   .querySelector("#add-more-price-category-button-1")
//   .addEventListener("click", (e) => {
//     // Clone an existing form to capture price category and price
//     existing_element = document.querySelector(
//       "#price-category-and-value-section-1",
//     );

//     cloned_section = existing_element.cloneNode(true);

//     // Add cloned element to the section
//     document
//       .querySelector("#outer-section-for-price-category-and-value-1")
//       .append(cloned_section);
//   });

// Get all the available genres from the database

// Add an event listener around document loaded event
document.addEventListener("DOMContentLoaded", async (e) => {
  // Make a request to get all the events data based on user's neighbourhood
  let event_data = await call("/api/get-event-details", null);
  console.log(JSON.stringify(event_data));

  // Loop through each genre and populate the options
  event_data.genres.forEach((element) => {
    // Create an option element
    optionElement = document.createElement("option");
    optionElement.innerText = element.genre_name;
    optionElement.value = element.genre_id;
    document.querySelector("#genre_id").appendChild(optionElement);
  });

  // Load countries drop-down options
  // Get list of countries from database
  let response = await call("/api/get-countries", null);
  console.log(JSON.stringify(response.data.countries));
  // Loop through all the countries
  response.data.countries.forEach((element) => {
    optionElement = document.createElement("option");
    optionElement.innerText = element.country;
    optionElement.value = element.country;
    document.querySelector("#country-dropdown").appendChild(optionElement);
  });

  // Load States drop-down options
  // Get list of States from database
  // Add a change event on country drop down
  document
    .querySelector("#country-dropdown")
    .addEventListener("change", async (evt) => {
      let parameters = {
        country: evt.target.value,
      };
      let response = await call("/api/get-states", parameters);
      console.log(JSON.stringify(response.data.states));
      // Loop through all the states
      response.data.states.forEach((element) => {
        optionElement = document.createElement("option");
        optionElement.innerText = element.state;
        optionElement.value = element.state;
        document.querySelector("#state-dropdown").appendChild(optionElement);
      });
    });

  // Load cities drop-down options
  // Get list of cities from database
  // Add a change event on State drop down
  document
    .querySelector("#state-dropdown")
    .addEventListener("change", async (evt) => {
      let parameters = {
        state: evt.target.value,
        country: document.querySelector("#country-dropdown").value,
      };
      let response = await call("/api/get-cities", parameters);
      console.log(JSON.stringify(response.data.cities));
      // Loop through all the states
      response.data.cities.forEach((element) => {
        optionElement = document.createElement("option");
        optionElement.innerText = element.city;
        optionElement.value = element.city;
        document.querySelector("#city-dropdown").appendChild(optionElement);
      });
    });
});

// Function to call API
async function call(endPoint, parameters) {
  try {
    // Make a GET request to get all the matching events
    // Set query parameters
    let params = null;
    let url = "";
    if (parameters) {
      const params = new URLSearchParams(parameters);
      url = `${endPoint}?${params.toString()}`;
    } else {
      url = `${endPoint}`;
    }

    // Make a GET request to get all the matching events
    const response = await fetch(url);

    // Handle based on status
    if (response.status === 200) {
      // Get response body as text
      const JSONResponse = await response.json();
      // return text body.
      return JSONResponse;
    } else {
      // Throw error
      throw new Error("Error");
    }
  } catch (err) {
    console.log(
      `Error while calling API: ${endPoint} with params: ${parameters}. Error: ${err}`,
    );
    return `error while fetching: ${url}`;
  }
}
