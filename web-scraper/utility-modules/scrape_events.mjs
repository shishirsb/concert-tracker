import { scrape_district_music_events_URLs } from "./scrape_district_music_events_URLs.mjs";
import { scrape_district_event_music_url_contents } from "./scrape_district_event_music_url_contents.mjs";

export async function scrape_events_by_location(location) {
  let event_urls = await scrape_district_music_events_URLs(location);

  console.log("Extracted list of event urls for bengaluru.");

  // console.log(JSON.stringify(event_urls));

  // Collate data from each url
  let all_event_data = await scrape_url_contents(event_urls, location);

  console.log("Extracted events data from the event urls.");

  return all_event_data;
}

// -----------------------------------------------------------------------
// Scrape event URls
async function scrape_url_contents(event_urls, location) {
  try {
    let events_list = [];
    for (const url of event_urls) {
      let scraped_event_data =
        await scrape_district_event_music_url_contents(url);
      if (scraped_event_data) {
        scraped_event_data["event_url"] = url;
        scraped_event_data["city"] = location.city;
        scraped_event_data["state"] = location.state;
        scraped_event_data["country"] = location.country;
        scraped_event_data["featured"] = 0;
        events_list.push(scraped_event_data);
        console.log(`Scraped data from ${url}`);
      }
    }
    return events_list;
  } catch (error) {
    console.error(error);
  }
}
