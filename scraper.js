const scraper = require("./scraper/scraper");
const filelogic = require("./scraper/file");
const colorConsole = require("./scraper/console");

function main() {
  filelogic.checkFiles();
  colorConsole.colorConsole("\x1b[32m", `Starting scraper`);
  colorConsole.colorConsole(
    "\x1b[32m",
    `Discord: https://discord.com/invite/pc4CgYNArN`
  );
  scraper();
}

main();
