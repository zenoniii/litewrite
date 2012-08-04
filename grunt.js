module.exports = function(grunt) {

  grunt.initConfig({

    requirejs: {
      almond: true,
      replaceRequireScript: [{
        files: ['build/index.html'],
        module: 'main'
      }],
      modules: [{name: 'main'}],
      dir: 'build/',
      appDir: 'src',
      baseUrl: 'js',
      inlineText: true,
      wrap: true,
      mainConfigFile: 'src/js/main.js',
      paths: {
      },
      stubModules: [
        'utils/log',
        'text'
      ]
    }
  });

  grunt.loadNpmTasks('grunt-requirejs');

  grunt.registerTask('build', 'requirejs');
};