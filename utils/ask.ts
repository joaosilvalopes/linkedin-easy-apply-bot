import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function ask(str: string): Promise<string> {
  return new Promise(resolve => {
    rl.question(`${str}\n`, resolve);
  });
}

export default ask;
