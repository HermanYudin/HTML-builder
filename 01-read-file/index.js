const fs = require('fs');
const path = require('path');

const reqStream = fs.createReadStream(path.join(__dirname, 'text.txt'), {
  encoding: 'UTF-8',
});

reqStream.on('data', (el) => console.log(el));
