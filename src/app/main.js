define([
	'dijit/registry',
	"dojo/_base/declare",
	"dojo/_base/lang",
	'dojo/parser',
	'dojo/dom',
	"dojo/dom-style",
	'dojo/dom-construct',
	'dojo/html',
	'dojo/router',
	"dojo/request",
	'dojo/query',
	'dojo/dom-class',
	'dojo/dom-attr',
	'dojo/_base/array',
	'dojo/promise/all',
	'dojo/Deferred',
	'dojo/hash',
	'dojo/topic',
	'dojo/on',
	'app/Card',
	'app/HomepageBanner',
	'app/PageBanner',
	'app/namedFunctions',
	'dijit/layout/ContentPane'
	], function(
		registry,
		declare,
		lang,
		parser,
		dom,
		domStyle,
		domConstruct,
		html,
		router,
		request,
		query,
		domClass,
		domAttr,
		Array,
		all,
		Deferred,
		hash,
		topic,
		on,
		Card,
		HomepageBanner,
		PageBanner,
		namedFunctions,
		ContentPane
		) {

	//identify sections of the index.html that will hold the html p
		var app = {};
		lang.mixin(app, new namedFunctions());

		router.register("home", function(evt) {
			evt.preventDefault();
			console.log('loading ' + evt.newPath);

			app.unloadSection().then(function(e) {
				var pane = new ContentPane({
					style: "display: flex",
					id: 'headerPane'
				}, 'headerPane');

				pane.startup();

				if (registry.byId('homepage-banner') === undefined) {
					app.header = new HomepageBanner({
						id: 'homepage-banner',
						baseClass: 'sub-nav-title text-white leader-3 trailer-3',
						title: 'Reno/Tahoe International Airport GIS Website'
					});
				} else {
					app.header = registry.byId('homepage-banner');
				}

				pane.set('content', app.header);
			}, function(err) {
				console.log(err);
			});
		});

		router.register("gisportal/home", function(evt) {
				evt.preventDefault();
				console.log('loading ' + evt.newPath);

				app.unloadSection().then(function(e) {
					try {
						registry.byId('gisportal-banner').destroyRecursive();
					} catch(err) {
						console.log(err);
					}

					app.header = new PageBanner({
						id: 'gisportal-banner',
						baseClass: 'sub-nav-title text-white page-banner',
						title: 'Geographic Information Systems',
						routes: [{
							title: 'Map Viewer',
							href: '/#gisportal/mapviewer'
						}, {
							title: 'Web Apps',
							href: '/#gisportal/apps'
						}, {
							title: 'Browse GIS Data',
							href: '/#gisportal/gis-data-browse'
						}, {
							title: 'Backend Database APIs',
							href: '/#gisportal/backend-apis'
						}]
					});

					var pane = new ContentPane({
						id: 'headerPane',
						content: app.header
					}, 'headerPane');
					pane.startup();

			}, function(err) {
				console.log(err);
			});
		});

		router.register("gisportal/mapviewer", function(evt) {
						evt.preventDefault();
						console.log('loading ' + evt.newPath);
						app.unloadContent().then(function(e) {
							if (registry.byId('gisportal-banner') !== undefined) {
								app.header.set('title', 'Map Viewer');
							}
						}, function(err) {
							console.log(err);
						});


		});

		router.register("gisportal/apps", function(evt) {
						evt.preventDefault();
						app.unloadContent().then(function(e) {
							console.log('loading ' + evt.newPath);

							if (registry.byId('gisportal-banner') !== undefined) {
								registry.byId('gisportal-banner').set('title', "Geospatial Applications");
							}

							app.loadCards([{
								id: "AirspaceAppCard",
								imgSrc: 'app/img/thumbnails/airspace_app.png',
								href: 'https://gisapps.aroraengineers.com:3344',
								header: 'Airspace',
								baseClass: 'card column-6 animate-fade-in leader-1 trailer-2',
								contents: 'View and Analyze the data in the airspace of the RTAA Airport'
							}, {
								id: "eDocAppCard",
								imgSrc: 'app/img/thumbnails/eDoc_app.png',
								href: 'https://gisapps.aroraengineers.com:3344',
								header: 'eDoc Search Tools',
								baseClass: 'card column-6 animate-fade-in pre-1 leader-1 trailer-2',
								contents: 'Search for documents and images using this map focused search tool'
							}, {
								id: "AirfieldAppCard",
								imgSrc: 'app/img/thumbnails/airfield_app.png',
								href: 'https://rtaa.maps.arcgis.com/apps/webappviewer/index.html?id=ff605fe1a736477fad9b8b22709388d1',
								header: 'Airfield',
								baseClass: 'card column-6 animate-fade-in pre-1 leader-1 trailer-2',
								contents: 'View the Airfield Data'
							}]).then(function(e) {
								console.log(e);
							}, function(err) {
								console.log(err);
							});
						});
		});

		router.register("gisportal/gis-data-browse", function(evt) {
						evt.preventDefault();
						console.log("loading "+evt.newPath);
						app.unloadContent().then(function(e) {
							if (registry.byId('gisportal-banner') !== undefined) {
								registry.byId('gisportal-banner').set('title', 'Browse GIS Data');
							}
						});

		});

		router.register("gisportal/backend-apis", function(evt) {
						evt.preventDefault();
						console.log("loading "+evt.newPath);
						app.unloadContent().then(function(e) {
							if (registry.byId('gisportal-banner') !== undefined) {
								registry.byId('gisportal-banner').set('title', 'Backend APIs');
							}

							app.loadCards([{
								id: "eDoc Rest API",
								imgSrc: 'app/img/thumbnails/restapi_app.png',
								href: 'https://gisapps.aroraengineers.com:8004/edoc',
								header: 'eDoc Rest API',
								baseClass: 'card column-6 animate-fade-in leader-1 trailer-2',
								contents: 'Manage the eDoc Rest API'
							}]);
						});

		});

		router.register("departments/home", function(evt) {
						evt.preventDefault();
						console.log("loading "+evt.newPath);
						app.unloadSection().then(function(e) {
							try {
								registry.byId('departments-banner').destroyRecursive();
							} catch(err) {
								// console.log(err);
							}
							app.header = new PageBanner({
								id: 'departments-banner',
								baseClass: "sub-nav-title text-white page-banner",
								title: "Airport Departments",
								routes: [{
									title: 'Engineering',
									href: '/#departments/engineering'
								}, {
									title: 'Operations',
									href: '/#departments/operations'
								}, {
									title: 'Planning',
									href: '/#departments/planning'
								}, {
									title: 'Utilities',
									href: '/#departments/utilities'
								}]
							});
							var pane = new ContentPane({
								id: 'headerPane',
								content: app.header
							}, 'headerPane');

							pane.startup();
						});

		});

		router.register("departments/engineering", function(evt) {
						evt.preventDefault();
						console.log("loading "+evt.newPath);
						app.unloadContent().then(function(e) {
							if (registry.byId('departments-banner') !== undefined) {
								registry.byId('departments-banner').set('title', 'Engineering');
							}
						});

		});

		router.register("departments/operations", function(evt) {
						evt.preventDefault();
						console.log('loading '+evt.newPath);
						app.unloadContent().then(function(e) {
							if (registry.byId('departments-banner') !== undefined) {
								registry.byId('departments-banner').set('title', 'Operations');
							}
						});

		});

		router.register("departments/planning", function(evt) {
						evt.preventDefault();
						console.log('loading '+evt.newPath);
						app.unloadContent().then(function(e) {
							if (registry.byId('departments-banner') !== undefined) {
								registry.byId('departments-banner').set('title', 'Airport Planning');
							}
						});
		});

		router.register("departments/utilities", function(evt) {
						evt.preventDefault();
						console.log('loading '+evt.newPath);
						app.unloadContent().then(function(e) {
							if (registry.byId('departments-banner') !== undefined) {
								registry.byId('departments-banner').set('title', 'Airfield Utilities');
							}
						});
		});

		router.register("web-resources/home", function(evt) {
						evt.preventDefault();
						console.log('loading '+evt.newPath);
						app.unloadSection().then(function(e) {
							try {
								registry.byId('web-resources-banner').destroyRecursive();
							} catch(err) {
								// console.log(err);
							}
							app.header = new PageBanner({
								id: 'web-resources-banner',
								baseClass: 'sub-nav-title text-white page-banner',
								title: 'Online Resource Library',
								routes: [{
									title: 'Live Data Feeds',
									href: '/#web-resources/live-data'
								}, {
									title: 'State Level GIS Data',
									href: '/#web-resources/state-level'
								}, {
									title: 'County Level GIS Data',
									href: '/#web-resources/county-level'
								}, {
									title: 'ESRI Online Resources',
									href: '/#web-resources/esri-resources'
								}]
							});

							var pane = new ContentPane({
								id: 'headerPane',
								content: app.header
							}, 'headerPane');

							pane.startup();
						});

		});

		router.register("help/home", function(evt) {
						evt.preventDefault();
						console.log('loading '+evt.newPath);
						app.unloadSection().then(function(e) {
							try {
								registry.byId('help-banner').destroyRecursive();
							} catch(err) {
								// console.log(err);
							}
							app.header = new PageBanner({
								id: 'help-banner',
								baseClass: 'sub-nav-title text-white page-banner',
								title: 'Help Documentation',
								routes: [{
									title: 'Technical Details',
									href: '/#help/tech-details'
								}, {
									title: 'About this Site',
									href: '/#help/about'
								}, {
									title: 'Request Help Ticket',
									href: '/#help/request-ticket'
								}, {
									title: 'Tutorials',
									href: '/#help/tutorials'
								}]
							});

							var pane = new ContentPane({
								id: 'headerPane',
								content: app.header
							}, 'headerPane');

							pane.startup();
						});
		});

		router.startup();
		app.router = router;
		// query('.loader').forEach(function(e) {
		// 	domClass.toggle(e, 'is-active');
		// });
		//hash('home');

		return app;

});
