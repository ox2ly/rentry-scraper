const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");

const { formatTime, getCurrentTime } = require("./time");
const { colorConsole, console_Title } = require("./console");
const { readFromFile, writeToFile } = require("./file");

function genId() {
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_-";
  const length = Math.floor(Math.random() * 6) + 1;
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

const scrapedIdsFile = path.join("./scrape_logs", "scraped_ids.json");
const notValidIdsFile = path.join("./scrape_logs", "notvalid.json");

async function scrape() {
  const startTime = new Date().getTime();
  const scrapedIds = readFromFile(scrapedIdsFile);
  const notValidIds = readFromFile(notValidIdsFile);
  urlID = genId();

  do {
    const elapsedTime = (new Date().getTime() - startTime) / 1000;
    const formattedElapsedTime = formatTime(elapsedTime);

    urlID = genId();
    if (notValidIds.includes(urlID)) {
      colorConsole("\x1b[31m", `[NOT VALID] ID: ${urlID}`);
      continue;
    }
    if (scrapedIds.includes(urlID)) {
      colorConsole("\x1b[35m", `[ALREADY SCRAPED] ID: ${urlID}`);
      continue;
    }

    const url = "https://rentry.co/" + urlID;
    const logFile = path.join("./data", `${urlID}.txt`);

    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    await page.goto(url);

    const textElement = await page.$(".entry-text");
    const textFound = textElement !== null;

    if (textFound) {
      const foundText = await page.evaluate(
        (element) => element.textContent.trim(),
        textElement
      );

      const pubDateElement = await page.$(".float-right.text-right");
      const pubText = pubDateElement
        ? await page.evaluate(
            (pubDateElement) => pubDateElement.textContent.trim(),
            pubDateElement
          )
        : "N/A";
      const dateRegex = /Pub: (.+?)\s+/;

      const pubDate = dateRegex.exec(pubText)?.[1] || "N/A";
      const completeUrl = page.url();
      const currentDateTime = getCurrentTime();
      colorConsole("\x1b[32m", `[VALID] URL: ${completeUrl}`);
      fs.writeFileSync(
        logFile,
        `ID: ${urlID}\nURL: ${completeUrl}\nTIME: ${currentDateTime}\nPublication Date: ${pubDate}\nText: ${foundText}\n`
      );
      scrapedIds.push(urlID);
      writeToFile(scrapedIdsFile, scrapedIds);
      await browser.close();
    } else {
      colorConsole("\x1b[35m", `[NO TEXT] ID: ${urlID}`);
      notValidIds.push(urlID);
      writeToFile(notValidIdsFile, notValidIds);
      await browser.close();
    }
    const consoleTitle = `Valid: ${scrapedIds.length} | Total Scraped: ${
      scrapedIds.length + notValidIds.length
    } | Elapsed Time: ${formattedElapsedTime}`;

    console_Title(consoleTitle);
    await new Promise((resolve) => setTimeout(resolve, 200)); //edit this to make it faster or slower
  } while (true);
}

module.exports = scrape;
