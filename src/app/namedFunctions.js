define([
	'dijit/registry',
	"dojo/_base/declare",
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
	'esri/IdentityManager',
	'esri/arcgis/OAuthInfo',
	'dijit/layout/ContentPane',
	'dojo/text!./application_cards.json'
	], function(
		registry,
		declare,
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
		esriId,
		OAuthInfo,
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

				domClass.add(pane.domNode, "block-group block-group-4-up tablet-block-group-3-up phone-block-group-1-up");
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
						isAdmin: e.isAdmin,
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

					// remove cards that are not admin
					var reg_cards = Array.filter(cards, function(e) {
						return !e.isAdmin;
					}); 

					self.loadCards(Card, reg_cards).then(function(e) {
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
								title: 'Site Analytics',
								href: 'gisportal/analytics'
							}, {
								title: '2D Data Viewer',
								href: 'gisportal/2dviewer'
							}, {
								title: '3D Data Viewer',
								href: 'gisportal/3dviewer'
							}, {
								title: 'Publishing Tools',
								href: 'gisportal/publishing-tools'
							}];
				

					self.header = new PageBanner({
							id: 'gisportal-banner',
							class: 'text-white font-size-4 page-banner',
							title: 'Geographic Information Systems',
							routes: routes
						});

					
					var pane = registry.byId('header-pane');
					pane.set('content', self.header);
					pane.resize();
					deferred.resolve(pane);
				}, function(err) {
					console.log(err);
					deferred.cancel(err);
				});
				return deferred.promise;

			},
			buildAnalytics: function(evt, groups) {
				var self = this;
				var deferred = new Deferred();
				if (registry.byId('gisportal-banner') !== undefined) {
					var nodeList = query("h1", 'gisportal-banner');
					nodeList[0].innerText = 'Admin: Site Analytics';
					registry.byId('gisportal-banner').set('title', 'Admin: Site Analytics');
				}
				deferred.resolve();
				return deferred.promise;
			},
			build2dViewer: function(evt, groups) {
				var self = this;
				var deferred = new Deferred();
				if (registry.byId('gisportal-banner') !== undefined) {
					var nodeList = query("h1", 'gisportal-banner');
					nodeList[0].innerText = 'Admin: Online 2D Data Viewer';
					registry.byId('gisportal-banner').set('title', 'Admin: Online 2D Data Viewer');
					self.agolLogin().then(function(e) {
						self.loadIframe("https://rtaa.maps.arcgis.com/apps/webappviewer/index.html?id=9244a03e2c4b4213959096d6cb7d4927");
					});
				}
				deferred.resolve();
				return deferred.promise;
			},
			build3dViewer: function(evt, groups) {
				var self = this;
				var deferred = new Deferred();
				if (registry.byId('gisportal-banner') !== undefined) {
					var nodeList = query("h1", 'gisportal-banner');
					nodeList[0].innerText = 'Admin: Online 3D Data Viewer';
					registry.byId('gisportal-banner').set('title', 'Admin: Online 3D Data Viewer');
					self.agolLogin().then(function(e) {
						self.loadIframe("https://rtaa.maps.arcgis.com/apps/webappviewer3d/index.html?id=01fbf7699e68478b9a8116f7e36a0d1e");
					});
				}
				deferred.resolve();
				return deferred.promise;
			},

			buildBackEndAPIs: function(evt, groups) {
				var self = this;
				var deferred = new Deferred();
				if (registry.byId('gisportal-banner') !== undefined) {
					var nodeList = query("h1", 'gisportal-banner');
					nodeList[0].innerText = 'Admin: Publishing Tools';
					registry.byId('gisportal-banner').set('title', 'Admin: Publishing Tools');
				}
				deferred.resolve();
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
					self.header = new PageBanner({
						id: 'help-banner',
						class: 'text-white font-size-4 page-banner',
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
			},

			agolLogin: function() {
				var self = this;
				var deferred = new Deferred();
				var cred = "esri_jsapi_id_manager_data";
				baseUnload.addOnUnload(storeCredentials);
				loadCredentials().then(function(e) {
					deferred.resolve(e);
				});
				return deferred.promise;

				function loadCredentials() {
					var _deferred = new Deferred();
					var idJson, idObject;
					if (supports_local_storage()) {
						idJson = window.localStorage.getItem(cred);
					} else {
						idJson = cookie(cred);
					}

					if (idJson && idJon !== "null" && idJson.length > 4) {
						idObject = JSON.parse(idJson);
						esriId.initialize(idObject);
						_deferred.resolve(idObject);
					} else {
						// _deferred.cancel("unable to locate credential from storage");
						var info = new OAuthInfo({
							appId: "ZiLmgjAhbXtBT7Ge",
							popup: true
						});
						esriId.registerOAuthInfos([info]);
						// on(dom.byId("sign-in"), "click", function (){
					 //      console.log("click", arguments);
					 //      // user will be redirected to OAuth Sign In page
					 //      esriId.getCredential(info.portalUrl + "/sharing");
					 //    });

					 //    on(dom.byId("sign-out"), "click", function (){
					 //      esriId.destroyCredentials();
					 //      window.location.reload();
					 //    });
					    deferred.resolve(esriId);

					}
					return _deferred.promise;
				}

				function storeCredentials() {
					if (esriId.credentials.length === 0) {
						return;
					}

					var idString = JSON.stringify(esriId.toJson());
					if (supports_local_storage()) {
						window.localStorage.setItem(cred, idString);
					} else {
						cookie(cred, idString, {expires: 1});
					}
				}

				function supports_local_storage() {
					try {
						return "localStorage" in window && window.localStorage !== null;
					} catch (e) {
						return false;
					}
				}
			},
			loadIframe: function(url) {
				var self = this;
				self.unloadIframe().then(function(e) {
				console.log(e);
				var pane = new ContentPane({
				  id: "iframe-pane",
				  style: {
				    position: "relative",
				    width: "100%",
				    height: "100vh",
				    overflow: "hidden"
				  }
				});
				pane.startup();
				pane.set('content', domConstruct.create("iframe",  {
				    src: url,
				    margin: 0,
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
		});
	});