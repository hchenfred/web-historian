var path = require('path');
var archive = require('../helpers/archive-helpers');
var fs = require('fs');
var querystring = require('querystring');
// require more modules/folders here!


var readFileAndDisplay = function(url, statusCode, response) {
  fs.readFile(url, 'utf8', (err, html) => {
    if (err) {
      throw err;
    }
    response.writeHead(statusCode, {'Content-Type': 'text/html'});
    response.write(html);
    response.end();
  });

};

exports.handleRequest = function (req, res) {
  if (req.method === 'GET') {
    console.log('handling GET request ========>>');
    if (req.url === '/') {
      var url = archive.paths.siteAssets + '/index.html';
      console.log(url);
      readFileAndDisplay(url, 200, res);
    }

    archive.isUrlInList(req.url, (isInList) => {
      if (isInList) {
        archive.isUrlArchived(req.url, (exists) => {
          if (exists) { // url exists in both sites.txt and archive, load the page from archive
            var url = archive.paths.archivedSites + req.url;
            readFileAndDisplay(url, 200, res);
          } else { // url exists in the list but not in archive yet
            var url = archive.paths.siteAssets + '/loading.html';
            readFileAndDisplay(url, 200, res);
          }
        });  
      } else {
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.end();
      }
    });

  } else if (req.method === 'POST') {
    console.log('handling POST==========>>');
    req.on('data', function(chunk) {
      var chunkString = '';
      chunkString += chunk;
      var parseChunk = querystring.parse(chunkString);

      archive.isUrlInList(parseChunk.url, (isInList) => { 
        if (!isInList) { // url is not in the list, add it to the list and load loading.html
          archive.addUrlToList(parseChunk.url, () => {
            var url = archive.paths.siteAssets + '/loading.html';
            readFileAndDisplay(url, 302, res);
          });
        } else if (isInList) {  // url is in the list then check if it's in the archive
          archive.isUrlArchived(parseChunk.url, (exists) => { 
            if (exists) { // url is in the archive
              var url = archive.paths.archivedSites + '/' + parseChunk.url;
              console.log(parseChunk.url);
              readFileAndDisplay(url, 302, res);
            } else { //url is not in the archive
              var url = archive.paths.siteAssets + '/loading.html';
              readFileAndDisplay(url, 302, res);
            }

          });  

        }
      });
    }); 
  }
};
