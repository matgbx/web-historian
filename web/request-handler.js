const path = require('path');
const archive = require('../helpers/archive-helpers');
const fs = require('fs');
const httpHelpers = require('./http-helpers');
// require more modules/folders here!

const inputFile = '/index.html';
const loadingFile = '/loading.html';
exports.handleRequest = function (req, res) {
  // all user inputs are POST method
  // archive.readListOfUrls();
  let headers = {
    'Content-Type': 'text/html'
  };
  if ( req.method === 'GET') {
    if (req.url === '/') {
      httpHelpers.serveAssets(res, `${archive.paths.siteAssets}${inputFile}`, (data) => {
        res.writeHead(200, httpHelpers.headers);
        res.end(data);
      });  
    } else {
      let urlClean = req.url.slice(1);
      archive.isUrlArchived(urlClean, (err, exists) => {
        if (exists) {
          httpHelpers.serveAssets(res, `${archive.paths.archivedSites}${req.url}`, (data) => {
            res.end(data);
          }); 
        } else {
          httpHelpers.serveAssets(res, `${archive.paths.siteAssets}${loadingFile}`, (data) => {
            res.writeHead(404, httpHelpers.headers);
            res.end(data);
          });
        }
      });
    } 
  } else if ( req.method === 'POST') {
    // concat Buffer chunks of body message
    
    body = [];
    req.on('data', (chunk) => {
      body.push(chunk);
    }).on('end', () => {
      body = Buffer.concat(body).toString().slice(4);
      console.log(body);
      archive.isUrlArchived(body, (err, exists) => {
        console.log('exists should be false', exists);
        if (exists) {
          httpHelpers.serveAssets(res, `${archive.paths.archivedSites}/${body}`, (data) => {
            res.writeHead(302, httpHelpers.headers);
            res.end(data);
          });
        } else {
          archive.addUrlToList(body, (err, exists) => {
            httpHelpers.serveAssets(res, `${archive.paths.siteAssets}${loadingFile}`, (data) => {
              res.writeHead(302, httpHelpers.headers);
              res.end(data);
            });
          });
        }
      });
      
    });
  }

};
