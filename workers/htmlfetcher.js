// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.
const CronJob = require('cron').CronJob;
const archive = require('../helpers/archive-helpers');
const fs = require('fs');



// will run downloadURLS
//will loop through URLS array - invoke isURLarchived on each URL
// if false
//push into an array
//rewrite to blank
// add back items in array to sites.txt

const workerBee = () => {
  // set variable to collect urls from list
  let urlsOnList = [];
  console.log('inside workerBee');
  archive.readListOfUrls((err, urls) => {
    console.log('reading list of urls: ', urls[0]);
    urls.pop();
    urls.push('ALL DONE');
    urlsOnList = urls;
    console.log('urlsOnList: ---> ', urlsOnList);
    archive.downloadUrls(urlsOnList, (remainingUrls) => {
      fs.writeFile(archive.paths.list, remainingUrls.join('\n'));
    });
  }); 
};

// new CronJob('* 2 * * * *', function() {
//   workerBee();
// }, null, true, 'America/Los_Angeles');'
module.exports = workerBee;