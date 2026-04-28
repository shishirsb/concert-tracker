import { URLs } from "../config-modules/urls.mjs";
import { open_url } from "./open_url.mjs";

// let page_content = "";
// let locator;
// let event_urls = [];

// other actions...
//   page_content = await page.content();
//   locator = page.locator("body");
// Open URL and return the page object

let district_music_event_urls = [];

export async function scrape_district_music_events_URLs(location) {
  try {
    console.log("Started extracting event URLs list.");
    for (const url of URLs[
      `${location.city}_${location.state}_${location.country}`
    ]) {
      console.log("Retrieved a URL.");
      let web_browser = await open_url(url);
      let page = web_browser.page;
      let browser = web_browser.browser;

      while (true) {
        let event_count_prev = await page.locator("a.dds-h-full").count();

        await page.locator("body").evaluate((element) => {
          element.scrollTo(0, document.body.scrollHeight);
        });

        // wait for 3 seconds
        try {
          await page.waitForFunction(
            (event_count_prev) => {
              // Define expression
              return (
                document.querySelectorAll("a.dds-h-full").length >
                event_count_prev
              );
            },
            event_count_prev,
            { timeout: 5000 },
          );
        } catch (err) {
          console.log("no new events loaded");
        }

        let event_count_next = await page.locator("a.dds-h-full").count();
        if (event_count_next === event_count_prev) {
          break;
        }
      }

      let locator = await page.locator("a.dds-h-full").all();

      for (const element of locator) {
        // console.log(await element.getAttribute("href"));
        district_music_event_urls.push(await element.getAttribute("href"));
      }

      page.close();
    }

    // await browser.close();
    return district_music_event_urls;
  } catch (error) {
    console.error(error);
    return "error";
  }
}
