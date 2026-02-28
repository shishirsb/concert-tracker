// Import the built-in sqlite module
const Database = require("better-sqlite3");

// Get JSON data as a string
const axios = require("axios");

// Import required module - parallel-web
const { Parallel } = require("parallel-web");

// Import dotenv module
require("dotenv").config();

// // Import required module for node-cron
// const cron = require("node-cron");
// // --------------------------------------------

// // Schedule function to run task
// // cron.schedule("59 * * * *", () => {
// //   console.log("running a task every minute");
// // });
// // -------------------------------------------------
// // Extract last 1 year data

// Origin: // Extract only the matching events from database.
// Create a new database object.
const db = new Database("db.db", { verbose: console.log });

//Set Pragma values
db.pragma("journal_mode = WAL");
// Create a function to extract events data from API.
async function get_events(page_number, location) {
  // Start try block
  try {
    // Set configuration to make GET request to API.
    // const url = "https://www.searchapi.io/api/v1/search";
    // const params = {
    //   engine: "google_events",
    //   q: "All music concert events",
    //   api_key: "g3kLpDwt3aPVjbGbyxL6SbiT",
    //   gl: "in",
    //   page: page_number,
    //   location: location,
    // };
    // // Call SearchAPI to get list of events.
    // const response = await axios.get(url, { params }).catch((error) => {
    //   console.error("Error:", error);
    // });
    // const response = {
    //   data: JSON.parse(
    //   ),
    // };
    // Call Ticket Master API
    // $.ajax({
    //   type: "GET",
    //   url: "https://app.ticketmaster.com/discovery/v2/events.json?size=1&apikey=ABL8xB1oIhw9R8eY4lXiiKNGukB4HGLp",
    //   async: true,
    //   dataType: "json",
    //   success: function (json) {
    //     console.log(json);
    //     // Parse the response.
    //     // Do other things.
    //   },
    //   error: function (xhr, status, err) {
    //     // This time, we do not end up here!
    //   },
    // });
    // -----------------------------------------------------------
    // Ticket Master API
    // Set API key
    // const api_key = `ABL8xB1oIhw9R8eY4lXiiKNGukB4HGLp`;
    // // Set query parameters
    // const params = new URLSearchParams();
    // params.set("size", page_number);
    // params.set("apikey", api_key);
    // // Set API url
    // const url = `https://app.ticketmaster.com/discovery/v2/events.json?${params.toString()}`;
    // // Perform a GET request to the url
    // const response = await fetch(url);
    // const data = await response.json();
    // // Log request url to console
    // console.log(`URL: ${url}`);
    // -----------------------------------------------------
    // PredictHQ API
    // const response = await fetch(
    //   "https://api.predicthq.com/v1/events?category=concerts&country=IN",
    //   {
    //     method: "GET",
    //     headers: {
    //       Authorization: "Bearer fywSqEm-_b9I8WU5kAwqrgAcb7bbp11wdy1WYPv-",
    //       Accept: "*/*",
    //     },
    //   },
    // );
    // const data = await response.json();
    // // Log response data to console
    // console.log(`response data: \n ${JSON.stringify(data)}`);
    // -----------------------------------------------------------
    // SerpAPI
    // -------------------------------------------------------
    // Parallel AI
    const client = new Parallel({ apiKey: process.env.PARALLEL_API_KEY });

    async function main() {
      const search = await client.beta.search({
        objective:
          "List all the concerts scheduled in the next 1 year in India.",
        search_queries: ["Music concerts in 2026 in India"],
        max_results: 10,
        excerpts: { max_chars_per_result: 10000 },
      });

      for (const result of search.results) {
        console.log(`${result.title}: ${result.url}`);
        for (const excerpt of result.excerpts) {
          console.log(excerpt.slice(0, 200));
        }
      }
    }

    main().catch(console.error);
    // -------------------------------------------------------
    // Split JSON data into individual events.
    // Get the list of events
    // if (response.data.events) {
    //   events.push(...response.data.events);
    //   return "found_events";
    // } else {
    //   return "no_results";
    // }
    // Store in Database
    // Create table events_all_searchapi if not existing
    //Prepare Create Table SQL script
    // const create_table =
    //   db.prepare(`create table if not exists events_all_searchapi
    // (
    // event_id INTEGER
    // constraint username_constraint
    // primary key asc on conflict fail AUTOINCREMENT
    // not null on conflict fail
    // UNIQUE null on conflict fail
    // check (event_id != ''),
    // source text DEFAULT 'SearchApi',
    // engine text,
    // google_domain text,
    // query text,
    // query_location text,
    // status text,
    // created_at text,
    // title text,
    // event_link text,
    // date text,
    // duration text,
    // address text,
    // event_location text,
    // thumbnail text,
    // description text,
    // venue text,
    // offers text,
    // event_location_map text,
    // user_data text DEFAULT NULL
    // )`);
    // // Run create table statement
    // create_table.run();
    // // Insert data into db.events_all_searchapi
    // // Prepare insert script
    // // Create a prepared statement to insert data into the database.
    // const insert_data = db.prepare(
    //   `INSERT INTO events_all_searchapi
    //   (engine, google_domain, query, query_location, status, created_at, title, event_link, date, duration, address,
    //   event_location, thumbnail, description, venue, offers, event_location_map )
    //   VALUES (@engine, @google_domain, @query, @query_location, @status, @created_at,
    //   @title, @event_link, @date, @duration, @address, @event_location, @thumbnail, @description, @venue, @offers,
    //   @event_location_map
    //   )`,
    // );
    // let events = [];
    // //Prepare data to insert
    // for (const event of response.data.events) {
    //   const event_data = {
    //     engine: response.data.search_parameters.engine,
    //     google_domain: response.data.search_parameters.google_domain,
    //     query: response.data.search_parameters.q,
    //     query_location: response.data.search_parameters.location,
    //     status: response.data.search_metadata.status,
    //     created_at: response.data.search_metadata.created_at,
    //     title: event.title,
    //     event_link: event.link,
    //     date: JSON.stringify(event.date),
    //     duration: event.duration,
    //     address: event.address,
    //     event_location: event.location,
    //     thumbnail: event.thumbnail,
    //     description: event.description,
    //     venue: JSON.stringify(event.venue),
    //     offers: JSON.stringify(event.offers),
    //     event_location_map: JSON.stringify(event.event_location_map),
    //   };
    //   events.push(event_data);
    // }
    // // ---------------------------------------------------
    // // Insert event details in the database.
    // // Execute the prepared INSERT statement with values sent through the request.
    // const insertEvent = db.transaction((events) => {
    //   for (const event of events) insert_data.run(event);
    // });
    // insertEvent(events);
    // if (response.data.events) {
    //   return "found_events";
    // } else {
    //   return "no_results";
    // }
    // --------------------------------------------
  } catch (error) {
    console.error(error);
    return "error";
  }
}

async function extract_pagewise() {
  // Initialize page number (i)
  let i = 1;
  // Set location
  let location = "Bengaluru";
  // Extract data from API pagewise.
  let returnValue = "";
  while (true) {
    // Call the get_events function to extract data from current page, and append to the events list.
    returnValue = await get_events(i, location);
    if (returnValue === "found_events") {
      i = i + 1;
      continue;
    } else {
      break;
    }
  }
}

extract_pagewise().catch(console.error);

// ----------------------------------------------------

// Query users table
// const results = db.prepare(
//   "select * from events_all_searchapi where query_location = 'Bengaluru'",
// );
// console.log(results.all());

// //Prepare delete data SQL script
// const delete_data = db.prepare(`delete from events_all_searchapi`);

// // Run delete statement
// delete_data.run();
