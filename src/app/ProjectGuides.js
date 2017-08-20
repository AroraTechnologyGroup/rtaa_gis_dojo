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
	'dojo/text!./templates/ProjectGuides_template.html'
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
				console.log("project-guides::constructor()");
			},
			postCreate: function() {
				this.inherited(arguments);
				console.log("project-guides::postCreate()");
				var cp = new ContentPane({
					id: 'project-guides',
					class: 'admin-panel',
					style: "height: 100vh; width: 100%",
					href: 'app/resources/CollectorProjectBuildGuide.htm'
				});
				cp.set('content', domConstruct.toDom("<h1>Project Guides</h1>"));
				// request html page from server and set as content in the pane
				
				cp.placeAt(this.content);
				cp.startup();
			},
			startup: function() {
				this.inherited(arguments);
				console.log("project-guides::startup()");
				var deferred = new Deferred();
				deferred.resolve();
				return deferred.promise;
			}
		});
	});