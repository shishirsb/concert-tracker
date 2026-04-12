import Database from "better-sqlite3";
import { queries } from "../config-modules/SQL_queries.mjs";

// Create a new database object.
const db = new Database("db.db", { verbose: console.log });

//Set Pragma values
db.pragma("journal_mode = WAL");

export function insert_event_into_db(event) {
  try {
    // Check for duplicates
    let check_duplicate_status = check_duplicate_event(event);
    if (check_duplicate_status.message === "duplicate event") {
      return { message: "duplicate event", id: check_duplicate_status.id };
    } else if (event.event_name === "") {
      return { message: "event name missing", id: null };
    } else if (check_duplicate_status.message === "no duplicates") {
      //Prepare Create Table SQL script
      const insert = db.prepare(queries.insert_event);

      const info = insert.run(event);

      return { message: "success", id: info.lastInsertRowid };
    }
  } catch (error) {
    //
    console.error(error);
    return { message: "fail", id: null };
  }
}

function check_duplicate_event(event) {
  // Prepare query
  let stmt = db.prepare(queries.check_duplicate_event);

  let result = stmt.get(event);
  if (result) {
    return { message: "duplicate event", id: result.event_id };
  } else {
    return { message: "no duplicates", id: null };
  }
}
