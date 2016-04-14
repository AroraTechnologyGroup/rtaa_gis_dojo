define([
	'dijit/registry',
	'dojo/dom',
	'dojo/html',
	'dojo/router',
	"dojo/request",
	'dojo/query',
	'dojo/dom-class',
	'dojo/dom-attr',
	'dojo/_base/array',
	'dojo/promise/all',
	'dojo/Deferred',
	'dojo/hash',
	'dojo/topic',
	'dojo/on',
	'dojo/domReady!'
	], function(
	registry,
	dom,
	html,
	router,
	request,
	query,
	domClass,
	domAttr,
	Array,
	all,
	Deferred,
	hash,
	topic,
	on
	) {

	
	var app = {};
	//identify sections of the index.html that will hold the html pages
	var sub_header = dom.byId('sub-nav-header');
	var main_content = dom.byId('main_content');
	
	var loadContent = function (templateUrl, domId) {
		var deferred = new Deferred();
		request.get(templateUrl, {
						handleAs: "html"
					}).then(function(response) {
						dom.byId(domId).innerHTML = response;
						deferred.resolve(response);
					}, function(err) {
						console.log(err);
						deferred.resolve(err);
					});
		return deferred.promise;
	};

	router.register("home", function(evt) {
		evt.preventDefault();
		console.log("loading "+evt.newPath);
		loadContent("app/html/homepage_header.html", "sub-nav-header");
		loadContent("app/html/homepage_home.html", "main-content");
	});


	router.register("gisportal/home", function(evt) {
					evt.preventDefault();
					console.log("loading "+evt.newPath);

					loadContent("app/html/gis_portal_header.html", "sub-nav-header");
					loadContent("app/html/gis_portal_home.html", "main-content");
	});

	router.register("gisportal/mapviewer", function(evt) {
					evt.preventDefault();
					console.log("loading "+evt.newPath);

					loadContent("app/html/gis_portal_header.html","sub-nav-header").then(function(e) {
						var title = query(".sub-nav-title")[0];
						html.set(title, "Online Map Viewer");	
					});
					loadContent("app/html/gis_portal_viewer.html", "main-content");					
	});

	router.register("gisportal/apps", function(evt) {
					evt.preventDefault();
					console.log("loading "+evt.newPath);

					loadContent("app/html/gis_portal_header.html","sub-nav-header").then(function(e) {
						var title = query(".sub-nav-title")[0];
						html.set(title, "Web Applications");	
					});

					loadContent("app/html/gis_portal_apps.html", "main-content");
					
	});

	router.register("gisportal/browse", function(evt) {
					evt.preventDefault();
					console.log("loading "+evt.newPath);

					loadContent("app/html/gis_portal_header.html", "sub-nav-header").then(function(e) {
						var title = query(".sub-nav-title")[0];
						html.set(title, "Data Availability");	
					});
					loadContent("app/html/gis_portal_browse.html", "main-content");
	});

	router.register("departments/engineering", function(evt) {
					evt.preventDefault();
					console.log("loading "+evt.newPath);

					loadContent("app/html/departments_header.html", "sub-nav-header").then(function(e) {
						var title = query(".sub-nav-title")[0];
						html.set(title, "Engineering");	
					});
					loadContent("app/html/departments_home.html", "main-content");
	});

	router.register("departments/construction", function(evt) {
					evt.preventDefault();
					console.log("loading "+evt.newPath);

					loadContent("app/html/departments_header.html", "sub-nav-header").then(function(e) {
						var title = query(".sub-nav-title")[0];
						html.set(title, "Construction / Maintenance");	
					});
					loadContent("app/html/departments_home.html", "main-content");
	});

	router.register("departments/planning", function(evt) {
					evt.preventDefault();
					console.log("loading "+evt.newPath);

					loadContent("app/html/departments_header.html", "sub-nav-header").then(function(e) {
						var title = query(".sub-nav-title")[0];
						html.set(title, "Airport Planning");	
					});
					loadContent("app/html/departments_home.html", "main-content");
	});

	router.register("departments/utilities", function(evt) {
					evt.preventDefault();
					console.log("loading "+evt.newPath);

					loadContent("app/html/departments_header.html", "sub-nav-header").then(function(e) {
						var title = query(".sub-nav-title")[0];
						html.set(title, "Utilities");	
					});
					loadContent("app/html/departments_home.html", "main-content");
	});

	router.register("departments/home", function(evt) {
					evt.preventDefault();
					console.log("loading "+evt.newPath);

					loadContent("app/html/departments_header.html", "sub-nav-header").then(function(e) {
						var title = query(".sub-nav-title")[0];
						html.set(title, "Departments Directory");	
					});
					loadContent("app/html/departments_home.html", "main-content");
	});

	router.register("webresources/home", function(evt) {
					evt.preventDefault();
					console.log("loading "+evt.newPath);

					loadContent("app/html/web_resources_header.html", "sub-nav-header").then(function(e) {
						var title = query(".sub-nav-title")[0];
						html.set(title, "Online Resources");	
					});
					loadContent("app/html/web_resources_home.html", "main-content");
	});

	router.register("help/home", function(evt) {
					evt.preventDefault();
					console.log("loading "+evt.newPath);

					loadContent("app/html/help_header.html", "sub-nav-header").then(function(e) {
						var title = query(".sub-nav-title")[0];
						html.set(title, "Help and Tutorials");	
					});
					loadContent("app/html/help_home.html", "main-content");
	});

	router.startup();
		
	query('.loader').forEach(function(e) {
		domClass.toggle(e, 'is-active');
	});

	hash("home");
	

	return app;
});