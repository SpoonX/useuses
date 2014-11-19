var assert  = require('chai').assert,
    fs      = require('fs'),
    Useuses = require('../../index');

describe('Useuses', function () {
  describe('.construct()', function () {
    it('should construct a new instance of Useuses', function (done) {
      var options = {
            in  : 'foo/bar.js',
            out : 'foo/bat.js',
            wrap: true
          },
          useuses;

      useuses = new Useuses(options);

      assert.equal(useuses.options, options, 'Options were not set properly.');
      assert.typeOf(useuses.file, 'object', 'File was not created or set on useuses instance.');

      done();
    });
  });

  describe('.compile()', function () {
    it('should successfully write a built file, and return a list of files.', function (done) {
      fs.unlink('test/.tmp/test.output.js', function () {
        var options = {
              in  : 'examples/simple/main.js',
              out : 'test/.tmp/test.output.js',
              wrap: true
            },
            useuses;

        useuses = new Useuses(options);

        useuses.compile(function (error, assembled) {

          var cwd = process.cwd(),
              expected = [
                cwd + '/examples/simple/lib/hippify.js',
                cwd + '/examples/simple/lib/opposite_day.js',
                cwd + '/examples/simple/fake_vendor/drop_the_base.js',
                cwd + '/examples/simple/lib/mixup.js',
                cwd + '/examples/simple/main.js'
              ];

          assert.deepEqual(assembled, expected, 'Did not get expected files. Error instead: "' + error + '".');
          assert.notOk(error);

          fs.readFile('test/.tmp/test.output.js', {encoding: 'utf8'}, function (error, testFile) {
            assert.notOk(error);

            fs.readFile('examples/simple/dist/built.js', {encoding: 'utf8'}, function (error, distFile) {
              assert.notOk(error);

              assert.equal(testFile, distFile);

              done();
            });
          });
        });
      });
    });

    it('should fail because dest is not writable.', function (done) {
      var options = {
            in  : 'examples/simple/main.js',
            out : 'foo/bat.js',
            wrap: true
          },
          useuses;

      useuses = new Useuses(options);

      useuses.compile(function (error) {
        assert.equal(error, 'foo/bat.js is not writable!');
        done();
      });
    });

    it('should fail because file is not readable.', function (done) {
      var options = {
            in  : 'bacon/is/awesome.js',
            out : 'foo/bat.js',
            wrap: true
          },
          useuses;

      useuses = new Useuses(options);

      useuses.compile(function (error) {
        assert.equal(error, 'File "bacon/is/awesome.js" could not be resolved.');

        done();
      });
    });
  });
});
