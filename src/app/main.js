define([
	'dojo/dom',
	'dojo/router',
	"dojo/request",
	'dojo/query',
	'dojo/dom-class',
	'dojo/domReady!'
	], function(
	dom,
	router,
	request,
	query,
	domClass
	) {

	var app = {};

	//identify sections of the index.html that will hold the html pages
	var sub_header = dom.byId('sub-nav-header');
	var main_content = dom.byId('main_content');


	router.register("/#gisportal/", function(evt) {
		evt.preventDefault();
		request.get('app/html/gis_portal_header.html', {
			handleAs: "html"
		}).then(function(response) {
			sub_header.innerHTML = response;
		});

		request.get('app/html/gis_portal_page.html', {
			handleAs: 'html'
		}).then(function(response) {
			main_content.innerHTML = response;
		});
	});

	router.startup();


	query('.loader').forEach(function(e) {
		domClass.toggle(e, 'is-active');
	});
	
	router.go("/#gisportal/");
	return app;
});