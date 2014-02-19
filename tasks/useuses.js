/*
 * grunt-useuses
 * https://github.com/spoonx/useuses
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
        , pattern   = /^\s*\*\s*@uses\s+([\w_\-.\/]+)$/img
        , foundUses = []
        , fileRoot  = filePath.replace(/[^/]*$/, '')
        , match;

      while (match = pattern.exec(fileContents)) {

        var possibleTargets = [
          fileRoot + '/' + match[1],
          match[1]
        ];

        // No extension. Also look for matched file (with ext .js) and index.js (for packages).
        if (match[1].match(/\.js$/) === null) {
          possibleTargets = possibleTargets = [
            fileRoot + '/' + match[1] + '.js',
            match[1] + '.js',
            fileRoot + '/' + match[1] + '/index.js',
            match[1] + '/index.js'
          ];
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

    if (this.files.length < 1) {
      grunt.verbose.warn('Destination not written because no source files were provided.');
    }

    // Go through all series
    this.files.forEach(function(f) {

      var destination = f.dest
        , files
        , sources
        , src;

      // Filter out non-existent files
      files = f.src.filter(function(filepath) {

        // Warn on and remove invalid source files (if nonull was set).
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');

          return false;
        }

        return true;
      });

      // Make sure we got files left after filtering.
      if (files.length === 0) {
        grunt.log.warn('Destination not written because no source files were found.');

        // No src files. return.
        return;
      }

      sources = assembleUsedSources(files);
      src     = concatSources(sources);

      // Make sure that compiled data is not empty
      if (src.length === 0) {
        grunt.log.warn('Destination not written because compiled files were empty.');

        return;
      }

      // Write the destination file.
      grunt.file.write(destination, src);

      // Print a success message.
      grunt.log.writeln('File "' + destination + '" created.');
    });
  });
};
