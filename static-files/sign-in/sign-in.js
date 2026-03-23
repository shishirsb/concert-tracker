// --------------------------------------------------------
// Add an event listener to the document

document.addEventListener("DOMContentLoaded", async (evt) => {
  // Retrieve geo location co-ordinates of the user's device.
  window.navigator.geolocation.getCurrentPosition(async (position) => {
    const lat = position.coords.latitude;
    const long = position.coords.longitude;
    // print coordinates to log
    console.log(`Lat: ${lat}, Long: ${long}`);

    // Send GET request
    // Set query parameters
    const params = new URLSearchParams();
    params.set("lat", lat);
    params.set("long", long);

    // Make a GET request to get all the matching events
    // Prepare parameter list
    let parameters = {
      lat: lat,
      lon: long,
      zoom: 18,
      format: "jsonv2",
    };
    // Make a request to decode the address
    let user_location = await call(
      "https://nominatim.openstreetmap.org/reverse",
      parameters,
    );

    let address = `${user_location.address.neighbourhood}, ${user_location.address.suburb}`;

    console.log(
      `${user_location.address.neighbourhood}, ${user_location.address.suburb}, ${user_location.address.city_district}`,
    );

    // Populate current address in the drop-down.
    // Create an option element
    const optionElement = document.createElement("option");

    // Set the text display and value of the option
    optionElement.text = address;
    optionElement.value = address;

    // Add the option to the select drop-down element.
    // Get the <select> element.
    const selectCityDropDown = document.querySelector("#area-selector-1");
    selectCityDropDown.add(optionElement);

    // Add city, country
    document.querySelector(".city-country-display").textContent =
      `${user_location.address.city}, ${user_location.address.country}`;

    // Retrieve results based on location

    // Make a request to get all the events data based on user's neighbourhood
    parameters = {
      city: user_location.address.city,
      country: user_location.address.country,
    };
    let event_data = await call("/api/get-event-details", parameters);
    console.log(`${JSON.stringify(event_data)}`);

    // <!-- Search box -->
    // Add input event lister around the search box
    document.querySelector("#search-bar-1").addEventListener("input", (e) => {
      // Clear search box
      document.querySelector("#search-query-suggestions-1").innerHTML = "";
      // Get the search value from the search box
      const search_value = document.querySelector("#search-bar-1").value;
      event_data.genres.forEach((element) => {
        if (
          element.genre_name.toLowerCase().includes(search_value.toLowerCase())
        ) {
          let p_tag = document.createElement("p");
          p_tag.innerText = element.genre_name;
          document
            .querySelector("#search-query-suggestions-1")
            .appendChild(p_tag);
        }
      });

      // Get all the suggested items
      let suggested_items = document.querySelectorAll(
        "#search-query-suggestions-1 p",
      );
      for (const item of suggested_items) {
        item.addEventListener("click", (e) => {
          // Clear the events sections
          document.querySelector(
            ".event-cards-section-featured-events",
          ).innerHTML = "";

          // clear search suggestions
          document.querySelector("#search-query-suggestions-1").innerHTML = "";

          // Get the selected value.
          let selected_value = e.target.innerText;
          event_data.events.forEach((element) => {
            if (
              element.genre_name
                .toLowerCase()
                .includes(selected_value.toLowerCase())
            ) {
              // Clone Event card
              let clone_event_card = document
                .querySelector(".event-card")
                .cloneNode(true);
              // Edit the event card with the current event item
              clone_event_card
                .querySelector(".card-image")
                .style.setProperty(
                  "background-image",
                  `url("${element.event_image_url}")`,
                );
              clone_event_card
                .querySelector(".card-image")
                .style.setProperty("background-size", `contain`);

              clone_event_card
                .querySelector(".card-image")
                .style.setProperty("background-position", `center`);

              clone_event_card
                .querySelector(".card-image")
                .style.setProperty("background-repeat", `no-repeat`);

              clone_event_card.querySelector(".event-title").innerText =
                element.event_title;

              clone_event_card.querySelector(".event-date-time").innerText =
                `${element.event_date}, ${element.event_start_time}`;

              clone_event_card.querySelector(".event-address").innerText =
                `${element.event_address}`;

              // Append this element to the events container
              document
                .querySelector(".event-cards-section-featured-events")
                .appendChild(clone_event_card);
            }
          });
        });
      }
    });

    // Add event listener to the search text box.
    document.querySelector("#search-bar-1").addEventListener("keyup", (evt) => {
      // Check if the key pressed is Enter
      if (evt.key === "Enter") {
        // Clear the events sections
        document.querySelector(
          ".event-cards-section-featured-events",
        ).innerHTML = "";

        // clear search suggestions
        document.querySelector("#search-query-suggestions-1").innerHTML = "";
        // Get the search value from the search box.
        const search_value = document.querySelector("#search-bar-1").value;

        // Search through events data and get matching events by genre
        event_data.events.forEach((element) => {
          if (
            element.genre_name
              .toLowerCase()
              .includes(search_value.toLowerCase())
          ) {
            // Clone Event card
            let clone_event_card = document
              .querySelector(".event-card")
              .cloneNode(true);
            // Edit the event card with the current event item
            clone_event_card
              .querySelector(".card-image")
              .style.setProperty(
                "background-image",
                `url("${element.event_image_url}")`,
              );
            clone_event_card
              .querySelector(".card-image")
              .style.setProperty("background-size", `contain`);

            clone_event_card
              .querySelector(".card-image")
              .style.setProperty("background-position", `center`);

            clone_event_card
              .querySelector(".card-image")
              .style.setProperty("background-repeat", `no-repeat`);

            clone_event_card.querySelector(".event-title").innerText =
              element.event_title;

            clone_event_card.querySelector(".event-date-time").innerText =
              `${element.event_date}, ${element.event_start_time}`;

            clone_event_card.querySelector(".event-address").innerText =
              `${element.event_address}`;

            // Append this element to the events container
            document
              .querySelector(".event-cards-section-featured-events")
              .appendChild(clone_event_card);
          }
        });
      }
    });

    // Populate the music genres
    // Get a clone of the genre card
    let genre_card = document.querySelector(".category-card").cloneNode(true);
    // Clear existing cards.
    document.querySelector(".display-event-categories-section").innerHTML = "";

    // Loop through genres from the event data.
    event_data.genres.forEach((element) => {
      let clone_genre_card = genre_card.cloneNode(true);
      clone_genre_card
        .querySelector(".category-image")
        .setAttribute("src", element.genre_image_url);

      clone_genre_card.querySelector(".category-name").innerText =
        element.genre_name;

      // Add element to the container
      document
        .querySelector(".display-event-categories-section")
        .appendChild(clone_genre_card);
    });

    // Populate events
    // Get a clone of the event card
    let event_card = document.querySelector(".event-card").cloneNode(true);
    // Clear existing cards.
    document.querySelector(".event-cards-section-featured-events").innerHTML =
      "";

    // Loop through events from the event data.
    event_data.events.forEach((element) => {
      // Clone an event card
      let clone_event_card = event_card.cloneNode(true);
      // Edit the event card with the current event item
      clone_event_card
        .querySelector(".card-image")
        .style.setProperty(
          "background-image",
          `url("${element.event_image_url}")`,
        );
      clone_event_card
        .querySelector(".card-image")
        .style.setProperty("background-size", `contain`);

      clone_event_card
        .querySelector(".card-image")
        .style.setProperty("background-position", `center`);

      clone_event_card
        .querySelector(".card-image")
        .style.setProperty("background-repeat", `no-repeat`);

      clone_event_card.querySelector(".event-title").innerText =
        element.event_title;

      clone_event_card.querySelector(".event-date-time").innerText =
        `${element.event_date}, ${element.event_start_time}`;

      clone_event_card.querySelector(".event-address").innerText =
        `${element.event_address}`;

      // Append this element to the events container
      document
        .querySelector(".event-cards-section-featured-events")
        .appendChild(clone_event_card);
    });
    // Populate the languages in the filter section
    // Loop through each language from event_data
    event_data.languages.forEach((element) => {
      // Create a span element and append to the languages filter article.
      // Loop through all the languages
      let optionElement = document.createElement("option");
      optionElement.innerText = element.language;
      optionElement.value = element.language;
      document
        .querySelector("#language-dropdown-filter-page")
        .appendChild(optionElement);
    });

    // Populate the categories in the filter section
    // Loop through categories from event_data
    event_data.categories.forEach((element) => {
      // Create a span element and append to the languages filter article.
      // Loop through all the languages
      let optionElement = document.createElement("option");
      optionElement.innerText = element.event_category;
      optionElement.value = element.event_category;
      document
        .querySelector("#categories-dropdown-filter-page")
        .appendChild(optionElement);
    });

    // Populate the genres in the filter section
    // Loop through genres from event_data
    event_data.genres.forEach((element) => {
      // Create a span element and append to the languages filter article.
      // Loop through all the languages
      let optionElement = document.createElement("option");
      optionElement.innerText = element.genre_name;
      optionElement.value = element.genre_name;
      document
        .querySelector("#music-genres-dropdown-filter-page")
        .appendChild(optionElement);
    });

    // Populate the artists in the filter section
    // Loop through artists from event_data
    event_data.artists.forEach((element) => {
      // Create a span element and append to the languages filter article.
      // Loop through all the languages
      let optionElement = document.createElement("option");
      optionElement.innerText = element.main_artist;
      optionElement.value = element.main_artist;
      document
        .querySelector("#artist-dropdown-filter-page")
        .appendChild(optionElement);
    });

    // Populate the venues in the filter section
    // Loop through venues from event_data
    event_data.venues.forEach((element) => {
      // Create a span element and append to the languages filter article.
      // Loop through all the languages
      let optionElement = document.createElement("option");
      optionElement.innerText = element.event_venue;
      optionElement.value = element.event_venue;
      document
        .querySelector("#venue-dropdown-filter-page")
        .appendChild(optionElement);
    });
  });
});

