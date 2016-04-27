define(function (require) {
  // the page object is created as a constructor
  // so we can provide the remote Command object
  // at runtime
  function IndexPage(remote) {
    this.remote = remote;
  }

  IndexPage.prototype = {
    constructor: IndexPage,
    page_title: function(page_title) {
      return this.remote
          .get(require.toUrl('index.html'))
          .setFindTimeout(5000)
          .findByCssSelector('top-nav-link')
            .click()
          .findById('headerPane')
          .findByTagName('h1')
            .getVisibleText()
            .then(function (text) {
              assert.strictEqual(text, page_title,
                'Page Title should be updated when the link is clicked');
            });
      }
        });
    },

    // …additional page interaction tasks…
  };

  return IndexPage;
});
