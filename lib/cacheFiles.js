var fs = require('fs-extra');
var path = require('path');
var chokidar = require('chokidar');

function cache () {

  this.fileCache = {};

}

cache.prototype.load = function (filePath) {

  var self = this;

  if (typeof this.fileCache[filePath] !== 'undefined') {
    console.log('from cache');
    return this.fileCache[filePath];
  } else {
    console.log('NOT from cache');
    var exists = fs.existsSync(filePath);

    if (exists) {
      var isDir = fs.lstatSync(filePath).isDirectory();

      if (!isDir) {

        if (path.extname(filePath) === '.json') {

          chokidar.watch(filePath).on('change', function (event, path) {
            self.fileCache[filePath] = fs.readJsonSync(filePath);
          });

          this.fileCache[filePath] = fs.readJsonSync(filePath);

        } else {

          chokidar.watch(filePath).on('change', function (event, path) {
            self.fileCache[filePath] = fs.readSync(filePath);
          });

          this.fileCache[filePath] = fs.readSync(filePath);

        }

        console.log('loging NOT cache', filePath, this.fileCache[filePath]);
        return this.fileCache[filePath];

      } else {
        return false;
        // cache all files within folder?
      }

    } else {
      return false;
    }

  }

}

module.exports = new cache();
