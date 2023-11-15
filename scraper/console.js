function console_Title(title) {
  process.stdout.write(`\x1b]0;${title}\x1b\\`);
}

function colorConsole(colorCode, text) {
  console.log(`${colorCode}${text}\x1b[0m`);
}

module.exports = {
  console_Title,
  colorConsole,
};
