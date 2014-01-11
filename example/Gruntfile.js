module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-useuses');

  // Project configuration.
  grunt.initConfig({
    useuses: {
      groovy: {
        src: 'scripts/app.js',
        dest: 'built/groovy.js'
      }
    }
  });

  grunt.registerTask('default', [
    'useuses'
  ]);
};
