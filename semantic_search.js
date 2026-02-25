// Get JSON data as a string
const axios = require("axios");

// Import required modules
const { MemoryVectorStore } = require("@langchain/classic/vectorstores/memory");
const { OpenAIEmbeddings } = require("@langchain/openai");
const { Document } = require("@langchain/core/documents");

const { OpenAI } = require("openai");
const fs = require("node:fs");
const path = require("node:path");

// Initialize an empty events list to store events data.
let events = [];

// Create a function to extract events data from API.
async function get_events(page_number) {
  // Start try block
  try {
    // Set configuration to make GET request to API.
    const url = "https://www.searchapi.io/api/v1/search";
    const params = {
      engine: "google_events",
      q: "All Music Concert Events",
      api_key: "g3kLpDwt3aPVjbGbyxL6SbiT",
      gl: "in",
      page: page_number,
      location: "Bengaluru",
    };

    // Call SearchAPI to get list of events.
    const response = await axios.get(url, { params }).catch((error) => {
      console.error("Error:", error);
    });

    // Split JSON data into individual events.
    // Get the list of events
    // if (response.data.events) {
    //   events.push(...response.data.events);
    //   return "found_events";
    // } else {
    //   return "no_results";
    // }

    // Store in Database
  } catch (error) {
    console.error(error);
    return "error";
  }
}

// Create a function to extract API data, create vector store and do semantic search.
async function create_vectorstore() {
  // Initialize page number (i)
  let i = 1;
  // Extract data from API pagewise.
  let returnValue = "";
  while (true) {
    // Call the get_events function to extract data from current page, and append to the events list.
    returnValue = await get_events(i);
    if (returnValue === "found_events") {
      i = i + 1;
      continue;
    } else {
      break;
    }
  }

  // // Get vector embeddings from OpenAI
  // const embeddings = new OpenAIEmbeddings({
  //   model: "text-embedding-3-large",
  // });

  // // Instantiate vector store
  // const vectorStore = new MemoryVectorStore(embeddings);

  // // Log all events as it is extracted from the API to console
  // for (const doc of events) {
  //   console.log(`All Events: \n ${JSON.stringify(doc)} \n -----------------`);
  // }

  // // Divider
  // console.log("====================================================");

  // // Create document split as list of string elements, to write to the vector store.
  // const documentList = events.map((event) => {
  //   return new Document({
  //     pageContent: `
  //     Title: ${JSON.stringify(event.title)}
  //     Date: ${JSON.stringify(event.date.day)}, ${JSON.stringify(event.date.month)}
  //     Duration: ${JSON.stringify(event.duration)}
  //     Address: ${JSON.stringify(event.address)}
  //     Location: ${JSON.stringify(event.location)}
  //     Description: ${JSON.stringify(event.description)}
  //     Venue: ${JSON.stringify(event.venue.name)}
  //     Rating: ${JSON.stringify(event.venue.rating)}
  //     Reviews: ${JSON.stringify(event.venue.reviews)}
  //     `,
  //   });
  // });

  // // Log all extracted events parsed into a documentlist
  // for (const doc of documentList) {
  //   console.log(
  //     `Parsed events: \n ${JSON.stringify(doc)} \n -----------------`,
  //   );
  // }

  // // Get headlines from OpenAI
  // const client = new OpenAI();

  // const response = await client.responses.create({
  //   model: "gpt-5-mini-2025-08-07",
  //   input: `Give me 5 eye-catching headlines with emojies for these concert events: ${JSON.stringify(events)}
  //   Do not include serial numbers.`,
  // });
  // // Log headlines to console.
  // console.log(response.output_text);

  // // Store headlines in a file
  // // Get the content to write to file
  // const content = response.output_text;

  // // write content to a text file.
  // fs.writeFile(path.join(__dirname, "headlines_1.txt"), content, (err) => {
  //   if (err) {
  //     console.error(err);
  //     throw new Error("Could not write to file");
  //   } else {
  //     console.log("File written");
  //   }
  // });

  // //Create vector store
  // await vectorStore.addDocuments(documentList);

  // // Get relevant chunks based by doing similarity search
  // const relevant_docs = await vectorStore.similaritySearch(
  //   "Carnatic, classical",
  // );

  // // Log all the matches to console.
  // for (const doc of relevant_docs) {
  //   console.log(`${JSON.stringify(doc)} \n -----------------`);
  // }
}

// trigger the function create_vectorstore to extract API data, create vector store and do semantic search.
create_vectorstore();
