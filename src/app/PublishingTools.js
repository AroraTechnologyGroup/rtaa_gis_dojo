define([
	'dijit/registry',
	'dojo/dom',
	'dojo/dom-construct',
	'dojo/dom-class',
	'dojo/_base/declare',
	'dojo/_base/lang',
	'dojo/Deferred',
	'dijit/layout/ContentPane',
	'dijit/_WidgetBase',
	"dijit/_TemplatedMixin",
	'dijit/_WidgetsInTemplateMixin',
	"dojo/text!./templates/PublishingTools_template.html"
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
		_WidgetBase,
		_TemplatedMixin,
		_WidgetsInTemplateMixin,
		template
		) {
		return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
			templateString: template,
			id: null,
			baseClass: '_publishing-tools',
			constructor: function(options) {
				this.inherited(arguments);
				declare.safeMixin(this, options);
				console.log("publishingTools::constructor()");
			},
			postCreate: function() {
				this.inherited(arguments);
				console.log("publishingTools::postCreate()");
				var self = this;
				var cp = new ContentPane({
					class: 'admin-panel',
					style: "height: 100vh; width: 100%; background-color: white"
				});
				cp.set('content', domConstruct.toDom("<h1>Publishing Tools</h1>"));
				cp.placeAt(this.content);
				domClass.add(self.domNode, 'off');
			},
			startup: function() {
				this.inherited(arguments);
				console.log("publishingTools::startup()");
				var self = this;
				var deferred = new Deferred();
				deferred.resolve(self);
				return deferred.promise;
			}
		});
	});