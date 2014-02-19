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
    var fileSources = {}
      , options = this.options();

    /**
     * Apply set aliases on dependency.
     *
     * @param {string} dependency
     * @returns {Array}
     */
    function applyAliases(dependency) {
      var applied = []
        , find
        , alias;

      for (var alias in options.aliases) {
        find = new RegExp('^' + alias);

        if (!find.test(dependency)) {
          continue;
        }

        applied.push(dependency.replace(find, options.aliases[alias]));
      }

      return applied;
    }

    /**
     * Compile a list of searchPaths.
     *
     * Lookup order:
     * - Alias
     * - Full path alias
     * - relative
     * - Full path
     * - Alias index
     * - Full path alias index
     * - relative index
     * - Full path index
     *
     * @param {string} target
     * @param {string} callerPath
     * @returns {Array}
     */
    function compileSearchPaths(rawTarget, callerPath) {
      var searchPaths = []
        , checkIndex = false
        , matchAliases = applyAliases(rawTarget)
        , target = rawTarget
        , i
        , k;

      // Check if supplied target has .js extension
      if (!/\.js$/.test(rawTarget)) {
        checkIndex = true;
        target = rawTarget + '.js';
      }

      // Add untouched.
      searchPaths.push(target);
      searchPaths.push(path.join(callerPath, target));

      // Add aliases.
      if (matchAliases.length > 0) {
        i = matchAliases.length;

        while (i--) {
          // Index
          if (checkIndex) {
            searchPaths.push(path.join(matchAliases[i], 'index.js'));
            searchPaths.push(path.join(callerPath, matchAliases[i], 'index.js'));

            if (!/\.js$/.test(matchAliases[i])) {
              matchAliases[i] += '.js';
            }
          }

          // Filename
          searchPaths.unshift(path.join(callerPath, matchAliases[i]));
          searchPaths.unshift(matchAliases[i]);
        }
      }

      // Add untouched index.
      if (checkIndex) {
        searchPaths.push(path.join(rawTarget, 'index.js'));
        searchPaths.push(path.join(callerPath, rawTarget, 'index.js'));
      }

      return searchPaths;
    }

    /**
     * Scan a file for "uses" annotations and return the resolved paths found.
     *
     * @param {String} filePath
     *
     * @returns {Array}
     */
    function scanFile(filePath) {

      var fileContents = grunt.file.read(filePath)
        , pattern = /^\s*\*\s*@uses\s+([\w_\-.\/]+)$/img
        , foundUses = []
        , fileRoot = filePath.replace(/[^/]*$/, '')
        , match;

      while (match = pattern.exec(fileContents)) {

        var searchPaths = compileSearchPaths(match[1], fileRoot)
          , expandedFilePath = grunt.file.expand(searchPaths);

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
      src = concatSources(sources);

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
