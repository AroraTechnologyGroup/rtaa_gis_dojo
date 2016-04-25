define([
  'intern!bdd',
  'intern/chai!expect',
  'app/main',
  'dijit/registry',
  'dojo/domReady!'
], function(bdd, expect, app, registry) {

  bdd.describe('routes for the rtaa website', function() {
    var app;
    var destroy = function () {
        registry.forEach(function(e) {
            registry.remove(e.id);
        });
    };

    bdd.before(function () {
      app = new app();
    });

    bdd.after(function () {
      destroy();
    });

    bdd.beforeEach(function () {
      app = new app();
    });

    bdd.afterEach(function () {
      destroy();
    });

  });
});
