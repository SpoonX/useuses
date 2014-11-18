var split             = require('split'),
    annotationPattern = /^\s*\*\s*@uses\s+(.+?)\s*$/;

/**
 * Extract all used files from `stream`.
 *
 * @param {Stream}   stream
 * @param {function} callback
 */
module.exports = function (stream, callback) {
  var extracted = [],
      collected = '';

  stream
    .pipe(split())
    .on('data', function (line) {
      var matches = annotationPattern.exec(line);

      if (matches) {
        extracted.push(matches[1]);
      }
    })
    .on('end', function () {
      return callback(extracted, collected);
    });
};
