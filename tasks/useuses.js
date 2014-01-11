/*
 * grunt-useuses
 * https://github.com/RWOverdijk/useuses
 *
 * Copyright (c) 2014 RWOverdijk
 * Licensed under the MIT license.
 */

'use strict';

var path = require('path');

module.exports = function(grunt) {

  grunt.registerMultiTask('useuses', 'A grunt plugin allowing you to use "uses" annotations to import dependencies.', function() {

    // A cache of file sources.
    var fileSources = {};

    /**
     * Scan a file for "uses" annotations and return the resolved paths found.
     *
     * @param {String} filePath
     *
     * @returns {Array}
     */
    function scanFile(filePath) {

      var fileContents = grunt.file.read(filePath)
        , pattern = /^\s*\*\s*@uses\s+([\w_\-.\/]+)$/img // Let me have my fun
        , foundUses = []
        , fileRoot = filePath.replace(/[^/]*$/, '')
        , match;

      while (match = pattern.exec(fileContents)) {

        var possibleTargets = [
          match[1],
          fileRoot + '/' + match[1]
        ];

        // No extension. Also look for file.js and index.js for packages.
        if (match[1].match(/\.js$/) === null) {
          possibleTargets = possibleTargets.concat([
            match[1] + '.js',
            fileRoot + '/' + match[1] + '.js',
            match[1] + '/index.js',
            fileRoot + '/' + match[1] + '/index.js'
          ]);
        }

        var expandedFilePath = grunt.file.expand(possibleTargets);

        if (expandedFilePath.length === 0 || !expandedFilePath[0]) {
          grunt.log.warn('Required source "' + match[1] + '" not found. Skipping.');

          continue;
        }

        foundUses.push(path.resolve(expandedFilePath[0]));
      }

      fileSources[filePath] = fileContents;

      // We'll filter eventually, but filter here too to avoid extra file processing.
      foundUses = foundUses.filter(function(value, index, self) {
        return self.indexOf(value) === index;
      });

      return foundUses;
    }

    /**
     * Recursively assemble the used sources.
     *
     * @param {Array} sources
     *
     * @returns {Array}
     */
    function assembleUsedSources(sources) {

      var results = [];

      sources.forEach(function(source) {

        source = path.resolve(source);

        // Scan file. Get all found sources.
        var scanResults = scanFile(source)
          , assembled;

        if (scanResults.length > 0) {

          assembled = assembleUsedSources(scanResults);

          if (assembled.length === 0) {
            return;
          }

          results = results.concat(assembled);
        }

        results.push(source);

      });

      return results;
    }

    /**
     * @param {Array} sources
     *
     * @returns {String}
     */
    function concatSources(sources) {
      var concatenatedSources = '';

      sources.map(function(value, index, self) {
        if (self.indexOf(value) !== index) {
          return;
        }

        concatenatedSources += fileSources[value];
      });

      return concatenatedSources;
    }

    // Iterate over all specified file groups.
    this.files.forEach(function(files) {

      var sources = assembleUsedSources(files.src)
        , src = concatSources(sources);

      // Write the destination file.
      grunt.file.write(files.dest, src);

      // Print a success message.
      grunt.log.writeln('File "' + files.dest + '" created.');
    });
  });
};
