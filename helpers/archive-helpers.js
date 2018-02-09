var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var request = require('request');

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
  //  a list of to be URLS
  // pass in  fs.readfile(path, (err, data) =>)
  // creates array
  fs.readFile(exports.paths.list, (err, data)=> {
    // urls = data.toString().split('\n');
    urls = `${data}`.split('\n');
    callback(err, urls);
    
  });
};

exports.isUrlInList = function(url, callback) {
  // checks entire list for URL
  exports.readListOfUrls((err, urls) => {
    let exists = urls.includes(url);
    callback(err, exists);
  });
};

exports.addUrlToList = function(url, callback) {
  // adds URL to to be list for worker to add later - sites.text
  exports.isUrlInList(url, (err, exists)=> {
    if (!exists) {
      fs.appendFile(exports.paths.list, url + '\n', (err) => {
        callback(err, exists);
      });
    }
  });
};

exports.isUrlArchived = function(url, callback) {
  // checks to see if URL is in archived list - sites folder
  fs.readdir(exports.paths.archivedSites, (err, files) => {
    console.log('files', files);
    var exists = false;
    for (var i = 0; i < files.length; i++) {
      if (files[i] === url) {
        exists = true;
      }
    }
    callback(err, exists);
  });
};

exports.downloadUrls = function(urls, callback) {
  // pulls information from the internet to archived list
  // add to sites
  // remove from sites.text
  // urls.forEach((url) => {
  for (let url of urls) {
    if ( url === 'ALL DONE') {
      var array = [];
      urls.pop();
      urls.filter(url => { 
        return exports.isUrlArchived(url, (err, exists) => {
          if (!exists) {
            array.push(url);
          }
        });
      });
      callback(array);
    }
    request(`http://${url}`, (err, response, body) => {
      console.log('writing file to ', url);
      fs.writeFile(exports.paths.archivedSites + '/' + url, body); 
    });
  }
};
