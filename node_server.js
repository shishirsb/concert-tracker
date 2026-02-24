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
        // --------------------------------------------------------------------------
        // ************************** END POINT ********************************
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
            console.log(url.searchParams.get("city"));

            return;

            // -----------------------------------------------------
            // Catch errors encountered during backend operations.
          } catch (error) {
            // Prepare JSON response
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
