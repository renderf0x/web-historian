var path = require('path');
var archive = require('../helpers/archive-helpers');
var httpHelpers = require('./http-helpers.js');
// require more modules/folders here!

exports.handleRequest = function (req, res) {
  //need to grab the user submitted url

  if(req.url === '/'){
    httpHelpers.serveAssets(res, './public/index.html', function() {})
  } else {
    //should later refactor to modify header if it is a css file
    httpHelpers.serveAssets(res, path.join(archive.paths.siteAssets,req.url), function() {})
  }
  //res.end(archive.paths.list);
};
