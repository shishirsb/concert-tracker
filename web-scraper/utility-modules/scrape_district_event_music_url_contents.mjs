import { test, expect } from "@playwright/test";
import { open_url } from "./open_url.mjs";
import fs from "node:fs";
import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { z } from "zod";
let page;
let artist_image_page;
let genre_image_page;
let category_image_page;

export async function scrape_district_event_music_url_contents(url) {
  try {
    console.log(`Started scraping ${url}`);
    // open the URL page in a browser
    let web_browser = await open_url(url);
    let browser = web_browser.browser;
    page = web_browser.page;

    // Get event title
    let event_title = await scrape_event_title(page);

    // Get event date and time, and address

    let event_date_time_address = await get_event_date_time_address(page);
    let event_date_time = event_date_time_address.event_date_time;
    let event_address = event_date_time_address.event_address;

    //   Parse date and time
    // Extract the date part
    let event_date = await parse_date(event_date_time);

    // get event start time
    let event_start_time = await parse_event_start_time(event_date_time);

    // Get event_image url
    let event_image_url = await get_event_image_url(page);

    // Get the event description
    let event_description = await scrape_event_description(page);

    // Get gates open time
    let doors_open_time = await scrape_doors_open_time(page);

    // Get the cost
    let price = await scrape_cost(page);

    // Get the artist details from the description
    // Call Open AI
    let artist_details = await extract_artist_details(event_description);

    // Get genre image
    let artist_image_url = await get_artist_image(
      artist_details.main_artist_name,
      browser,
    );

    // Get genre's image url
    let genre_image_url = await get_genre_image(
      artist_details.genre_in_one_word,
      browser,
    );

    // Get category's image url
    let category_image_url = await get_category_image(
      artist_details.category_of_event_in_one_word,
      browser,
    );

    return {
      event_title: event_title || "",
      event_date: event_date || "",
      doors_open_time: doors_open_time || "",
      event_start_time: event_start_time || "",
      event_address: event_address || "",
      event_venue: event_address || "",
      event_description: event_description || "",
      artist_name: artist_details.main_artist_name,
      sub_artists: artist_details.sub_artists,
      artist_position: artist_details.artist_role,
      artist_image_url: artist_image_url,
      artist_description: artist_details.describe_artist,
      category_name: artist_details.category_of_event_in_one_word,
      category_description: artist_details.describe_category,
      genre_name: artist_details.genre_in_one_word,
      genre_description: artist_details.describe_genre,
      event_image_url: event_image_url || "",
      language: artist_details.language,
      price: price || "",
      category_image_url: category_image_url,
      genre_image_url: genre_image_url,
    };
  } catch (error) {
    console.error(`Error extracting contents from event url: ${url}:`);
    console.error(error);
    return null;
  } finally {
    if (page && !page.isClosed()) await page.close();

    if (artist_image_page && !artist_image_page.isClosed())
      await artist_image_page.close();

    if (genre_image_page && !genre_image_page.isClosed())
      await genre_image_page.close();

    if (category_image_page && !category_image_page.isClosed())
      await category_image_page.close();
  }
}

// ---------------------------------------------------------
async function scrape_event_title(page) {
  let title_element = page.locator("h3").first();
  let title = await title_element.innerText();
  return title;
}

async function get_event_date_time_address(page) {
  let title_element = page.locator("h3").first();
  let date_and_address = await title_element.evaluate((element) => {
    // let next_sibling_to_event_title = document.querySelector("h3 + div");
    let next_sibling_to_event_title = element.nextElementSibling;
    let span_elements = next_sibling_to_event_title.querySelectorAll("span");
    let event_date_time = span_elements[0].innerText;
    let event_address = span_elements[2].innerText;
    return {
      event_date_time: event_date_time,
      event_address: event_address,
    };
  });
  return date_and_address;
}

async function parse_date(event_date_time) {
  let event_date_month = event_date_time.match(/\d+ [A-Za-z]{3,10}/);
  let month = event_date_month[0].match(/[a-zA-Z]+/);
  let day = event_date_month[0].match(/\d+/);
  // Get current year
  const current_date = new Date();
  let current_year = current_date.getFullYear();

  let event_date = new Date(`${month[0]} ${day[0]}, ${current_year}`);
  let event_date_ISOformat = event_date.toISOString().slice(0, 10);
  return event_date_ISOformat;
}

// Get time
async function parse_event_start_time(event_date_time) {
  let event_start_time = event_date_time.match(/\d+:\d+ [AMP]+/);
  // let event_date;
  if (event_start_time) {
    return event_start_time[0];
  } else {
    return "Multiple slots";
  }
}

// Get event image URL
async function get_event_image_url(page) {
  let anchor_element_for_event_image = page.locator("section#info").first();
  let event_image_url = await anchor_element_for_event_image.evaluate(
    (element) => {
      let next_sibling = element.nextElementSibling;
      let img_elements = next_sibling.querySelector("img");
      let image_url = img_elements.src;
      return image_url;
    },
  );
  return event_image_url;
}

async function scrape_event_description(page) {
  let description_element = await page.locator(".html-render-container").all();
  let event_description = await description_element[0].textContent();
  return event_description;
}

