define([
	'dijit/registry',
	"dojo/_base/declare",
	'dojo/parser',
	'dojo/dom',
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
	'dijit/layout/ContentPane',
	'dojo/domReady!'
	], function(
		registry,
		declare,
		parser,
		dom,
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
		ContentPane
		) {



	//identify sections of the index.html that will hold the html p
		var app = {};

		var cleanBanner = function() {
			var deferred = new Deferred();
			(function() {
				if (registry.byId('headerPane') !== undefined) {
					domConstruct.empty(registry.byId('headerPane'));
					registry.remove('headerPane');
					deferred.resolve(true);
				} else {
					deferred.resolve(false);
				}
			})();
			return deferred.promise;
		};

		var cleanContent = function() {
			var deferred = new Deferred();
			(function() {
				if (registry.byId('main-content') !== undefined) {
					domConstruct.empty(registry.byId('main-content').containerNode);
					registry.remove('main-content');
					deferred.resolve(true);
				} else {
					deferred.resolve(false);
				}
			})();
			return deferred.promise;
		};

		var unloadPage = function() {
			var deferred = new Deferred();
			all([cleanBanner(), cleanContent()]).then(function(arr) {
				deferred.resolve("page cleaned, ready for new page load");
			});
			return deferred.promise;
		};

		app.loadCards = function(objects, domNode) {
				// each card object has [baseClass, imgSrc, header, content]
				var mainDeferred = new Deferred();

				var pane = new ContentPane({
					id: 'main-content'
				}, 'main-content');
				pane.startup();

				var nodelist = Array.map(objects, function(e) {
					var deferred = new Deferred();
					if (registry.byId(e.id) !== undefined) {
						registry.byId(e.id).destroyRecursive();
					}
					var div = domConstruct.create("div");
					var new_card = new Card({
						id: e.id,
						baseClass: e.baseClass,
						contents: e.contents,
						imgSrc: e.imgSrc,
						header: e.header
					}, div);
					return deferred.resolve(new_card);
				});

				all(nodelist).then(function(arr) {
					Array.forEach(arr, function(e) {
						pane.addChild(e);
					});
					mainDeferred.resolve(pane);
				});
				return mainDeferred.promise;
			};



			router.register("home", function(evt) {
				evt.preventDefault();
				console.log("loading "+evt.newPath);

				unloadPage().then(function(e) {
					var pane = new ContentPane({
						style: "display: flex",
						id: 'headerPane'
					}, 'headerPane');

					pane.startup();

					if (registry.byId('homepage-banner') === undefined) {
						app.header = new HomepageBanner({
							id: 'homepage-banner',
							baseClass: "sub-nav-title text-white leader-3 trailer-3",
							title: "Reno/Tahoe International Airport GIS Website"
						});
					} else {
						app.header = registry.byId('homepage-banner');
					}

					pane.setContent(app.header);
				});
			});

			router.register("gisportal/home", function(evt) {
					evt.preventDefault();
					console.log("loading "+evt.newPath);

					unloadPage().then(function(e) {
						if (registry.byId('gisportal-banner') === undefined) {
							app.header = new PageBanner({
								id: 'gisportal-banner',
								baseClass: "sub-nav-title text-white page-banner",
								title: "GIS Mainpage",
								routes: [{
									title: 'Map Viewer',
									href: "/#gisportal/mapviewer"
								}, {
									title: 'Web Apps',
									href: "/#gisportal/apps"
								}, {
									title: 'Browse Data',
									href: "/#gisportal/browse"
								}]
							});
						} else {
							app.header = registry.byId('gisportal-banner');
						}

						var pane = new ContentPane({
							id: 'headerPane',
							content: app.header
						}, 'headerPane');

						pane.startup();
				});
			});

			router.register("gisportal/mapviewer", function(evt) {
							evt.preventDefault();
							console.log("loading "+evt.newPath);

			});

			router.register("gisportal/apps", function(evt) {
							evt.preventDefault();
							cleanContent().then(function(e) {
								console.log("loading "+evt.newPath);

								if (registry.byId('gisportal-banner') !== undefined) {
									registry.byId('gisportal-banner').set('title', "Geospatial Applications");
								}

								app.loadCards([{
									id: "AirspaceAppCard",
									imgSrc: "./app/img/thumbnails/airspace_app.png",
									header: "Airspace",
									baseClass: "card column-6 animate-fade-in trailer-2",
									contents: "View and Analyze the data in the airspace of the RTAA Airport"
								}, {
									id: "eDocAppCard",
									imgSrc: './app/img/thumbnails/eDoc_app.png',
									header: 'eDoc Search Tools',
									baseClass: "card column-6 animate-fade-in pre-1 trailer-2",
									contents: "Search for documents and images using this map focused search tool"
								}]).then(function(e) {
									console.log(e);
								}, function(err) {
									console.log(err);
								});
							});
		});

		router.register("gisportal/browse", function(evt) {
						evt.preventDefault();
						console.log("loading "+evt.newPath);

		});

		router.register("departments/engineering", function(evt) {
						evt.preventDefault();
						console.log("loading "+evt.newPath);

		});

		router.register("departments/construction", function(evt) {
						evt.preventDefault();
						console.log("loading "+evt.newPath);

		});

		router.register("departments/planning", function(evt) {
						evt.preventDefault();
						console.log("loading "+evt.newPath);

		});

		router.register("departments/utilities", function(evt) {
						evt.preventDefault();
						console.log("loading "+evt.newPath);

		});

		router.register("departments/home", function(evt) {
						evt.preventDefault();
						console.log("loading "+evt.newPath);


		});

		router.register("webresources/home", function(evt) {
						evt.preventDefault();
						console.log("loading "+evt.newPath);


		});

		router.register("help/home", function(evt) {
						evt.preventDefault();
						console.log("loading "+evt.newPath);
		});

		router.startup();
		query('.loader').forEach(function(e) {
			domClass.toggle(e, 'is-active');
		});
		hash("home");

		return app;

});
