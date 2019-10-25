const path = require('path');
const fs = require('fs');

let files = fs.readdirSync('./kanji/');

files = files.filter((el) => el.slice(-3) === 'svg');

// During dev, only 20 items
files = files.slice(0, 20);

console.log(files);