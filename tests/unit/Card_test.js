define([
  'intern!bdd',
  'intern/chai!expect',
  'dijit/registry',
  'app/Card',
  'dojo/_base/array',
  'dojo/Deferred',
  'dojo/promise/all'
], function(
  bdd,
  expect,
  registry,
  Card,
  Array,
  Deferred,
  all
) {

  bdd.describe('the Card Widget', function() {

    var destroy = function (widget) {
        Array.forEach(registry.toArray(), function(e) {
            registry.remove(e.id);
        });
    };

    var card;

    bdd.before(function() {
    });

    bdd.after(function() {
    });

    bdd.beforeEach(function () {
      var options = {
        id: "AirspaceAppCard",
        imgSrc: 'static/home/app/img/thumbnails/airspace_app.png',
        path: 'https://aroragis.maps.arcgis.com/apps/3DScene/index.html?appid=5f7bf59e212c4339a3ffda29315972be',
        header: 'Airspace',
        baseClass: 'card column-8 leader-2 trailer-2',
        content1: 'View and Analyze the data in the airspace of the RTAA Airport',
        content2: 'This is only a test'
      };
      card = new Card(options, "");
    });

    bdd.afterEach(function () {
      destroy(card);
    });

    bdd.it('should be a card', function() {
      expect(card).to.be.an.instanceof(Card);
    });
  });
});
