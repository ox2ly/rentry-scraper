const fs = require("fs");

function checkFiles() {
  if (!fs.existsSync("./data")) {
    fs.mkdirSync("./data");
  }
  if (!fs.existsSync("./scrape_logs")) {
    fs.mkdirSync("./scrape_logs");
  }

  if (!fs.existsSync("./scrape_logs/scraped_ids.json")) {
    fs.writeFileSync("./scrape_logs/scraped_ids.json", "[]");
  }

  if (!fs.existsSync("./scrape_logs/notvalid.json")) {
    fs.writeFileSync("./scrape_logs/notvalid.json", "[]");
  }
  console.log("Files checked");
}

function readFromFile(filePath) {
  try {
    const data = fs.readFileSync(filePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

function writeToFile(filePath, ids) {
  fs.writeFileSync(filePath, JSON.stringify(ids, null, 2), "utf8");
}

module.exports = {
  readFromFile,
  writeToFile,
  checkFiles,
};
