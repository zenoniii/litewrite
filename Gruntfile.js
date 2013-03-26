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
        }
      }
    },

    clean: {
      build: [
        'js/collections',
        'js/models',
        'js/templates',
        'js/utils',
        'js/views',
        'js/build.txt',
        'js/litewrite.js',
        'Gruntfile.js'
      ]
    },

   connect: {
      server: {
        options: {
          keepalive: true
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-connect');

  grunt.registerTask('build', ['requirejs', 'clean']);

  grunt.registerTask('default', 'connect');

};