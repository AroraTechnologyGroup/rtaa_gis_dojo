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
	'dojo/text!./templates/Viewer3d_template.html'
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
				console.log("viewer3d::constructor()");
			},
			postCreate: function() {
				this.inherited(arguments);
				console.log("viewer3d::postCreate()");
				var cp = new ContentPane({
					id: 'viewer3d',
					class: 'admin-panel',
					style: "height: 100vh; width: 100%"
				});
				// request html page from server and set as content in the pane
				
				cp.set('content', domConstruct.toDom("<h1>3d Viewer</h1>"));
				cp.placeAt(this.content);
				cp.startup();
			},
			startup: function() {
				this.inherited(arguments);
				console.log("viewer3d::startup()");
				var deferred = new Deferred();
				deferred.resolve();
				return deferred.promise;
			}
		});
	});