async function scrape_doors_open_time(page) {
  let description_element = await page.locator(".html-render-container").all();
  let doors_open_time = await description_element[2].textContent();
  let doors_open_time_formatted = doors_open_time.match(/\d.+/);
  return doors_open_time_formatted[0] || "";
}

async function scrape_cost(page) {
  let cost_element = await page.locator(".font-bold").first();
  let event_price = await cost_element.textContent();
  return event_price;
}

async function extract_artist_details(event_description) {
  const openai = new OpenAI();
  // Define structured output
  const ArtistDetails = z.object({
    main_artist_name: z.string(),
    sub_artists: z.string(),
    artist_role: z.string(),
    describe_artist: z.string(),
    category_of_event_in_one_word: z.string(),
    describe_category: z.string(),
    genre_in_one_word: z.string(),
    describe_genre: z.string(),
    language: z.string(),
  });

  const response = await openai.responses.parse({
    model: "gpt-4.1-nano",
    input: [
      {
        role: "system",
        content:
          "You are an expert at structured data extraction. You will be given unstructured description of a music concert event from a website and should convert it into the given structure.",
      },
      { role: "user", content: event_description },
    ],
    text: {
      format: zodTextFormat(ArtistDetails, "artist_details"),
    },
  });

  const artist_details = response.output_parsed;
  return artist_details;
}

async function get_artist_image(artist_name, browser) {
  // web_browser = await open_url(
  //   `https://en.wikipedia.org/wiki/${artist_details.main_artist_name.replace(" ", "_")}`,
  // );
  // page = web_browser.page;
  // https://images.google.com/
  // <textarea title='Search'
  // div#search img (src)

  artist_image_page = await browser.newPage();
  // let url = `https://commons.wikimedia.org/w/index.php?search=${artist_name} artist&title=Special%3AMediaSearch&type=image`;
  let url =
    "https://www.google.com/search?q=random&sca_esv=4bcc69982abf93aa&sxsrf=ANbL-n54uIVMh-yq7wA2J-3zXkAnZUdlNQ:1775812801019&source=hp&biw=1440&bih=650&ei=wMDYaamjPPmOvr0Puvf6oA8&iflsig=AFdpzrgAAAAAadjO0f2yGUkU1NtSaIksA80dthOrqlgd&ved=0ahUKEwipg8OZ-uKTAxV5h68BHbq7HvQQ4dUDCBc&uact=5&oq=random&gs_lp=EgNpbWciBnJhbmRvbTIFEAAYgAQyCBAAGIAEGLEDMgsQABiABBixAxiDATIIEAAYgAQYsQMyCBAAGIAEGLEDMggQABiABBixAzIIEAAYgAQYsQMyCBAAGIAEGLEDMgUQABiABDIFEAAYgARIiAxQAFjQB3AAeACQAQCYAboBoAHQBqoBAzAuNrgBA8gBAPgBAYoCC2d3cy13aXotaW1nmAIGoALxBsICDhAAGIAEGLEDGIMBGIoFmAMAkgcDMC42oAfSHbIHAzAuNrgH8QbCBwUwLjMuM8gHFIAIAA&sclient=img&udm=2";
  await artist_image_page.goto(url);

  // Locate the search box <textarea title='Search'
  let search_boxes = await artist_image_page.locator(
    `textarea[aria-label="Search"]`,
  );
  await search_boxes.waitFor({ state: "visible", timeout: 5000 });
  let search_box = search_boxes.first();

  // Type artist name with keyword 'artist' in the text area and hit enter
  await search_box.fill(`${artist_name} artist`);
  await search_box.press("Enter");

  // Check if image exists
  let images = await artist_image_page.locator("div#search img");
  await images.waitFor({ state: "visible", timeout: 5000 });
  let img_count = images.count();
  if (img_count > 0) {
    let first_image = images.first();
    let image_url = first_image.getAttribute("src");
    return image_url;
  } else {
    return "";
  }
}

async function get_genre_image(genre, browser) {
  // web_browser = await open_url(
  //   `https://en.wikipedia.org/wiki/${artist_details.main_artist_name.replace(" ", "_")}`,
  // );
  // page = web_browser.page;
  genre_image_page = await browser.newPage();
  let url = `https://commons.wikimedia.org/w/index.php?search=${genre}&title=Special%3AMediaSearch&type=image`;
  await genre_image_page.goto(url);
  // Check if image exists
  let element_count = await genre_image_page
    .locator(".sdms-image-result img")
    .count();
  if (element_count > 0) {
    let genre_image_url = await genre_image_page
      .locator(".sdms-image-result img")
      .first()
      .getAttribute("src");
    return genre_image_url;
  } else {
    return "";
  }
}

async function get_category_image(category, browser) {
  // web_browser = await open_url(
  //   `https://en.wikipedia.org/wiki/${artist_details.main_artist_name.replace(" ", "_")}`,
  // );
  // page = web_browser.page;
  category_image_page = await browser.newPage();
  let url = `https://commons.wikimedia.org/w/index.php?search=${category}&title=Special%3AMediaSearch&type=image`;
  await category_image_page.goto(url);
  // Check if image exists
  let element_count = await category_image_page
    .locator(".sdms-image-result img")
    .count();
  if (element_count > 0) {
    let category_image_url = `${await category_image_page
      .locator(".sdms-image-result img")
      .first()
      .getAttribute("src")}`;
    return category_image_url;
  } else {
    return "";
  }
}
