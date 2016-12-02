define([
	'dijit/registry',
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/unload",
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
	'dojo/text!./ldap.json',
	'dijit/layout/ContentPane'
	], function(
		registry,
		declare,
		lang,
		baseUnload,
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
		ldapConfig,
		ContentPane
		) {

		var unload = function() {
			registry.forEach(function(widget, index, hash) {
				registry.remove(widget);
				domConstruct.destroy(widget.domNode);
			});
		};

		baseUnload.addOnUnload(unload);

		var app = {};
		lang.mixin(app, new namedFunctions());

		var ldap_url = JSON.parse(ldapConfig).url;
		var header_pane = new ContentPane({
			id: "header-pane",
			style: "top: 0"
		}, 'headerPane');
		header_pane.startup();
		var main_content = new ContentPane({
					id: 'main-content'
				}, 'main-content');
		main_content.startup();

		app.getGroups(ldap_url).then(function(groups) {
		router.register("home", function(evt) {
			evt.preventDefault();
			console.log('loading ' + evt.newPath);
			// var handle = topic.subscribe("/dojo/hashchange", function(hash) {
			// 				app.unloadContent();
			// 				handle.remove()
			// 			});
			app.buildTitleBar(evt);
						
			
		});

		router.register("gisportal/home", function(evt) {
			evt.preventDefault();
			console.log('loading ' + evt.newPath);

			// Get groups before tearing down to limit visual 
			
				app.buildGISPortal(evt, groups).then(function(e) {
					console.log(e);
				});
		}, function(err) {
			console.log(err);
		});
		

		router.register("gisportal/dashboard", function(evt) {
						evt.preventDefault();
						console.log('loading ' + evt.newPath);
						app.unloadContent().then(function(e) {
							if (registry.byId('gisportal-banner') !== undefined) {
								app.header.set('title', 'Home');
							}
						}, function(err) {
							console.log(err);
						});


		});

		router.register("gisportal/apps", function(evt) {
						evt.preventDefault();
						app.buildGISPortal(evt, groups).then(function(e) {
							console.log('loading ' + evt.newPath);

							if (registry.byId('gisportal-banner') !== undefined) {
								registry.byId('gisportal-banner').set('title', "Geospatial Applications");
							}

							
							var airspace_app = {
								id: "AirspaceAppCard",
								imgSrc: 'static/home/app/img/thumbnails/airspace_app.png',
								href: 'https://gisapps.aroraengineers.com/rtaa_3d/',
								header: 'Airspace',
								baseClass: 'card column-4 leader-2 trailer-2',
								contents: ''
							};

							var eDoc_app = {
								id: "eDocAppCard",
								imgSrc: 'static/home/app/img/thumbnails/eDoc_app.png',
								href: 'https://gisapps.aroraengineers.com/eDoc/',
								header: 'eDoc Search Tool',
								baseClass: 'card column-4 leader-2 trailer-2',
								contents: ''
							};

							// var airfield_app = {
							// 	id: "AirfieldAppCard",
							// 	imgSrc: 'static/home/app/img/thumbnails/airfield_app.png',
							// 	href: 'https://rtaa.maps.arcgis.com/apps/webappviewer/index.html?id=ff605fe1a736477fad9b8b22709388d1',
							// 	header: 'Airfield',
							// 	baseClass: 'card column-4 leader-2 trailer-2',
							// 	contents: ''
							// };

							var noise_app = {
								id: "NoiseAppCard",
								imgSrc: 'static/home/app/img/thumbnails/NoiseApp.png',
								href: "https://gisapps.aroraengineers.com/bcad-noise-mit/",
								header: 'Noise Mitigation',
								baseClass: 'card column-4 leader-2 trailer-2',
								contents: ''
							};

							
							var cards;
							var test = Array.indexOf(groups, 'GIS');
							if (test !== -1) {
								cards = [airspace_app, eDoc_app, airfield_app, noise_app];
							} else {
								cards = [airspace_app];
							}
							app.loadCards(Card, cards).then(function(e) {
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

							app.loadCards(Card, [{
								id: "eDoc Rest API",
								imgSrc: 'static/home/app/img/thumbnails/restapi_app.png',
								href: 'https://gisapps.aroraengineers.com:8004/edoc/swag',
								header: 'eDoc Rest API',
								baseClass: 'card column-4 leader-1 trailer-2',
								contents: 'Manage the eDoc Rest API'
							}]).then(function(e) {
								console.log(e);
							}, function(err) {
								console.log(err);
							});
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
								baseClass: 'text-white font-size-4 page-banner',
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

							var pane = registry.byId('header-pane');
							pane.set('content', app.header);
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
								baseClass: 'text-white font-size-4 page-banner',
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

							var pane = registry.byId('header-pane');
							pane.set('content', app.header);
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
								baseClass: 'text-white font-size-4 page-banner',
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

							var pane = registry.byId('header-pane');
							pane.set('content', app.header);
						});
		});

		router.startup();
		app.router = router;
		});
		return app;

});
