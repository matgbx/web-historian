// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.



// will run downloadURLS
//will loop through URLS array - invoke isURLarchived on each URL
// if false
//push into an array
//rewrite to blank
// add back items in array to sites.txt

const archive = require('../helpers/archive-helpers');
const workerBee = () => {
  // set variable to collect urls from list
  let urlsOnList = [];
  archive.readListOfUrls((err, urls) => {
    urlsOnList = urls;
    urlsOnList.push('ALL DONE');
    archive.downloadUrls(urlsOnList, (remainingUrls) => {
      fs.writeFileSync(archive.paths.list, remainingUrls.join('\n'));
    });
  }); 
};