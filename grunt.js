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
        'text'
      ]
    },

    clean: {
      build: {
        dirs: [
          'js/collections',
          'js/models',
          'js/templates',
          'js/utils',
          'js/views'
        ],
        files: [
          'js/build.txt',
          'js/litewrite.js',
          './grunt.js',
          'grunt'
        ]
      }
    },

    watch: {
        files: [],
        tasks: ''
    }

  });

  grunt.loadNpmTasks('grunt-requirejs');
  grunt.loadNpmTasks('grunt-cleanx');

  grunt.registerTask('build', 'requirejs clean');

  grunt.registerTask('default', 'server watch');

};