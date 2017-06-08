define([
	'dijit/registry',
	'dojo/dom',
	'dojo/dom-construct',
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
			constructor: function(options, srcNodeRef) {
				this.inherited(arguments);
				console.log("publishingTools::constructor()");
			},
			postCreate: function() {
				this.inherited(arguments);
				console.log("publishingTools::postCreate()");
				var cp = new ContentPane({
					id: 'publishing',
					class: 'admin-panel',
					style: "height: 100vh; width: 100%"
				});
				cp.set('content', domConstruct.toDom("<h1>Publishing Tools</h1>"));
				cp.placeAt(this.content);
			},
			startup: function() {
				this.inherited(arguments);
				console.log("publishingTools::startup()");
				var deferred = new Deferred();
				deferred.resolve();
				return deferred.promise;
			}
		});
	});