var fs = require('fs-extra');

var files = [];
function getProjects (folder) {

    var fileContents = fs.readdirSync(folder);

    fileContents.map(function (fileName) {

      var current = folder + '/' + fileName;

      var stats = fs.lstatSync(current);

      if (stats.isDirectory()) {
        return current;
      } else {
        return 'false';
      }

    });

    return fileContents;

};

function getResourceConfigs (name) {
  var resource = cache.load(__dirname + '/source/resources/' + name + '.json');
  return resource;
}

function getImplementationConfigs (name) {
  var implementations = cache.load(__dirname + '/source/implementations/' + name + '.json');
  return implementations;
}


function buildConfig (name) {
  var fullConfig = {};

  for (var i = 0; i < load.length; i++) {

    var endpoint = load[i];

    var resource = getResourceConfigs(endpoint);
    var implementations = getImplementationConfigs(endpoint);

    var paths = Object.keys(resource);

    for (var j = 0; j < paths.length; j++) {
      var currentPath =  paths[j];

      if (typeof fullConfig[currentPath] === 'undefined') {
        fullConfig[currentPath] = resource[currentPath];
      }

      fullConfig[currentPath].implementations = implementations[currentPath];

      console.log(endpoint, 'config', currentPath);
    }

  }

  return fullConfig;
}


var cache = require('./lib/cacheFiles.js');

var obj = cache.load(__dirname + '/source/config.json');
var load = obj.loadResources;


var express = require('express');

var app = express();

app.listen(3000);

app.get('*', function (req, res, next) {
  res.json(getProjects(__dirname + '/source'))

  // res.json(buildConfig());
})
