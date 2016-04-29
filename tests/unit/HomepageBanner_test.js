define([
  'intern!bdd',
  'intern/chai!expect',
  'dijit/registry',
  'app/HomepageBanner'
], function(bdd, expect, registry, HomepageBanner) {

  bdd.describe('widgets that make up the app', function() {
    var destroy = function (widget) {
        registry.forEach(function(e) {
            registry.remove(e.id);
        });
    };

    var homepage_banner;

    bdd.describe('the HomepageBanner Widget', function() {

      bdd.beforeEach(function () {
        card = new HomepageBanner();
      });

      bdd.afterEach(function () {
        destroy(homepage_banner);
      });

      bdd.it('should be a card', function() {
        expect(homepage_banner).to.be.an.instanceof(HomepageBanner);
      });
    });
  });
});
