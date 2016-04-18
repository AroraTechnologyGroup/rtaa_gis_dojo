module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-dojo');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-stylus');

  // replace these with your own paths
  var appDir = 'C:\\CalciteRTAA\\src\\app';
  var distDir = 'C:\\CalciteRTAA\\dist';

  grunt.initConfig({
    clean: {
      build: {
        src: ['dist/']
      },
      uncompressed: {
        src: [
          'dist/**/*.uncompressed.js'
        ]
      }
    },

    copy: {
      main: {
        files: [{
          expand: true,
          cwd: 'src/',
          src: ['index.html'],
          dest: './dist/',
          rename: function(dest, src) {
            return dest + 'index.html';
          }
        }]
      }
    },

    dojo: {
      dist: {
        options: {
          releaseDir: '../dist',
        }
      },
      options: {
        profile: 'build.profile.js',
        dojo: 'src/dojo/dojo.js',
        load: 'build',
        cwd: './',
        basePath: './src'
      }
    },

    watch: {
      main: {
        files: ['./src/app/**/*.js', './tests/**/*.js', './src/index.html',
      './src/app/**/*.styl'],
        tasks: ['stylus', 'jshint'],
        options: {
          liveReload: true
        }
      }
    },

    stylus: {
      compile: {
        files: [{
          './src/app/resources/app.css': './src/app/resources/app.styl'
        }, {
          './src/app/templates/resources/card_template.css': './src/app/templates/resources/card_template.styl'
        }]
      }
    },

    jshint : {
      options: {
        reporter: require('jshint-stylish'),
        curly: true,
        eqeqeq: true,
        eqnull: true,
        browser: true,
        dojo: true
      },

      all: ['gruntfile.js', 'src/app/**/*.js', 'tests/**/*.js']
    },

    connect: {
      server: {
        options: {
          port: 35729,
          base: 'src',
          open: true
        }
      }
    }

  });


  grunt.registerTask('build', ['stylus', 'jshint', 'clean:build', 'dojo', 'copy', 'clean:uncompressed']);
  grunt.registerTask('default', ['stylus', 'jshint', 'connect', 'watch']);
};
