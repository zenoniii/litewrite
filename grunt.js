module.exports = function(grunt) {

  grunt.initConfig({

    jasmine: {
      all: {
        src:['js/spec/specrunner.html'],
        errorReporting: true
      }
    },

    requirejs: {
      almond: true,
      replaceRequireScript: [{
        files: ['build/index.html'],
        module: 'main'
      }],
      modules: [{name: 'main'}],
      dir: 'build',
      appDir: 'src',
      baseUrl: 'js',
      paths: {
          jquery: 'empty:'
      }
    }
  });

  grunt.loadNpmTasks('grunt-jasmine-task');
  grunt.loadNpmTasks('grunt-requirejs');

  grunt.registerTask('build', 'requirejs');
  grunt.registerTask('test', 'jasmine');

};