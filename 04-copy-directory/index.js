const fs = require('fs');
const path = require('path');

const mainFolder = path.join(__dirname, 'files');
const copyFolder = path.join(__dirname, 'files-copy');

fs.mkdir(copyFolder, { recursive: true }, (err) => {
  if (err) throw err;
});

fs.readdir(copyFolder, (err, files) => {
  if (err) throw err;
  for (let file of files) {
    fs.unlink(path.join(copyFolder, file), (err) => {
      if (err) throw err;
    });
  }
});

fs.readdir(mainFolder, (err, files) => {
  if (err) throw err;
  files.forEach((el) => {
    let copyOfFile = path.join(copyFolder, `${el}`);
    let sourceFile = path.join(mainFolder, `${el}`);
    fs.createReadStream(sourceFile).pipe(fs.createWriteStream(copyOfFile));
  });
});
