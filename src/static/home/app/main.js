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
		var ldap_config = JSON.parse(ldapConfig);
		if (Array.indexOf(['localhost', '127.0.0.1'], window.location.hostname) !== -1) {
			ldap_url = ldap_config.test_url;
		} else if (window.location.port === "8443") {
			ldap_url = ldap_config.production_url;
		} else if (window.location.port === "8004") {
			ldap_url = ldap_config.staging_url;
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
				router.go("gisportal/published-layers");
			});
		}, function(err) {
			console.log(err);
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

		router.register("applications/home", function(evt) {
			evt.preventDefault();
			console.log("loading "+evt.newPath);
			app.buildApplications(evt, Card, groups).then(function(e) {
				console.log(e);
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
