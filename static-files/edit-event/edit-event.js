import { call } from "/static-files/utility-modules.js";

document.addEventListener("DOMContentLoaded", async (e) => {
  // <!-- Form for editing an event  -->

  // <!-- Choose Country  -->
  // Populate country values
  // Load countries drop-down options
  // Get list of countries from database
  let response = await call("/api/get-countries", null);

  // Loop through all the countries
  response.data.countries.forEach((element) => {
    let optionElement = document.createElement("option");
    optionElement.innerText = element.country;
    optionElement.value = element.country;
    document
      .querySelector(".country-in-edit-event-form")
      .appendChild(optionElement);
  });

  // Populate cities based on the selected country

  // Load States drop-down options
  // Get list of States from database
  // Add a change event on country drop down
  document
    .querySelector(".country-in-edit-event-form")
    .addEventListener("change", async (evt) => {
      let parameters = {
        country: evt.target.value,
      };
      let response = await call("/api/get-states", parameters);
      // console.log(JSON.stringify(response.data.states));
      // Loop through all the states
      response.data.states.forEach((element) => {
        let optionElement = document.createElement("option");
        optionElement.innerText = element.state;
        optionElement.value = element.state;
        document
          .querySelector(".state-in-edit-event-form")
          .appendChild(optionElement);
      });
    });

  // Load cities drop-down options
  // Get list of cities from database
  // Add a change event on State drop down
  document
    .querySelector(".state-in-edit-event-form")
    .addEventListener("change", async (evt) => {
      let parameters = {
        state: evt.target.value,
        country: document.querySelector(".country-in-edit-event-form").value,
      };
      let response = await call("/api/get-cities", parameters);
      // console.log(JSON.stringify(response.data.cities));
      // Loop through all the states
      response.data.cities.forEach((element) => {
        let optionElement = document.createElement("option");
        optionElement.innerText = element.city;
        optionElement.value = element.city;
        document
          .querySelector(".city-in-edit-event-form")
          .appendChild(optionElement);
      });
    });

  // Populate events based on the selected city
  // <!-- Choose event  -->
  // Add event listener to city drop down
  // <!-- Choose event  -->
  document
    .querySelector(".city-in-edit-event-form")
    .addEventListener("change", async (evt) => {
      // Set parameters
      let parameters = {
        city: document.querySelector(".city-in-edit-event-form").value,
        state: document.querySelector(".state-in-edit-event-form").value,
        country: document.querySelector(".country-in-edit-event-form").value,
      };

      // get matching events
      let event_data = await call("/api/get-event-details", parameters);

      // Loop through all the events
      event_data.events.forEach((element) => {
        let optionElement = document.createElement("option");
        optionElement.innerText = `${element.event_title}, in ${element.event_venue}, on ${element.event_date}`;
        optionElement.value = element.event_id;
        // Clear
        document
          .querySelector(".event_id-in-edit-event-form")
          .appendChild(optionElement);
      });
    });

  // Update event
  // Detect form submission
  // <!-- Update event button  -->
  document
    .querySelector(".edit-event-form")
    .addEventListener("submit", async (evt) => {
      // Prevent default
      evt.preventDefault();
      // Get the event_id selected and the new value

      const event_id = document.querySelector(
        ".event_id-in-edit-event-form",
      ).value;

      const column_name = document.querySelector(
        ".column_name-in-edit-event-form",
      ).value;

      const new_value = document.querySelector(
        ".new_value-in-edit-event-form",
      ).value;

      // Set parameters
      const paramaters = {
        event_id: event_id,
        column_name: column_name,
        new_value: new_value,
      };

      // Update event_detail with the new value
      let response = await call("/api/update-event", paramaters);

      if (response.message === "success") {
        // Print success message
        let spanElement = document.createElement("span");
        spanElement.innerText = `Event updated successfully!`;
        document
          .querySelector(".update-event-button-section-in-edit-event-form")
          .appendChild(spanElement);
      }
    });

  // Delete event
  // <!-- Delete event button  -->
  document
    .querySelector(".delete-event-in-edit-event-form")
    .addEventListener("click", async (evt) => {
      // Get the event_id selected and the new value
      const event_id = document.querySelector(
        ".event_id-in-edit-event-form",
      ).value;

      // Set parameters
      const paramaters = {
        event_id: event_id,
      };

      // Update event_detail with the new value
      let response = await call("/api/delete-event", paramaters);

      if (response.message === "success") {
        // Print success message
        let spanElement = document.createElement("span");
        spanElement.innerText = `Event deleted successfully!`;
        document
          .querySelector(".update-event-button-section-in-edit-event-form")
          .appendChild(spanElement);

        // Clear the form
        document.querySelector(".edit-event-form").reset();
      } else {
        // Add failed message
        let spanElement = document.createElement("span");
        spanElement.innerText = `Delete operation failed!`;
        document
          .querySelector(".update-event-button-section-in-edit-event-form")
          .appendChild(spanElement);
      }
    });
});
