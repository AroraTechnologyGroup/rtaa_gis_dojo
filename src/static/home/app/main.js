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

		var ldap_url;
		if (Array.indexOf(['localhost', '127.0.0.1'], window.location.hostname) !== -1) {
			ldap_url = JSON.parse(ldapConfig).test_url;
		} else {
			ldap_url = JSON.parse(ldapConfig).production_url;
		}
	
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
			app.buildGISPortal(evt, groups).then(function(e) {
				console.log(e);
				//TODO-add a redirect to the dashboard
			});
		}, function(err) {
			console.log(err);
		});
		

		router.register("gisportal/dashboard", function(evt) {
			evt.preventDefault();
			app.buildGISPortal(evt, groups).then(function(e) {
				app.buildDashboard(evt, Card, groups).then(function(e) {
					console.log(e);
				});
			}, function(err) {
				console.log(err);
			});
		});

		router.register("gisportal/apps", function(evt) {
			evt.preventDefault();
			console.log('loading ' + evt.newPath);
			app.buildGISPortal(evt, groups).then(function(e) {
				app.buildApps(evt, Card, groups).then(function(e) {
					console.log(e);
				});
			});
		});

		router.register("gisportal/published-layers", function(evt) {
			evt.preventDefault();
			console.log("loading "+evt.newPath);
			app.buildGISPortal(evt, groups).then(function(e) {
				app.buildDataBrowser(evt, Card, groups).then(function(e) {
					console.log(e);
				});
			});

		});

		router.register("gisportal/publishing-tools", function(evt) {
			evt.preventDefault();
			console.log("loading "+evt.newPath);
			app.buildGISPortal(evt, groups).then(function(e) {
				app.buildBackEndAPIs(evt, Card, groups).then(function(e) {
					console.log(e);
				});
			});

		});

		router.register("departments/home", function(evt) {
			evt.preventDefault();
			console.log("loading "+evt.newPath);
			app.buildDepartments(evt, groups).then(function(e) {
				console.log(e);
			});
		});

		router.register("departments/engineering", function(evt) {
			evt.preventDefault();
			console.log("loading "+evt.newPath);
			app.buildDepartments(evt, groups).then(function(e) {
				app.buildEngineering(evt, Card, groups).then(function(e) {
					console.log(e);
				});
			});
		});

		router.register("departments/operations", function(evt) {
			evt.preventDefault();
			console.log('loading '+evt.newPath);
			app.buildDepartments(evt, groups).then(function(e) {
				app.buildOperations(evt, Card, groups).then(function(e) {
					console.log(e); 
				});
			});
		});

		router.register("departments/planning", function(evt) {
			evt.preventDefault();
			console.log('loading '+evt.newPath);
			app.buildDepartments(evt, groups).then(function(e) {
				app.buildPlanning(evt, Card, groups).then(function(e) {
					console.log(e);
				});
			});
		});

		router.register("departments/utilities", function(evt) {
			evt.preventDefault();
			console.log('loading '+evt.newPath);
			app.buildDepartments(evt, groups).then(function(e) {
				app.buildUtilities(evt, Card, groups).then(function(e) {
					console.log(e);
				});
			});
		});

		router.register("web-resources/home", function(evt) {
			evt.preventDefault();
			console.log('loading '+evt.newPath);
			app.buildWebResources(evt, groups).then(function(e) {
				console.log(e);
			});
		});

		router.register("help/home", function(evt) {
			evt.preventDefault();
			console.log('loading '+evt.newPath);
			app.buildHelp().then(function(e) {
				console.log(e);
			});
		});

		router.startup();
		app.router = router;
		});
		return app;

});
