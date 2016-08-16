var fs = require('fs-extra');

var files = [];
function getFilesRecursive (folder) {


    var fileContents = fs.readdirSync(folder),
        fileTree = [],
        stats;

    fileContents.map(function (fileName) {

      var current = folder + '/' + fileName;

      var stats = fs.lstatSync(current);

      if (stats.isDirectory()) {
        // console.log('current', current, getFilesRecursive(current).map(function (filename) {return current + '/' + filename;}));
        getFilesRecursive(current)
      } else {
        files.push(current);
        // files.push(current)
      }

    });

    // console.log('output', fileContents);

    return files;

};

function getConfigFiles (name) {

  var resource = cache.load(__dirname + '/source/resources/' + name + '.json')
  var implementations = cache.load(__dirname + '/source/implementations/' + name + '.json')

  return [resource, implementations]

}

var cache = require('./lib/cacheFiles.js');

var obj = cache.load(__dirname + '/source/config.json');
var load = obj.loadResources;

for (var i = 0; i < load.length; i++) {
  // console.log('user config', getConfigFiles(load[i]));
}

setInterval(function () {
  console.log('tick', cache.load(__dirname + '/source/config.json'));
}, 2000)
