'use strict';

var grunt = require('grunt');

exports.useuses = {
  setUp: function(done) {
    // setup here if necessary
    done();
  },
  groovyTest: function(test) {
    test.expect(1);

    var actual = grunt.file.read('tmp/groovy-test.js');
    var expected = grunt.file.read('test/expected/groovy-code.js');
    test.equal(actual, expected, 'Concatenated code should be in right order, without duplicates.');

    test.done();
  },
};
