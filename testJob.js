// Import the built-in sqlite module
const Database = require("better-sqlite3");

// Get JSON data as a string
const axios = require("axios");

// Import required module - parallel-web
const { Parallel } = require("parallel-web");

// Import dotenv module
require("dotenv").config();

// Call Open AI's LLM API to get a structured output.
const { OpenAI } = require("openai");
const { zodTextFormat } = require("openai/helpers/zod");
const { z } = require("zod");

// Import module for working with files.
const fs = require("node:fs/promises");

// ---------------------------------

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
async function get_events(location) {
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

    let results = [];

    // Initiate an array to hold all the structured event data.
    let events_structured = [];

    // Creating required objects for OpenAI LLM call.
    const openai = new OpenAI();
    const musicConcertsExtraction = z.object({
      events: z.array(
        z.object({
          event_title: z.string(),
          main_artist: z.string(),
          sub_artists: z.string(),
          event_date: z.string(),
          doors_open_time: z.string(),
          event_start_time: z.string(),
          event_address: z.string(),
          event_venue: z.string(),
          city: z.string(),
          state: z.string(),
          country_code: z.string(),
          country: z.string(),
          price: z.string(),
          event_url: z.string(),
          music_genre: z.string(),
          event_category: z.string(),
          event_image_url: z.string(),
          event_description: z.string(),
        }),
      ),
    });

    // Search API.
    // Get all the web page urls.
    let urls = [];
    async function search_web() {
      const search = await client.beta.search({
        mode: "agentic",
        objective: `Extract all music concert shows in ${location} with Event title, Main Artist, Sub artists, event date, doors open time, start time, event address, event venue, city, state, country, price, event URL, event genre, event image URL, and event description.`,
        search_queries: [`Music concert shows in ${location}`],
        // excerpts: { max_chars_per_result: 10000 },
      });

      // for (const result of search.results) {
      //   results.push({
      //     url_title: result.title,
      //     url_published_date: result.publish_date,
      //     URL: result.url,
      //     excerpt: result.excerpts[0],
      //     source: "Web",
      //   });
      // }

      // Extract the results obtained by the Search API
      const file_name = "data_sample_2_feb_9.log";

      // Loop through reasult result set
      for (const element of search.results) {
        // Log url to file
        // Append file
        try {
          await fs.appendFile(file_name, `URL: ${element.url}\n---`);
        } catch (err) {
          console.log(err);
        }
        // Combine all the excerpts into a single string.
        let combinedExcerpts = "";
        element.excerpts.forEach((element, index) => {
          combinedExcerpts = `${combinedExcerpts}\n${element}`;
        });

        // Write the combined excerpt to file
        try {
          await fs.appendFile(
            file_name,
            `\nExcerpt: ${combinedExcerpts}\n--- `,
          );
        } catch (err) {
          console.log(err);
        }
        console.log(`\n------------------------------------------------------`);

        // Get structured excerpt from LLM
        // Get response from OpenAI.
        const response = await openai.responses.parse({
          model: "gpt-5-mini",
          input: [
            {
              role: "system",
              content: `Music concert shows in ${location} with Event title, Main Artist, Sub artists, event date, doors open time, start time, event address, event venue, city, state, country, price, event URL, event genre, event image URL, and event description.`,
            },
            { role: "user", content: combinedExcerpts },
          ],
          text: {
            format: zodTextFormat(
              musicConcertsExtraction,
              "Music_Concerts_Extraction",
            ),
          },
        });

        const StructuredAIoutput = response.output_parsed;

        // Log to file
        // Append to file
        try {
          await fs.appendFile(
            file_name,
            `------------------------------AI structured output -----------------------`,
          );
        } catch (err) {
          console.log(err);
        }

        // Log out to console
        StructuredAIoutput.events.forEach(async (element, index) => {
          events_structured.push(element);
          console.log(`Event ${index + 1}: \n ${JSON.stringify(element)}\n---`);
          // Log to file
          // Append to file
          try {
            await fs.appendFile(
              file_name,
              `Event ${index + 1}: \n ${JSON.stringify(element)}\n---`,
            );
          } catch (err) {
            console.log(err);
          }
        });

        // Append divider to file
        try {
          await fs.appendFile(
            file_name,
            `\n---------------------------------------------------------------\n`,
          );
        } catch (err) {
          console.log(err);
        }
      }
    }

    //   // Print results from Parallel AI to console
    //   console.log(`\n ----------------------\n`);
    //   console.log(`Results from Parallel AI: \n`);
    //   results.forEach((item) => {
    //     console.log(`${JSON.stringify(item)} \n ----`);
    //   });
    //   console.log(`\n ----------------------\n`);
    // }

    // // ----------------------------------------------------------
    // Trigger the search process
    await search_web();

    // Log structured events data to console
    console.log(`Structured events:\n${events_structured}`);

    // // Pring extracted urls to console
    // console.log(`URLS: \n`);
    // console.log(urls);
    // console.log(`---------------------------------------`);

    // // Use Extract API to get content from each url.
    // let excerpts = [];
    // let extract_results = [];
    // const extract = await client.beta.extract({
    //   urls: urls,
    //   objective:
    //     "You are an expert promoter of music concert events in Bengaluru, India. I am looking for a list of all the concerts scheduled in Bengaluru, India. Extract the following information for each concert event: Title, City, Date, Address, Link, Price, Currency, Age Limit, Genre, Description.",
    //   full_content: true,
    // });

    // for (const result of extract.results) {
    //   excerpts.push(...result.excerpts);
    //   extract_results.push({ url: result.url, excerpts: result.excerpts });
    // }

    // // Log extract results to console
    // extract_results.forEach((result) => {
    //   console.log(`URL: ${result.url} \n ---`);
    //   result.excerpts.forEach((excerpt) => {
    //     console.log(`Excerpts: ${excerpt} \n ---`);
    //   });
    //   console.log(`---`);
    // });

    // // Log excerpts to console
    // console.log(`List of all Excerpts: \n ${excerpts}`);
    // console.log(`------------------------------------`);

    // // Combine all extracts.
    // let combinedExcerpts = "";
    // excerpts.forEach((excerpt) => {
    //   // Concatenate each excerpt
    //   combinedExcerpts = `${combinedExcerpts}. ${excerpt}`;
    // });

    // // Log combined excerpt to console
    // console.log(
    //   `Combined Extracts: \n ${combinedExcerpts} \n -----------------------`,
    // );

    // Call Open AI's LLM API to get a structured output.

    // Create a JSON schema for structured output.
    // const MusicConcertsExtraction = z.array(
    //   z.object({
    //     event_title: z.string(),
    //     city: z.string(),
    //     event_date: z.string(),
    //     address: z.string(),
    //     link: z.string(),
    //     price: z.string(),
    //   }),
    // );

    // Extract API

    // ------------------------------------------------------------------------
    // Split JSON data into individual events.
    // Get the list of events
    // if (response.data.events) {
    //   events.push(...response.data.events);
    //   return "found_events";
    // } else {
    //   return "no_results";
    // }
    // ----------------------------------------
    // Store in Database
    // Create table events_all_searchapi if not existing
    // Prepare Create Table SQL script
    const create_table =
      db.prepare(`create table if not exists music_concert_events
    (
        event_id INTEGER primary key AUTOINCREMENT,
        event_source text DEFAULT 'Web',
        created_at text DEFAULT (date('now')),
        event_title text,
        main_artist text,
        main_artist_image_url text,
        sub_artists text,
        event_date text,
        doors_open_time text,
        event_start_time text,
        event_address text,
        event_venue text,
        city text,
        state text,
        country_code text,
        country text,
        price text,
        event_url text,
        music_genre text,
        event_category text,
        event_image_url text,
        event_description text,
        featured INTEGER
    )`);
    // Run create table statement
    create_table.run();
    // Insert data into db.events_all_searchapi
    // Prepare insert script
    // Create a prepared statement to insert data into the database.
    const insert_data = db.prepare(
      `INSERT INTO music_concert_events
      (event_title, main_artist, sub_artists, event_date, doors_open_time, event_start_time, event_address, event_venue, city, state,
      country_code, country, event_url, music_genre, event_category, event_image_url, event_description)
      VALUES (@event_title, @main_artist, @sub_artists, @event_date, @doors_open_time, @event_start_time,
      @event_address, @event_venue, @city, @state, @country_code, @country, @event_url, @music_genre, @event_category, @event_image_url, @event_description)`,
    );
    // let events = [];
    //Prepare data to insert
    // for (const event of events_structured) {
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
    // ---------------------------------------------------
    // Insert event details in the database.
    // Execute the prepared INSERT statement with values sent through the request.
    const insertEvent = db.transaction((events) => {
      for (const element of events) insert_data.run(element);
    });
    insertEvent(events_structured);
    if (events_structured) {
      return "found_events";
    } else {
      return "no_results";
    }
    // --------------------------------------------
  } catch (error) {
    console.error(error);
    return "error";
  }
}

async function extract_pagewise() {
  // Set location
  let location = "Bengaluru";
  // Extract data from API pagewise.
  let returnValue = "";
  while (true) {
    // Call the get_events function to extract data from current page, and append to the events list.
    returnValue = await get_events(location);
    if (returnValue === "found_events") {
      break;
    } else {
      console.error(`Something went wrong while extracting music events data`);
    }
  }
}

// For // Execute select query and extract results.
// extract_pagewise().catch(console.error);

// ----------------------------------------------------

// Query users table
// const results = db.prepare("select * from music_concert_events");
// console.log(results.all());

//Prepare delete data SQL script
// const delete_data = db.prepare(`delete from music_concert_events`);

// // Run delete statement
// delete_data.run();

// Delete table
// Prepare delete data SQL script
// const delete_table_stmt = db.prepare(
//   `DROP table if exists music_concert_events`,
// );

// // // Run delete statement
// delete_table_stmt.run();
