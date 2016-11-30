define([
  "app/namedFunctions",
  "dojo/_base/declare",
  "dojo/_base/lang",
  "dojo/dom-construct",
  "dojo/dom-class",
  "dojo/dom",
  "dojo/parser",
  "dojo/ready",
  "dojo/on",
  "dojo/mouse",
  "dojo/Deferred",
  "dojo/promise/all",
  "dijit/registry",
  "dijit/_WidgetBase",
  "dijit/_OnDijitClickMixin",
  "dijit/_TemplatedMixin",
  "dijit/layout/ContentPane",
  "dojo/text!./templates/Card_template.html"
], function(
  namedFunctions,
  declare,
  lang,
  domConstruct,
  domClass,
  dom,
  parser,
  ready,
  on,
  mouse,
  Deferred,
  all,
  registry,
  _WidgetBase,
  _OnDijitClickMixin,
  _TemplatedMixin,
  ContentPane,
  template
) {

  return declare([_WidgetBase, _TemplatedMixin], {
    templateString: template,
    id: null,
    options: {
      baseClass: null,
      imgSrc: null,
      href: null,
      header: null,
      contents: null
    },
    constructor: function(options, srcNodeRef) {
      this.inherited(arguments);
      declare.safeMixin(this.options, options);
      this.set("imgSrc", this.options.imgSrc);
      this.set("header", this.options.header);
      this.set("contents", this.options.contents);
      this.set("href", this.options.href);
      this.set("baseClass", this.options.baseClass);
      this.set("srcNodeRef", this.srcNodeRef);
      this.id = this.options.id;
      
    },
    postCreate: function() {
      var self = this;
      lang.mixin(this, new namedFunctions());
      self.on("mouseup", function(evt) {
        evt.preventDefault();
        if (mouse.isLeft(event)) {
          self.unloadSection().then(function(e) {
            self.loadIframe();
            console.log(event);
          });
          
        } else if (mouse.isRight(event)) {
         
          console.log(event);
        }
      });
      self.on(mouse.enter, function(evt) {
        console.log(evt);
        domClass.add(self.domNode, "hover");
      });
      self.on(mouse.leave, function(evt) {
        console.log(evt);
        domClass.remove(self.domNode, "hover");
      });
    }   
  });
});
