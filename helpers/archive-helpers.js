var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var http = require('http');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(callback) {
  fs.readFile(exports.paths.list, 'utf8', (err, data) => {
    if (err) {
      throw err;
    }
    var urlArray = data.split('\n');
    callback(urlArray);
  });
};

exports.isUrlInList = function(url, callback) {
  exports.readListOfUrls(function(urls) {
    callback(_.contains(urls, url));
  });
};

exports.addUrlToList = function(url, callback) {
  fs.appendFile(exports.paths.list, url + '\n', (err) => {
    if (err) {
      console.log('error on addUrlToList');
      throw err;
    }
    callback();
  });
};

exports.isUrlArchived = function(url, callback) {
  fs.stat(exports.paths.archivedSites + '/' + url, (err) => {
    err ? callback(false) : callback(true);
  });

};

exports.downloadUrls = function(urls) {
  _.each(urls, (url) => {
    exports.isUrlArchived(url, (exists) => {
      if (!exists) {
        // TODO: fix the download of urls to the file
        // fs.writeFileSync(exports.paths.archivedSites + '/' + url, (url + 'test file'));
        exports.downloadUrl(url, (data) => {
          fs.writeFile(exports.paths.archivedSites + '/' + url, data);
        });
      }
    });
  });
};

exports.downloadUrl = function(url, callback) {
  var options = {
    host: url,
    port: 80,
    path: '/'
  };
  var content = '';
  var req = http.request(options, function(res) {
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      content += chunk;
      callback(content);
    });

    res.on('end', function () {
      //console.log(content);
    });

  });
  req.end();
};




