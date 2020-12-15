/**
 *	Content script
 */

// turn on debugging 
let DEBUG = false;

Mousetrap.bind('ctrl+g', launchGithub);

/**
 *	Launch a Github.com or Github.io page
 */
function launchGithub() {
	try {
		// console.log("launchGithub()");

		var url;

		if (window.location.href.includes('github.com')) {
			url = returnCleanGithubIO(window.location.href);
		} else if (window.location.href.includes('github.io')) {
			url = returnCleanGithubCOM(window.location.href);
		}

		// open if url returned
		if (!url) return;
		var html = window.open(url, "this page on github.io / github.com");

	} catch (err) {
		console.error(err);
	}
}

/**
 *	Return a URL converted from github.com > github.io
 */
function returnCleanGithubIO(loc) {
	try {
		console.log("🤣 returnCleanGithubIO() loc =", loc);

		// test
		// loc = "https://github.com/omundy/dig245-critical-web-design/blob/master/demos/javascript/0-hello-console-variables/0-lamp.html";

		if (!loc) return;
		// console.log(loc);

		// clean loc
		var cleanLoc = loc.replace('https://github.com/', '');
		if (!cleanLoc) return;
		if (DEBUG) console.log("🤣 returnCleanGithubIO() cleanLoc =", cleanLoc);

		// username
		var username = cleanLoc.split("/")[0];
		if (!username) return;
		if (DEBUG) console.log("🤣 returnCleanGithubIO() username =", username);

		// repo name
		var repo = cleanLoc.split("/")[1];
		if (!repo) return;
		if (DEBUG) console.log("🤣 returnCleanGithubIO() repo =", repo);

		// filepath
		var filepath = cleanLoc.split("/blob/master")[1];
		if (!filepath) {
			// if we get this far we know we're on Github.com, but in a repo directory
			filepath = "/index.html";
		}
		if (DEBUG) console.log("🤣 returnCleanGithubIO() filepath =", filepath);

		// final url
		var url = "https://" + username + ".github.io/" + repo + filepath;
		if (!url) return;
		if (DEBUG) console.log("🤣 returnCleanGithubIO() url =", url);

		return url;

	} catch (err) {
		console.error("🤣 returnCleanGithubIO() err =", err);
	}
}

/**
 *	Return a URL converted from github.io > github.com
 */
function returnCleanGithubCOM(loc) {
	try {
		console.log("😛 returnCleanGithubCOM() loc =", loc);

		// test
		// loc = "https://omundy.github.io/dig245-critical-web-design/demos/javascript/0-hello-console-variables/0-lamp.html";

		if (!loc) return;
		// console.log(loc);

		// clean loc
		var cleanLoc = loc.replace('https://', '');
		if (!cleanLoc) return;
		if (DEBUG) console.log("😛 returnCleanGithubCOM() cleanLoc =", cleanLoc);

		// username
		var username = cleanLoc.split(".github.io/")[0];
		if (!username) return;
		if (DEBUG) console.log("😛 returnCleanGithubCOM() username =", username);

		// repo name
		var repo = cleanLoc.split("/")[1];
		if (!repo) return;
		if (DEBUG) console.log("😛 returnCleanGithubCOM() repo =", repo);

		// filepath
		var filepath = cleanLoc.split(repo)[1];
		if (!filepath) return;
		if (DEBUG) console.log("😛 returnCleanGithubCOM() filepath =", filepath);

		// final url
		var url = "https://github.com/" + username + "/" + repo;
		// if not root
		if (filepath != "/" || filepath != "/index.html")
			url += "/blob/master" + filepath;

		if (!url) return;
		if (DEBUG) console.log("😛 returnCleanGithubCOM() url =", url);

		return url;
	} catch (err) {
		console.error("😛 returnCleanGithubCOM() err =", err);
	}
}
