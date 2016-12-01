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
				// var user_list = query('.user-nav-name');
				var user_list = ["siteadmin"];
				if (user_list.length > 0) {
					// var username = user_list[0].innerText;
					var username = user_list[0];
					(function() {
						request(url, {
							method: "POST",
							preventCache: true,
							handleAs: 'json',
							data: {
								'username': username,
							},
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
					
				} else {
					deferred.resolve(["anonymous"]); 
				}

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
				    // frameborder: 0,
				    height: '100%',
				    width: '100%',
				    allowfullscreen: true
				}));
				pane.placeAt(dom.byId('main-content'));
				aspect.after(pane, 'resize', function(evt) {
					domStyle.set(pane.domNode, "height", "90vh");
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
					
					var routes;
					
					var test = Array.indexOf(groups, 'GIS');
					if (test !== -1) {
						routes = [{
								title: 'Dashboard',
								href: '/#gisportal/dashboard'
							}, {
								title: 'Web Mapping Apps',
								href: '/#gisportal/apps'
							}, {
								title: 'AGOL Browser',
								href: '/#gisportal/gis-data-browse'
							}, {
								title: 'Backend Database APIs',
								href: '/#gisportal/backend-apis'
							}];
					} else {
						routes = [{
								title: 'Dashboard',
								href: '/#gisportal/dashboard'
							}, {
								title: 'Web Mapping Apps',
								href: '/#gisportal/apps'
							}];
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

					var routes;

					self.header = new PageBanner({
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
					var nodeList = query("h1", 'gisportal-banner');
					nodeList[0].innerText = "Geospatial Applications";
					registry.byId('gisportal-banner').set('title', 'Geospatial Applications');
					deferred.progress(nodeList[0]);
				} else {
					deferred.cancel("gisportal-banner does not exist");
				}

				var airspace_app = {
					id: "AirspaceAppCard",
					imgSrc: 'static/home/app/img/thumbnails/airspace_app.png',
					href: 'https://aroragis.maps.arcgis.com/apps/3DScene/index.html?appid=5f7bf59e212c4339a3ffda29315972be',
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
					href: 'https://rtaa.maps.arcgis.com/apps/webappviewer/index.html?id=ff605fe1a736477fad9b8b22709388d1',
					header: 'Airfield',
					baseClass: 'card column-4 leader-2 trailer-2',
					contents: ''
				};

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
					nodeList[0].innerText = 'Browse GIS Data';
					registry.byId('gisportal-banner').set('title', 'Browse GIS Data');
				}

				deferred.resolve("no code written for this method");
				return deferred.promise;
			},

			buildBackEndAPIs: function(evt, Card, groups) {
				var self = this;

				var deferred = new Deferred();
				if (registry.byId('gisportal-banner') !== undefined) {
					var nodeList = query("h1", 'gisportal-banner');
					nodeList[0].innerText = 'Backend APIs';
					registry.byId('gisportal-banner').set('title', 'Backend APIs');
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