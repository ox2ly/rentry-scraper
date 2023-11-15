function formatTime(elapsedTime) {
  const days = Math.floor(elapsedTime / (60 * 60 * 24));
  const hours = Math.floor((elapsedTime % (60 * 60 * 24)) / (60 * 60));
  const minutes = Math.floor((elapsedTime % (60 * 60)) / 60);
  const seconds = Math.floor(elapsedTime % 60);

  const parts = [];

  if (days > 0) {
    parts.push(`${days}d`);
  }

  if (hours > 0) {
    parts.push(`${hours}h`);
  }

  if (minutes > 0) {
    parts.push(`${minutes}m`);
  }

  if (seconds > 0) {
    parts.push(`${seconds}s`);
  }

  return parts.join(" ");
}

module.exports = {
  formatTime,
};
