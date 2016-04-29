define([
  "dojo/_base_array"
], function (Array, require) {
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
          .findAllByClassName('top-nav-link')
          .then(function(arr) {
            var text_links = {
              "RTAA GIS": "RTAA GIS",
              "RTAA GIS": "RTAA GIS",
               "Departments": "Departments",
               "Web Resources": "Web Resources",
               "Help": "HELP"
            };


          })
            });
      }
        });
    },

    // …additional page interaction tasks…
  };

  return IndexPage;
});
