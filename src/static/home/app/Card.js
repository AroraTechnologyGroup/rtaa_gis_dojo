define([
  "dojo/_base/declare",
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
      this.set("srcNodeRef", this.srcNodeRef);
      this.set("href", this.options.href);
      this.set("baseClass", this.options.baseClass);
    },
    postCreate: function() {
      var self = this;
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
    },

    unloadContent: function() {
      var deferred = new Deferred();
      (function() {
        if (registry.byId('main-content') !== undefined) {
          domConstruct.empty(registry.byId('main-content').containerNode);
          registry.remove('main-content');
          deferred.resolve(true);
        } else {
          deferred.resolve(false);
        }
      })();
      return deferred.promise;
    },

    unloadBanner: function() {
      var deferred = new Deferred();
      (function() {
        if (registry.byId('headerPane') !== undefined) {
          var obj = registry.byId('headerPane');
          domClass.add(obj.domNode, "animate-out-down");
          domConstruct.empty(registry.byId('headerPane').containerNode);
          registry.remove('headerPane');
          deferred.resolve(true);
        } else {
          deferred.resolve(false);
        }
      })();
      return deferred.promise;
    },

    unloadSection: function() {
      var self = this;
      var deferred = new Deferred();
      all([self.unloadBanner(), self.unloadContent()]).then(function(arr) {
        deferred.resolve("page cleaned, ready for new page load");
      });
      return deferred.promise;
    },

    loadIframe: function() {
      var self = this;
      var pane = registry.byId("iframe_pane");
      if (pane !== undefined) {
        pane.destroy();
        registry.remove(pane);
      }

      pane = new ContentPane({
        id: "iframe_pane",
        style: {
          position: "relative",
          width: "100vw",
          height: "100vh",
          overflow: "hidden"
        }
      });
      pane.startup();
      pane.set('content', domConstruct.create("iframe",  {
        src: self.href,
        frameborder: 0,
        height: '100%',
        width: '100%'
      }));
      pane.placeAt('main-content');
    }
  });
});
