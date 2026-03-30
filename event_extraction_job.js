import axios from "axios";

async function run_extraction_process() {
  // Code to automate events extraction process
  // Extract events from googleapi
  let page_number = 1;
  let city = "bengaluru";
  let canonical_name_city = "";
  let response = {};
  response = await get_canonical_name_location(city);
  response.forEach((element) => {
    if (element.target_type === "City") {
      canonical_name_city = element.canonical_name;
    }
  });
  console.log(JSON.stringify(response));
  await extract_event_data(page_number, canonical_name_city);
}

run_extraction_process();

// Get canonical name for location
async function get_canonical_name_location(city) {
  const url = "https://www.searchapi.io/api/v1/locations";
  const params = {
    q: `${city}`,
    api_key: "g3kLpDwt3aPVjbGbyxL6SbiT",
  };

  try {
    let response = await axios.get(url, { params });
    return response.data;
  } catch (err) {
    console.error("Error:", err);
  }
}

async function extract_event_data(page_number, city) {
  // Set configuration to make GET request to API.
  //   let city = "bengaluru";
  const url = "https://www.searchapi.io/api/v1/search";
  const params = {
    engine: "google_events",
    q: `All music concert events in bengaluru.`,
    api_key: "g3kLpDwt3aPVjbGbyxL6SbiT",
    gl: "in",
    page: page_number,
    location: city,
  };

  // Call SearchAPI to get list of events.
  const response = await axios.get(url, { params }).catch((error) => {
    console.error("Error:", error);
  });

  // Write results to a file
  const file_name = "searapi_results_30_mar_1.log";
  try {
    await fs.appendFile(file_name, `${response.data}`);
  } catch (err) {
    console.log(err);
  }

  // Write artist details to artist table

  // Prepare input
  const input = {
    artist_name: artist_name,
    artist_image_url: artist_image_url,
    artist_description: artist_description,
    artist_position: artist_position,
  };

  // Prepare query
  const stmt = db.prepare(
    `insert into artist (artist_name, artist_image_url, artist_description, artist_position)
    values 
    (@artist_name, @artist_image_url, @artist_description, @artist_position)`,
  );

  // Execute insert query
  stmt.run(input);
}
