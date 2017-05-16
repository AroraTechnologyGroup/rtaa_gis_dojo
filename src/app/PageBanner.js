define([
  "dojo/_base/declare",
  "dojo/_base/lang",
  "dojo/dom-construct",
  "dojo/dom-style",
  "dojo/query",
  "dojo/_base/array",
  "dijit/_WidgetBase",
  "dijit/_OnDijitClickMixin",
  "dijit/_TemplatedMixin",
  "dojo/hash",
  "dojo/router",
  "dojo/on",
  "dojo/topic",
  "dojo/text!./templates/PageBanner_template.html"
], function(
  declare,
  lang,
  domConstruct,
  domStyle,
  query,
  Array,
  _WidgetBase,
  _OnDijitClickMixin,
  _TemplatedMixin,
  hash,
  router,
  on,
  topic,
  template
) {
  return declare([_WidgetBase, _OnDijitClickMixin, _TemplatedMixin], {
    templateString: template,
    baseClass: "_PageBanner",
    options: {
      title: null,
      routes: []
    },
    constructor: function(options) {
      this.inherited(arguments);
      declare.safeMixin(this.options, options);
      this.set("title", this.options.title);
      this.set("subtitle", this.options.subtitle);
      this.set("routes", this.options.routes);
    },
    postCreate: function() {
      var routes = this.routes;
      var targetNode = this.routeNode;
     
      if (routes.length >= 1) {
        Array.forEach(routes, function(e) {
          var link = domConstruct.toDom("<a class='sub-nav-link'>"+e.title+"</a>");
          on(link, 'click', function(evt) {
            evt.preventDefault();
            var current = hash();
            if (e.href !== current) {
              hash(e.href, true);
              
            }
          });
          domConstruct.place(link, targetNode, 'last');
        });
      }
    }
  });
});
