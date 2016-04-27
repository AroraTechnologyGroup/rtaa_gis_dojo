(function () { return this; })().dojoConfig = {
	// Since we are loading the Dojo 1 AMD loader to emulate the normal environment of our modules more closely,
	// we need to disable actions within the loader that will cause requests to occur before the loader is reconfigured;
	// if `async` is not set, the loader will immediately try to synchronously load all of `dojo/main`
	async: true,
	// has-configuration gets shared between Intern and Dojo 1, which currently causes some problems in Intern code
	// if the `config-deferredInstrumentation` has rule is true (it is by default), so force it off
	deferredInstrumentation: false
};


define({
	basePath: 'src',

	proxyPort: 9000,
//
//	// A fully qualified URL to the Intern proxy
	proxyUrl: 'http://localhost:9000/',

	capabilities: {
		'browserstack.selenium_version': '2.45.0'
	},
    runnerClientReporter: {
        id: 'WebDriver',
				writeHTML: 'true'
    },

	environments: [
		{ browserName: 'chrome', version: '39', platform: [ 'WINDOWS' ] }
	],

	// Maximum number of simultaneous integration tests that should be executed on the remote WebDriver service
	maxConcurrency: Infinity,

	loaders: {
			'host-browser': '../../src/dojo/dojo.js'
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
            name: 'tests',
            location: 'tests'
          }, {
              name: 'moment',
              location: 'src/moment'
          }
                  ]
	},


	// Non-functional test suite(s) to run in each browser
	suites: ['tests/unit/widgets'],

	// Functional test suite(s) to execute against each browser once non-functional tests are completed
	// functionalSuites: ['tests/functional/index'],

	// A regular expression matching URLs to files that should not be included in code coverage analysis
	excludeInstrumentation: /^(?:tests|node_modules|bower_components|src\/(?:dgrid|dijit|dojo|dojox|put-selector|xstyle))\//
});
