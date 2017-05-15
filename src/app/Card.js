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
      imgSrc: null,
      path: null,
      header: null,
      content1: null,
      content2: null
    },
    constructor: function(options, srcNodeRef) {
      this.inherited(arguments);

      var imgSrc = options.imgSrc;
      var path = options.path;
      var back_url = options.back_url;
      var pathname = window.location.pathname.split("/")[1];
      var port = window.location.port;
      var origin = window.location.origin;
      var url;
      if (pathname !== "index.html") {
        var new_imgSrc = "static/home/" + imgSrc;
        var new_path = pathname + "/" + path;
        var new_back_url = pathname + "/" + back_url;
        options.imgSrc = new_imgSrc;
        options.path = origin + "/" + new_path + "/";
        options.back_url = new_back_url;
      } else {
        options.imgSrc = imgSrc;
        options.path = origin + "/" + path + "/";
        options.back_url = back_url;
      }
      this.id = this.options.id;
      declare.safeMixin(this.options, options);
    },
    postCreate: function() {
      var self = this;
      lang.mixin(this, new namedFunctions());
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
  });
});
