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
			}
		});
	});