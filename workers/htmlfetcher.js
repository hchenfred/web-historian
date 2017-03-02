// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.




var archive = require('../helpers/archive-helpers');

//Expected Behavior:
//checks the urls in sites.txt
var scheduler = function() {
  archive.readListOfUrls((urls) => {
    archive.downloadUrls(urls);
  });
};
//if the url is not in the archive
  //download the files of the url
//setup cron to schedule the scheduler

//01 * * * *  /usr/local/bin/node /Users/student/Desktop/hrsf72-web-historian/workers/htmlfetcher.js
console.log('Scheduler: >----------->');
scheduler();