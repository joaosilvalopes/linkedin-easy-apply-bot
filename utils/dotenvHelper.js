const fs = require('fs');

function checkDotEnvExists() {
  const MESSAGE = "File .env was not found. \
Please create a .env file before running the script. \
You can use a sample.env as sample configuration.";

  if (!fs.existsSync('.env')) {
    throw new Error(MESSAGE);
  }
}

module.exports = {
  checkDotEnvExists
}