const fs = require('fs');
const path = require('path');
const readLine = require('readline');

const mainFile = path.join(__dirname, 'write-file.txt');
const wrtStream = fs.createWriteStream(mainFile);
const readFile = readLine.createInterface(process.stdin, process.stdout);
const { stdin, stdout } = process;

readFile.write('Hello! Please, enter your text\n');

readFile.on('line', (string) => {
  if (string === 'exit') {
    stdout.write('Bye and come back please! :)');
    process.exit();
  }
  wrtStream.write(string + '\n');
});

readFile.on('SIGINT', () => {
  stdout.write('Bye and come back please! :)');
  process.exit();
});
