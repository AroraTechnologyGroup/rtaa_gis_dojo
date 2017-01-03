define([
	'dijit/registry',
	"dojo/_base/declare",
	"dojo/aspect",
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
	'dijit/layout/ContentPane'
	], function(
		registry,
		declare,
		aspect,
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
		ContentPane
		) {

		return declare([], {
			
			unloadBanner: function() {
				var deferred = new Deferred();
				(function() {
					if (registry.byId('header-pane') !== undefined) {
						var obj = registry.byId('header-pane');
						domConstruct.empty(obj.containerNode);
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
						deferred.resolve(true);
					} else {
						deferred.resolve('no widgets were found in main-content domNode');
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
				var nodelist = Array.map(objects, function(e) {
					var deferred = new Deferred();
					if (registry.byId(e.id) !== undefined) {
						registry.byId(e.id).destroyRecursive();
					}
					var div = domConstruct.create('div');
					var new_card = new Card({
						id: e.id,
						baseClass: e.baseClass,
						href: e.href,
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
			},

			getGroups: function(url) {
				var deferred = new Deferred();
				
				(function() {
					request(url, {
						method: "POST",
						preventCache: true,
						handleAs: 'json',
						headers: {
				            "X-Requested-With": null,
				            "X-CSRFToken": cookie('csrftoken')
				        }
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

			loadIframe: function() {
				var self = this;
				self.unloadIframe().then(function(e) {
				console.log(e);
				var pane = new ContentPane({
				  id: "iframe-pane",
				  style: {
				    position: "relative",
				    width: "100%",
				    height: "90vh",
				    overflow: "hidden"
				  }
				});
				pane.startup();
				pane.set('content', domConstruct.create("iframe",  {
				    src: self.href,
				    frameborder: 0,
				    height: '100%',
				    width: '100%',
				    allowfullscreen: true
				}));
				pane.placeAt(dom.byId('main-content'));
				aspect.after(pane, 'resize', function(evt) {
					domStyle.set(pane.domNode, "height", "90vh");
					});
				});
				var target = query(".top-nav-list")[0];

				var node = domConstruct.create("button", {
					class: "btn-green",
					innerHTML: "back to apps"
				}, target);

				on(node, 'click', function(e) {
					self.unloadIframe().then(function(e) {
						router.go("gisportal/apps");
						domConstruct.destroy(node);
					});
				});
			},

			unloadIframe: function() {
				var self = this;
				var deferred = new Deferred();
				var iframe_pane = registry.byId("iframe-pane");
				if (iframe_pane !== undefined) {
					iframe_pane.destroy();
					registry.remove(iframe_pane);
					deferred.resolve("iframe-pane removed from registry");
				} else {
					deferred.resolve("iframe-pane not found");
				}
				return deferred.promise;
			},

			buildTitleBar: function(evt) {
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
						baseClass: 'sub-nav-title text-white leader-0 trailer-6 animate-fade-in',
						title: 'Reno/Tahoe International Airport GIS Website'
					});
				} else {
					self.header = registry.byId('homepage-banner');
				}

				pane.set('content', self.header);
				deferred.resolve(pane);
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
					
					// if the user is admin, allow for browse data and backend api
					
					var routes = [{
								title: 'Dashboard',
								href: '/#gisportal/dashboard'
							}, {
								title: 'Web Mapping Apps',
								href: '/#gisportal/apps'
							}];
					
					var test = Array.indexOf(groups, 'GIS_admin');
					if (test !== -1) {
						routes.push({
								title: 'Data Viewer',
								href: '/#gisportal/published-layers'
							}, {
								title: 'Publishing Tools',
								href: '/#gisportal/publishing-tools'
							});
					} 

					self.header = new PageBanner({
							id: 'gisportal-banner',
							baseClass: 'text-white font-size-4 page-banner',
							title: 'Geographic Information Systems',
							routes: routes
						});

					
					var pane = registry.byId('header-pane');
					pane.set('content', self.header);
					pane.resize();
					deferred.resolve(pane.content);
				}, function(err) {
					console.log(err);
					deferred.cancel(err);
				});
				return deferred.promise;

			},

			buildDashboard: function(evt, Card, groups) {
				var deferred = new Deferred();
				if (registry.byId('gisportal-banner') !== undefined) {
					//TODO - modify text in title to show selected route
					var nodeList = query("h1", 'gisportal-banner');
					nodeList[0].innerText = 'My Dashboard';
					registry.byId('gisportal-banner').set('title', 'My Dashboard');
					deferred.resolve(nodeList);
				} else {
					deferred.cancel('gisportal-banner does not exist');
				}
				return deferred.promise;
			},

			buildDepartments: function(evt, groups) {
				var self = this;
				var deferred = new Deferred();
				var footer = query("#footer-container");
				domClass.add(footer[0], 'animate-out-up');
				self.unloadSection().then(function(e) {
					try {
						registry.byId('departments-banner').destroyRecursive();
					} catch(err) {
						// console.log(err);
					}

					var routes = [{
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
						}];

					var filtered_routes = [];
					Array.forEach(routes, function(e) {
						if (Array.indexOf(groups, e.title) !== -1) {
							filtered_routes.push(e);
						}
					});

					self.header = new PageBanner({
						id: 'departments-banner',
						baseClass: 'text-white font-size-4 page-banner',
						title: "Airport Departments",
						routes: filtered_routes
					});

					var pane = registry.byId('header-pane');
					pane.set('content', self.header);
					deferred.resolve(pane);
				}, function(err) {
					console.log(err);
					deferred.cancel(err);
				});
				return deferred.promise;
			},

			buildEngineering: function(evt, Card, groups) {
				var deferred = new Deferred();
				if (registry.byId('departments-banner') !== undefined) {
					var nodeList = query("h1", 'departments-banner');
					nodeList[0].innerText = 'Airport Engineering';
					registry.byId('departments-banner').set('title', 'Airport Engineering');
					deferred.resolve(nodeList[0]);
				} else {
					deferred.cancel('departments-banner does not exist');
				}
				return deferred.promise;
			},

			buildOperations: function(env, Card, groups) {
				var deferred = new Deferred();
				if (registry.byId('departments-banner') !== undefined) {
					var nodeList = query("h1", 'departments-banner');
					nodeList[0].innerText = 'Airport Operations';
					registry.byId('departments-banner').set('title', 'Airport Operations');
					deferred.resolve(nodeList[0]);
				} else {
					deferred.cancel('departments-banner does not exist');
				}
				return deferred.promise;
			},

			buildPlanning: function(env, Card, groups) {
				var deferred = new Deferred();
				if (registry.byId('departments-banner') !== undefined) {
					var nodeList = query("h1", 'departments-banner');
					nodeList[0].innerText = 'Airport Planning';
					registry.byId('departments-banner').set('title', 'Airport Planning');
					deferred.resolve(nodeList[0]);
				} else {
					deferred.cancel('departments-banner does not exist');
				}
				return deferred.promise;
			},

			buildUtilities: function(env, Card, groups) {
				var deferred = new Deferred();
				if (registry.byId('departments-banner') !== undefined) {
					var nodeList = query("h1", 'departments-banner');
					nodeList[0].innerText = 'Airport Utilities';
					registry.byId('departments-banner').set('title', 'Utilities');
					deferred.resolve(nodeList[0]);
				} else {
					deferred.cancel('departments-banner does not exist');
				}
				return deferred.promise;
			},

			buildApps: function(evt, Card, groups) {
				var self = this;
				var deferred = new Deferred();
				if (registry.byId('gisportal-banner') !== undefined) {
					var t = registry.byId('gisportal-banner').domNode;
					var nodeList = query("h1", t);
					nodeList[0].innerText = "Geospatial Applications";
					registry.byId('gisportal-banner').set('title', 'Geospatial Applications');
					deferred.progress(nodeList[0]);
				} else {
					deferred.cancel("gisportal-banner does not exist");
				}

				var airspace_app = {
					id: "AirspaceAppCard",
					imgSrc: 'static/home/app/img/thumbnails/airspace_app.png',
					href: 'https://gisapps.aroraengineers.com/rtaa_airspace/',
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

				var airfield_app = {
					id: "AirfieldAppCard",
					imgSrc: 'static/home/app/img/thumbnails/airfield_app.png',
					href: 'https://gisapps.aroraengineers.com/rtaa_airfield/',
					header: 'Airfield',
					baseClass: 'card column-4 leader-2 trailer-2',
					contents: ''
				};

				var property_app = {
					id: "PropertyAppCard",
					imgSrc: 'static/home/app/img/thumbnails/property_app.png',
					href: 'https://gisapps.aroraengineers.com/rtaa_property/',
					header: 'Parcel, Easement, and Leases',

					baseClass: 'card column-4 leader-2 trailer-2',
					contents: ''
				};

				
				var cards;
				var test = Array.indexOf(groups, 'GIS_admin');
				if (test !== -1) {
					cards = [airspace_app, eDoc_app, airfield_app, property_app];
				} else {
					cards = [airspace_app, airfield_app, property_app];
				}
				self.loadCards(Card, cards).then(function(e) {
					console.log(e);
					deferred.resolve(e);
				}, function(err) {
					console.log(err);
					deferred.cancel(e);
				});
				return deferred.promise;
			},

			buildDataBrowser: function(evt, Card, groups) {
				var self = this;
				var deferred = new Deferred();
				if (registry.byId('gisportal-banner') !== undefined) {
					var nodeList = query("h1", 'gisportal-banner');
					nodeList[0].innerText = 'Admin: Published Layers';
					registry.byId('gisportal-banner').set('title', 'Admin: Published Layers');
				}
				self.loadCards(Card, [{
					id: "Data Viewer",
					imgSrc: 'static/home/app/img/thumbnails/data_viewer.png',
					href: 'https://gisapps.aroraengineers.com/rtaa_data_viewer',
					header: 'Data Viewer',
					baseClass: 'card column-4 leader-1 trailer-2',
					contents: 'View Published Layers from AGOL'
				}]).then(function(e) {
					console.log(e);
					deferred.resolve(e);
				}, function(err) {
					console.log(err);
					deferred.cancel(err);
				});
				return deferred.promise;
			},

			buildBackEndAPIs: function(evt, Card, groups) {
				var self = this;

				var deferred = new Deferred();
				if (registry.byId('gisportal-banner') !== undefined) {
					var nodeList = query("h1", 'gisportal-banner');
					nodeList[0].innerText = 'Admin: Inspect GDB / Publish Layers';
					registry.byId('gisportal-banner').set('title', 'Admin: Inspect GDB / Publish Layers');
				}
				self.loadCards(Card, [{
					id: "eDoc Rest API",
					imgSrc: 'static/home/app/img/thumbnails/restapi_app.png',
					href: 'https://gisapps.aroraengineers.com:8004/edoc/swag',
					header: 'eDoc Rest API',
					baseClass: 'card column-4 leader-1 trailer-2',
					contents: 'Manage the eDoc Rest API'
				}]).then(function(e) {
					console.log(e);
					deferred.resolve(e);
				}, function(err) {
					console.log(err);
					deferred.cancel(err);
				});
				return deferred.promise;
			},

			buildWebResources: function(evt, Card, groups) {
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
					pane.set('content', self.header);
					deferred.resolve(pane);
				});
				return deferred.promise;
			},

			buildHelp: function(evt, Card, groups) {
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
					self.header = new PageBanner({
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
					pane.set('content', self.header);
					deferred.resolve(pane);
				});
				return deferred.promise;
			}
		});
	});