// Reset form
document
  .querySelector("#clear-all-hyperlink-in-filter-page")
  .addEventListener("click", (evt) => {
    // Clear form
    document.querySelector("#filter-form-1").reset();
  });

// Apply filter functionality
document
  .querySelector("#apply-button-in-filter-page")
  .addEventListener("click", async (evt) => {
    // Collect form data
    const from_date = document.querySelector("input#from_date").value;

    const to_date = document.querySelector("input#to_date").value;

    const language = document.querySelector(
      "select#language-dropdown-filter-page",
    ).value;

    const event_category = document.querySelector(
      "select#categories-dropdown-filter-page",
    ).value;

    const music_genre = document.querySelector(
      "select#music-genres-dropdown-filter-page",
    ).value;

    const min_price = document.querySelector(
      "input#min-price-filter-page",
    ).value;

    const max_price = document.querySelector(
      "input#max-price-filter-page",
    ).value;

    const main_artist = document.querySelector(
      "select#artist-dropdown-filter-page",
    ).value;

    const content_venue = document.querySelector(
      "select#venue-dropdown-filter-page",
    ).value;

    const parameter = {
      from_date: from_date,
      to_date: to_date,
      language: language,
      event_category,
      music_genre: music_genre,
      min_price: min_price,
      max_price: max_price,
      main_artist: main_artist,
      content_venue: content_venue,
    };

    // Send a GET request
    let event_data = await call("/api/get-event-details", parameter);
    // console.log(JSON.stringify(event_data));

    // Hide the filter page
    document.querySelector("#filter-page-1").classList.add("hidden");

    // Update events section
    // Populate events
    // Get a clone of the event card
    let event_card = document.querySelector(".event-card").cloneNode(true);
    // Clear existing cards.
    document.querySelector(".event-cards-section-featured-events").innerHTML =
      "";

    // Loop through events from the event data.
    event_data.events.forEach((element) => {
      // Clone an event card
      let clone_event_card = event_card.cloneNode(true);
      // Edit the event card with the current event item
      clone_event_card
        .querySelector(".card-image")
        .style.setProperty(
          "background-image",
          `url("${element.event_image_url}")`,
        );
      clone_event_card
        .querySelector(".card-image")
        .style.setProperty("background-size", `contain`);

      clone_event_card
        .querySelector(".card-image")
        .style.setProperty("background-position", `center`);

      clone_event_card
        .querySelector(".card-image")
        .style.setProperty("background-repeat", `no-repeat`);

      clone_event_card.querySelector(".event-title").innerText =
        element.event_title;

      clone_event_card.querySelector(".event-date-time").innerText =
        `${element.event_date}, ${element.event_start_time}`;

      clone_event_card.querySelector(".event-address").innerText =
        `${element.event_address}`;

      // Append this element to the events container
      document
        .querySelector(".event-cards-section-featured-events")
        .appendChild(clone_event_card);
    });
  });

// <!-- adjustment icon image  -->
// Add event listener to adjustment button icon
document
  .querySelector(".adjustment-icon-image")
  .addEventListener("click", (evt) => {
    // Show filter page
    document.querySelector("#filter-page-1").classList.remove("hidden");
  });

// <!-- Filter page  -->
document
  .querySelector("#header-in-filter-page-1")
  .addEventListener("click", (e) => {
    // add hidden class to filter page
    document.querySelector("#filter-page-1").classList.add("hidden");
  });

// Create span element
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
