// --------------------------------------------------------
// Add an event listener to the document

// const { BodyMixin } = require("undici");

let user_location = {};
let lat;
let long;
let today_date_ISOformat;
let event_data_all = [];

document.addEventListener("DOMContentLoaded", async (evt) => {
  // Retrieve geo location co-ordinates of the user's device.
  window.navigator.geolocation.getCurrentPosition(
    async (position) => {
      lat = position.coords.latitude;
      long = position.coords.longitude;

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
      user_location = await call(
        "https://nominatim.openstreetmap.org/reverse",
        parameters,
      );

      let address = `${user_location.address.neighbourhood}, ${user_location.address.suburb}`;

      // console.log(
      //   `${user_location.address.neighbourhood}, ${user_location.address.suburb}, ${user_location.address.city_district}`,
      // );

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
      // Set today's date and next week's date
      let today_date = new Date(Date.now());
      // Convert to YYYY-MM-DD format
      today_date_ISOformat = today_date.toISOString().slice(0, 10);
      // Add 7 days
      today_date.setDate(today_date.getDate() + 7);

      let next_week_date_ISOformat = today_date.toISOString().slice(0, 10);
      // Set parameters
      parameters = {
        city: user_location.address.city,
        country: user_location.address.country,
        from_date: today_date_ISOformat,
        to_date: next_week_date_ISOformat,
      };
      let event_data = await call("/api/get-event-details", parameters);
      // console.log(`${JSON.stringify(event_data)}`);

      // Add click event listener to any area outside the search box
      document.addEventListener("click", (evt) => {
        // Check if user clicked on the search box
        if (
          !document
            .querySelector(".search-section-with-suggestions-drop-down")
            .contains(evt.target)
        ) {
          // Clear suggestion box
          document.querySelector("#search-query-suggestions-1").innerHTML = "";
        }
      });

      // Get events display section containers
      // Featured events section
      let featured_events_section = document.querySelector(
        ".event-cards-section-featured-events",
      );

      // Events all section
      let events_all_section = document.querySelector(
        ".all-events-display-section",
      );

      // Get the search suggestions box
      let search_suggestion_box = document.querySelector(
        "#search-query-suggestions-1",
      );

      // Get all events data in current city

      // Set parameters
      parameters = {
        city: user_location.address.city,
        country: user_location.address.country,
        from_date: today_date_ISOformat,
      };
      event_data = await call("/api/get-event-details", parameters);
      event_data_all = event_data;
      // Send event_data to the backend to form a narrative of all the events available

      // <!-- Suggestion box  -->
      // <!-- Search box -->
      // Add input event lister around the search box
      document
        .querySelector("#search-bar-1")
        .addEventListener("input", async (e) => {
          // Clear search box
          search_suggestion_box.innerHTML = "";
          // Get the search value from the search box
          const search_value = document.querySelector("#search-bar-1").value;

          // Loop through all genres
          event_data.genres.forEach((element) => {
            // Check whether search query matches any genre
            if (
              element.genre_name
                .toLowerCase()
                .includes(search_value.toLowerCase())
            ) {
              let p_tag = document.createElement("p");
              p_tag.innerText = element.genre_name;
              document
                .querySelector("#search-query-suggestions-1")
                .appendChild(p_tag);

              // Add a click event listener
              p_tag.addEventListener("click", (evt) => {
                // Clear search box
                search_suggestion_box.innerHTML = "";

                // Clear events sections
                featured_events_section.innerHTML = "";
                events_all_section.innerHTML = "";

                // Get the matching events by genre_name
                event_data.events.forEach((event) => {
                  // check if genre name matches
                  if (
                    element.genre_name.toLowerCase() ===
                    event.genre_name.toLowerCase()
                  ) {
                    // Add the event_card
                    add_event(event, event_data);
                  }
                });
              });
            }
          });

          // Loop through all categories
          event_data.categories.forEach((element) => {
            // Check whether search query matches any category
            if (
              element.category_name
                .toLowerCase()
                .includes(search_value.toLowerCase())
            ) {
              // Add the category to the suggestions list
              let p_tag = document.createElement("p");
              p_tag.innerText = element.category_name;
              document
                .querySelector("#search-query-suggestions-1")
                .appendChild(p_tag);

              // Add a click event listener to the suggestion element
              p_tag.addEventListener("click", (evt) => {
                // Clear suggestions list
                search_suggestion_box.innerHTML = "";

                // Clear events in events sections

                featured_events_section.innerHTML = "";
                events_all_section.innerHTML = "";

                // Find event based on the search query
                event_data.events.forEach((event) => {
                  // check if search q is inside category name
                  if (
                    element.category_name.toLowerCase() ===
                    event.category_name.toLowerCase()
                  ) {
                    // Add event to event sections
                    // populate_events({ events: [event] });
                    add_event(event, event_data);
                  }
                });
              });
            }
          });

          // Get all the suggested items
          // let suggested_items = document.querySelectorAll(
          //   "#search-query-suggestions-1 p",
          // );

          // for (const item of suggested_items) {
          //   // Add click event listener to each item
          //   item.addEventListener("click", (e) => {
          //     // Clear the featured events sections
          //     document.querySelector(
          //       ".event-cards-section-featured-events",
          //     ).innerHTML = "";

          //     let event_card = document.querySelector(".event-card");

          //     // Clear all events section
          //     document.querySelector(".all-events-display-section").innerHTML =
          //       "";

          //     // clear search suggestions
          //     document.querySelector("#search-query-suggestions-1").innerHTML =
          //       "";

          //     // Get the selected value.
          //     let selected_value = e.target.innerText;
          //     event_data.events.forEach((element) => {
          //       if (
          //         element.genre_name
          //           .toLowerCase()
          //           .includes(selected_value.toLowerCase())
          //       ) {
          //         // Display event card
          //         // Clone Event card
          //         let clone_event_card = event_card.cloneNode(true);
          //         // Edit the event card with the current event item
          //         clone_event_card
          //           .querySelector(".card-image")
          //           .style.setProperty(
          //             "background-image",
          //             `url("${element.event_image_url}")`,
          //           );
          //         clone_event_card
          //           .querySelector(".card-image")
          //           .style.setProperty("background-size", `contain`);

          //         clone_event_card
          //           .querySelector(".card-image")
          //           .style.setProperty("background-position", `center`);

          //         clone_event_card
          //           .querySelector(".card-image")
          //           .style.setProperty("background-repeat", `no-repeat`);

          //         clone_event_card.querySelector(".event-title").innerText =
          //           element.event_title;

          //         clone_event_card.querySelector(".event-date-time").innerText =
          //           `${element.event_date}, ${element.event_start_time}`;

          //         clone_event_card.querySelector(".event-address").innerText =
          //           `${element.event_address}`;

          //         // Append this element to the events container
          //         // Check if event is featured
          //         if (element.featured === 1) {
          //           document
          //             .querySelector(".event-cards-section-featured-events")
          //             .appendChild(clone_event_card);
          //         }

          //         // Clone node and append to all events container.
          //         clone_event_card_all_events =
          //           clone_event_card.cloneNode(true);
          //         document
          //           .querySelector(".all-events-display-section")
          //           .appendChild(clone_event_card_all_events);
          //       }
          //     });
          //   });
          // }
        });

      // Add event listener to the search text box.
      document
        .querySelector("#search-bar-1")
        .addEventListener("keyup", (evt) => {
          // Check if the key pressed is Enter
          if (evt.key === "Enter") {
            // Clear the events sections
            document.querySelector(
              ".event-cards-section-featured-events",
            ).innerHTML = "";

            // clear search suggestions
            document.querySelector("#search-query-suggestions-1").innerHTML =
              "";
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
      // --------------------------------------------------------------------
      // Populate the music genres

      // Get a clone of the genre card
      let genre_card = document.querySelector(".category-card").cloneNode(true);
      // Clear existing cards.
      document.querySelector(".display-event-categories-section").innerHTML =
        "";

      if (event_data.genres.length > 0) {
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
      }

      // Add event listener to genre icons
      document.querySelectorAll(".category-card").forEach((element) => {
        // Add click event listener
        element.addEventListener("click", async (evt) => {
          // Remove existing borders
          document
            .querySelectorAll(".category-card")
            .forEach((card_element) => {
              // remove border
              card_element.style.setProperty("border", `none`);
            });

          // Add a white border around the genre card
          element.style.setProperty("border", `1px solid white`);
          element.style.setProperty("border-radius", `10px`);

          // get the selected genre.
          const genre = element.querySelector(".category-name").innerText;

          // Filter events based on genre.
          // Set parameters
          // Set parameters
          parameters = {
            city: user_location.address.city,
            country: user_location.address.country,
            genre_name: genre,
            from_date: today_date_ISOformat,
          };
          let event_data = await call("/api/get-event-details", parameters);

          populate_events(event_data);
        });
      });

      // --------------------------------------------------------------------
      // Make a request to get all the events data based on user's neighbourhood
      // Set today's date and next week's date
      today_date = new Date(Date.now());
      // Convert to YYYY-MM-DD format
      today_date_ISOformat = today_date.toISOString().slice(0, 10);
      // Add 7 days
      today_date.setDate(today_date.getDate() + 7);

      next_week_date_ISOformat = today_date.toISOString().slice(0, 10);
      // Set parameters
      parameters = {
        city: user_location.address.city,
        country: user_location.address.country,
        from_date: today_date_ISOformat,
        to_date: next_week_date_ISOformat,
      };

      event_data = await call("/api/get-event-details", parameters);
      populate_events(event_data);

      // <!-- Filter page  -->
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
        optionElement.innerText = element.category_name;
        optionElement.value = element.category_id;
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
        optionElement.value = element.genre_id;
        document
          .querySelector("#music-genres-dropdown-filter-page")
          .appendChild(optionElement);
      });

      // Event data
      // Set parameters
      parameters = {
        city: user_location.address.city,
        country: user_location.address.country,
        from_date: today_date_ISOformat,
      };
      event_data = await call("/api/get-event-details", parameters);

      // Populate the artists in the filter section
      // Loop through artists from event_data
      event_data.artists.forEach((element) => {
        // Create a span element and append to the languages filter article.
        // Loop through all the languages
        let optionElement = document.createElement("option");
        optionElement.innerText = element.artist_name;
        optionElement.value = element.artist_id;
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

      // <!-- Duration selector  -->
      // Add event listener 'change' to the duration selector
      document
        .querySelector("#duration-selector-1")
        .addEventListener("change", async (evt) => {
          // check selection
          if (evt.target.value === "month") {
            // Make a request to get all the events data based on user's selection
            // Set today's date and next month's date
            let today_date = new Date(Date.now());
            // Convert to YYYY-MM-DD format
            today_date_ISOformat = today_date.toISOString().slice(0, 10);
            // Add 30 days
            today_date.setDate(today_date.getDate() + 30);

            let next_week_date_ISOformat = today_date
              .toISOString()
              .slice(0, 10);
            // Set parameters
            parameters = {
              city: user_location.address.city,
              country: user_location.address.country,
              from_date: today_date_ISOformat,
              to_date: next_week_date_ISOformat,
            };
            let event_data = await call("/api/get-event-details", parameters);

            populate_events(event_data);
          } else if (evt.target.value === "year") {
            // Make a request to get all the events data based on user's selection
            // Set today's date and next month's date
            let today_date = new Date(Date.now());
            // Convert to YYYY-MM-DD format
            today_date_ISOformat = today_date.toISOString().slice(0, 10);
            // Add 30 days
            today_date.setDate(today_date.getDate() + 365);

            let next_week_date_ISOformat = today_date
              .toISOString()
              .slice(0, 10);
            // Set parameters
            parameters = {
              city: user_location.address.city,
              country: user_location.address.country,
              from_date: today_date_ISOformat,
              to_date: next_week_date_ISOformat,
            };
            let event_data = await call("/api/get-event-details", parameters);

            populate_events(event_data);
          } else if (evt.target.value === "week") {
            // Make a request to get all the events data based on user's selection
            // Set today's date and next month's date
            let today_date = new Date(Date.now());
            // Convert to YYYY-MM-DD format
            today_date_ISOformat = today_date.toISOString().slice(0, 10);
            // Add 30 days
            today_date.setDate(today_date.getDate() + 7);

            let next_week_date_ISOformat = today_date
              .toISOString()
              .slice(0, 10);
            // Set parameters
            parameters = {
              city: user_location.address.city,
              country: user_location.address.country,
              from_date: today_date_ISOformat,
              to_date: next_week_date_ISOformat,
            };
            let event_data = await call("/api/get-event-details", parameters);

            populate_events(event_data);
          }
        });

      // Populate artists
      populate_artists(event_data);

      // Populate Categories
      populate_categories(event_data);

      // Add view all functionality
      document.querySelectorAll(".view-all-link").forEach((element) => {
        // Add click event listener
        element.addEventListener("click", async (evt) => {
          // fetch all events
          // Set parameters
          parameters = {
            city: user_location.address.city,
            country: user_location.address.country,
            from_date: today_date_ISOformat,
          };
          let event_data = await call("/api/get-event-details", parameters);

          // Populate events
          populate_events(event_data);

          // Populate artists, categories and genres
          populate_artists(event_data);
          populate_categories(event_data);
        });
      });
      // <!-- All events section  -->
      // <!-- Filter cards section  -->
      document.querySelectorAll(".filter-card").forEach((element) => {
        // Add click event handler
        element.addEventListener("click", async (evt) => {
          // Get the text of the filter card
          let selected_filter_card = element.querySelector("span").innerText;
          if (selected_filter_card === "Today") {
            // Make a request to get all the events data based on user's selection
            // Set today's date and next month's date
            let today_date = new Date(Date.now());
            // Convert to YYYY-MM-DD format
            let today_date_ISOformat = today_date.toISOString().slice(0, 10);

            // Set parameters
            parameters = {
              city: user_location.address.city,
              country: user_location.address.country,
              from_date: today_date_ISOformat,
              to_date: today_date_ISOformat,
            };
            let event_data = await call("/api/get-event-details", parameters);

            populate_events(event_data);
          } else if (selected_filter_card === "Tomorrow") {
            // Set today's date and next month's date
            let today_date = new Date(Date.now());

            // Add 1 days
            today_date.setDate(today_date.getDate() + 1);

            // Convert to YYYY-MM-DD format
            let today_date_ISOformat = today_date.toISOString().slice(0, 10);

            let next_week_date_ISOformat = today_date
              .toISOString()
              .slice(0, 10);

            // Set parameters
            parameters = {
              city: user_location.address.city,
              country: user_location.address.country,
              from_date: today_date_ISOformat,
              to_date: today_date_ISOformat,
            };
            let event_data = await call("/api/get-event-details", parameters);

            populate_events(event_data);
          } else if (selected_filter_card === "This week") {
            // Set today's date and next month's date
            let today_date = new Date(Date.now());

            // Convert to YYYY-MM-DD format
            let today_date_ISOformat = today_date.toISOString().slice(0, 10);

            // Add 1 days
            today_date.setDate(today_date.getDate() + 7);

            let next_week_date_ISOformat = today_date
              .toISOString()
              .slice(0, 10);

            // Set parameters
            parameters = {
              city: user_location.address.city,
              country: user_location.address.country,
              from_date: today_date_ISOformat,
              to_date: next_week_date_ISOformat,
            };
            let event_data = await call("/api/get-event-details", parameters);

            populate_events(event_data);
          }
        });
      });

      // Send event_data to the backend to form a narrative of all the events available
      // Call API to form a narrative of all the events available so far.
      // Set parameters
      parameters = {
        event_data: JSON.stringify(event_data_all),
      };
      // await call("/api/create-chunks", parameters);

      // await fetch("/api/create-chunks", {
      //   method: "POST",
      //   headers: {
      //     "User-Agent": "undici-stream-example",
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(parameters),
      // });
      create_vector_store(parameters);

      // Add new functions here (just before this comment) which are dependant on the user location parameters.
    },
    (error) => {
      console.warn(`ERROR(${err.code}): ${err.message}`);
    },
    { maximumAge: 172800000, enableHighAccuracy: false },
  );
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

    const category_id = document.querySelector(
      "select#categories-dropdown-filter-page",
    ).value;

    const genre_id = document.querySelector(
      "select#music-genres-dropdown-filter-page",
    ).value;

    const min_price = document.querySelector(
      "input#min-price-filter-page",
    ).value;

    const max_price = document.querySelector(
      "input#max-price-filter-page",
    ).value;

    const artist_id = document.querySelector(
      "select#artist-dropdown-filter-page",
    ).value;

    const event_venue = document.querySelector(
      "select#venue-dropdown-filter-page",
    ).value;

    const parameter = {
      from_date: from_date,
      to_date: to_date,
      language: language,
      category_id: category_id,
      genre_id: genre_id,
      min_price: min_price,
      max_price: max_price,
      artist_id: artist_id,
      event_venue: event_venue,
    };

    // Send a GET request
    let event_data = await call("/api/get-event-details", parameter);
    // console.log(JSON.stringify(event_data));

    // Hide the filter page
    document.querySelector("#filter-page-1").classList.add("hidden");

    // Update events section
    // Populate events
    // Get a clone of the event card
    populate_events(event_data);

    // populate genres
    populate_music_genres(event_data);
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

// Create a function to populate events

// Get a clone of the event card
let event_card = document.querySelector(".event-card").cloneNode(true);

function populate_events(event_data) {
  // Populate events in featured events section

  // Clear existing cards in featured events.
  document.querySelector(".event-cards-section-featured-events").innerHTML = "";
  // Clear existing cards all events section.
  document.querySelector(".all-events-display-section").innerHTML = "";

  // Check if events_data exists
  if (event_data.events.length > 0) {
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

      // Append this element to the featured event container
      if (element.featured === 1) {
        document
          .querySelector(".event-cards-section-featured-events")
          .appendChild(clone_event_card);
      }

      let card_all_events = clone_event_card.cloneNode(true);

      // Clone the same node and append to the all events section
      document
        .querySelector(".all-events-display-section")
        .appendChild(card_all_events);

      // Add click event listener to the nodes
      [clone_event_card, card_all_events].forEach((node) => {
        // Add click event listener
        node.addEventListener("click", (evt) => {
          // Show event details display page.
          let event_details_page = document.querySelector(
            ".event-details-display-section",
          );
          event_details_page.classList.remove("hidden");

          // Edit event-details page.

          // Set banner image
          let banner_image = document.querySelector(
            ".banner-image-in-event-details-section",
          );
          banner_image.style.setProperty(
            "background-image",
            `url("${element.event_image_url}")`,
          );
          banner_image.style.setProperty("background-size", `contain`);

          banner_image.style.setProperty("background-position", `center`);

          banner_image.style.setProperty("background-repeat", `no-repeat`);

          // Add back button function
          event_details_page
            .querySelector(
              ".back-icon-in-icons-section-in-event-details-display-section",
            )
            .addEventListener("click", (evt) => {
              // Hide the event details page
              event_details_page.classList.add("hidden");
            });

          // Add title
          event_details_page.querySelector(
            ".event-title-in-about-event-section",
          ).innerText = element.event_title;

          // Add date and time
          // Get the date
          const event_date = new Date(element.event_date);

          event_details_page.querySelector(
            ".event-time-in-about-event-section",
          ).innerText =
            `${event_date.toDateString()}, ${element.event_start_time}`;

          // Add address
          event_details_page.querySelector(
            ".address-in-address-section-in-event-location-link-card",
          ).innerText = element.event_address;

          // Add Gates open time
          event_details_page.querySelector(
            ".gates-open-time-in-event-schedule-link-card",
          ).innerText = `Gates open at ${element.doors_open_time}`;

          // Add Event URL
          event_details_page
            .querySelector(".event-url-in-event-schedule-link-card")
            .setAttribute("href", `${element.event_url}`);

          // Add Artist details
          event_details_page.querySelector(
            "#main-artist-name-in-artist-name-title-section",
          ).innerText = element.artist_name;

          // Add artist image
          let image_div = event_details_page.querySelector(
            ".artist-image-in-artist-card",
          );
          image_div.style.setProperty(
            "background-image",
            `url("${element.artist_image_url}")`,
          );
          image_div.style.setProperty("background-size", `contain`);

          image_div.style.setProperty("background-position", `center`);

          image_div.style.setProperty("background-repeat", `no-repeat`);

          // Add click event listener to the artist card
          event_details_page
            .querySelector(".artist-card-in-who-is-taking-the-stage-section")
            .addEventListener("click", (evt) => {
              // Show the artist details page.
              document
                .querySelector(".artist-details-display-page")
                .classList.remove("hidden");

              // Hide the event details card
              event_details_page.classList.add("hidden");

              // Edit the artist page.
              edit_artist_page(element, event_data);
            });
        });
      });
    });
  }
  // Check if featured events exist.
  let featured_event_count = 0;
  event_data.events.forEach((element) => {
    if (element.featured === 1) {
      featured_event_count = featured_event_count + 1;
    }
  });

  // If no events show no events message in featured events section
  if (featured_event_count === 0) {
    document.querySelector(".event-cards-section-featured-events").innerHTML =
      "<span style='font-size:medium'>No featured events found.</span>";
  }

  // Check if any event was extracted.
  if (event_data.events.length === 0) {
    document.querySelector(".all-events-display-section").innerHTML =
      "<span style='font-size:medium'>No events found.</span>";
  }
}

function populate_artists(event_data) {
  // Get a clone of artist card
  let artist_card = document.querySelector(".artist-image-div").cloneNode(true);

  // Clear existing artist cards
  document.querySelector(".artists-display").innerHTML = "";

  // Loop through each artist in event_date
  event_data.artists.forEach((element) => {
    // Get a clone of artist card
    let clone_artist_card = artist_card.cloneNode(true);

    // Edit the artist card with the current event item
    clone_artist_card.querySelector(".artist-image-artists-display").src =
      element.artist_image_url;

    clone_artist_card.querySelector(".artist-name").innerText =
      element.artist_name;

    // Append this element to the events container
    document.querySelector(".artists-display").appendChild(clone_artist_card);

    // Add click event listener to the artist card element
    clone_artist_card.addEventListener("click", (evt) => {
      // Show the artist details page.
      let artist_details_page = document.querySelector(
        ".artist-details-display-page",
      );

      artist_details_page.classList.remove("hidden");

      // Edit the artist card elements
      // Add banner image.
      // Set banner image
      let artist_banner_image = document.querySelector(
        ".banner-image-display-section",
      );
      artist_banner_image.style.setProperty(
        "background-image",
        `url("${element.artist_image_url}")`,
      );
      artist_banner_image.style.setProperty("background-size", `contain`);

      artist_banner_image.style.setProperty("background-position", `center`);

      artist_banner_image.style.setProperty("background-repeat", `no-repeat`);

      // Add artist name
      artist_details_page.querySelector(
        "#artist_name-in-artist-about-section-in-artist-details-page",
      ).innerText = element.artist_name;

      // Add description
      artist_details_page.querySelector(
        ".artist-description-in-about-section",
      ).innerText = element.artist_description;

      // Add back button function
      artist_details_page
        .querySelector(".left-arrow-in-icons-section-in-artists-display-page")
        .addEventListener("click", (evt) => {
          // hide the artist_details display
          artist_details_page.classList.add("hidden");
        });

      // Populate associated events in all events section
      // Get a clone of event card in artist_details page.
      let event_card_clone = artist_details_page
        .querySelector(
          ".event-card-in-all-events-section-in-artist-details-section",
        )
        .cloneNode(true);

      // Clear existing event cards
      artist_details_page.querySelector(
        ".all-events-section-in-artist-details-section",
      ).innerHTML = "";

      event_data.events.forEach((event) => {
        // check whether the main_artist matches
        if (event.artist_name === element.artist_name) {
          // Clone event card again
          let event_card_duplicate = event_card_clone.cloneNode(true);

          // Edit card elements
          // Event date and time
          // Add date and time
          // Get the date
          const event_date = new Date(event.event_date);

          event_card_duplicate.querySelector(
            ".time-in-event-card-in-artist-details-section",
          ).innerText =
            `${event_date.toDateString()}, ${event.event_start_time}`;

          // Add event title
          event_card_duplicate.querySelector(
            ".title-in-event-card-in-artist-details-section",
          ).innerText = event.event_title;

          // Add venue
          event_card_duplicate.querySelector(
            ".location-in-event-card-in-artist-details-section",
          ).innerText = event.event_venue;

          // Add price
          event_card_duplicate.querySelector(
            ".price-in-event-card-in-artist-details-section",
          ).innerText = `INR ${event.price}`;

          // Add event image
          let artist_banner_image = event_card_duplicate.querySelector(
            ".image-in-event-card-in-all-events-section-in-artist-details-section",
          );
          artist_banner_image.style.setProperty(
            "background-image",
            `url("${event.event_image_url}")`,
          );
          artist_banner_image.style.setProperty("background-size", `contain`);

          artist_banner_image.style.setProperty(
            "background-position",
            `center`,
          );

          artist_banner_image.style.setProperty(
            "background-repeat",
            `no-repeat`,
          );

          // Append the event card in all events section
          artist_details_page
            .querySelector(".all-events-section-in-artist-details-section")
            .appendChild(event_card_duplicate);

          // Add click event hander to the event card
          event_card_duplicate.addEventListener("click", (evt) => {
            // Show event details page
            document
              .querySelector(".event-details-display-section")
              .classList.remove("hidden");

            // Hide artist details page
            artist_details_page.classList.add("hidden");

            // edit event details page
            edit_event_details_page(event, event_data);
          });
        }
      });
    });
  });
}

// function to populate categories
function populate_categories(event_data) {
  // Get a clone of category card
  let category_card = document
    .querySelector(".category-card-big")
    .cloneNode(true);

  // Clear existing category cards
  document.querySelector(".display-categories-big-section").innerHTML = "";

  // Loop through each artist in event_data
  event_data.categories.forEach((element) => {
    // Get a clone of category card
    let clone_category_card = category_card.cloneNode(true);

    // Edit the category card with the current event item
    clone_category_card.querySelector(
      ".category-name-inside-category-card-big",
    ).innerText = element.category_name;

    clone_category_card.querySelector(
      ".number-of-events-in-category",
    ).innerText = `${element.number_of_events} Events`;

    clone_category_card.style.setProperty(
      "background-image",
      `url("${element.category_image_url}")`,
    );
    clone_category_card.style.setProperty("background-size", `contain`);

    clone_category_card.style.setProperty("background-position", `center`);

    clone_category_card.style.setProperty("background-repeat", `no-repeat`);

    // Append this element to the category display container
    document
      .querySelector(".display-categories-big-section")
      .appendChild(clone_category_card);

    // Add click event listener to the category card
    clone_category_card.addEventListener("click", (evt) => {
      // Display the category details page
      let category_details_page = document.querySelector(
        ".category-details-section",
      );
      category_details_page.classList.remove("hidden");

      // Add back button function
      category_details_page
        .querySelector("#category-name-and-left-arrow-section")
        .addEventListener("click", (evt) => {
          // Hide page
          category_details_page.classList.add("hidden");
        });

      // Add Category name
      category_details_page.querySelector(
        "#category-name-in-category-name-and-left-arrow-section",
      ).innerText = element.category_name;

      // Add description
      category_details_page.querySelector(
        "#category-description-in-category-details-section",
      ).innerText = element.category_description;

      // Fill the events section for the category
      populate_events_in_category_details_page(
        event_data,
        element.category_name,
      );

      // Add filter cards function
      // Loop through all the cards.

      category_details_page
        .querySelectorAll(
          ".filter-card-in-filter-cards-section-in-category-details-section",
        )
        .forEach((filter_card) => {
          // Add click event listener
          filter_card.addEventListener("click", async (evt) => {
            if (filter_card.querySelector("span").innerText === "Today") {
              // Make a request to get all the events data based on user's selection
              // Set today's date and next month's date
              let today_date = new Date(Date.now());
              // Convert to YYYY-MM-DD format
              let today_date_ISOformat = today_date.toISOString().slice(0, 10);

              // Set parameters
              parameters = {
                city: user_location.address.city,
                country: user_location.address.country,
                from_date: today_date_ISOformat,
                to_date: today_date_ISOformat,
              };
              let event_data = await call("/api/get-event-details", parameters);

              // populate_events(event_data);
              // Populate events in category details page
              populate_events_in_category_details_page(
                event_data,
                element.category_name,
              );
            } else if (
              filter_card.querySelector("span").innerText === "Tomorrow"
            ) {
              // Set today's date and next month's date
              let today_date = new Date(Date.now());

              // Add 1 days
              today_date.setDate(today_date.getDate() + 1);

              // Convert to YYYY-MM-DD format
              let today_date_ISOformat = today_date.toISOString().slice(0, 10);

              let next_week_date_ISOformat = today_date
                .toISOString()
                .slice(0, 10);

              // Set parameters
              parameters = {
                city: user_location.address.city,
                country: user_location.address.country,
                from_date: today_date_ISOformat,
                to_date: today_date_ISOformat,
              };
              let event_data = await call("/api/get-event-details", parameters);

              populate_events_in_category_details_page(
                event_data,
                element.category_name,
              );
            } else if (
              filter_card.querySelector("span").innerText === "This week"
            ) {
              // Set today's date and next month's date
              let today_date = new Date(Date.now());

              // Convert to YYYY-MM-DD format
              let today_date_ISOformat = today_date.toISOString().slice(0, 10);

              // Add 1 days
              today_date.setDate(today_date.getDate() + 7);

              let next_week_date_ISOformat = today_date
                .toISOString()
                .slice(0, 10);

              // Set parameters
              parameters = {
                city: user_location.address.city,
                country: user_location.address.country,
                from_date: today_date_ISOformat,
                to_date: next_week_date_ISOformat,
              };
              let event_data = await call("/api/get-event-details", parameters);

              populate_events_in_category_details_page(
                event_data,
                element.category_name,
              );
            }
          });
        });

      // Populate artists section
      // populate_artists_in_category_details_page(event_data);
    });
  });
}

// -----
// Function to add events in category details page
function populate_events_in_category_details_page(event_data, category_name) {
  // Populate events in featured events section

  // Clear existing cards in featured events.
  // document.querySelector(".event-cards-section-featured-events").innerHTML = "";
  // Clear existing cards all events section.
  // document.querySelector(".all-events-display-section").innerHTML = "";

  // Clear existing cards in category details page.
  document.querySelector(
    "#events-section-in-category-details-section",
  ).innerHTML = "";

  // Loop through events from the event data.
  let event_count = 0;
  event_data.events.forEach((element) => {
    // Check event if it matches the category
    if (element.category_name === category_name) {
      // Increment event count
      event_count = event_count + 1;
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
        .querySelector("#events-section-in-category-details-section")
        .appendChild(clone_event_card);

      // Add click event listener to the nodes
      [clone_event_card].forEach((node) => {
        // Add click event listener
        node.addEventListener("click", (evt) => {
          // Show event details display page.
          let event_details_page = document.querySelector(
            ".event-details-display-section",
          );
          event_details_page.classList.remove("hidden");

          // Hide the category_details page
          document
            .querySelector(".category-details-section")
            .classList.add("hidden");

          // Edit event-details page.

          // Set banner image
          let banner_image = document.querySelector(
            ".banner-image-in-event-details-section",
          );
          banner_image.style.setProperty(
            "background-image",
            `url("${element.event_image_url}")`,
          );
          banner_image.style.setProperty("background-size", `contain`);

          banner_image.style.setProperty("background-position", `center`);

          banner_image.style.setProperty("background-repeat", `no-repeat`);

          // Add back button function
          event_details_page
            .querySelector(
              ".back-icon-in-icons-section-in-event-details-display-section",
            )
            .addEventListener("click", (evt) => {
              // Hide the event details page
              event_details_page.classList.add("hidden");
            });

          // Add title
          event_details_page.querySelector(
            ".event-title-in-about-event-section",
          ).innerText = element.event_title;

          // Add date and time
          // Get the date
          const event_date = new Date(element.event_date);

          event_details_page.querySelector(
            ".event-time-in-about-event-section",
          ).innerText =
            `${event_date.toDateString()}, ${element.event_start_time}`;

          // Add address
          event_details_page.querySelector(
            ".address-in-address-section-in-event-location-link-card",
          ).innerText = element.event_address;

          // Add Gates open time
          event_details_page.querySelector(
            ".gates-open-time-in-event-schedule-link-card",
          ).innerText = `Gates open at ${element.doors_open_time}`;

          // Add Event URL
          event_details_page
            .querySelector(".event-url-in-event-schedule-link-card")
            .setAttribute("href", `${element.event_url}`);

          // Add Artist details
          event_details_page.querySelector(
            "#main-artist-name-in-artist-name-title-section",
          ).innerText = element.artist_name;

          // Add artist image
          let image_div = event_details_page.querySelector(
            ".artist-image-in-artist-card",
          );
          image_div.style.setProperty(
            "background-image",
            `url("${element.artist_image_url}")`,
          );
          image_div.style.setProperty("background-size", `contain`);

          image_div.style.setProperty("background-position", `center`);

          image_div.style.setProperty("background-repeat", `no-repeat`);

          // Add click event listener to the artist card
          event_details_page
            .querySelector(".artist-card-in-who-is-taking-the-stage-section")
            .addEventListener("click", (evt) => {
              // hide the event details page
              event_details_page.classList.add("hidden");

              // Show artist details page
              document
                .querySelector(".artist-details-display-page")
                .classList.remove("hidden");

              // Edit artist page
              edit_artist_page(element, event_data);
            });
        });
      });
    }
  });

  // Print no events message if no events were found.
  if (event_count === 0) {
    // Print no events message
    let spanElement = document.createElement("span");
    spanElement.innerText = "No events found!";
    // Append this element to the events container
    document
      .querySelector("#events-section-in-category-details-section")
      .appendChild(spanElement);
  }
}

// ----
// Function to display artists in category details page
function populate_artists_in_category_details_page(event_data) {
  //
}

// -----
// Function to edit events page
function edit_event_details_page(element, event_data) {
  // Edit event-details page.

  // Set banner image
  let banner_image = document.querySelector(
    ".banner-image-in-event-details-section",
  );
  banner_image.style.setProperty(
    "background-image",
    `url("${element.event_image_url}")`,
  );
  banner_image.style.setProperty("background-size", `contain`);

  banner_image.style.setProperty("background-position", `center`);

  banner_image.style.setProperty("background-repeat", `no-repeat`);

  let event_details_page = document.querySelector(
    ".event-details-display-section",
  );

  // Add back button function
  event_details_page
    .querySelector(
      ".back-icon-in-icons-section-in-event-details-display-section",
    )
    .addEventListener("click", (evt) => {
      // Hide the event details page
      event_details_page.classList.add("hidden");
    });

  // Add title
  event_details_page.querySelector(
    ".event-title-in-about-event-section",
  ).innerText = element.event_title;

  // Add date and time
  // Get the date
  const event_date = new Date(element.event_date);

  event_details_page.querySelector(
    ".event-time-in-about-event-section",
  ).innerText = `${event_date.toDateString()}, ${element.event_start_time}`;

  // Add address
  event_details_page.querySelector(
    ".address-in-address-section-in-event-location-link-card",
  ).innerText = element.event_address;

  // Add Gates open time
  event_details_page.querySelector(
    ".gates-open-time-in-event-schedule-link-card",
  ).innerText = `Gates open at ${element.doors_open_time}`;

  // Add Event URL
  event_details_page
    .querySelector(".event-url-in-event-schedule-link-card")
    .setAttribute("href", `${element.event_url}`);

  // Add Artist details
  event_details_page.querySelector(
    "#main-artist-name-in-artist-name-title-section",
  ).innerText = element.artist_name;

  // Add artist image
  let image_div = event_details_page.querySelector(
    ".artist-image-in-artist-card",
  );
  image_div.style.setProperty(
    "background-image",
    `url("${element.artist_image_url}")`,
  );
  image_div.style.setProperty("background-size", `contain`);

  image_div.style.setProperty("background-position", `center`);

  image_div.style.setProperty("background-repeat", `no-repeat`);

  // Add click event listener to the artist card
  event_details_page
    .querySelector(".artist-card-in-who-is-taking-the-stage-section")
    .addEventListener("click", (evt) => {
      // Show the artist details page.
      document
        .querySelector(".artist-details-display-page")
        .classList.remove("hidden");

      // Hide the event details card
      event_details_page.classList.add("hidden");

      // Edit the artist page.
      edit_artist_page(element, event_data);
    });
}

// ----
// Function to edit artist page
function edit_artist_page(element, event_data) {
  // Edit artist page.

  // Edit the artist card elements
  // Add banner image.
  // Set banner image
  let artist_banner_image = document.querySelector(
    ".banner-image-display-section",
  );
  artist_banner_image.style.setProperty(
    "background-image",
    `url("${element.artist_image_url}")`,
  );
  artist_banner_image.style.setProperty("background-size", `contain`);

  artist_banner_image.style.setProperty("background-position", `center`);

  artist_banner_image.style.setProperty("background-repeat", `no-repeat`);

  // Add artist name
  let artist_details_page = document.querySelector(
    ".artist-details-display-page",
  );
  artist_details_page.querySelector(
    "#artist_name-in-artist-about-section-in-artist-details-page",
  ).innerText = element.artist_name;

  // Add description
  artist_details_page.querySelector(
    ".artist-description-in-about-section",
  ).innerText = element.artist_description;

  // Add back button function
  artist_details_page
    .querySelector(".left-arrow-in-icons-section-in-artists-display-page")
    .addEventListener("click", (evt) => {
      // hide the artist_details display
      artist_details_page.classList.add("hidden");
    });

  // Populate associated events in all events section
  // Get a clone of event card in artist_details page.
  let event_card_clone = artist_details_page
    .querySelector(
      ".event-card-in-all-events-section-in-artist-details-section",
    )
    .cloneNode(true);

  // Clear existing event cards
  artist_details_page.querySelector(
    ".all-events-section-in-artist-details-section",
  ).innerHTML = "";

  event_data.events.forEach((event) => {
    // check whether the main_artist matches
    if (event.artist_name === element.artist_name) {
      // Clone event card again
      let event_card_duplicate = event_card_clone.cloneNode(true);

      // Edit card elements
      // Event date and time
      // Add date and time
      // Get the date
      const event_date = new Date(event.event_date);

      event_card_duplicate.querySelector(
        ".time-in-event-card-in-artist-details-section",
      ).innerText = `${event_date.toDateString()}, ${event.event_start_time}`;

      // Add event title
      event_card_duplicate.querySelector(
        ".title-in-event-card-in-artist-details-section",
      ).innerText = event.event_title;

      // Add venue
      event_card_duplicate.querySelector(
        ".location-in-event-card-in-artist-details-section",
      ).innerText = event.event_venue;

      // Add price
      event_card_duplicate.querySelector(
        ".price-in-event-card-in-artist-details-section",
      ).innerText = `INR ${event.price}`;

      // Add artist image
      let artist_banner_image = event_card_duplicate.querySelector(
        ".image-in-event-card-in-all-events-section-in-artist-details-section",
      );
      artist_banner_image.style.setProperty(
        "background-image",
        `url("${event.event_image_url}")`,
      );
      artist_banner_image.style.setProperty("background-size", `contain`);

      artist_banner_image.style.setProperty("background-position", `center`);

      artist_banner_image.style.setProperty("background-repeat", `no-repeat`);

      // Append the event card in all events section
      artist_details_page
        .querySelector(".all-events-section-in-artist-details-section")
        .appendChild(event_card_duplicate);

      // Add click event listener to the event card
      event_card_duplicate.addEventListener("click", (evt) => {
        // Hide the artist details card
        artist_details_page.classList.add("hidden");

        // Display the event details page
        document
          .querySelector(".event-details-display-section")
          .classList.remove("hidden");

        // Edit event details page
        edit_event_details_page(event, event_data);
      });
    }
  });
}

// <!-- About artist block  -->
// Add show more function in artists details page
document
  .querySelector(".show-more-button-in-about-artist-section")
  .addEventListener("click", (evt) => {
    // Set height to auto
    document
      .querySelector(".artist-description-in-about-section")
      .style.setProperty("height", "auto");

    // Hide the show more button
    document
      .querySelector(".show-more-button-in-about-artist-section")
      .classList.add("hidden");
  });

// Get a genre card
let genre_card = document.querySelector(".category-card");

// Function to populate music genres
function populate_music_genres(event_data) {
  // Populate music genres

  // Clear existing cards.
  document.querySelector(".display-event-categories-section").innerHTML = "";

  if (event_data.genres.length > 0) {
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

    // Add event listener to genre icons
    document.querySelectorAll(".category-card").forEach((element) => {
      // Add click event listener
      element.addEventListener("click", async (evt) => {
        // Remove existing borders
        document.querySelectorAll(".category-card").forEach((card_element) => {
          // remove border
          card_element.style.setProperty("border", `none`);
        });

        // Add a white border around the genre card
        element.style.setProperty("border", `1px solid white`);
        element.style.setProperty("border-radius", `10px`);

        // get the selected genre.
        const genre = element.querySelector(".category-name").innerText;

        // Filter events based on genre.
        // Set parameters

        parameters = {
          city: user_location.address.city,
          country: user_location.address.country,
          genre_name: genre,
        };
        let event_data = await call("/api/get-event-details", parameters);

        populate_events(event_data);
      });
    });
  } else {
    // Add no genres message
    document.querySelector(".display-event-categories-section").innerHTML =
      "<span style='font-size:medium'>No genres found for the selected filters.</span>";
  }
}

// Function to add/apend an event to the event display sections
function add_event(event, event_data) {
  // Add event
  // Clone an event card
  let clone_event_card = event_card.cloneNode(true);

  // Edit event card clone
  edit_event_card(clone_event_card, event);

  // Append this event card to the featured event container
  if (event.featured === 1) {
    document
      .querySelector(".event-cards-section-featured-events")
      .appendChild(clone_event_card);
  }

  let card_all_events = clone_event_card.cloneNode(true);

  // Clone the same node and append to the all events section
  document
    .querySelector(".all-events-display-section")
    .appendChild(card_all_events);

  // Add click event listener to the nodes
  [clone_event_card, card_all_events].forEach((node) => {
    // Add click event listener
    node.addEventListener("click", (evt) => {
      // Show event details display page.
      let event_details_page = document.querySelector(
        ".event-details-display-section",
      );
      event_details_page.classList.remove("hidden");

      // Edit event-details page.
      edit_event_details_page(event, event_data);
    });
  });
}

// Function to edit an event_card before adding it to display section
function edit_event_card(event_card, event) {
  // Edit event card
  // Edit the event card with the current event item
  event_card
    .querySelector(".card-image")
    .style.setProperty("background-color", `black`);

  event_card.querySelector(".card-image").style.setProperty("border", `none`);
  event_card.querySelector(".card-image").style.setProperty("color", `black`);

  event_card
    .querySelector(".card-image")
    .style.setProperty("background-image", `url("${event.event_image_url}")`);

  event_card
    .querySelector(".card-image")
    .style.setProperty("background-size", `contain`);

  event_card
    .querySelector(".card-image")
    .style.setProperty("background-position", `center`);

  event_card
    .querySelector(".card-image")
    .style.setProperty("background-repeat", `no-repeat`);

  event_card.querySelector(".event-title").innerText = event.event_title;

  event_card.querySelector(".event-date-time").innerText =
    `${event.event_date}, ${event.event_start_time}`;

  event_card.querySelector(".event-address").innerText =
    `${event.event_address}`;
  // -----
}

// Function to add/apend an event to the ai chat box output container
// let event_card_in_ai_chat_box = document.querySelector(
//   ".event-card-in-ai-output-container",
// );
function add_event_to_ai_output_container(event, event_data) {
  // Add event
  // Clone an event card
  let clone_event_card = event_card.cloneNode(true);

  // Edit event card clone
  edit_event_card(clone_event_card, event);

  // Append this event card to the featured event container
  document.querySelector(".ai-output-container").appendChild(clone_event_card);

  // Add click event listener to the nodes
  [clone_event_card].forEach((node) => {
    // Add click event listener
    node.addEventListener("click", (evt) => {
      // Show event details display page.
      let event_details_page = document.querySelector(
        ".event-details-display-section",
      );
      event_details_page.classList.remove("hidden");

      // Edit event-details page.
      edit_event_details_page(event, event_data);
    });
  });
}

/* <!-- Main navigation bar --> */
document
  .querySelector(".home-button-div")
  .style.setProperty("background-color", "rgb(31, 31, 31)");

// <!-- #anchor Chat button div  -->
document.querySelector(".chat-button-div").addEventListener("click", (evt) => {
  // Open a chat box
  // Reveal the chat box
  // Check if the chat box is hidden
  if (
    document.querySelector(".ai-chat-box-section").classList.contains("hidden")
  ) {
    document.querySelector(".ai-chat-box-section").classList.remove("hidden");
  } else {
    document.querySelector(".ai-chat-box-section").classList.add("hidden");
  }
});

// <!-- #anchor play button in AI chat box -->
// Listen for click event on the play button
const play_button = document.querySelector(
  ".play-button-in-ai-prompt-form-in-ai-prompt-container",
);

const prompt_input_box = document.querySelector(
  ".ai-prompt-input-in-ai-prompt-form-in-ai-prompt-container",
);

let prompt_output_element = document.querySelector(
  ".prompt-output-element-in-ai-output-container",
);

let ai_output_container = document.querySelector(".ai-output-container");

document
  .querySelector(".ai-prompt-input-in-ai-prompt-form-in-ai-prompt-container")
  .addEventListener("keydown", async (evt) => {
    if (evt.key === "Enter") {
      // Add a loading message
      let loading_message = document.createElement("span");
      loading_message.innerText = "Loading ...";
      ai_output_container.appendChild(loading_message);

      //

      // Get the prompt
      const prompt = prompt_input_box.value.trim();

      // Clear the prompt input box
      prompt_input_box.value = "";

      // Set parameters
      const parameters = {
        prompt: prompt,
        event_data_all: JSON.stringify(event_data_all),
      };

      // Call API to get the output data (events matching the prompt)
      // const response = await call("/api/ask-ai", parameters);
      const response = await fetch("/api/ask-ai", {
        method: "POST",
        headers: {
          "User-Agent": "undici-stream-example",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(parameters),
      });

      const data = await response.json();

      // Display the matching event in the AI output container
      // <!-- #anchor Ai output container inside chat box  -->
      // Clear the previous output
      ai_output_container.innerHTML = "";

      let prompt_output_element_clone = prompt_output_element.cloneNode(true);
      prompt_output_element_clone.innerText = prompt;
      // Unhide the prompt box
      prompt_output_element_clone.classList.remove("hidden");

      // Add the prompt to the ai output container
      ai_output_container.appendChild(prompt_output_element_clone);

      // Add Here is an event recommendation for you message
      let p_tag = document.createElement("p");
      p_tag.innerText = "Here is an event recommendation for you";
      ai_output_container.appendChild(p_tag);

      add_event_to_ai_output_container(data.event, event_data_all);

      loading_message.classList.add("hidden");
    }
  });

// Function to create chunks and vector store needed for AI chat Box

async function create_vector_store(parameters) {
  await fetch("/api/create-chunks", {
    method: "POST",
    headers: {
      "User-Agent": "undici-stream-example",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(parameters),
  });
}
