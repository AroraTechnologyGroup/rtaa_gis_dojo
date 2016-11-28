define([
	'dijit/registry',
	"dojo/_base/declare",
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
	'dijit/layout/ContentPane'
	], function(
		registry,
		declare,
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
			}
		});
	});