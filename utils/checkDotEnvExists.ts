import fs from 'fs';

function checkDotEnvExists(): void {
  const MESSAGE = `File .env was not found.
Please create a .env file before running the script.
You can use a sample.env as sample configuration.
See the README file for more information.`;

  if (!fs.existsSync('.env')) {
    throw new Error(MESSAGE);
  }
}

export default checkDotEnvExists;
