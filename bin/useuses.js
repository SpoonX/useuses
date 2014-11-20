#!/usr/bin/env node

var Useuses  = require('../index.js'),
    optimist = require('optimist'),
    options  = optimist
      .usage('Build a concatenated file using the @uses annotation in files.')
      .demand('out')
      .alias('out', 'o')
      .describe('out', 'Where to write the built file to.')
      .demand('in')
      .alias('in', 'i')
      .describe('in', 'The main file of your application.')
      .alias('search', 's')
      .describe('search', 'Comma separated list of additional search paths (include paths).')
      .alias('alias', 'a')
      .describe('alias', 'Allows you to alias dependencies, and paths.')
      .alias('wrap', 'w')
      .describe('wrap', 'Wrap the output in a self-invoking function.')
      .alias('verbose', 'v')
      .describe('verbose', 'Output the files being written to the build.')
      .alias('tolerant', 't')
      .describe('tolerant', 'Instruct useuses to be tolerant (accept) against missing dependencies.')
      .alias('dry-run', 'd')
      .describe('dry-run', 'Only output what would be written. Note: This option cancels out verbose.')
      .argv,
    useuses;

// Allow list of search paths.
if (typeof options.search === 'string') {
  options.search = options.search.split(',');
}

// Allow list of aliases.
if (typeof options.alias === 'string') {
  options.alias = options.alias.split(',');
}

if (options.alias) {
  options.aliases = {};

  options.alias.forEach(function (alias) {
    var parts = alias.split('=');

    options.aliases[parts[0]] = parts[1];
  });
}

if (options.d) {
  options.dryRun = true;
}

useuses = new Useuses(options);

useuses.compile(function (error, assembled) {
  if (error) {
    console.error(error);

    process.exit(1);
  }

  if (!options.dryRun) {
    console.log('The build completed successfully. You can find the compiled file at "' + options.out + '".');
  }
});
