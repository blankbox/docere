var fs = require('fs-extra');

var files = [];
function getProjects (folder) {

    var fileContents = fs.readdirSync(folder);

    var projects = fileContents.map(function (fileName) {

      var current = folder + '/' + fileName;

      var stats = fs.lstatSync(current);

      if (stats.isDirectory()) {
        return {
          name: fileName,
          url: 'http://localhost:3000/' + fileName

        };

      } else {
        return 'false';
      }

    });

    return projects;

};

function getResourceConfigs (project, name) {
  var resource = cache.load(__dirname + '/source/resources/' + name + '.json');
  return resource;
}

function getImplementationConfigs (project, name) {
  var implementations = cache.load(__dirname + '/source/implementations/' + name + '.json');
  return implementations;
}

function getConfigs (project, name, type) {
  var config = cache.load(__dirname + '/projects/' + project + '/source/' + type + 's/' + name + '.json');
  console.log('project', project, name, type, config);
  return config;
}



function buildConfig (project) {
  var fullConfig = {};

  for (var i = 0; i < load.length; i++) {

    var endpoint = load[i];

    var resource = getConfigs(project, endpoint, 'implementation');
    var implementations = getConfigs(project, endpoint, 'resource');


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

// ##### Exmaple Server ##### //

var express = require('express');
var app = express();

app.listen(3000);

app.get('/:project_name', function (req, res, next) {

  res.json(buildConfig(req.params.project_name));

})

app.get('/', function (req, res, next) {

  res.json(getProjects(__dirname + '/projects'))

})
