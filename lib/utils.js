const fs = require("fs");

const fromJSONFile = (filepath) => () => {
  if (!filepath) return [];
  const fileContents = fs.readFileSync(filepath);
  return JSON.parse(fileContents);
}

module.exports = {fromJSONFile};