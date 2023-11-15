const fs = require("fs");
const path = require("path");
const axios = require("axios");

const { formatTime } = require("./time");
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

    const url = "https://rentry.co/" + urlID + "/raw";
    const logFile = path.join("./data", `${urlID}.txt`);

    try {
      const response = await axios.get(url);
      const foundText = response.data;
      const completeUrl = url;
      colorConsole("\x1b[32m", `[VALID] URL: ${completeUrl}`);
      fs.writeFileSync(
        logFile,
        `URL: ${completeUrl}\nContent ⬇\n\n${foundText}`
      );
      scrapedIds.push(urlID);
      writeToFile(scrapedIdsFile, scrapedIds);
    } catch (error) {
      colorConsole("\x1b[35m", `[NO CONTENT] ID: ${urlID}`);
      notValidIds.push(urlID);
      writeToFile(notValidIdsFile, notValidIds);
    }

    const consoleTitle = `Valid: ${scrapedIds.length} | Total Scraped: ${
      scrapedIds.length + notValidIds.length
    } | Elapsed Time: ${formattedElapsedTime}`;

    console_Title(consoleTitle);
    await new Promise((resolve) => setTimeout(resolve, 200)); //edit this to make it faster or slower
  } while (true);
}

module.exports = scrape;
