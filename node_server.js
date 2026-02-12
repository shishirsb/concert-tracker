try {
  // Backend operations
  // ------------------------------------------------------------------------------
  // Import File system modules
  const fs = require("node:fs");
  //-------------------------------
  // Import path object
  const path = require("node:path");

  // ------------------------------------------------------------------------------
  // Setup hash passwords
  // Import required modules and set configurations
  const bcrypt = require("bcrypt");
  const saltRounds = 10;
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
  // Import http, process modules
  const http = require("node:http");
  const process = require("node:process");
  // --------------------------------------------------------------------------
  // Getting the PORT number if it is defined.
  const PORT = process.env.PORT || 8000;

  // --------------------------------------------------------------------------
  // Create a server
  const server = http
    .createServer((request, response) => {
      // -------------------------------------------------------------------------
      //Handling pre-flight request OPTIONS
      if (request.method === "OPTIONS") {
        response.writeHead(204, {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        });
        response.end();
        return;
      }
      // --------------------------------------------------------------------------
      // ************************** END POINT ********************************
      // Root
      if (request.method === "GET" && request.url === "/") {
        // Catching error on the request
        request.on("error", (err) => {
          // This prints the error message and stack trace to `stderr`.
          // Send response
          response.write("FAIL");
          // Finish sending response body
          response.end();
          console.error(err.stack);
        });
        // Set operations on completion of request
        // .on("end", async () => {
        // Add a try...catch block
        try {
          // Back-end operations start when the request is completed.

          // Set status code and headers for response
          response.writeHead(200, {
            "Content-Type": "text/html",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET",
            "Access-Control-Allow-Headers": "Content-Type",
          });

          // --------------------------------------------------

          // Serve html file
          fs.readFile(
            "static-files/sign-in/sign-in.html",
            "utf8",
            (err, data) => {
              // Catch error and leave the function
              if (err) {
                // Send response
                response.write("FAILED_TO_LOAD_PAGE");
                // --------------------------------------------
                // Finish sending response body
                response.end();
                console.error(err);
                return;
              }

              // Send response
              response.write(data);
              // --------------------------------------------
              // Finish sending response body
              response.end();
            },
          );

          return;

          // --------------------------------------------------
          // Catch error while sending response.
          response.on("error", (err) => {
            response.write("FAIL");
            // Finish sending response body
            response.end();
            console.error(err);
          });
          // -----------------------------------------------------
          // Catch errors encountered during backend operations.
        } catch (error) {
          response.write("Oops! Something broke.");
          // End response
          response.end();
          console.error(error);
        }
      }
      // ------------------------------------------------------------------
      // ************************** END POINT ********************************
      // Capture any GET request (for serving any other static files or resources)
      if (request.method === "GET") {
        // Catching error on the request
        request.on("error", (err) => {
          // This prints the error message and stack trace to `stderr`.
          // Send response
          response.write("FAIL");
          // Finish sending response body
          response.end();
          console.error(err.stack);
        });
        // Set operations on completion of request
        // .on("end", async () => {
        // Add a try...catch block
        try {
          // Back-end operations start when the request is completed.

          // Get only the resource pathname
          url = new URL(`http://example.com${request.url}`);
          pathname = url.pathname;
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
            // -----------------------------------
          });

          // --------------------------------------------------
          // Catch error while sending response.
          response.on("error", (err) => {
            response.write("FAIL");
            // Finish sending response body
            response.end();
            console.error(err);
          });

          // Safely return the control out of the current function.
          return;
        } catch (error) {
          // -----------------------------------------------------
          // Catch errors encountered during backend operations.
          response.write("Oops! Something broke.");
          // End response
          response.end();
          console.error(error);
        }
      }
      // --------------------------------------------------------------------
      // ************************** API END POINT ********************************
      // Create endpoint: Proceed only if the request is POST method and if the url is /api/signup
      if (request.method === "POST" && request.url === "/api/signup") {
        try {
          // Get the headers, method and url from the request.
          const { method, url, headers } = request;
          // -----------------------------------------------------------------
          let body = [];
          // -----------------------------------------------------------------
          // Catching error on the request
          request
            .on("error", (err) => {
              // This prints the error message and stack trace to `stderr`.
              // Send response
              response.write("FAIL");
              // Finish sending response body
              response.end();
              console.error(err.stack);
            })
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
                // --------------------------------------------------
                // Catch error while sending response.
                response.on("error", (err) => {
                  response.write("FAIL");
                  // Finish sending response body
                  response.end();
                  console.error(err);
                });
                // --------------------------------------------

                console.log(body);
                // --------------------------------------------

                // Set status code and headers for response
                response.writeHead(200, {
                  "Content-Type": "text/plain",
                  "Access-Control-Allow-Origin": "*",
                  "Access-Control-Allow-Methods": "POST, OPTIONS",
                  "Access-Control-Allow-Headers": "Content-Type",
                });

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

                // Send response
                response.write("SUCCESS_FROM_NEW_SERVER");
                // --------------------------------------------
                // Finish sending response body
                response.end();
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
                } else {
                  // Set response message
                  response.write("FAILED_REGISTERING_USER");
                  // End response
                  response.end();
                  console.error(error);
                }
              }
              // --------------------------------------------
            });
          // Catching any errors while reading the request from the client
        } catch (error) {
          // Set status code to 404
          response.statusCode = 404;
          // Set response
          response.write("FAILED_REGISTERING_USER");
          // End response
          response.end();
          console.error(error);
        }
        // -------------------------------------------------------------------------
      }

      // ---------------------------------------------------------------------------
      else {
        // Set status code to 404
        response.statusCode = 404;
        // Send response

        //End response
        response.end();
      }
      // ------------------------------------------------------------------------
    })
    .listen(PORT);
  // Catching any errors from the beginning of the file.
} catch (error) {
  console.error(error);
}
