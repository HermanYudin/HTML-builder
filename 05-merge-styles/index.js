const fs = require('fs');
const path = require('path');
const arr = [];

async function writeStyles(readable) {
  for await (const el of readable) {
    arr.push(el);
  }

  const complex = fs.createWriteStream(
    path.join(__dirname, 'project-dist', 'bundle.css'),
  );
  arr.forEach((css) => {
    complex.write(css);
  });
}

fs.readdir(
  path.join(__dirname, 'styles'),
  { withFileTypes: true }, (err, elem) => {
    elem.forEach((item) => {
      const extName = path.extname(item.name);

      if (extName === '.css') {
        const readComplex = fs.createReadStream(
          path.join(__dirname, 'styles', item.name),
          'utf8',
        );
        writeStyles(readComplex);
      }
    });
  },
);