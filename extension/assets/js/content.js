/**
 *	Content script
 */

var DEBUG = false;


Mousetrap.bind('ctrl+g', function() {

	var url;

	if (window.location.href.includes('github.com')){
		url = returnCleanGithubIO(window.location.href);
	} else if (window.location.href.includes('github.io')){
		url = returnCleanGithubCOM(window.location.href);
	}

	// open if url returned
	if (!url) return;
	var html = window.open(url, "this page on github.io / github.com");

});

function returnCleanGithubIO(loc){
	// loc = "https://github.com/omundy/dig245-critical-web-design/blob/master/demos/javascript/0-hello-console-variables/0-lamp.html";

	if (!loc) return;
	// console.log(loc);

	// clean loc
	var cleanLoc = loc.replace('https://github.com/', '');
	if (!cleanLoc) return;
	// console.log(cleanLoc);

	// username
	var username = cleanLoc.split("/")[0];
	if (!username) return;

	// repo name
	var repo = cleanLoc.split("/")[1];
	if (!repo) return;

	// path
	var path = cleanLoc.split("/blob/master")[1];
	if (!path) return;

	// final url
	var url = "https://" + username + ".github.io/" + repo + path;
	if (!url) return;
	if (DEBUG) console.log(url);

	return url;
}

function returnCleanGithubCOM(loc){

	// loc = "https://omundy.github.io/dig245-critical-web-design/demos/javascript/0-hello-console-variables/0-lamp.html";

	if (!loc) return;
	if (DEBUG) console.log(loc);

	// clean loc
	var cleanLoc = loc.replace('https://', '');
	if (!cleanLoc) return;
	if (DEBUG) console.log(cleanLoc);

	// username
	var username = cleanLoc.split(".github.io/")[0];
	if (!username) return;
	if (DEBUG) console.log(username);

	// repo name
	var repo = cleanLoc.split("/")[1];
	if (!repo) return;
	if (DEBUG) console.log(repo);

	// path
	var path = cleanLoc.split(repo)[1];
	if (!path) return;
	if (DEBUG) console.log(path);

	// final url
	var url = "https://github.com/" + username + "/" + repo + "/blob/master" + path;
	if (!url) return;
	if (DEBUG) console.log(url);

	return url;
}
