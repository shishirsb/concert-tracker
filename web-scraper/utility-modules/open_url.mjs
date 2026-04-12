// const { chromium, firefox, webkit } = require("playwright");
import { chromium, firefox, webkit } from "playwright";

const browser = await chromium.launch({ headless: false }); // Or 'firefox' or 'webkit'.

export async function open_url(url) {
  try {
    const page = await browser.newPage();
    page.setDefaultTimeout(50000);
    await page.goto(url, { timeout: 10000 });

    return { browser: browser, page: page };
  } catch (error) {
    console.log(`Error opening ${url}`);
    console.log(error);
    return null;
  }
}
