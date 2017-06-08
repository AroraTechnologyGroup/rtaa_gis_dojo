define([
	'dijit/registry',
	'dojo/dom',
	'dojo/dom-construct',
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
			constructor: function(options, srcNodeRef) {
				this.inherited(arguments);
				console.log("analytics::constructor()");
			},
			postCreate: function() {
				this.inherited(arguments);
				console.log("analytics::postCreate()");
				var cp = new ContentPane({
					id: 'analytics',
					class: 'admin-panel',
					style: "height: 100vh; width: 100%"
				});
				cp.set('content', domConstruct.toDom("<h1>Site Analytics</h1>"));
				cp.placeAt(this.content);
			},
			startup: function() {
				this.inherited(arguments);
				console.log("analytics::startup()");
				var deferred = new Deferred();
				deferred.resolve();
				return deferred.promise;
			}
		});
	});