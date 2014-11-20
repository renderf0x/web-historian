var path = require('path');
var archive = require('../helpers/archive-helpers');
var httpHelpers = require('./http-helpers.js');
// require more modules/folders here!

exports.handleRequest = function (req, res) {
  //need to grab the user submitted url
  if(req.method === 'GET'){
    if(req.url === '/'){
      httpHelpers.serveAssets(res, './public/index.html', function() {})
    } else if (req.url.slice(-3)==='css'){
      //should later refactor to modify header if it is a css file
      httpHelpers.serveAssets(res, path.join(archive.paths.siteAssets,req.url), function() {})
    } else {
      httpHelpers.serveAssets(res, path.join(archive.paths.archivedSites,req.url), function() {})
    }
  } else if (req.method === 'POST'){
    var data = '';
    req.on('data', function(chunk){
      data += chunk;
    });
    req.on('end',function() {
      data = data.slice(4);

      archive.isURLArchived(data,
        function() {
          /*httpHelpers.serveAssets(res, path.join(archive.paths.archivedSites,data), function() {});*/
          res.statusCode = 302;
          res.setHeader("Location", data);
          res.end();
        },
        function() {
            archive.addUrlToList(data);
            httpHelpers.serveAssets(res, './public/loading.html', function() {})
        }
      );

    })
  }
  //res.end(archive.paths.list);
};
