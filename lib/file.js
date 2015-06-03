var path   = require('path'),
    async  = require('async'),
    http   = require('http'),
    mkdirp = require('mkdirp'),
    https  = require('https'),
    url    = require('url'),
    fs     = require('fs');

function File (options) {
  this.options = options;
}

function getProtocolModule (source) {
  var parsedUrl = url.parse(source, false);

  return parsedUrl.protocol === 'https:' ? https : http;
}

/**
 * Check if provided `suspect` is a url.
 * @param {string} suspect
 *
 * @returns {boolean}
 */
File.prototype.isUrl = function (suspect) {
  return !!suspect.match(/^https?:\/\/.*?\./);
};

/**
 * Resolve a file to an absolute path.
 *
 * @param {string}   filePath
 * @param {string}   [callerFilePath]
 * @param {function} done
 */
File.prototype.resolve = function (filePath, callerFilePath, done) {
  var self = this;

  if (this.isUrl(filePath)) {
    return done(filePath, true);
  }

  var searchPaths = this.composeSearchPaths(filePath, callerFilePath);

  async.detectSeries(searchPaths, function (searchPath, callback) {
    if (!self.isUrl(searchPath)) {
      return fs.stat(searchPath, function (error, stats) {
        callback(!error && stats.isFile());
      });
    }

    var protocolModule = getProtocolModule(searchPath),
        statusCheckRequest;

    statusCheckRequest = protocolModule.get(searchPath, function (res) {
      callback(res.statusCode >= 200 && res.statusCode < 400);

      statusCheckRequest.destroy();
    });
  }, function (match) {
    if (match && self.isUrl(match)) {
      return done(match, true);
    }

    done(match);
  });
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
  var searchPaths = [],
      aliases,
      find;

  // If this is a direct file, with no parent, or doesn't have a relative path, use path.resolve.
  if (callerFilePath && filePath.match(/^\..?\//)) {
    searchPaths.push(path.resolve(path.join(path.dirname(callerFilePath), filePath)));
  }

  if (this.options.aliases) {
    aliases = this.options.aliases;

    Object.getOwnPropertyNames(aliases).forEach(function (alias) {
      find = new RegExp('^' + alias);

      if (!find.test(filePath)) {
        return;
      }

      var applied = filePath.replace(find, aliases[alias]);

      if (this.isUrl(aliases[alias])) {
        searchPaths.push(applied);
      } else {
        searchPaths.push(path.resolve(applied));

        if (this.options.rootDirectory) {
          searchPaths.push(path.resolve(path.join(this.options.rootDirectory, filePath.replace(find, aliases[alias]))));
        }
      }
    }, this);
  }

  searchPaths.push(path.resolve(filePath));

  if (this.options.search) {
    this.options.search.forEach(function (searchPath) {
      searchPaths.push(path.resolve(path.join(searchPath, filePath)));
    });
  }

  return searchPaths;
};

/**
 * Write an array of paths, combined (appended) to `filePath`
 *
 * @param {string}   filePath
 * @param {[]}       combined
 * @param {function} done
 */
File.prototype.writeCombined = function (filePath, combined, done) {
  var initialContent = this.options.wrap ? '(function () {\n' : '',
      self           = this,
      protocolModule,
      destinationStream;

  if (this.options.dryRun) {
    console.log('> Would write to "' + filePath + '":');
    console.log('- ' + combined.join('\n- '));

    return done();
  }

  mkdirp(path.dirname(filePath), function (error) {
    if (error) {
      return done(error);
    }

    // Create a new file, and write the initial content.
    fs.writeFile(filePath, initialContent, function (error) {
      if (error) {
        return done(error);
      }

      async.eachSeries(combined, function (sourceFilePath, callback) {
        if (self.options.verbose) {
          console.log('> Writing file ' + sourceFilePath);
        }

        function closeFile () {
          fs.appendFile(filePath, '\n', callback);
        }

        destinationStream = fs.createWriteStream(filePath, {flags: 'a'});

        if (!self.isUrl(sourceFilePath)) {
          fs.createReadStream(sourceFilePath).pipe(destinationStream).on('finish', function () {
            closeFile();
          });
        }

        if (self.isUrl(sourceFilePath)) {
          protocolModule = getProtocolModule(sourceFilePath);

          protocolModule.get(sourceFilePath, function (res) {
            res.pipe(destinationStream).on('finish', function () {
              closeFile();
            });
          });
        }
      }, function () {
        if (!self.options.wrap) {
          return done();
        }

        fs.appendFile(filePath, '\n})();', done);
      });
    });
  });
};

module.exports = File;
