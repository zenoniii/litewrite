var livereload = require('connect-livereload');
var connect = require('connect');


module.exports = function(grunt) {

  grunt.initConfig({

    requirejs: {
      compile: {
        options: {
          almond: false,
          replaceRequireScript: [{
            files: ['index.html'],
            module: 'main'
          }],
          modules: [{name: 'main'}],
          dir: 'src',
          keepBuildDir: true,
          baseUrl: 'src',
          inlineText: true,
          wrap: true,
          mainConfigFile: 'src/main.js',
          paths: {
            jquery: 'empty:',
            remotestorage: 'empty:'
          },
          stubModules: [
            'text'
          ]
        }
      }
    },

    clean: {
      build: [
        'src/collections',
        'src/models',
        'src/templates',
        'src/utils',
        'src/views',
        'src/build.txt',
        'src/litewrite.js',
        'Gruntfile.js'
      ]
    },

   connect: {
      server: {
        options: {
          middleware: function(connect, options) {
            return [
              livereload(),
              connect.static(options.base),
              connect.directory(options.base)
            ];
          }
        }
      }
    },

    watch: {
      options: {
        livereload: true
      },
      files: ['*', '*/*']
    }

  });

  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('build', ['requirejs', 'clean']);
  grunt.registerTask('default', ['connect', 'watch']);

};