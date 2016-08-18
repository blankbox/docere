var fs = require('fs-extra');
var cache = require('./lib/cacheFiles.js');

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

var glob = require("glob")
var glob = require('glob-fs')({ gitignore: true });

function getVersions (project) {

    var files = {}

    var fileContents = glob.readdirSync('projects/test/*');

    var projects = fileContents.map(function (fileName) {

      var parts = fileName.split('/');

      var current = __dirname + '/' + fileName;

      var stats = fs.lstatSync(current);

      if (stats.isDirectory()) {
        console.log('dir', fileName);

        if (typeof files[parts[2]] == 'undefined') {
          files[parts[2]] = {};
        }

        files[parts[2]] = {
          name: parts[1],
          version: parts[2],
          url: 'http://localhost:3000/' + parts[1] + '/' + parts[2]
        };

      } else {
        return null;
      }

    });

    return files;

};

function getConfigs (project, name, version, type) {
  var path = __dirname + '/projects/' + project + '/' + version + '/' + type + 's/' + name + '.json'
  var config = cache.load(path);
  return config;
}

function getProjectConfig (project, version) {
  var path = __dirname + '/projects/' + project + '/' + version + '/config.json'
  var config = cache.load(path);
  return config;
}

function buildConfig (project, version) {
  var fullConfig = getProjectConfig(project, version);

  for (var i = 0; i < load.length; i++) {

    var endpoint = load[i];

    var resource = getConfigs(project, endpoint, version, 'resource');
    var implementations = getConfigs(project, endpoint, version, 'implementation');


    var paths = Object.keys(resource);

    for (var j = 0; j < paths.length; j++) {
      var currentPath =  paths[j];
      var verbs = Object.keys(resource[currentPath]);

      console.log('verbs', verbs);


      if (typeof fullConfig[currentPath] === 'undefined') {
        fullConfig[currentPath] = resource[currentPath];
        fullConfig[currentPath].name = resource.name
      }

      fullConfig[currentPath].implementations = implementations[currentPath].implementations;

      console.log(endpoint, 'config', currentPath);
    }

  }

  return fullConfig;
}


var express = require('express');
var app = express();

app.listen(3000);

app.get('/:project_name', function (req, res, next) {

  res.json(getVersions(req.params.project_name));

})

app.get('/:project_name/:project_version', function (req, res, next) {

  res.json(buildConfig(req.params.project_name, req.params.project_version));

})

console.log('project', getProjects(__dirname + '/projects'));

app.get('/', function (req, res, next) {

  res.json(getProjects(__dirname + '/projects'))

})
