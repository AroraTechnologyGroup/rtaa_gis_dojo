define([
  'intern!bdd',
  'intern/chai!expect',
  'dijit/registry',
  "dojo/_base/array",
  'app/IFrameLoader'
], function(bdd, expect, registry, Array, IFrameLoader) {

  bdd.describe('the IFrameLoader Widget', function() {

    var iframe_loader;

    var destroy = function (widget) {
        Array.forEach(registry.toArray(), function(e) {
            registry.remove(e.id);
        });
    };

    bdd.beforeEach(function () {
      iframe_loader = new IFrameLoader({
        id: null,
        url: null
      });
    });

    bdd.afterEach(function () {
      destroy(iframe_loader);
    });

    bdd.it('should be and IFrameLoader', function() {
      expect(iframe_loader).to.be.an.instanceof(IFrameLoader);
    });
  });
});
