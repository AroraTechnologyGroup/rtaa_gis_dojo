module.exports = function(grunt) {
    
    grunt.loadNpmTasks('grunt-dojo');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-stylus');

  
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
                rename: function (dest, src) {
                    return dest + 'index.html';
                }
            }]
        }
    },
    dojo: {
      dist: {
          options: {
              releaseDir: '../dist'
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
    // uglify: {
    //   build: {
    //     files: [{
    //         expand: true,
    //         cwd: 'dist/',
    //         src: '**/*.js',
    //         dest: 'dist/'
    //     }]
    //   }
    // },
    watch: {
      options: {
          'livereload': {
              'host': 'localhost',
              'port': 9000,
              // 'key': grunt.file.read("node_modules/grunt-contrib-connect/tasks/certs/server.key"),
              // 'cert': grunt.file.read("node_modules/grunt-contrib-connect/tasks/certs/server.crt")
          },
          'livereloadOnError': false
      },
      configFiles: {
          files: ['gruntfile.js'],
          options: {
              'reload': true
          }
      },
      main: {
        cwd: '.',
        files: [
          'app/**/*.js',
          'app/*.js',
          'app/**/*.html',
          'app/**/*.styl'
        ],
        tasks: [
          'stylus:compile',
          'jshint'
        ],
        options: {
          'spawn': false,
          'atBegin': true
        }
      }
    },

    stylus: {
      compile: {
        options: {
          compress: false,
          'import': [ 'nib']
        },
        use: [
          require('autoprefixer-stylus')
        ],
        files: [{
          './src/app/resources/app.css': [
            './src/app/resources/app.styl'
          ]
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

      all: ['gruntfile.js', './src/app/**/*.js', './tests/**/*.js']
    },

    connect: {
			options: {
				livereload: true,
        port: 3000,
        protocol: 'http'
			},
      dev: {
        options: {
          base: './src',
          open: {
            target: 'http://localhost:3000/index.html'
          }
        }
      },
      test: {
        options: {
          base: '.',
          open: {
            target: 'http://localhost:3000/node_modules/intern/client.html?config=tests/intern'
          }
        }
      },
      dist: {
        options: {
          keepalive: true,
          base: './dist',
          open: {
            target: 'http://localhost:3000/index.html'
          }
        }
      }
    }
  });

  grunt.registerTask('build', ['stylus:compile', 'jshint', 'clean:build', 'dojo', 'copy', 'clean:uncompressed']);
  grunt.registerTask('default', [
    'stylus:compile',
    'jshint',
    'connect:dev',
    'watch'
    ]);
  
  grunt.registerTask('test', [
    'stylus:compile',
    'jshint',
    'connect:test',
    'watch'
    ]);
};
