define([
	'dijit/registry',
	'dojo/dom',
	'dojo/dom-construct',
	'dojo/dom-class',
	'dojo/_base/declare',
	'dojo/_base/lang',
	'dojo/Deferred',
	'dijit/layout/ContentPane',
	'dojo/text!./analytics_config.json',
	'dojo/text!./templates/Analytics_template.html',
	'dijit/_WidgetBase',
	"dijit/_TemplatedMixin",
	'dijit/_WidgetsInTemplateMixin'
	],
	function(
		registry,
		dom,
		domConstruct,
		domClass,
		declare,
		lang,
		Deferred,
		ContentPane,
		config,
		template,
		_WidgetBase,
		_TemplatedMixin,
		_WidgetsInTemplateMixin 
		) {
		return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
			templateString: template,
			id: null,
			baseClass: '_analytics',
			constructor: function(options, srcNodeRef) {
				this.inherited(arguments);
				console.log("analytics::constructor()");
			},
			postCreate: function() {
				var self = this;
				this.inherited(arguments);
				console.log("analytics::postCreate()");
				var cp = new ContentPane({
					class: 'admin-panel',
					style: "height: 100vh; width: 100%; background-color: white"
				});
				cp.set('content', domConstruct.toDom("<h1>Site Analytics</h1>"));
				
				cp.placeAt(self.content);
				domClass.add(self.domNode, 'activated');
			},
			startup: function() {
				this.inherited(arguments);
				console.log("analytics::startup()");
				var self = this;
				var deferred = new Deferred();
				deferred.resolve(self);
				return deferred.promise;
			}
		});
	});