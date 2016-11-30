define([
  'intern!bdd',
  'intern/chai!expect',
  'dijit/registry',
  'app/namedFunctions',
  'dojo/_base/Array',
  'dojo/Deferred',
  'dojo/promise/all'
], function(
  bdd,
  expect,
  registry,
  namedFunctions,
  Array,
  Deferred,
  all
) {

  bdd.describe('the namedFunctions widget', function() {
    
    var destroy = function (widget) {
        Array.forEach(registry.toArray(), function(e) {
            registry.remove(e.id);
        });
    };

    var widget;
    bdd.before(function() {
    });

    bdd.after(function() {
    });

    bdd.beforeEach(function () {
      widget = new namedFunctions();
    });

    bdd.afterEach(function () {
      destroy(widget);
    });

    bdd.it('should be a namedFunctions', function() {
      expect(widget).to.be.an.instanceof(namedFunctions);
    });
  });
});
