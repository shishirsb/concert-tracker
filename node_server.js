try {
  // Backend operations
  // ------------------------------------------------------------------------------

  // ---------------------------------------------------------------------------
  // Import http module
  const http = require("node:http");
  // Import File system modules
  const fs = require("node:fs");
  const { open } = require("node:fs/promises");
  //-------------------------------
  // Import path object
  const path = require("node:path");

  // ------------------------------------------------------------------------------
  // Setup hash passwords
  // Import required modules and set configurations
  const bcrypt = require("bcrypt");
  const saltRounds = 10;

  // Import modules
  const jwt = require("jsonwebtoken");
  // ------------------------------------------------------------------------------
  //Set up database

  // Import the built-in sqlite module
  const Database = require("better-sqlite3");

  // Create a new database object.
  const db = new Database("db.db", { verbose: console.log });

  //Set Pragma values
  db.pragma("journal_mode = WAL");

  //Prepare Create Table SQL script
  const create_users_table = db.prepare(`create table if not exists users 
  (
  username text 
  constraint username_constraint 
  primary key asc on conflict fail
  not null on conflict fail
  check (username != ''),
  password text 
  constraint password_constraint 
  not null
  check (password != '')
  )`);

  // Run create table statement
  create_users_table.run();

  // Create a prepared statement to insert data into the database.
  const insert_user = db.prepare(
    "INSERT INTO users (username, password) VALUES (@username, @password)",
  );

  // //Insert data
  // // Execute the prepared statement with bound values.
  // const insertUser = db.transaction((user) => {
  //   insert_user.run(user);
  // });
  // insertUser({
  //   username: "",
  //   password: "password",
  // });

  // Query users table
  // const select_users = db.prepare("select * from users");
  // console.log(select_users.all());
  // --------------------------------------------------------------------------
  // Create a node server and define API endpoints.

  // --------------------------------------------------------------------------
  // Getting the PORT number if it is defined.
  const PORT = process.env.PORT || 10000;

  // --------------------------------------------------------------------------
  // Create a server
  const server = http
    .createServer((request, response) => {
      try {
        // -------------------------------------------------------------------------
        //Handling pre-flight request OPTIONS
        if (request.method === "OPTIONS") {
          response.writeHead(204, {
            // "Access-Control-Allow-Origin":
            //   "https://concert-tracker-nw6r.onrender.com",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
          });
          response.end();
          return;
        }

        // if (
        //   request.method === "GET" &&
        //   request.url === "/api/get-available-areas"
        // ) {
        // }

        // --------------------------------------------------------------------------
        // ************************** END POINT ********************************
        if (
          request.method === "GET" &&
          request.url.startsWith("/api/get-cities")
        ) {
          try {
            // Get query paramaters as an object
            const myURL = new URL(`https://example.org/${request.url}`);

            let search_params = {};

            myURL.searchParams.forEach((value, name) => {
              search_params[name] = value;
            });

            // Prepare query

            const stmt = db.prepare(
              `
              select distinct city
              from location
              where state = @state
              and country = @country
              `,
            );

            const cities = stmt.all(search_params);
            console.log(JSON.stringify(cities));

            // Prepare reply
            const reply = {
              data: {
                cities: cities,
              },
              message: "success",
              error: "none",
            };

            // Set header
            response.writeHead(200, {
              "Content-Type": "application/json",
            });
            // Send response
            response.end(JSON.stringify(reply));
          } catch (err) {
            console.log(err);

            // Prepare reply
            const reply = {
              data: {
                cities: [],
              },
              message: "fail",
              error: err,
            };

            // Set header
            response.writeHead(200, {
              "Content-Type": "application/json",
            });
            // Send response
            response.end(JSON.stringify(reply));
          }
        }

        // --------------------------------------------------------------------------
        // ************************** END POINT ********************************
        if (
          request.method === "GET" &&
          request.url.startsWith("/api/get-states")
        ) {
          try {
            // Get query paramaters as an object
            const myURL = new URL(`https://example.org/${request.url}`);

            let search_params = {};

            myURL.searchParams.forEach((value, name) => {
              search_params[name] = value;
            });

            // Prepare query

            const stmt = db.prepare(
              `
              select distinct state
              from location
              where country = @country
              `,
            );

            const states = stmt.all(search_params);
            console.log(JSON.stringify(states));

            // Prepare reply
            const reply = {
              data: {
                states: states,
              },
              message: "success",
              error: "none",
            };

            // Set header
            response.writeHead(200, {
              "Content-Type": "application/json",
            });
            // Send response
            response.end(JSON.stringify(reply));
          } catch (err) {
            console.log(err);

            // Prepare reply
            const reply = {
              data: {
                states: [],
              },
              message: "fail",
              error: err,
            };

            // Set header
            response.writeHead(200, {
              "Content-Type": "application/json",
            });
            // Send response
            response.end(JSON.stringify(reply));
          }
        }

        // --------------------------------------------------------------------------
        // ************************** END POINT ********************************
        if (request.method === "GET" && request.url === "/api/get-countries") {
          try {
            // Query database

            // Prepare query to get available countries

            const stmt = db.prepare(
              `
              select distinct country
              from location
              `,
            );

            // Run query
            const countries = stmt.all();
            console.log(JSON.stringify(countries));

            // Prepare reply
            const reply = {
              data: {
                countries: countries,
              },
              message: "success",
              error: "None",
            };

            // Set header
            response.writeHead(200, {
              "Content-Type": "application/json",
            });
            // Send response
            response.end(JSON.stringify(reply));
          } catch (err) {
            console.log(err);
            // Prepare reply
            const reply = {
              data: {
                countries: [],
              },
              message: "error",
              error: err,
            };
            // Set header
            response.writeHead(200, {
              "Content-Type": "application/json",
            });
            // Send response
            response.end(JSON.stringify(reply));
          }
        }

        // --------------------------------------------------------------------------
        // ************************** END POINT ********************************
        if (request.method === "POST" && request.url === "/api/add-event") {
          try {
            // Read body
            let body = [];
            request
              .on("data", (chunk) => {
                body.push(chunk);
              })
              .on("end", () => {
                // Read request body
                body = Buffer.concat(body).toString();

                // Create a URL object

                const myURL = new URL(
                  `https://example.org${request.url}?${body}`,
                );

                // Extract query parameters as JSON
                let json_body = {};

                myURL.searchParams.forEach((value, name) => {
                  json_body[name] = value;
                });

                // Insert form data into DB

                const insert = db.prepare(
                  `INSERT INTO music_concert_events (
                  event_title, main_artist, sub_artists, event_date, doors_open_time, event_start_time, 
                  event_address, event_venue, city, state, country, price, event_url, genre_id, event_category, 
                  event_image_url, event_description, language 
                  ) VALUES (
                  @event_title, @main_artist, @sub_artists, @event_date, @doors_open_time, @event_start_time, 
                  @event_address, @event_venue, @city, @state, @country, @price, @event_url, @genre_id, @event_category,
                  @event_image_url, @event_description, @language)`,
                );

                insert.run(json_body);

                response.writeHead(200, {
                  "Content-Type": "application/json",
                  "Access-Control-Allow-Methods": "POST",
                  "Access-Control-Allow-Headers": "Content-Type",
                });
                response.end(JSON.stringify(json_body));
              });
          } catch (error) {
            // Prepare response
            const reply = {
              error: error,
            };
            response.writeHead(200, {
              "Content-Type": "application/json",
              "Access-Control-Allow-Methods": "POST",
              "Access-Control-Allow-Headers": "Content-Type",
            });
            response.end(JSON.stringify(reply));
          }
        }

        // --------------------------------------------------------------------------
        // ************************** END POINT ********************************
        if (
          request.method === "GET" &&
          request.url.startsWith("/api/get-event-details")
        ) {
          try {
            // Extract only music genres

            // Get query parameters.

            const myURL = new URL(`https://example.org${request.url}`);
            let filterCondition = " WHERE TRUE";
            let filterInput = {};

            myURL.searchParams.forEach((value, name) => {
              if (value != "") {
                console.log(name, value);
                value = value.toLowerCase();
                name = name.toLowerCase();
                const excluded_parameters = [
                  "from_date",
                  "to_date",
                  "min_price",
                  "max_price",
                ];
                if (excluded_parameters.includes(name) === false) {
                  filterCondition =
                    filterCondition + ` AND lower(${name}) = @${name}`;
                } else if (name === "from_date") {
                  filterCondition =
                    filterCondition + ` AND mce.event_date >= @${name}`;
                } else if (name === "to_date") {
                  filterCondition =
                    filterCondition + ` AND mce.event_date <= @${name}`;
                } else if (name === "min_price") {
                  filterCondition =
                    filterCondition + ` AND mce.price >= @${name}`;
                } else if (name === "max_price") {
                  const max_price = "max_price";
                  filterCondition =
                    filterCondition + ` AND mce.price <= @${name}`;
                }
                filterInput[name] = value;
              }
            });

            console.log(filterCondition);
            console.log(filterInput);

            // Prepare query

            stmt = db.prepare(
              `SELECT distinct mg.genre_id, mg.genre_name, mg.genre_image_url, mg.genre_description
              FROM music_genre mg 
              left join music_concert_events mce 
              on mg.genre_id =  mce.genre_id
              ${filterCondition}`,
            );

            const genres = stmt.all(filterInput);

            console.log(genres);

            // Extract only featured events

            // Extract only categories
            stmt = db.prepare(
              `SELECT c.category_id, c.category_name, c.category_image_url, c.category_description, count(*) as number_of_events
              from music_concert_Events mce
              join category c
              on mce.category_id = c.category_id
              where c.category_name is not null
              group by c.category_id, c.category_name, c.category_image_url, c.category_description`,
            );
            const categories = stmt.all();

            // Extract languages
            // Prepare query

            stmt = db.prepare(
              `SELECT distinct language 
              from music_concert_Events mce
              join music_genre mg 
              on mce.genre_id = mg.genre_id
              ${filterCondition}
               and mce.language is not null`,
            );
            const languages = stmt.all(filterInput);

            // Extract only artists
            stmt = db.prepare(
              `SELECT distinct a.artist_id, a.artist_name, a.artist_image_url, a.artist_description
              from music_concert_Events mce
              join music_genre mg 
              on mce.genre_id = mg.genre_id
              join artist a
              on mce.artist_id = a.artist_id
              ${filterCondition}
              and mce.main_artist is not null
              `,
            );
            const artists = stmt.all(filterInput);

            // Extract venues
            stmt = db.prepare(
              `SELECT distinct mce.event_venue 
              from music_concert_Events mce
              join music_genre mg 
              on mce.genre_id = mg.genre_id
              ${filterCondition}
              and mce.event_venue is not null
              `,
            );
            const venues = stmt.all(filterInput);

            // Extract events

            // Prepare query

            const extract_events = db.prepare(
              `SELECT mce.event_id, mce.event_source, mce.created_at, 
              mce.event_title, mce.main_artist, mce.main_artist_image_url,
              mce.sub_artists, mce.event_date, mce.doors_open_time, mce.event_start_time,
              mce.event_address, mce.event_venue, mce.city, mce.state, mce.country_code,
              mce.country, mce.price, mce.event_url, mce.genre_id, mce.event_category, mce.event_image_url,
              mce.event_description, mce.featured
              , mg.genre_id, mg.genre_name, mg.genre_image_url, mg.genre_description, a.artist_name, a.artist_image_url, a.artist_position,
              a.artist_description, c.category_id, c.category_name, c.category_image_url, c.category_description
              FROM music_genre mg 
              join music_concert_events mce 
              on mg.genre_id =  mce.genre_id
              join category c
              on c.category_id = mce.category_id
              join artist a
              on a.artist_id = mce.artist_id
              ${filterCondition}
              and mce.event_title is not null
              `,
            );

            const events = extract_events.all(filterInput);

            console.log(events);

            // Prepare reply
            const reply = {
              genres: genres,
              featured_events: [],
              categories: categories,
              artists: artists,
              events: events,
              languages: languages,
              venues: venues,
              message: "success",
            };

            // Set headers
            // Set status code and headers for response
            response.writeHead(200, {
              "Content-Type": "application/json",
              "Access-Control-Allow-Methods": "GET",
              "Access-Control-Allow-Headers": "Content-Type",
            });
            // Send response
            response.write(JSON.stringify(reply));
            // Finish sending response body
            response.end();

            return;
          } catch (error) {
            // Return events
            // Prepare reply
            console.log(error);
            const reply = {
              events: "no results",
              message: "error",
            };
            // Set headers
            // Set status code and headers for response
            response.writeHead(200, {
              "Content-Type": "application/json",
              "Access-Control-Allow-Methods": "GET",
              "Access-Control-Allow-Headers": "Content-Type",
            });
            // Send response
            response.write(JSON.stringify(reply));
            // Finish sending response body
            response.end();

            return;
          }
        }

        // --------------------------------------------------------------------------
        // ************************** END POINT ********************************
        // Make a GET request to get all the matching events
        // Authenticate session with token cookie
        if (
          request.method === "GET" &&
          request.url.startsWith("/api/concert-events")
        ) {
          // Add a try...catch block
          try {
            // Backend operations
            // Create a url object
            const url = new URL(`http://example.com${request.url}`);

            // Log city parameter to console.
            // const city = url.searchParams.get("city");

            // Extract only the matching events from database.
            // Prepare Filter conditions
            let filterCondition = "";
            if (url.searchParams.entries()) {
              url.searchParams.entries().forEach((param) => {
                filterCondition = `${filterCondition} and ${param[0]}='${param[1]}'`;
              });
            }
            // Prepare select stmt
            // Query users table
            const select_stmt = db.prepare(
              `select * from music_concert_events where true ${filterCondition}`,
            );
            results = select_stmt.all();
            console.log(results);

            // Return events
            // Prepare reply
            const reply = {
              events: results,
              message: "success",
            };

            // Set headers
            // Set status code and headers for response
            response.writeHead(200, {
              "Content-Type": "application/json",
              "Access-Control-Allow-Methods": "GET",
              "Access-Control-Allow-Headers": "Content-Type",
            });
            // Send response
            response.write(JSON.stringify(reply));
            // Finish sending response body
            response.end();

            return;

            // -----------------------------------------------------
            // Catch errors encountered during backend operations.
          } catch (error) {
            // Prepare JSON response
            const reply = {
              events: [],
              message: "fail",
            };

            // Set headers
            // Set status code and headers for response
            response.writeHead(401, {
              "Content-Type": "application/json",
              "Access-Control-Allow-Methods": "GET",
              "Access-Control-Allow-Headers": "Content-Type",
            });
            // Send response
            response.write(JSON.stringify(reply));
            // Finish sending response body
            response.end();

            //  Log error to console
            console.log(`Error while fetching events: ${error}`);

            return;
          }
        }

        // ---------------------------------------------------------------------------
        // <!-- Headline items -->
        // ************************** END POINT ********************************
        // Authenticate session with token cookie
        if (request.method === "GET" && request.url === "/api/headlines") {
          // Add a try...catch block
          try {
            // Back-end operations start when the request is completed.

            // ----------------------------------------------------
            // Initialize an empty list
            let headlinesList = [];

            try {
              // ----------------------------------------------------
              // Read file contents
              (async () => {
                const file = await open(
                  path.join(__dirname, "headlines_1.txt"),
                );

                for await (const line of file.readLines()) {
                  headlinesList.push(line);
                  console.log(line);
                }

                // Prepare reply
                const reply = {
                  headlines: headlinesList,
                  message: "headlines_extracted",
                };

                // Set status code and headers for response
                response.writeHead(200, {
                  "Content-Type": "application/json",
                  "Access-Control-Allow-Methods": "GET",
                  "Access-Control-Allow-Headers": "Content-Type",
                });
                // Send response
                response.write(JSON.stringify(reply));
                // Finish sending response body
                response.end();
                return;
              })();
            } catch (error) {
              // Prepare JSON response
              reply = { message: "Error", error: err, headlines: [] };

              // Set status code and headers for response
              response.writeHead(401, {
                "Content-Type": "application/json",
                "Access-Control-Allow-Methods": "GET",
                "Access-Control-Allow-Headers": "Content-Type",
              });
              // Send response
              response.write(JSON.stringify(reply));
              // Finish sending response body
              response.end();
              return;
            }

            // -------------------------------------------------
            // Serve html file
            // fs.readFile(
            //   path.join(__dirname, "headlines.txt"),
            //   "utf8",
            //   (err, data) => {
            //     // Catch error and leave the function
            //     if (err) {
            //       // Prepare JSON response
            //       reply = { message: "Error", error: err, headlines: "" };

            //       // Set status code and headers for response
            //       response.writeHead(401, {
            //         "Content-Type": "application/json",
            //         "Access-Control-Allow-Methods": "GET",
            //         "Access-Control-Allow-Headers": "Content-Type",
            //       });
            //       // Send response
            //       response.write(JSON.stringify(reply));
            //       // --------------------------------------------
            //       // Finish sending response body
            //       response.end();
            //       console.error(err);
            //       return;
            //     }

            //     // Prepare JSON response
            //     reply = { headlines: data, message: "headlines_extracted" };

            //     // Set status code and headers for response
            //     response.writeHead(200, {
            //       "Content-Type": "application/json",
            //       "Access-Control-Allow-Methods": "GET",
            //       "Access-Control-Allow-Headers": "Content-Type",
            //     });

            //     // Send response
            //     response.write(JSON.stringify(reply));
            //     // --------------------------------------------
            //     // Finish sending response body
            //     response.end();
            //     return;
            //   },
            // );
            return;

            // -----------------------------------------------------
            // Catch errors encountered during backend operations.
          } catch (error) {
            // Prepare JSON response
            reply = { error: error, message: "error" };

            // Set status code and headers for response
            response.writeHead(200, {
              "Content-Type": "application/json",
              "Access-Control-Allow-Methods": "GET",
              "Access-Control-Allow-Headers": "Content-Type",
            });

            // Send response
            response.write(JSON.stringify(reply));
            // --------------------------------------------
            // Finish sending response body
            response.end();
            return;
          }
        }

        // ---------------------------------------------------------------------------
        // Send a POST request after user signs in with google.
        // ************************** API END POINT ********************************
        //Send a POST request to sign-in user.
        // Create endpoint: Proceed only if the request is POST method and if the url is /api/signin
        if (request.method === "POST" && request.url === "/api/google-signin") {
          // Get the headers, method and url from the request.
          const { method, url, headers } = request;
          // -----------------------------------------------------------------
          let body = [];
          // -----------------------------------------------------------------
          // Catching error on the request
          request
            // -----------------------------------------------------
            // Reading data and push to body list.
            .on("data", (chunk) => {
              body.push(chunk);
            })
            // -----------------------------------------------------
            // Finish reading data
            .on("end", async () => {
              // ---------------------------------------------------
              // Define what happens after reading the body from request.
              try {
                // Combine all the elements of the body list.
                body = Buffer.concat(body).toString();
                // ---------------------------------------------------

                //Convert body from string to JSON value.
                body_json = JSON.parse(body);
                // --------------------------------------------

                console.log(body);
                // --------------------------------------------
                // Get input email and unique_id
                const { username, unique_id } = body_json;

                // Prepare select statement by filtering input username
                const select_stmt = db.prepare(
                  "SELECT * from users where username = ?",
                );

                // Execute select statement to get the 1st matching row.
                const result = select_stmt.get(username);

                // Pring result to console.
                console.log(result);

                // Check if username does not exist.
                if (!result) {
                  // Insert user details in the database.
                  // Execute the prepared INSERT statement with values sent through the request.
                  const insertUser = db.transaction((user) => {
                    insert_user.run(user);
                  });
                  insertUser({
                    username: username,
                    password: "Not Applicable",
                  });
                  // --------------------------------------------
                }

                // --------------------------------------------
                // Create a token for authentication
                const token = jwt.sign({ username: username }, "super-secret");

                console.log(`User data: ${body}`);
                // Log generated token
                console.log(`Token generated: ${token}`);

                // --------------------------------------------

                // Set status code and headers for response
                response.writeHead(200, {
                  "Content-Type": "application/json",
                  // "Access-Control-Allow-Origin": "*",
                  "Access-Control-Allow-Methods": "POST, OPTIONS",
                  "Access-Control-Allow-Headers": "Content-Type",
                  "Set-Cookie": `token=${token}; HttpOnly; Path=/`,
                });

                // -----------------------------------------------
                // Create a reply object
                const reply = {
                  message: "google_signin_was_successful",
                  username: username,
                };

                // Send response
                response.write(JSON.stringify(reply));
                // --------------------------------------------
                // Finish sending response body
                response.end();
                return;
                // --------------------------------------------
                // Catch any errors during back-end operations and preparing response
              } catch (error) {
                // Set status code to 404
                response.statusCode = 404;
                if (error.code === "SQLITE_CONSTRAINT_PRIMARYKEY") {
                  // Set error message
                  response.write("DUPLICATE_USERNAME");
                  // End response
                  response.end();
                  console.error(error);
                  return;
                } else {
                  // Set response message
                  response.write("FAILED_TO_SIGN_IN");
                  // End response
                  response.end();
                  console.error(error);
                  return;
                }
              }
            });
        }

        // -----------------------------------------------------------------
        // ************************** END POINT ********************************
        // Authenticate session with token cookie
        if (request.method === "GET" && request.url === "/api/logout") {
          // Add a try...catch block
          try {
            // Back-end operations start when the request is completed.

            // --------------------------------------------------
            // Set status code and headers for response (remove cookies)
            response.writeHead(200, {
              "Content-Type": "text/plain",
              // "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Methods": "POST, OPTIONS",
              "Access-Control-Allow-Headers": "Content-Type",
              "Set-Cookie": `token=; HttpOnly; Path=/; max-age=-1`,
            });

            // -----------------------------------------------

            // Send response
            response.write("Successful_logout");
            // --------------------------------------------
            // Finish sending response body
            response.end();
            return;

            // -----------------------------------------------------
            // Catch errors encountered during backend operations.
          } catch (error) {
            // Set status code and headers for response
            response.writeHead(401, {
              "Content-Type": "text/plain",
              // "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Methods": "POST, OPTIONS",
              "Access-Control-Allow-Headers": "Content-Type",
            });
            // Respond with "NOT_AUTHENTICATED"
            response.write("Unsuccessful_logout");
            // End response
            response.end();
            console.error(error);
            return;
          }
        }
        // --------------------------------------------------------------------------
        // ************************** END POINT ********************************
        // Authenticate session with cookies
        if (request.method === "GET" && request.url === "/api/auth-session") {
          // Add a try...catch block
          try {
            // Back-end operations start when the request is completed.

            // --------------------------------------------------
            // Try to load cookies
            const cookie = request.headers.cookie;

            // Check if cookie exists
            if (!cookie) {
              // Throw error
              throw new Error("Cookies does not exist");
            }
            // Log cookies to console
            console.log(`Cookie: ${cookie} \n\n --------------`);

            // Get the index of last occurrence of the word 'token'.
            const lastIndexOfToken = cookie.lastIndexOf("token");

            // Log lastIndexOfToken to console
            console.log(`index: ${lastIndexOfToken} \n\n ---------------`);

            // Define a variable called subString
            let subString;

            // Define a variable called tokenSubString
            let tokenSubString;

            // Check whether index of 'token' exists
            if (lastIndexOfToken != -1) {
              // Get the remaining substring.
              subString = cookie.slice(lastIndexOfToken);

              // print subString to console.
              console.log(`Substring: ${subString} \n\n ---------------`);

              // Get index of ';' from subString
              const indexOfSemicolon = subString.indexOf(";");

              // Handle the value of indexOfSemicolon
              if (indexOfSemicolon === -1) {
                // Take the remaining string as tokenSubString.
                tokenSubString = subString;
              }

              // Check semicolon exists and handle
              else if (indexOfSemicolon > 0) {
                // Slice and Get only the token substring
                tokenSubString = subString.slice(0, indexOfSemicolon);
              }

              // Log tokenSubString
              console.log(`Token: ${tokenSubString}`);
            } else {
              // Throw error
              throw new Error("token is not stored in cookies.");
            }

            // Split subString by '=' sign
            const splitList = tokenSubString.split("=");

            // Extract token by splitting the substring by '='
            const token = splitList[1];

            // Print token to console
            console.log(`Token: ${token} \n\n ---------------`);

            // verify a token symmetric - synchronous
            const decoded = jwt.verify(token, "super-secret");

            // Log the decoded value
            console.log(decoded.username); // bar

            // --------------------------------------------------
            // Set status code and headers for response
            response.writeHead(200, {
              "Content-Type": "text/plain",
              // "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Methods": "POST, OPTIONS",
              "Access-Control-Allow-Headers": "Content-Type",
            });

            // -----------------------------------------------

            // Send response
            response.write(decoded.username);
            // --------------------------------------------
            // Finish sending response body
            response.end();
            return;

            // -----------------------------------------------------
            // Catch errors encountered during backend operations.
          } catch (error) {
            // Set status code and headers for response
            response.writeHead(401, {
              "Content-Type": "text/plain",
              // "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Methods": "POST, OPTIONS",
              "Access-Control-Allow-Headers": "Content-Type",
            });
            // Respond with "NOT_AUTHENTICATED"
            response.write("NOT_AUTHENTICATED");
            // End response
            response.end();
            console.error(error);
            return;
          }
        }
        // -----------------------------------------------------------------------
        // ************************** END POINT ********************************
        // Root
        if (request.method === "GET" && request.url === "/") {
          // Add a try...catch block
          try {
            // Back-end operations start when the request is completed.
            // --------------------------------------------------

            // Serve html file
            fs.readFile(
              path.join(__dirname, "static-files", "sign-in", "sign-in.html"),
              "utf8",
              (err, data) => {
                // Catch error and leave the function
                if (err) {
                  // Set status code and headers for response
                  response.writeHead(401, {
                    "Content-Type": "plain/text",
                    // "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "GET",
                    "Access-Control-Allow-Headers": "Content-Type",
                  });
                  // Send response
                  response.write("FAILED_TO_LOAD_PAGE");
                  // --------------------------------------------
                  // Finish sending response body
                  response.end();
                  console.error(err);
                  return;
                }

                // Set status code and headers for response
                response.writeHead(200, {
                  "Content-Type": "text/html",
                  // "Access-Control-Allow-Origin": "*",
                  "Access-Control-Allow-Methods": "GET",
                  "Access-Control-Allow-Headers": "Content-Type",
                });

                // Send response
                response.write(data);
                // --------------------------------------------
                // Finish sending response body
                response.end();
              },
            );

            return;

            // -----------------------------------------------------
            // Catch errors encountered during backend operations.
          } catch (error) {
            response.write("ERROR_FETCHING_RESOURCE");
            // End response
            response.end();
            console.error(error);
            return;
          }
        }
        // ------------------------------------------------------------------
        // ************************** END POINT ********************************
        // Capture any GET request (for serving any other static files or resources)
        if (request.method === "GET") {
          // Add a try...catch block
          try {
            // Back-end operations start when the request is completed.

            // Get only the resource pathname
            const url = new URL(`http://example.com${request.url}`);
            const pathname = url.pathname;
            // ----------------
            // Get the full uri of the requested resource.
            const uri = path.join(__dirname, pathname);
            // ------------------

            // Read the file contents of the requested resource.
            // Serve html file
            fs.readFile(uri, (err, data) => {
              // Catch error and leave the function
              if (err) {
                // Send response
                response.write("FAILED_TO_GET_REQUESTED_RESOURCE");
                // --------------------------------------------
                // Finish sending response body
                response.end();
                console.error(err);
                return;
              }
              // -----------------------------------

              // Get the extention of the requested resource
              const extension = path.extname(uri);
              // -------------------------------------

              // Initialize content-type as text/html
              let contentType = "text/html";
              // --------------------------------------

              // Set contentType based on the file extension
              if (extension == ".css") {
                contentType = "text/css";
              } else if (extension == ".js") {
                contentType = "text/javascript";
              } else if (extension == ".png") {
                contentType = "image/png";
              } else if (extension == ".jpeg") {
                contentType = "image/jpeg";
              }

              // Set content type in headers and respond
              response.writeHead(200, {
                "Content-Type": contentType,
              });
              // -----------------------------------
              // Send response
              response.write(data);
              // --------------------------------------------
              // Finish sending response body
              response.end();
              // --------------------------------------------
            });

            // Safely return the control out of the current function.
            return;
          } catch (error) {
            // -----------------------------------------------------
            //Write header
            response.writeHead(401);
            // Catch errors encountered during backend operations.
            response.write("ERROR_FETCHING_RESOURCE");
            // End response
            response.end();
            console.error(error);
            return;
          }
        }
        // --------------------------------------------------------------------
        // ************************** API END POINT ********************************
        //send a POST request to register user.
        // Create endpoint: Proceed only if the request is POST method and if the url is /api/signup
        if (request.method === "POST" && request.url === "/api/signup") {
          // Get the headers, method and url from the request.
          const { method, url, headers } = request;
          // -----------------------------------------------------------------
          let body = [];
          // -------------------------
          // logging request url
          console.log("URL:", request.url);
          // -----------------------------------------------------------------
          request
            // -----------------------------------------------------
            // Reading data and push to body list.
            .on("data", (chunk) => {
              body.push(chunk);
            })
            // -----------------------------------------------------
            // Finish reading data
            .on("end", async () => {
              // ---------------------------------------------------
              // Define what happens after reading the body from request.
              try {
                // Combine all the elements of the body list.
                body = Buffer.concat(body).toString();
                // ---------------------------------------------------

                //Convert body from string to JSON value.
                body_json = JSON.parse(body);

                // -----------------------------------------------
                // Hash password before inserting to db.
                const newPassword_hashed = await bcrypt.hash(
                  body_json.newPassword,
                  saltRounds,
                );
                // --------------------------------------------

                // Execute the prepared INSERT statement with values sent through the request.
                const insertUser = db.transaction((user) => {
                  insert_user.run(user);
                });
                insertUser({
                  username: body_json.newUsername,
                  password: newPassword_hashed,
                });
                // --------------------------------------------

                // Create responseBody
                // const responseBody = { headers, method, url, body };

                //'SQLITE_CONSTRAINT_PRIMARYKEY'
                // --------------------------------------------
                // --------------------------------------------
                // Create a token for authentication
                const token = jwt.sign(
                  { username: body_json.newUsername },
                  "super-secret",
                );

                console.log(`User data: ${body}`);
                // Log generated token
                console.log(`Token generated: ${token}`);
                // --------------------------------------------

                // Set status code and headers for response
                response.writeHead(200, {
                  "Content-Type": "application/json",
                  // "Access-Control-Allow-Origin": "*",
                  "Access-Control-Allow-Methods": "POST, OPTIONS",
                  "Access-Control-Allow-Headers": "Content-Type",
                  "Set-Cookie": `token=${token}; HttpOnly; Path=/`,
                });

                // Create a reply object
                const reply = {
                  message: "SUCCESS_FROM_NEW_SERVER",
                  username: body_json.newUsername,
                };

                // Send response
                response.write(JSON.stringify(reply));
                // --------------------------------------------
                // Finish sending response body
                response.end();
                return;
                // --------------------------------------------
                // Catch any errors during back-end operations and preparing response
              } catch (error) {
                // Set status code to 404
                response.statusCode = 401;
                if (error.code === "SQLITE_CONSTRAINT_PRIMARYKEY") {
                  // Prepare response
                  const reply = { message: "DUPLICATE_USERNAME" };
                  // Set response message
                  response.write(JSON.stringify(reply));
                  // End response
                  response.end();
                  console.error(error);
                  return;
                } else {
                  // Prepare response
                  const reply = { message: "FAILED_REGISTERING_USER" };
                  // Set response message
                  response.write(JSON.stringify(reply));
                  // End response
                  response.end();
                  console.error(error);
                  return;
                }
              }
              // --------------------------------------------
            });
          // -------------------------------------------------------------------------
        }

        // --------------------------------------------------------------------------
        // ************************** API END POINT ********************************
        //Send a POST request to sign-in user.
        // Create endpoint: Proceed only if the request is POST method and if the url is /api/signin
        if (request.method === "POST" && request.url === "/api/signin") {
          // Get the headers, method and url from the request.
          const { method, url, headers } = request;
          // -----------------------------------------------------------------
          let body = [];
          // -----------------------------------------------------------------
          // Catching error on the request
          request
            // -----------------------------------------------------
            // Reading data and push to body list.
            .on("data", (chunk) => {
              body.push(chunk);
            })
            // -----------------------------------------------------
            // Finish reading data
            .on("end", async () => {
              // ---------------------------------------------------
              // Define what happens after reading the body from request.
              try {
                // Combine all the elements of the body list.
                body = Buffer.concat(body).toString();
                // ---------------------------------------------------

                //Convert body from string to JSON value.
                body_json = JSON.parse(body);
                // --------------------------------------------

                console.log(body);
                // --------------------------------------------
                // Get input username and password
                const { usernameField, passwordField } = body_json;

                // Prepare select statement by filtering input username
                const select_stmt = db.prepare(
                  "SELECT * from users where username = ?",
                );

                // Execute select statement to get the 1st matching row.
                const result = select_stmt.get(usernameField);

                // Pring result to console.
                console.log(result);

                // Check if username exists.
                if (!result) {
                  // Return error
                  // Set status code and headers for response
                  // response.writeHead(401, {
                  //   "Content-Type": "text/plain",
                  // });
                  // // Write response body
                  // response.end("FAIL:USERNAME_NOT_FOUND");
                  // // step out of the loop
                  // return;

                  // Set status code and headers for response
                  response.writeHead(401, {
                    "Content-Type": "application/json",
                    // "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "POST, OPTIONS",
                    "Access-Control-Allow-Headers": "Content-Type",
                  });

                  // Create a reply object
                  const reply = {
                    message: "USERNAME_NOT_FOUND",
                    username: usernameField,
                  };

                  // Send response
                  response.write(JSON.stringify(reply));
                  // --------------------------------------------
                  // Finish sending response body
                  response.end();
                  return;
                }

                // Get the password from the result
                const hashedPassword = result.password;

                // Compare input password with DB password
                const match = await bcrypt.compare(
                  passwordField,
                  hashedPassword,
                );

                // Check if match is False and return error
                if (!match) {
                  // Return error
                  // Set status code and headers for response
                  // response.writeHead(401, {
                  //   "Content-Type": "text/plain",
                  // });
                  // // Write response body
                  // response.end("FAIL:PASSWORD_NOT_MATCHING");
                  // // step out of the loop
                  // return;
                  // Set status code and headers for response
                  response.writeHead(401, {
                    "Content-Type": "application/json",
                    // "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "POST, OPTIONS",
                    "Access-Control-Allow-Headers": "Content-Type",
                  });

                  // Create a reply object
                  const reply = {
                    message: "PASSWORD_NOT_CORRECT",
                    username: usernameField,
                  };

                  // Send response
                  response.write(JSON.stringify(reply));
                  // --------------------------------------------
                  // Finish sending response body
                  response.end();
                  return;
                }

                // --------------------------------------------
                // Create a token for authentication
                const token = jwt.sign(
                  { username: usernameField },
                  "super-secret",
                );

                console.log(`User data: ${body}`);
                // Log generated token
                console.log(`Token generated: ${token}`);

                // --------------------------------------------

                // Set status code and headers for response
                response.writeHead(200, {
                  "Content-Type": "application/json",
                  // "Access-Control-Allow-Origin": "*",
                  "Access-Control-Allow-Methods": "POST, OPTIONS",
                  "Access-Control-Allow-Headers": "Content-Type",
                  "Set-Cookie": `token=${token}; HttpOnly; Path=/`,
                });

                // -----------------------------------------------
                // Create a reply object
                const reply = {
                  message: "SUCCESS",
                  username: usernameField,
                };

                // Send response
                response.write(JSON.stringify(reply));
                // --------------------------------------------
                // Finish sending response body
                response.end();
                return;
                // --------------------------------------------
                // Catch any errors during back-end operations and preparing response
              } catch (error) {
                // Set status code and headers for response
                response.writeHead(401, {
                  "Content-Type": "application/json",
                  // "Access-Control-Allow-Origin": "*",
                  "Access-Control-Allow-Methods": "POST, OPTIONS",
                  "Access-Control-Allow-Headers": "Content-Type",
                });

                // Create a reply object
                const reply = {
                  message: `FAILED_TO_SIGN_IN ${usernameField}: ${error}`,
                  username: usernameField,
                };

                // Send response
                response.write(JSON.stringify(reply));
                // --------------------------------------------
                // Finish sending response body
                response.end();
                return;
              }
              // --------------------------------------------
            });
          // -------------------------------------------------------------------------
        }

        // ---------------------------------------------------------------------

        // ------------------------------------------------------------------------
      } catch (err) {
        // Set status code to 404
        response.statusCode = 404;
        // Send response

        //End response
        response.end("ERROR");
      }
    })
    .listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on ${PORT}`);
    });
  // Catching any errors from the beginning of the file.
} catch (error) {
  console.error(error);
}
