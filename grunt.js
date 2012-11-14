module.exports = function(grunt) {

  grunt.initConfig({

    requirejs: {
      almond: false,
      replaceRequireScript: [{
        files: ['index.html'],
        module: 'main'
      }],
      modules: [{name: 'main'}],
      dir: 'js',
      keepBuildDir: true,
      baseUrl: 'js',
      inlineText: true,
      wrap: true,
      mainConfigFile: 'js/main.js',
      paths: {
        jquery: 'empty:',
        remotestorage: 'empty:'
      },
      stubModules: [
        'utils/log',
        'text'
      ]
    },

    watch: {
        files: [],
        tasks: ''
    }

  });

  grunt.loadNpmTasks('grunt-requirejs');

  grunt.registerTask('build', 'requirejs');
  grunt.registerTask('b', 'requirejs');

  grunt.registerTask('default', 'server watch');

};