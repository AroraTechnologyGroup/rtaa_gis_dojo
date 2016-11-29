define([
	'dijit/registry',
	"dojo/_base/declare",
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
	'app/Card',
	'app/HomepageBanner',
	'app/PageBanner',
	'dijit/layout/ContentPane'
	], function(
		registry,
		declare,
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
		Card,
		HomepageBanner,
		PageBanner,
		ContentPane
		) {

		return declare([], {
			
			unloadBanner: function() {
				var deferred = new Deferred();
				(function() {
					if (registry.byId('headerPane') !== undefined) {
						var obj = registry.byId('headerPane');
						domConstruct.empty(registry.byId('headerPane').containerNode);
						registry.remove('headerPane');
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
						domConstruct.empty(registry.byId('main-content').containerNode);
						registry.remove('main-content');
						deferred.resolve(true);
					} else {
						deferred.resolve(false);
					}
				})();
				return deferred.promise;
			},

			unloadSection: function() {
				var deferred = new Deferred();
				all([this.unloadBanner(), this.unloadContent()]).then(function(arr) {
					deferred.resolve("page cleaned, ready for new page load");
				});
				return deferred.promise;
			},

			loadCards: function(objects, domNode) {
				// each card object has [baseClass, imgSrc, href, header, content]
				var mainDeferred = new Deferred();

				var pane = new ContentPane({
					id: 'main-content'
				}, 'main-content');


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
					pane.startup();
					Array.forEach(arr, function(e) {
						pane.addChild(e);
					});
					mainDeferred.resolve(pane);
				});
				return mainDeferred.promise;
			},

			getGroups: function() {
				var deferred = new Deferred();
				// var user_list = query('.user-nav-name');
				var user_list = ["siteadmin"];
				if (user_list.length > 0) {
					// var username = user_list[0].innerText;
					var username = user_list[0];
					(function() {
						request("http://127.0.0.1:8080/groups/", {
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
			}
		});
	});