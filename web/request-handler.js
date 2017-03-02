var path = require('path');
var archive = require('../helpers/archive-helpers');
var fs = require('fs');
var querystring = require('querystring');
// require more modules/folders here!

exports.handleRequest = function (req, res) {
  console.log('req.method', req.method);
  if (req.method === 'GET') {
    //console.log('req.url', req.url);
    if (req.url === '/') {
      fs.readFile(archive.paths.siteAssets + '/index.html', (err, html) => {
        if (err) {
          throw err;
        }
        res.write(html);
        // res.writeHead(200, {'Content-Type': 'text/html'});
        res.end();
      });
    }

    archive.isUrlInList(req.url, (isInList) => {
      if (isInList) {
        archive.isUrlArchived(req.url, (exists) => {
          if (exists) {
            fs.readFile(archive.paths.archivedSites + req.url, (err, html) => {
              if (err) {
                throw err;
              }
              res.write(html);
              // res.writeHead(200, {'Content-Type': 'text/html'});
              res.end();
            });
          } else {
            fs.readFile(archive.paths.siteAssets + '/loading.html', (err, html) => {
              if (err) {
                throw err;
              }
              res.write(html);
              // res.writeHead(200, {'Content-Type': 'text/html'});
              res.end();
            });

          }

        });  

      } else {
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.end();
      }

    });

  } else if (req.method === 'POST') {
    req.on('data', function(chunk) {
      var chunkString = '';
      chunkString += chunk;
      var parseChunk = querystring.parse(chunkString);

      archive.isUrlInList(parseChunk.url, (isInList) => {
        if (!isInList) {
          archive.addUrlToList(parseChunk.url, () => {});
          fs.readFile(archive.paths.siteAssets + '/loading.html', (err, html) => {
            if (err) {
              throw err;
            }
            res.writeHead(302, {'Content-Type': 'text/html'});
            res.write(html);
            res.end();
          });
        }
      });
    });


    
  }
  // res.end(archive.paths.list);
};
