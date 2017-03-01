var path = require('path');
var archive = require('../helpers/archive-helpers');
var fs = require('fs');
// require more modules/folders here!

exports.handleRequest = function (req, res) {
  if (req.method === 'GET') {
    fs.readFile(archive.paths.siteAssets + '/index.html', (err, html) => {
      if (err) {
        throw err;
      }
      res.write(html);
      res.end();
    });
  }
  // res.end(archive.paths.list);
};
