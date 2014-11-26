var gulp        = require('gulp'),
    minifyCSS   = require('gulp-minify-css'),
    minifyJS    = require('gulp-uglify'),
    run         = require('run-sequence'),
    Useuses     = require('useuses'),
    useuses,
    options;

//styles
gulp.task('styleDeps', function(cb) {
  options = {
    in     : 'src/styles/main.css',
    out    : 'build/styles/main.css',
    verbose: true, //turn if off if you don't want that :p
    search : ['./styles'],
    dryRun : false //turn the option off but still visible if needed
  };

  useuses = new Useuses(options);

  useuses.compile(function (err, assembled) {
    if (err) {
      return cb(err);
    }
    return cb();
  });
});

gulp.task('css', function() {
  return gulp.src('build/styles/main.css')
              .pipe(minifyCSS())
              .pipe(gulp.dest('build/styles'));
});

gulp.task('style', function(cb){
  return run('styleDeps', 'css', cb)
});

//scripts
gulp.task('scriptDeps', function(cb) {
  options = {
    in     : 'src/scripts/main.js',
    out    : 'build/scripts/main.js',
    verbose: true,
    search : ['./scripts'],
    dryRun : false //turn the option off but still visible if needed
  };

  useuses = new Useuses(options);

  useuses.compile(function (err, assembled) {
    if (err) {
      return cb(err);
    }
    return cb();
  });
});

gulp.task('js', function() {
  return gulp.src('build/scripts/main.js')
              .pipe(minifyJS())
              .pipe(gulp.dest('build/scripts'));
});

gulp.task('script', function(cb) {
  return run('scriptDeps', 'js', cb)
});

//default
gulp.task('default', function(cb) {
  return run(['script', 'style'], cb)
});
