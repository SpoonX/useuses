var fs      = require('fs'),
    extract = require('./lib/extract'),
    async   = require('async'),
    path    = require('path'),
    File    = require('./lib/file');

/**
 * Constructor for a new useuses compiler.
 *
 * @param {{rootDirectory, in, out, wrap, alias, aliases, search, tolerant, verbose, dryRun}} options
 * @constructor
 */
function Useuses (options) {
  this.options          = options;
  this.file             = new File(options);
  options.rootDirectory = path.dirname(options.in);
}

/**
 * Assemble the used sources for `sources`.
 *
 * @param {[]}              sources
 * @param {string|function} [callerFilePath]
 * @param {function}        done
 */
Useuses.prototype.assembleUsedSources = function (sources, callerFilePath, done) {
  var usedSources = [],
      self        = this;

  // Ensure array, to simplify lookup
  if (typeof sources === 'string') {
    sources = [sources];
  }

  // Make callerFilePath optional.
  if (typeof callerFilePath === 'function') {
    done           = callerFilePath;
    callerFilePath = null;
  }

  // Loop through each file supplied.
  async.eachSeries(sources, function (filePath, callback) {

    // resolve the filename to a file
    self.file.resolve(filePath, callerFilePath, function (resolvedFilePath, thirdParty) {

      if (!resolvedFilePath) {
        if (self.options.tolerant) {
          if (self.options.verbose) {
            console.log('> !File "' + filePath + '" could not be resolved.');
          }

          return callback();
        }
        return callback('File "' + filePath + '" could not be resolved.');
      }

      if (thirdParty) {
        usedSources.push(resolvedFilePath);

        return callback();
      }

      // Scan the file for uses
      extract(fs.createReadStream(resolvedFilePath), function (extracted) {

        // Nothing found? On to the next source.
        if (!extracted) {
          usedSources.push(resolvedFilePath);

          return callback();
        }

        // Call self to build list based on extracted sources.
        self.assembleUsedSources(extracted, resolvedFilePath, function (error, assembled) {
          if (error) {
            return callback(error);
          }

          // Push the assembled list, and self to the array of usedSources
          usedSources = usedSources.concat(assembled);
          usedSources.push(resolvedFilePath);

          callback();
        });
      });
    });
  }, function (error) {
    done(error, usedSources);
  });
};

/**
 * Compile the bundled file as specified in `options` on construct.
 *
 * @param {function} done Callback function defined like function (error, assembled) {}
 */
Useuses.prototype.compile = function (done) {
  var self = this;

  function handleError (error, done) {
    if (typeof error === 'object' && error.code === 'ENOENT') {
      return done(error.path + ' is not writable!');
    }

    done(error);
  }

  this.assembleUsedSources(this.options.in, function (error, assembled) {
    if (error) {
      return handleError(error, done);
    }

    assembled = assembled.filter(function (value, index, self) {
      return self.indexOf(value) === index;
    });

    self.file.writeCombined(self.options.out, assembled, function (error) {
      if (error) {
        return handleError(error, done);
      }

      done(null, assembled);
    });
  });
};

module.exports = Useuses;
