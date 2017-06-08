define([
  'intern!bdd',
  'intern/chai!expect',
  'dijit/registry',
  "dojo/_base/array",
  'app/Viewer3d'
], function(bdd, expect, registry, Array, Viewer3d) {

  bdd.describe('the Viewer3d Widget', function() {

    var viewer3d;

    var destroy = function (widget) {
        Array.forEach(registry.toArray(), function(e) {
            registry.remove(e.id);
        });
    };

    bdd.beforeEach(function () {
      viewer3d = new Viewer3d({});
    });

    bdd.afterEach(function () {
      destroy(viewer3d);
    });

    bdd.it('should be Viewer3d', function() {
      expect(viewer3d).to.be.an.instanceof(Viewer3d);
    });
  });
});
