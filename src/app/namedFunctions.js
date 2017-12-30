define([
	'dijit/registry',
	"dojo/_base/declare",
	'dojo/window',
	"dojo/_base/unload",
	"dojo/aspect",
	'dojo/json',
	'dojo/parser',
	"dojo/cookie",
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
	'app/HomepageBanner',
	'app/PageBanner',
	'app/Analytics',
	'app/PublishingTools',
	'app/IFrameLoader',
	'app/ResourcePage',
	'app/AboutSite',
	'app/RequestHelp',
	'app/TechnicalDetails',
	'esri/IdentityManager',
	'esri/arcgis/OAuthInfo',
	'dijit/layout/ContentPane',
	'dojo/text!./application_cards.json'
	], function(
		registry,
		declare,
		win,
		baseUnload,
		aspect,
		JSON,
		parser,
		cookie,
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
		HomepageBanner,
		PageBanner,
		Analytics,
		PublishingTools,
		IFrameLoader,
		ResourcePage,
		AboutSite,
		RequestHelp,
		TechnicalDetails,
		esriId,
		OAuthInfo,
		ContentPane,
		app_cards
		) {

		return declare([], {
			adminRoutes: [
				// {
				// 	title: 'Site Analytics',
				// 	href: 'gisportal/site-analytics'
				// }, {
					{
					title: '2D Data Viewer',
					href: 'gisportal/viewer2d'
				}, {
					title: '3D Data Viewer',
					href: 'gisportal/viewer3d'
				}
				// }, {
				// 	title: 'Publishing Tools',
				// 	href: 'gisportal/publishing-tools'
				// }
			],

			helpRoutes: [
				{
					title: 'Technical Details',
					href: 'help/tech-details'
				}, {
					title: 'About this Site',
					href: 'help/about'
				}
				// }, {
				// 	title: 'Request Help Ticket',
				// 	href: 'help/request-ticket'
				// }
			],

			unloadBanner: function() {
				var deferred = new Deferred();
				(function() {
					if (registry.byId('header-pane') !== undefined) {
						var obj = registry.byId('header-pane');
						domConstruct.empty(obj.containerNode);
						domClass.remove(obj.containerNode);
						deferred.resolve(true);
				} else {
				  deferred.resolve(false);
				}
				})();
				return deferred.promise;
			},

			unloadContent: function() {
			var deferred = new Deferred();
				(function() {
					
					if (registry.byId('main-content') !== undefined) {
						var obj = registry.byId('main-content');
						domConstruct.empty(obj.containerNode);
						domClass.remove(obj.containerNode);
						deferred.resolve(true);
					} else {
						deferred.resolve('the main-content div was not replaced by the ContentPane dijit in main.js');
					}
				})();
				return deferred.promise;
		    },

			unloadSection: function() {
				var self = this;
				var deferred = new Deferred();
				all([self.unloadBanner(), self.unloadContent()]).then(function(arr) {
					deferred.resolve("page cleaned, ready for new page load");
				}, function(err) {
					deferred.cancel(err);
				});
				return deferred.promise;
			},

			loadCards: function(Card, objects) {
				// each card object has [baseClass, imgSrc, href, header, content]
				var mainDeferred = new Deferred();
				var pane = registry.byId('main-content');

				domClass.add(pane.domNode, "block-group block-group-3-up tablet-block-group-2-up phone-block-group-1-up");
				var nodelist = Array.map(objects, function(e) {
					var deferred = new Deferred();
					if (registry.byId(e.id) !== undefined) {
						registry.byId(e.id).destroyRecursive();
					}
					var div = domConstruct.create('div');
					var new_card = new Card({
						id: e.id,
						path: e.path,
						content1: e.content1,
						header: e.header,
						imgSrc: e.imgSrc,
						isActive: e.isActive
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
			},

			getGroups: function(url) {
				var deferred = new Deferred();
				
				(function() {
					request(url, {
						method: "GET",
						preventCache: true,
						handleAs: 'json',
						headers: {
				            "X-Requested-With": null
				        },
				        withCredentials: true
					}).then(function(data) {
						console.log(data);
						deferred.resolve(data);
					}, function(err) {
						console.log(err);
						deferred.cancel(err);
					});
				})();
				return deferred.promise;
			},

			buildTitleBar: function(evt, Card) {
				var self = this;
				var deferred = new Deferred();
				var footer = query("#footer-container");
				// slide the footer back into view
				domClass.remove(footer[0], 'animate-out-up');
				self.unloadSection().then(function(e) {
					var pane;
					if (registry.byId('header-pane') === undefined) {
						pane = new ContentPane({
							style: "display: flex",
							id: 'header-pane'
						}, 'headerPane');
						pane.startup();
					} else {
						pane = registry.byId('header-pane');
					}
					
					if (registry.byId('homepage-banner') === undefined) {
						self.header = new HomepageBanner({
							id: 'homepage-banner',
							title: 'Reno-Tahoe Airport Authority',
							subtitle: 'Web Application Portal'
						});
					} else {
						self.header = registry.byId('homepage-banner');
					}

					pane.set('content', self.header);

					// these are loaded from dojo/text!./application_cards.json
					var cards = JSON.parse(app_cards);

					self.loadCards(Card, cards).then(function(e) {
						console.log(e);
						deferred.resolve(pane);
					}, function(err) {
						console.log(err);
						deferred.cancel(err);
					});
				}, function(err) {
					console.log(err);
					deferred.cancel(pane);
				});
				return deferred.promise;
			},

			buildGISPortal: function(evt, groups) {
				var self = this;
				var deferred = new Deferred();
				// slide the footer out of view
				var footer = query("#footer-container");
				domClass.add(footer[0], 'animate-out-up');
				self.unloadSection().then(function(e) {
					try {
						registry.byId('gisportal-banner').destroyRecursive();
					} catch(err) {
						console.log(err);
					}
					
					var routes = self.adminRoutes;

					self.header = new PageBanner({
							id: 'gisportal-banner',
							class: 'text-white font-size-4 page-banner',
							title: 'GIS Administrative Portal',
							routes: routes
						});
				

					var pane = registry.byId('header-pane');
					pane.set('content', self.header);
					pane.resize();

					// self.buildAnalytics(evt, groups).then(function(resp) {
						self.build2dViewer(evt, groups).then(function(resp) {
							self.build3dViewer(evt, groups).then(function(resp) {
								
								deferred.resolve(resp);
								// self.buildBackEndAPIs(evt, groups).then(function(resp) {
								// 	deferred.resolve(resp);
								// }, function(err) {
								// 	console.log(err);
								// });
							}, function(err) {
								console.log(err);
							});
						}, function(err) {
							console.log(err);
						});
					// }, function(err) {
					// 	console.log(err);
					// });
				}, function(err) {
					console.log(err);
					deferred.cancel(err);
				});
				return deferred.promise;
			},

			buildAnalytics: function(event, gr) {
				var self = this;
				var deferred = new Deferred();
				var widget = registry.byId('site-analytics');
				if (!widget) {
					widget = new Analytics({
						id: "site-analytics"
					});
				
					widget.startup().then(function(e) {
						domConstruct.place(e.domNode, 'main-content');
						deferred.resolve(e);
					});
				} else {
					domConstruct.place(widget.domNode, 'main-content');
					deferred.resolve(widget);
				}
				return deferred.promise;
			},

			build2dViewer: function(event, gr) {
				var self = this;
				var deferred = new Deferred();
				var widget = registry.byId('viewer2d');
				if (!widget) {
					widget =  new IFrameLoader({
						id: "viewer2d",
						url: "https://gisapps.aroraengineers.com/rtaa_admin_viewer"
					});
				
					widget.startup().then(function(e) {
						domConstruct.place(e.domNode, 'main-content');
						deferred.resolve(e);
					});
				} else {
					domConstruct.place(widget.domNode, 'main-content');
					deferred.resolve(widget);
				}
				return deferred.promise;
			},

			build3dViewer: function(event, gr) {
				var self = this;
				var deferred = new Deferred();
				var widget = registry.byId('viewer3d');
				if (!widget) {
					widget = new IFrameLoader({
						id: "viewer3d",
						url: "https://gisapps.aroraengineers.com/rtaa_airspace"
					});
				
					widget.startup().then(function(e) {
						domConstruct.place(e.domNode, 'main-content');
						deferred.resolve(e);
					});
				} else {
					domConstruct.place(widget.domNode, 'main-content');
					deferred.resolve(widget);
				}
				return deferred.promise;
			},

			buildBackEndAPIs: function(event, gr) {
				var self = this;
				var deferred = new Deferred();
				var widget = registry.byId('publishing-tools');
				if (!widget) {
					widget = new PublishingTools({
						id: "publishing-tools"
					});
				
					widget.startup().then(function(e) {
						domConstruct.place(e.domNode, 'main-content', "last");
						deferred.resolve(e.domNode);
					});
				} else {
					domConstruct.place(widget.domNode, 'main-content');
					deferred.resolve(widget);
				}
				return deferred.promise;
			},

			buildWebResources: function(evt, groups) {
				var self = this;
				var deferred = new Deferred();
				var footer = query("#footer-container");
				domClass.add(footer[0], 'animate-out-up');
				self.unloadSection().then(function(e) {
					try {
						registry.byId('web-resources-banner').destroyRecursive();
					} catch(err) {
						console.log(err);
					}

					self.header = new PageBanner({
						id: 'web-resources-banner',
						class: 'text-white font-size-4 page-banner',
						title: 'Online Resource Library',
						routes: {}
					});

					var pane = registry.byId('header-pane');
					pane.set('content', self.header);
					pane.resize();
					self.buildResourcePage(evt, groups).then(function(resp) {
						deferred.resolve(resp);
					}, function(err) {
						console.log(err);
					});
				}, function(err) {
					deferred.cancel(err);
				});
				return deferred.promise;
			},

			buildResourcePage: function(evt, groups) {
				var self = this;
				var deferred = new Deferred();
				var widget = registry.byId('resourcePage');
				if (!widget) {
					widget = new ResourcePage({
						id: "resourcePage"
					});
				
					widget.startup().then(function(e) {
						domConstruct.place(e.domNode, 'main-content');
						deferred.resolve(e);
					});
				} else {
					domConstruct.place(widget.domNode, 'main-content');
					deferred.resolve(widget);
				}
				return deferred.promise;
			},

			buildHelp: function(evt, groups) {
				var self = this;
				var deferred = new Deferred();
				var footer = query("#footer-container");
				domClass.add(footer[0], 'animate-out-up');
				self.unloadSection().then(function(e) {
					try {
						registry.byId('help-banner').destroyRecursive();
					} catch(err) {
						console.log(err);
					}
					var routes = self.helpRoutes;

					self.header = new PageBanner({
						id: 'help-banner',
						class: 'text-white font-size-4 page-banner',
						title: 'Help Documentation',
						routes: routes
					});

					var pane = registry.byId('header-pane');
					pane.set('content', self.header);
					pane.resize();

					self.buildTechnicalDetails(evt, groups).then(function(resp) {
						self.buildAboutSite(evt, groups).then(function(resp) {
							self.buildRequestHelp(evt, groups).then(function(resp) {
								deferred.resolve(resp);
							}, function(err) {
								console.log(err);
							});
						}, function(err) {
							console.log(err);
						});
					}, function(err) {
						console.log(err);
					});
				});
				return deferred.promise;
			},

			buildTechnicalDetails: function(evt, groups) {
				var self = this;
				var deferred = new Deferred();
				var widget = registry.byId('technicalDetails');
				if (!widget) {
					widget = new TechnicalDetails({
						id: "technicalDetails"
					});
				
					widget.startup().then(function(e) {
						domConstruct.place(e.domNode, 'main-content');
						deferred.resolve(e);
					});
				} else {
					domConstruct.place(widget.domNode, 'main-content');
					deferred.resolve(widget);
				}
				return deferred.promise;
			},

			buildAboutSite: function(evt, groups) {
				var self = this;
				var deferred = new Deferred();
				var widget = registry.byId('aboutSite');
				if (!widget) {
					widget = new AboutSite({
						id: "aboutSite"
					});
				
					widget.startup().then(function(e) {
						domConstruct.place(e.domNode, 'main-content');
						deferred.resolve(e);
					});
				} else {
					domConstruct.place(widget.domNode, 'main-content');
					deferred.resolve(widget);
				}
				return deferred.promise;
			},

			buildRequestHelp: function(evt, groups) {
				var self = this;
				var deferred = new Deferred();
				var widget = registry.byId('requestHelp');
				if (!widget) {
					widget = new RequestHelp({
						id: "requestHelp"
					});
				
					widget.startup().then(function(e) {
						domConstruct.place(e.domNode, 'main-content');
						deferred.resolve(e);
					});
				} else {
					domConstruct.place(widget.domNode, 'main-content');
					deferred.resolve(widget);
				}
				return deferred.promise;
			},

			enablePage: function(page) {
				var self = this;
				var routes = self.adminRoutes;
				var names = [];
				Array.forEach(routes, function(e) {
					var path = e.href;
					var name = path.split(/\//)[1];
					names.push(name);
				});
				var result = Array.every(names, function(e) {
					var node = dom.byId(e);
					if (!node) {
						var widget = registry.byId(e);
						if (!widget) {
							return false;
						} else {
							node = widget.domNode;
						}
					}

					if (node) {
						if (e !== page) {
							domClass.remove(node, "activated");
							domClass.add(node, "off");
						}
						return true;
					}
					
				});

				if (result) {
					var node = dom.byId(page);
					if (!node) {
						node = registry.byId(page).domNode;
					}
					domClass.remove(node, "off");
					domClass.add(node, "activated");
				} else {
					self.buildGISPortal(null, null).then(function(e) {
						self.enablePage(page);
					});
				}
			}
		});
	});