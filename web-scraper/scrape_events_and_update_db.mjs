import { insert_artist_into_db } from "./utility-modules/insert_artist_into_database.mjs";
import { scrape_events_by_location } from "./utility-modules/scrape_events.mjs";
import { insert_category_into_db } from "./utility-modules/insert_category_into_database.mjs";
import { insert_genre_into_db } from "./utility-modules/insert_genre_into_database.mjs";
import { insert_event_into_db } from "./utility-modules/insert_event_into_database.mjs";
import JSON5 from "json5";
import fs from "node:fs";

try {
  // Extract events from web
  let location = { city: "bengaluru", state: "karnataka", country: "india" };
  let events = await scrape_events_by_location(location);

  // Read events from a text file
  // const data = fs.readFileSync("./events.txt", "utf8");

  // Parse events from text file
  // let events = JSON5.parse(data);
  // ------------------------------------------------------------------------------------
  // Insert events
  for (const event of events) {
    // Insert artist into db
    let insert_status = insert_artist(event);
    if (insert_status === "fail") {
      continue;
    }

    // insert category
    insert_status = insert_category(event);
    if (insert_status === "fail") {
      continue;
    }

    // insert genre
    insert_status = insert_genre(event);
    if (insert_status === "fail") {
      continue;
    }

    // insert event
    insert_status = insert_event(event);
    if (insert_status === "fail") {
      continue;
    }

    console.log(`------------\n Processed event ${event.event_title} into db.`);
  }

  console.log("Completed inserting events into db.");
} catch (error) {
  console.error(error);
}

// ----------------------------------------------------------------------------------------
// insert artist
function insert_artist(event) {
  let insert_status = insert_artist_into_db(event);

  if (insert_status.message === "success") {
    event["artist_id"] = insert_status.id;
    return "success";
  } else if (insert_status.message === "duplicate artist") {
    event["artist_id"] = insert_status.id;
    return "success";
  } else {
    event["artist_id"] = "";
    return "fail";
  }
}

// insert category
function insert_category(event) {
  let insert_status = insert_category_into_db(event);

  if (insert_status.message === "success") {
    event["category_id"] = insert_status.id;
    return "success";
  } else if (insert_status.message === "duplicate category") {
    event["category_id"] = insert_status.id;
    return "success";
  } else {
    event["category_id"] = "";
    return "fail";
  }
}

// insert genre
function insert_genre(event) {
  let insert_status = insert_genre_into_db(event);

  if (insert_status.message === "success") {
    event["genre_id"] = insert_status.id;
    return "success";
  } else if (insert_status.message === "duplicate genre") {
    event["genre_id"] = insert_status.id;
    return "success";
  } else {
    event["genre_id"] = "";
    return "fail";
  }
}

// insert event
function insert_event(event) {
  let insert_status = insert_event_into_db(event);

  if (insert_status.message === "success") {
    event["event_id"] = insert_status.id;
    return "success";
  } else if (insert_status.message === "duplicate event") {
    event["event_id"] = insert_status.id;
    return "success";
  } else {
    event["event_id"] = "";
    return "fail";
  }
}
