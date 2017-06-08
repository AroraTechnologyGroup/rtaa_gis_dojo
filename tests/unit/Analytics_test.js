define([
  'intern!bdd',
  'intern/chai!expect',
  'dijit/registry',
  "dojo/_base/array",
  'app/Analytics'
], function(bdd, expect, registry, Array, Analytics) {

  bdd.describe('the Analytics Widget', function() {

    var analytics;

    var destroy = function (widget) {
        Array.forEach(registry.toArray(), function(e) {
            registry.remove(e.id);
        });
    };

    bdd.beforeEach(function () {
      analytics = new Analytics({});
    });

    bdd.afterEach(function () {
      destroy(analytics);
    });

    bdd.it('should be an Analytics widget', function() {
      expect(analytics).to.be.an.instanceof(Analytics);
    });
  });
});
