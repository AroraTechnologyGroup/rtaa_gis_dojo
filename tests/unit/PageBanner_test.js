define([
  'intern!bdd',
  'intern/chai!expect',
  'dijit/registry',
  'app/PageBanner'
], function(bdd, expect, registry, PageBanner) {

  bdd.describe('widgets that make up the app', function() {
    var destroy = function (widget) {
        registry.forEach(function(e) {
            registry.remove(e.id);
        });
    };

    var page_banner;

    bdd.describe('the PageBanner Widget', function() {

      bdd.beforeEach(function () {
        card = new PageBanner();
      });

      bdd.afterEach(function () {
        destroy(page_banner);
      });

      bdd.it('should be a PageBanner', function() {
        expect(page_banner).to.be.an.instanceof(PageBanner);
      });
    });
  });
});
