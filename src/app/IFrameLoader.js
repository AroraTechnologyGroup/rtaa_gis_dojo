define([
	'dijit/registry',
	'dojo/dom',
	'dojo/dom-construct',
	'dojo/dom-style',
	'dojo/dom-class',
	'dojo/_base/declare',
	'dojo/_base/lang',
	'dojo/_base/unload',
	'dojo/Deferred',
	"dojo/aspect",
	'dijit/layout/ContentPane',
	'dojo/text!./templates/IFrameLoader_template.html',
	'dijit/_WidgetBase',
	"dijit/_TemplatedMixin",
	'dijit/_WidgetsInTemplateMixin'
	], function(
		registry,
		dom,
		domConstruct,
		domStyle,
		domClass,
		declare,
		lang,
		baseUnload,
		Deferred,
		aspect,
		ContentPane,
		template,
		_WidgetBase,
		_TemplatedMixin,
		_WidgetsInTemplateMixin 
		) {

		return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
			templateString: template,
			baseClass: "_iframe-loader",
			id: null,
			url: null,
			constructor: function(config) {
				this.inherited(arguments);
				declare.safeMixin(this, config);
			},
			
			postCreate: function() {
				var self = this;
				this.inherited(arguments);
				console.log("iframe-loader::postCreate()");
				var pane = new ContentPane({
				  style: {
				  	float: "left",
				    position: "relative",
				    width: "100%",
				    height: "100vh",
				    overflow: "hidden"
				  }
				}, self.content);
				pane.set('content', domConstruct.create("iframe",  {
				    src: self.url,
				    margin: 0,
				    frameborder: 0,
				    height: '100%',
				    width: '100%',
				    allowfullscreen: true
				}));
				pane.startup();
				aspect.after(pane, 'resize', function(evt) {
					domStyle.set(self.domNode, "height", "90vh");
				});
				domClass.add(self.domNode, "off");
			},

			startup: function() {
				var self = this;
				var deferred = new Deferred();
				var id = self.id;
				baseUnload.addOnUnload(function() {
					if (registry.byId(id)) {
						registry.byId(id).destroyRecursive();
					}
				});
				deferred.resolve(self);
				return deferred.promise;
			},

			unloadIframe: function() {
				var self = this;
				var deferred = new Deferred();
				var iframe_pane = registry.byId(self.id);
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