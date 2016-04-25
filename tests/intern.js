
define({
	// basePath: '',
	proxyPort: 9000,
//
//	// A fully qualified URL to the Intern proxy
	proxyUrl: 'http://localhost:9000/',

	capabilities: {
		'browserstack.selenium_version': '2.45.0'
	},
    runnerClientReporter: {
        id: 'WebDriver'
    },

	environments: [
		{ browserName: 'internet explorer', version: '11', platform: 'WIN8' },
		{ browserName: 'internet explorer', version: '10', platform: 'WIN8' },
		{ browserName: 'internet explorer', version: '9', platform: 'WINDOWS' },
		{ browserName: 'firefox', version: '37', platform: [ 'WINDOWS', 'MAC' ] },
		{ browserName: 'chrome', version: '39', platform: [ 'WINDOWS', 'MAC' ] },
		{ browserName: 'safari', version: '8', platform: 'MAC' }
	],

	// Maximum number of simultaneous integration tests that should be executed on the remote WebDriver service
	maxConcurrency: 2,

	// If you want to use a different loader than the default loader, see
	// <https://theintern.github.io/intern/#option-useLoader> for instruction
    loaders: {
        'host-node': 'dojo/dojo',
        "host-browser": "node_modules/dojo/dojo.js"
    },

	loaderOptions: {
		// Packages that should be registered with the loader in each testing environment


		packages: [ {
            name: 'dgrid',
            location: 'src/dgrid'
          }, {
            name: 'dstore',
            location: 'src/dstore'
          }, {
            name: 'dijit',
            location: 'src/dijit'
          }, {
            name: 'esri',
            location: 'src/esri'
          }, {
            name: 'dojo',
            location: 'src/dojo'
          }, {
            name: 'dojox',
            location: 'src/dojox'
          }, {
            name: 'put-selector',
            location: 'src/put-selector'
          }, {
            name: 'util',
            location: 'src/util'
          }, {
            name: 'xstyle',
            location: 'src/xstyle'
          }, {
            name: 'app',
            location: 'src/app'
          }, {
              name: 'moment',
              location: 'src/moment'
          }
                  ]
	},


	// Non-functional test suite(s) to run in each browser
	suites: ['tests/unit/routes'],

	// Functional test suite(s) to execute against each browser once non-functional tests are completed
//	functionalSuites: ['tests/functional/eDocSubWidgetFunctional'],

	// A regular expression matching URLs to files that should not be included in code coverage analysis
	excludeInstrumentation: /^(?:tests|node_modules|bower_components|src\/(?:dgrid|dijit|dojo|dojox|put-selector|xstyle))\//
});
