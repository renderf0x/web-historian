var fs = require('fs');
var path = require('path');
var httpGet = require('http-request');
var _ = require('underscore');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  'siteAssets' : path.join(__dirname, '../web/public'),
  'archivedSites' : path.join(__dirname, '../archives/sites'),
  'list' : path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for jasmine tests, do not modify
exports.initialize = function(pathsObj){
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(callback){
  fs.readFile(exports.paths.list, 'utf8', function(err, data) {
    if(err) throw err;
    callback(data.split('\n'));
  });
};

// exports.readListOfUrls(console.log);

exports.isUrlInList = function(url, successCB, failCB){
  successCB = successCB || _.identity;
  failCB = failCB || _.identity;
  exports.readListOfUrls(function(urlList) {
    if(_.contains(urlList, url)){
      successCB(urlList, url);
    } else {
      console.log('URL not in list');
      failCB(urlList, url);
    }
  });
};

// exports.isUrlInList('www.google.com',console.log);
// exports.isUrlInList('www.google1.com', console.log);

exports.addUrlToList = function(url){
  exports.isUrlInList(url, function(){}, function(urlList, url){
    fs.appendFile(exports.paths.list, url+'\n');
  });
};

exports.addUrlToList('www.urmama.com');

exports.isURLArchived = function(url, successCB, failCB){
  //console.log(path.join(exports.paths.archivedSites, url));
  fs.exists(path.join(exports.paths.archivedSites, url), function(exists){
    if (exists){
      // console.log('exists!');
      successCB(url);
    } else {
      // console.log('does not exist!')
      failCB(url);
    }
  })
};

//exports.isURLArchived('www.google.com', console.log, function(){});

exports.downloadUrl = function(url) {
  httpGet.get(url, path.join(exports.paths.archivedSites, url), function (err, res) {
    if (err) {
      console.error(err);
      return;
    }
    console.log(res.code, res.headers, res.file);
  });
};

exports.downloadUrls = function(){
  exports.readListOfUrls(function(listOfUrls){
    // console.log(listOfUrls);
    for (var i = 0; i < listOfUrls.length; i++){
      exports.isURLArchived(listOfUrls[i], function(){}, exports.downloadUrl);
    }
  });
};


//exports.downloadUrl('www.yahoo.com');
//exports.downloadUrls();
