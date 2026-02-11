try {
  // Backend operations

  //Set up database

  // Import the built-in sqlite module
  const Database = require("better-sqlite3");

  // Create a new database object.
  const db = new Database("db.db", { verbose: console.log });

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
  const select_users = db.prepare("select * from users");
  console.log(select_users.all());
  // --------------------------------------------------------------------------

  // Import http module
  const http = require("node:http");

  // Create a server
  const server = http
    .createServer((request, response) => {
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
      //Proceed only if the request is POST method and if the url is /signup
      if (request.method === "POST" && request.url === "/signup") {
        try {
          // Get the headers, method and url from the request.
          const { method, url, headers } = request;
          let body = [];
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
            // Reading data and push to body list.
            .on("data", (chunk) => {
              body.push(chunk);
            })

            // Finish reading data
            .on("end", () => {
              try {
                // Combine all the elements of the body list.
                body = Buffer.concat(body).toString();

                //Convert body from string to JSON value.
                body_json = JSON.parse(body);
                // Catch error while sending response.
                response.on("error", (err) => {
                  response.write("FAIL");
                  // Finish sending response body
                  response.end();
                  console.error(err);
                });

                console.log(body);

                // Set status code for response
                response.writeHead(200, {
                  "Content-Type": "text/plain",
                  "Access-Control-Allow-Origin": "*",
                  "Access-Control-Allow-Methods": "POST, OPTIONS",
                  "Access-Control-Allow-Headers": "Content-Type",
                });

                // Execute the prepared statement with bound values.
                const insertUser = db.transaction((user) => {
                  insert_user.run(user);
                });
                insertUser({
                  username: body_json.newUsername,
                  password: body_json.newPassword,
                });

                // Create responseBody
                // const responseBody = { headers, method, url, body };

                //'SQLITE_CONSTRAINT_PRIMARYKEY'

                // Send response
                response.write("SUCCESS_FROM_NEW_SERVER");
                // Finish sending response body
                response.end();
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
            });
        } catch (error) {
          // Set status code to 404
          response.statusCode = 404;
          // Set response
          response.write("FAILED_REGISTERING_USER");
          // End response
          response.end();
          console.error(error);
        }
      } else {
        // Set status code to 404
        response.statusCode = 404;
        // Send response

        //End response
        response.end();
      }
    })
    .listen(8000);
} catch (error) {
  console.error(error);
}
