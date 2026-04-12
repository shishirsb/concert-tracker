import fs from "node:fs";

export async function write_page_html_to_file(page) {
  const page_content = await page.content();

  try {
    fs.writeFileSync("./dom.html", page_content);
    // file written successfully
  } catch (err) {
    console.error(err);
  }
}
