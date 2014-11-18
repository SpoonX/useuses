var path  = require('path'),
    async = require('async'),
    fs    = require('fs');

function File (options) {
  this.options = options;
}

/**
 * Resolve a file to an absolute path.
 *
 * @param {string}   filePath
 * @param {string}   [callerFilePath]
 * @param {function} done
 */
File.prototype.resolve = function (filePath, callerFilePath, done) {
  var searchPaths = this.composeSearchPaths(filePath, callerFilePath);

  async.detectSeries(searchPaths, fs.exists, done);
};

/**
 * Compose an array of searchPaths for `filePath`.
 *
 * @param {string} filePath
 * @param {string} [callerFilePath]
 *
 * @returns {[]}
 */
File.prototype.composeSearchPaths = function (filePath, callerFilePath) {
  // If this is a direct file, with no parent, or doesn't have a relative path, use path.resolve.
  if (!callerFilePath || !filePath.match(/^\..?\//)) {
    return [path.resolve(filePath)];
  }

  return [
    path.join(path.dirname(callerFilePath), filePath),
    path.resolve(filePath)
  ];
};

/**
 * Write an array of paths, combined (appended) to `filePath`
 *
 * @param {string}   filePath
 * @param {[]}       combined
 * @param {function} done
 */
File.prototype.writeCombined = function (filePath, combined, done) {
  var initialContent = this.options.w ? '(function () {\n' : '',
      self           = this,
      destinationStream,
      sourceStream;

  // Create a new file, and write the initial content.
  fs.writeFile(filePath, initialContent, function (error) {
    if (error) {
      return done(error);
    }

    async.eachSeries(combined, function (sourceFilePath, callback) {
      destinationStream = fs.createWriteStream(filePath, {flags: 'a'});
      sourceStream      = fs.createReadStream(sourceFilePath);

      sourceStream.pipe(destinationStream).on('finish', function () {
        callback();
      });
    }, function () {
      if (!self.options.w) {
        return done();
      }

      fs.appendFile(filePath, '\n})();', done);
    });
  });
};

module.exports = File;
