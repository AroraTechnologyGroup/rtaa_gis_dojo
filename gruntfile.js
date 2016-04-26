module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt, [ 'grunt-*', 'intern-geezer' ]);
	var path = require('path');
  var stripComments = /<\!--.*?-->/g,
		collapseWhiteSpace = /\s+/g;

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
      index: {
        options: {
          processContent: function (content) {
						return content
							.replace(stripComments, '')
							.replace(collapseWhiteSpace, ' ')
						;
					}
        },
        files: [{
					src: path.join('src', 'index.html'),
					dest: path.join('dist', 'index.html')
				}]
      }
    },

    dojo: {
      dist: {
        options: {
          releaseDir: '../dist',
          profile: 'build.profile.js',
          dojo: 'src/dojo/dojo.js',
          load: 'build',
          cwd: './',
          basePath: './src'
        }
      },
    },

    watch: {
      main: {
        files: ['./src/app/**/*.js', './tests/**/*.js', './src/index.html',
      './src/app/**/*.styl'],
        tasks: ['stylus:compile', 'jshint']
      }
    },

    stylus: {
      compile: {
        options: {
          compress: false,
          'import': [ 'nib']
        },
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
			options: {
				port: 8888,
				hostname: 'localhost'
			},
			test: {
				options: {
					base: 'src'
				}
			},
			dist: {
				options: {
					base: 'dist'
				}
			}
		},

    intern: {
			local: {
				options: {
					runType: 'client',
					config: 'src/app/tests/intern'
				}
			},
			remote: {
				options: {
					runType: 'runner',
					config: 'src/app/tests/intern'
				}
			}
		}
  });

  grunt.registerTask('server', function (target) {
		if (target === 'dist') {
			return grunt.task.run([
				'build',
				'connect:dist:keepalive'
			]);
		}

		grunt.task.run([
			'stylus:compile',
			'connect:test',
			'watch'
		]);
	});

  grunt.registerTask('build', ['stylus:compile', 'jshint', 'clean:build', 'dojo:dist', 'copy', 'clean:uncompressed',
'connect:dist']);
  grunt.registerTask('default', ['stylus', 'jshint', 'connect:test', 'watch']);
};
