const rlp = require('readline');

const rl = rlp.createInterface({
  input: process.stdin,
  output: process.stdout
});

function ask(str) {
  return new Promise(resolve => {
    rl.question(str + "\n", resolve);
  });
}

module.exports = ask;
