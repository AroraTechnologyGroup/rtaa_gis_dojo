module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-dojo');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-browser-sync');

  // replace these with your own paths
  var appDir = 'C:\\CalciteRTAA\\src';
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
          src: ['built.html'],
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
        files: ['src/**', 'tests/**', 'src/index.html'],
        tasks: ['jshint'],
        options: {
          spawn: false
        }
      }
    },

    browserSync: {
      
      bsFiles: {
        src: [
        '/src/index.html'
        ]
      },
      options: {
        ui: {
          port: 8080
        },
        server: {
         browser: "google chrome",
         directory: false,
         baseDir: './'
        },
        watchTask: true
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

      all: ['gruntfile.js', 'src/**/*.js', 'tests/**/*.js']
    }

  });

  
  grunt.registerTask('build', ['clean:build', 'dojo', 'copy', 'clean:uncompressed']);
  grunt.registerTask('default', ['jshint', 'browserSync', 'watch']);
};