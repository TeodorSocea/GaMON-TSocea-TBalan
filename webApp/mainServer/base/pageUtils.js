const path = require('path');

const frontFolder = path.join(__dirname, "../../front");

const pagePath = {
    '.html': '../pages',
    '.css': '/style',
    '.js': '/scripts',
    '.png': '/resources',
    '.jpg': '/resources',
  };

module.exports = (ext) => {
    return pagePath[ext] ? (ext === '.html' ? path.join(__dirname, pagePath[ext]) : path.join(frontFolder, pagePath[ext])) : undefined;
}