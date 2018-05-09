const path = require("path");
const fs = require("fs");

const configDir = path.join(__dirname, "src", "config");
const exampleConfig = path.join(configDir, "index.example.js");
const liveConfig = path.join(configDir, "index.js");

if (!fs.existsSync(liveConfig)) {
  fs.copyFileSync(exampleConfig, liveConfig);
}
