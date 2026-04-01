// Get all the available genres from the database

// Add an event listener around document loaded event
document.addEventListener("DOMContentLoaded", async (e) => {
  // Clear all form inputs
  document.querySelector(".add_event_form").reset();
  // Make a request to get all the events data based on user's neighbourhood
  // Set parameters
  let event_data = await call("/api/get-all-event-details", null);
  // console.log(JSON.stringify(event_data));

  // Loop through each genre and populate the options
  event_data.genres.forEach((element) => {
    // Create an option element
    optionElement = document.createElement("option");
    optionElement.innerText = element.genre_name;
    optionElement.value = element.genre_id;
    document.querySelector("#genre_id").appendChild(optionElement);
  });

  // Loop through each genre and populate the options
  event_data.categories.forEach((element) => {
    // Create an option element
    optionElement = document.createElement("option");
    optionElement.innerText = element.category_name;
    optionElement.value = element.category_id;
    document.querySelector("#category_id").appendChild(optionElement);
  });

  // Populate artists in main artist drop down
  // Loop through artists in event_data
  event_data.artists.forEach((element) => {
    // Create option element
    optionElement = document.createElement("option");
    optionElement.innerText = element.artist_name;
    optionElement.value = element.artist_id;
    document.querySelector("#artist_id").appendChild(optionElement);
  });

  // Load countries drop-down options
  // Get list of countries from database
  let response = await call("/api/get-countries", null);

  // Clear existing options
  // document.querySelector("#country-dropdown").innerHTML = "";

  // Loop through all the countries and add country to drop-down
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

      // Loop through all the cities
      response.data.cities.forEach((element) => {
        optionElement = document.createElement("option");
        optionElement.innerText = element.city;
        optionElement.value = element.city;
        document.querySelector("#city-dropdown").appendChild(optionElement);
      });
    });

  // Main artist add/remove secction
  document
    .querySelector(".add-artist-button-in-choose-or-add-artist-section")
    .addEventListener("click", (evt) => {
      // Pull up a form to get artist details
      document
        .querySelector(".add-artist-form-section")
        .classList.remove("hidden");
    });

  document
    .querySelector(".close-button-in-add-artist-form-section")
    .addEventListener("click", (evt) => {
      // hide the add artist form section
      document
        .querySelector(".add-artist-form-section")
        .classList.add("hidden");
    });

  // <!-- Submit button  -->
  // Submit artist button event
  document
    .querySelector(".add-artist-form-section")
    .addEventListener("submit", async (evt) => {
      // Prevent default form submission
      evt.preventDefault();

      // Collect the form field values.
      const artist_name = document.querySelector(
        ".artist-name-in-add-artist-form-section",
      ).value;

      const artist_image_url = document.querySelector(
        ".artist_image_url-in-add-artist-form-section",
      ).value;

      const artist_description = document.querySelector(
        ".artist_description-in-add-artist-form-section",
      ).value;

      const artist_position = document.querySelector(
        ".artist_position-in-add-artist-form-section",
      ).value;

      const parameters = {
        artist_name: artist_name,
        artist_image_url: artist_image_url,
        artist_description: artist_description,
        artist_position: artist_position,
      };

      // Send POST request to add artist.
      const response = await call("/api/add-artist", parameters);

      if (response.message === "success") {
        // Display sucess message
        let spanElement = document.createElement("span");
        spanElement.innerText = "Artist added successfully!";

        document
          .querySelector(".choose-or-add-artist-section")
          .appendChild(spanElement);

        // Clear form and Close the add artist form
        document.querySelector(".add-artist-form-section").reset();

        document
          .querySelector(".add-artist-form-section")
          .classList.add("hidden");

        // Add artist in artist drop-down
        // Create option element
        optionElement = document.createElement("option");
        optionElement.innerText = response.artist_added.artist_name;
        optionElement.value = response.artist_added.artist_id;
        document.querySelector("#artist_id").appendChild(optionElement);
      }
    });

  // ---------------------
  // Get the add genre form
  let add_genre_form = document.querySelector(".add-genre-form-section");
  // <!-- Add genre button  -->
  document
    .querySelector(".add-genre-button-in-select-or-add-genre-section")
    .addEventListener("click", (evt) => {
      // Pull up a form to get genre details
      document
        .querySelector(".add-genre-form-section")
        .classList.remove("hidden");
    });

  document
    .querySelector(".close-button-in-add-genre-form-section")
    .addEventListener("click", (evt) => {
      // hide the add genre form section
      document.querySelector(".add-genre-form-section").classList.add("hidden");
    });

  // Submit genre button event
  document
    .querySelector(".add-genre-form-section")
    .addEventListener("submit", async (evt) => {
      // Prevent default form submission
      evt.preventDefault();

      // Collect the form field values.
      const genre_name = document.querySelector(
        ".genre_name-in-add-artist-form-section",
      ).value;

      const genre_image_url = document.querySelector(
        ".genre_image_url-in-add-artist-form-section",
      ).value;

      const genre_description = document.querySelector(
        ".genre_description-in-add-artist-form-section",
      ).value;

      const parameters = {
        genre_name: genre_name,
        genre_image_url: genre_image_url,
        genre_description: genre_description,
      };

      // Send POST request to add artist.
      const response = await call("/api/add-genre", parameters);

      if (response.message === "success") {
        // Display success message
        let spanElement = document.createElement("span");
        spanElement.innerText = "Genre has been added successfully!";

        document
          .querySelector(".select-or-add-genre-section")
          .appendChild(spanElement);

        // Clear form and Close the add genre form
        document.querySelector(".add-genre-form-section").reset();

        document
          .querySelector(".add-genre-form-section")
          .classList.add("hidden");

        // Add genre in artist drop-down
        // Create option element
        optionElement = document.createElement("option");
        optionElement.innerText = response.genre_added.genre_name;
        optionElement.value = response.genre_added.genre_id;
        document.querySelector("#genre_id").appendChild(optionElement);
      }
    });

  // ---------------------
  // Get the add genre form
  // let add_genre_form = document.querySelector(".add-genre-form-section");
  // <!-- Button for adding new category  -->
  document
    .querySelector(".add-category-button-in-select-or-add-category-section")
    .addEventListener("click", (evt) => {
      // Pull up a form to get genre details
      document
        .querySelector(".add-category-form-section")
        .classList.remove("hidden");
    });

  document
    .querySelector(".close-button-in-add-category-form-section")
    .addEventListener("click", (evt) => {
      // hide the add genre form section
      document
        .querySelector(".add-category-form-section")
        .classList.add("hidden");
    });

  // <!-- Submit button in add new category form -->
  document
    .querySelector(".add-category-form-section")
    .addEventListener("submit", async (evt) => {
      // Prevent default form submission
      evt.preventDefault();

      // Collect the form field values.
      const category_name = document.querySelector(
        ".category_name-in-add-category-form-section",
      ).value;

      const category_image_url = document.querySelector(
        ".category_image_url-in-add-category-form-section",
      ).value;

      const category_description = document.querySelector(
        ".category_description-in-add-category-form-section",
      ).value;

      const parameters = {
        category_name: category_name,
        category_image_url: category_image_url,
        category_description: category_description,
      };

      // Send POST request to add artist.
      const response = await call("/api/add-category", parameters);

      if (response.message === "success") {
        // Display success message
        let spanElement = document.createElement("span");
        spanElement.innerText = "Category has been added successfully!";

        document
          .querySelector(".select-or-add-category-section")
          .appendChild(spanElement);

        // Clear form and Close the add category form
        document.querySelector(".add-category-form-section").reset();

        document
          .querySelector(".add-category-form-section")
          .classList.add("hidden");

        // Add category in artist drop-down
        // Create option element
        optionElement = document.createElement("option");
        optionElement.innerText = response.category_added.category_name;
        optionElement.value = response.category_added.category_id;
        document.querySelector("#category_id").appendChild(optionElement);
      }
    });
  // --------------------
  // <!-- Add event form  -->
  // Add click event listener to add event button

  document
    .querySelector(".add_event_form")
    .addEventListener("submit", async (evt) => {
      // Prevent default form submission
      evt.preventDefault();

      // Collect the form field values.
      const event_title = document.querySelector(
        ".event_title-in-add_event_form",
      ).value;

      const language = document.querySelector(
        ".language-in-add_event_form",
      ).value;

      const artist_id = document.querySelector(
        ".artist_id-in-choose-or-add-artist-section",
      ).value;

      const sub_artists = document.querySelector(
        ".sub_artists-in-add_event_form",
      ).value;

      const event_date = document.querySelector(
        ".event_date-in-add_event_form",
      ).value;

      const doors_open_time = document.querySelector(
        ".doors_open_time-in-add_event_form",
      ).value;

      const event_start_time = document.querySelector(
        ".event_start_time-in-add_event_form",
      ).value;

      const event_address = document.querySelector(
        ".event_address-in-add_event_form",
      ).value;

      const event_venue = document.querySelector(
        ".event_venue-in-add_event_form",
      ).value;

      const country = document.querySelector(
        ".country-in-add_event_form",
      ).value;

      const state = document.querySelector(".state-in-add_event_form").value;

      const city = document.querySelector(".city-in-add_event_form").value;

      const price = document.querySelector(".price-in-add_event_form").value;

      const event_url = document.querySelector(
        ".event_url-in-add_event_form",
      ).value;

      const genre_id = document.querySelector(
        ".genre_id-in-add_event_form",
      ).value;

      const category_id = document.querySelector(
        ".category_id-in-add_event_form",
      ).value;

      const event_image_url = document.querySelector(
        ".event_image_url-in-add_event_form",
      ).value;

      const event_description = document.querySelector(
        ".event_description-in-add_event_form",
      ).value;

      const featured = document.querySelector(
        ".featured-in-add_event_form",
      ).value;

      const parameters = {
        event_title: event_title,
        language: language,
        artist_id: artist_id,
        sub_artists: sub_artists,
        event_date: event_date,
        doors_open_time: doors_open_time,
        event_start_time: event_start_time,
        event_address: event_address,
        event_venue: event_venue,
        country: country,
        state: state,
        city: city,
        price: price,
        event_url: event_url,
        genre_id: genre_id,
        category_id: category_id,
        event_image_url: event_image_url,
        event_description: event_description,
        featured: featured,
      };

      // Send POST request to add event.
      const response = await call("/api/add-event", parameters);

      if (response.message === "success") {
        // Display success message
        let spanElement = document.createElement("span");
        spanElement.innerText = "Event has been added successfully!";

        document
          .querySelector(".add-event-button-section-in-add_event_form")
          .appendChild(spanElement);

        // Clear form
        document.querySelector(".add_event_form").reset();
      } else {
        // Display fail message
        let spanElement = document.createElement("span");
        spanElement.innerText = "Something went wrong while adding the event!";

        document
          .querySelector(".add-event-button-section-in-add_event_form")
          .appendChild(spanElement);
      }
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

// Function to reset the add artist form
