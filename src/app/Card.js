define([
  "dojo/_base/declare",
  "dojo/_base/lang",
  "dojo/_base/array",
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
  declare,
  lang,
  Array,
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
    baseClass: "_Card",
    options: {
      imgSrc: null,
      path: null,
      header: null,
      content1: null,
      content2: null,
      isActive: null,
      isAdmin: null
    },
    constructor: function(options, srcNodeRef) {
      this.inherited(arguments);

      var imgSrc = options.imgSrc;
      var path = options.path;
      var port = window.location.port;
      var pathname = window.location.pathname.split("/")[1];
      var origin = window.location.origin;
      var url;
      if (Array.indexOf([8000, 8080, 3000], port) === -1) {
        var new_imgSrc = "static/home/" + imgSrc;
        var new_path = pathname + "/" + path;
        options.imgSrc = new_imgSrc;
        options.path = origin + "/" + new_path + "/";
      } 
      
      this.id = this.options.id;
      declare.safeMixin(this.options, options);
    },
    postCreate: function() {
      var self = this;
      if (self.isActive) {
        self.on("mouseup", function(evt) {
          evt.preventDefault();
          if (mouse.isLeft(event)) {
            var pathname = window.location.pathname.split("/")[1];
            var port = window.location.port;
            var origin = window.location.origin;
            var url;
            if (pathname === "index.html" || port === "8080") {
              url = "http://127.0.0.1:8080/" + self.path;
            } else {
              url = self.path;
            }
            window.open(url, '_self', "", false);
            
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
    }   
  });
});
