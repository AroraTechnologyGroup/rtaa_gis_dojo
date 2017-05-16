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
	'dijit/layout/ContentPane',
	'dijit/_WidgetBase'
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
		ContentPane,
		_WidgetBase
		) {
		return declare([_WidgetBase], {
			unload: function() {
				registry.forEach(function(widget, index, hash) {
					registry.remove(widget);
					domConstruct.destroy(widget.domNode);
				});
			},
			postCreate: function() {
				baseUnload.addOnUnload(this.unload);
				var header_pane = new ContentPane({
					id: "header-pane",
					style: "top: 0"
				}, 'headerPane');
				header_pane.startup();
				var main_content = new ContentPane({
							id: 'main-content'
						}, 'main-content');
				main_content.startup();
			},
			startup: function() {
				this.inherited(arguments);
				var deferred = new Deferred();
				var self = this;
				var app = {};
				var ldap_url;
				var ldap_config = JSON.parse(ldapConfig);
				if (Array.indexOf(['localhost', '127.0.0.1'], window.location.hostname) !== -1) {
					ldap_url = ldap_config.test_url;
				} else if (window.location.hostname === "gis.renoairport.net") {
					ldap_url = ldap_config.rtaa_url;
				} else if (window.location.hostname === "gisapps.aroraengineers.com") {
					if (window.location.pathname === "/rtaa_gis/") {
						ldap_url = ldap_config.staging_url;
					} else if (window.location.pathname === "/rtaa_prod/") {
						ldap_url = ldap_config.production_url;
					}
				}
				lang.mixin(app, new namedFunctions());
				app.getGroups(ldap_url).then(function(groups) {

					app.router = self.build_router(app, groups);
					deferred.resolve(app);
				});
				return deferred.promise;
			},

			build_router: function(obj, groups) {
				
				router.register("home", function(evt) {
					evt.preventDefault();
					console.log('loading ' + evt.newPath);
					obj.buildTitleBar(evt, Card).then(function(e) {
						console.log(e);
					});
				});

				router.register("gisportal/home", function(evt) {
					evt.preventDefault();
					console.log('loading ' + evt.newPath);
					obj.buildGISPortal(evt, groups).then(function(e) {
						console.log(e);
						hash("gisportal/analytics");
					});
				}, function(err) {
					console.log(err);
				});

				router.register("gisportal/analytics", function(evt) {
					evt.preventDefault();
					console.log('loading ' + evt.newPath);
					obj.buildGISPortal(evt, groups).then(function(e) {
						obj.buildAnalytics(evt, groups).then(function(e) {
							console.log(e);
							// load analytics widgets
						});
					});
				});

				router.register("gisportal/2dviewer", function(evt) {
					evt.preventDefault();
					console.log("loading "+evt.newPath);
					obj.buildGISPortal(evt, groups).then(function(e) {
						obj.build2dViewer(evt, groups).then(function(e) {
							console.log(e);
						});
					});
				});

				router.register("gisportal/3dviewer", function(evt) {
					evt.preventDefault();
					console.log("loading "+evt.newPath);
					obj.buildGISPortal(evt, groups).then(function(e) {
						obj.build3dViewer(evt, groups).then(function(e) {
							console.log(e);
						});
					});
				});

				router.register("gisportal/publishing-tools", function(evt) {
					evt.preventDefault();
					console.log("loading "+evt.newPath);
					obj.buildGISPortal(evt, groups).then(function(e) {
						obj.buildBackEndAPIs(evt, groups).then(function(e) {
							console.log(e);
						});
					});

				});
				
				router.register("web-resources/home", function(evt) {
					evt.preventDefault();
					console.log('loading '+evt.newPath);
					obj.buildWebResources(evt, groups).then(function(e) {
						console.log(e);
					});
				});

				router.register("help/home", function(evt) {
					evt.preventDefault();
					console.log('loading '+evt.newPath);
					obj.buildHelp().then(function(e) {
						console.log(e);
					});
				});

				router.startup();
				return router;
			}
		});
});
