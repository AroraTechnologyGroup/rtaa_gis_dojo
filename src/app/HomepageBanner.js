define([
  "dojo/_base/declare",
  "dojo/parser",
  "dojo/_base/lang",
  "dojo/_base/array",
  "dojo/dom-construct",
  "dijit/_WidgetBase",
  "dijit/_OnDijitClickMixin",
  "dijit/_TemplatedMixin",
  "dojo/text!./templates/HomepageBanner_template.html"
], function(
  declare,
  parser,
  lang,
  Array,
  domConstruct,
  _WidgetBase,
  _OnDijitClickMixin,
  _TemplatedMixin,
  template
) {
  return declare([_WidgetBase, _OnDijitClickMixin, _TemplatedMixin], {
    templateString: template,
    options: {
      title: null,
      subtitle: null
    },

    constructor: function(options) {
      declare.safeMixin(this.options, options);
      this.set("title", this.options.title);
      this.set("subtitle", this.options.subtitle);
    },

    postCreate: function() {
    }
  });
});
