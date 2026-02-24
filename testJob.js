// // Import required module for node-cron
// const cron = require("node-cron");
// // --------------------------------------------

// // Schedule function to run task
// // cron.schedule("59 * * * *", () => {
// //   console.log("running a task every minute");
// // });
// // -------------------------------------------------
// // Extract last 1 year data

// // Like the browser fetch API, the default method is GET
// async function main() {
//   // Like the browser fetch API, the default method is GET
//   const response = await fetch("https://jsonplaceholder.typicode.com/posts");
//   const data = await response.json();
//   console.log(data);
//   // returns something like:
//   //   {
//   //   userId: 1,
//   //   id: 1,
//   //   title: 'sunt aut facere repellat provident occaecati excepturi optio reprehenderit',
//   //   body: 'quia et suscipit\n' +
//   //     'suscipit recusandae consequuntur expedita et cum\n' +
//   //     'reprehenderit molestiae ut ut quas totam\n' +
//   //     'nostrum rerum est autem sunt rem eveniet architecto'
//   // }
// }

// main().catch(console.error);

// ----------------------------------------------------
// This code was directly taken from documentation (https://www.searchapi.io/docs/google-events-api)

const axios = require("axios");

const url = "https://www.searchapi.io/api/v1/search";
const params = {
  engine: "google_events",
  q: "All Music Concert Events in Bengaluru in the next 1 year",
  api_key: "g3kLpDwt3aPVjbGbyxL6SbiT",
};

axios
  .get(url, { params })
  .then((response) => {
    console.log(JSON.stringify(response.data));
  })
  .catch((error) => {
    console.error("Error:", error);
  });

// ---------------------------------------------------
