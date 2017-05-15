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
	'dijit/layout/ContentPane',
	'dojo/text!./application_cards.json'
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
		ContentPane,
		app_cards
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
						path: e.path,
						content1: e.content1,
						content2: e.content2,
						imgSrc: e.imgSrc,
						header: e.header,
						back_url: e.back_url
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

			loadIframe: function(back_url) {
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
						router.go(self.back_url);
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
					// remove cards that are not active
					var active_cards = Array.filter(cards, function(e) {
						return e.active && !e.isAdmin;
					}); 

					self.loadCards(Card, active_cards).then(function(e) {
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
					
					// if the user is admin, allow for browse data and backend api
					
					var routes = [{
								title: 'Data Viewer',
								href: 'gisportal/viewer'
							}, {
								title: 'Publishing Tools',
								href: 'gisportal/publishing-tools'
							}];
				

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

			buildDataBrowser: function(evt, Card, groups) {
				var self = this;
				var deferred = new Deferred();
				if (registry.byId('gisportal-banner') !== undefined) {
					var nodeList = query("h1", 'gisportal-banner');
					nodeList[0].innerText = 'Admin: Online Data Viewer';
					registry.byId('gisportal-banner').set('title', 'Admin: Online Data Viewer');
				}

				// these are loaded from dojo/text!./application_cards.json
				var cards = JSON.parse(app_cards);
				// remove cards that are not active
				var active_cards = Array.filter(cards, function(e) {
					return e.active && e.isAdmin;
				}); 

				self.loadCards(Card, active_cards).then(function(e) {
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
					nodeList[0].innerText = 'Admin: Publishing Tools';
					registry.byId('gisportal-banner').set('title', 'Admin: Publishing Tools');
				}
				self.loadCards(Card, [
				// {
				// 	id: "eDoc Rest API",
				// 	imgSrc: 'static/home/app/img/thumbnails/restapi_app.png',
				// 	path: 'https://gisapps.aroraengineers.com:8004/edoc/swag',
				// 	header: 'eDoc Rest API',
				// 	content1: 'Interact with the eDoc Rest API through this graphical api page.',
				// 	content2: 'available for members of the GIS_admin group'
				// }
				]).then(function(e) {
					console.log(e);
					deferred.resolve(e);
				}, function(err) {
					console.log(err);
					deferred.cancel(err);
				});
				return deferred.promise;
			},

			buildApplications: function(evt, Card, groups) {
				var self = this;
				var deferred = new Deferred();
				var footer = query("#footer-container");
				domClass.add(footer[0], 'animate-out-up');
				self.unloadSection().then(function(e) {
					try {
						registry.byId('applications-banner').destroyRecursive();
					} catch(err) {
						// console.log(err);
					}

					// these are loaded from dojo/text!./application_cards.json
					var cards = JSON.parse(app_cards);
					// remove cards that are not active
					var active_cards = Array.filter(cards, function(e) {
						return e.active && !e.isAdmin;
					});
					self.header = new PageBanner({
						id: 'applications-banner',
						baseClass: 'text-white font-size-4 page-banner',
						title: "Web Mapping Applications",
						routes: []
					});

					var pane = registry.byId('header-pane');
					pane.set('content', self.header);
					// set overflow scroll on main-content
					self.loadCards(Card, active_cards).then(function(e) {
						console.log(e);
						deferred.resolve(e);
					}, function(err) {
						console.log(err);
						deferred.cancel(err);
					});

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
							title: 'State Level GIS Data',
							href: 'web-resources/state-level'
						}, {
							title: 'County Level GIS Data',
							href: 'web-resources/county-level'
						}, {
							title: 'ESRI Online Resources',
							href: 'web-resources/esri-resources'
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
							href: 'help/tech-details'
						}, {
							title: 'About this Site',
							href: 'help/about'
						}, {
							title: 'Request Help Ticket',
							href: 'help/request-ticket'
						}, {
							title: 'Tutorials',
							href: 'help/tutorials'
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