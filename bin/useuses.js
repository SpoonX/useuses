#!/usr/bin/env node

var Useuses  = require('../index.js'),
    optimist = require('optimist'),
    options  = optimist
      .usage('Build a concatenated file using the @uses annotation in files.')
      .demand('o')
      .alias('o', 'out')
      .describe('o', 'Where to write the built file to.')
      .demand('i')
      .alias('i', 'in')
      .describe('i', 'The main file of your application.')
      .alias('s', 'search')
      .describe('s', 'Comma separated list of additional search paths (include paths).')
      .alias('w', 'wrap')
      .describe('w', 'Wrap the output in a self-invoking function.')
      .argv,
    useuses;

// Allow list of search paths.
if (typeof options.s === 'string' && options.s.search(',') > -1) {
  options.s = options.s.split(',');
}

useuses = new Useuses(options);

useuses.compile(function (error, assembled) {
  if (error) {
    console.error(error);

    process.exit(1);
  }
  
  console.log('The build completed successfully. You can find the compiled file at "' + options.out + '".');
});

