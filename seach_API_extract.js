// Import required module - parallel-web
const { Parallel } = require("parallel-web");

// Import dotenv module
require("dotenv").config();
// ---------------------------------
const client = new Parallel({ apiKey: process.env.PARALLEL_API_KEY });

let results = [];

// Search API.
// Get all the web page urls.
let urls = [];
async function search_web() {
  const search = await client.beta.search({
    mode: "agentic",
    objective:
      "List of all music concerts in Bengaluru, India. For each concert, show: Title, City, Date, Address, Link, Price, Currency, Age Limit, Genre, Description.",
    search_queries: [
      "Music concerts in Bengaluru, India",
      "Exciting music concerts for all age groups in Bengaluru, India.",
    ],
    max_results: 100,
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
  const search_results = [];
  for (const result of search.results) {
    search_results.push({
      url: result.url,
      excerpts: result.excerpts,
    });

    // Log result to console
    console.log(`URL: ${result.url} \n -- `);
    result.excerpts.forEach((element, index) => {
      console.log(`Excerpt ${index + 1}: ${element} \n -- `);
    });
    console.log(`------------------------------------------------------`);
  }
}

search_web();
