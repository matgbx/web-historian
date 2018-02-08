var path = require('path');
var archive = require('../helpers/archive-helpers');
// require more modules/folders here!

exports.handleRequest = function (req, res) {
  // all user inputs are POST method
  // archive.readListOfUrls();
  
  res.end(archive.paths.list);
};
