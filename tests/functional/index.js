// in tests/functional/index.js
define([
  'intern!object',
  'intern/chai!assert',
  '../support/pages/IndexPage'
], function (registerSuite, assert, IndexPage) {
  registerSuite(function () {
    var indexPage;
    return {
      // on setup, we create an IndexPage instance
      // that we will use for all the tests
      setup: function () {
        indexPage = new IndexPage(this.remote);
      },

      'GIS_Mainpage': function() {
        return indexPage
          .page_title('GIS Mainpage')
          .then(function (page_title) {
            assert.isTrue(page_title,
              'Page Banner heading should correspond with the link text');
          });
      }
    }
  });
});
