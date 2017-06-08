define([
  'intern!bdd',
  'intern/chai!expect',
  'dijit/registry',
  "dojo/_base/array",
  'app/PublishingTools',
  'dojo/Deferred',
  'dojo/promise/all'
], function(bdd, expect, registry, Array, PublishingTools, Deferred, all) {

  bdd.describe('the Publishing Tools Widget', function() {

    var publisher;

    var destroy = function (widget) {
        Array.forEach(registry.toArray(), function(e) {
            registry.remove(e.id);
        });
    };

    bdd.beforeEach(function () {
      publisher = new PublishingTools({});
    });

    bdd.afterEach(function () {
      destroy(publisher);
    });

    bdd.it('should be Publishing Tools', function() {
      expect(publisher).to.be.an.instanceof(PublishingTools);
    });
  });
});
