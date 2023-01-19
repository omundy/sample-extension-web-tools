/**
 *	Content script
 */

// turn on debugging
let DEBUG = true;


(async () => {

	moodleFixes();

	Mousetrap.bind('ctrl+g', launchGithub);

})();


function setFieldState(type, id, state){
	let field = document.querySelector(id);
	if (!field) return;
	// console.log(field);
	// console.log("field.type =", field.type);
	// console.log("field.checked =", field.checked);
	// console.log("field.value =", field.value);
	if (field && field.type == "checkbox") {
		// console.log("checkbox", field.type, field, field.checked);
		field.checked = state;
	}
	else if (field && field.type == "select-one") {
		// console.log("select", field.type, field, field.value);
		field.value = state;
	}
}


function moodleFixes() {
	// only on moodle...
	if (!window.location.href.includes('moodle')) return;

	// "notify student" checkbox and select
	setFieldState("checkbox",'#id_sendstudentnotifications', false);
	setFieldState("select-one", '#id_sendstudentnotifications', "0");
	// uncheck dates on assignments
	setFieldState("checkbox",'#id_allowsubmissionsfromdate_enabled', false);
	setFieldState("checkbox",'#id_duedate_enabled', false);
	setFieldState("checkbox",'#id_cutoffdate_enabled', false);
	setFieldState("checkbox",'#id_gradingduedate_enabled', false);

	// check "online text" submission
	setFieldState("checkbox",'#id_assignsubmission_onlinetext_enabled', true);

	console.log("👍 Moodle Fixes done");
}



/**
 *	Launch a Github.com or Github.io page
 */
function launchGithub() {
	try {
		console.log("launchGithub()");

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
		console.log("👍 returnCleanGithubIO() loc =", loc);

		// tests
		// loc = "https://github.com/omundy/dig245-critical-web-design/blob/master/demos/javascript/0-hello-console-variables/0-lamp.html";

		if (!loc) return;
		// console.log(loc);

		// clean loc
		var cleanLoc = loc.replace('https://github.com/', '');
		if (!cleanLoc) return;
		if (DEBUG) console.log("👍 returnCleanGithubIO() cleanLoc =", cleanLoc);

		// username
		var username = cleanLoc.split("/")[0];
		if (!username) return;
		if (DEBUG) console.log("👍 returnCleanGithubIO() username =", username);

		// repo name
		var repo = cleanLoc.split("/")[1];
		if (!repo) return;
		if (DEBUG) console.log("👍 returnCleanGithubIO() repo =", repo);

		// filepath
		var filepath = cleanLoc
			.split("/blob/master")
			.join("^")
			.split("/blob/main")
			.join("^")
			.split("^")[1];
		if (!filepath) {
			// if we get this far we know we're on Github.com, but in a repo directory
			filepath = "/index.html";
		}
		if (DEBUG) console.log("👍 returnCleanGithubIO() filepath =", filepath);

		// final url
		var url = "https://" + username + ".github.io/" + repo + filepath;
		if (!url) return;
		if (DEBUG) console.log("👍 returnCleanGithubIO() url =", url);

		return url;

	} catch (err) {
		console.error("👍 returnCleanGithubIO() err =", err);
	}
}

/**
 *	Return a URL converted from github.io > github.com
 */
function returnCleanGithubCOM(loc) {
	try {
		console.log("👍 returnCleanGithubCOM() loc =", loc);

		// tests
		// loc = "https://omundy.github.io/dig245-critical-web-design/";
		// loc = "https://omundy.github.io/dig245-critical-web-design/demos/javascript/0-hello-console-variables/0-lamp.html";

		if (!loc) return;
		// console.log(loc);

		// clean loc
		var cleanLoc = loc.replace('https://', '');
		if (!cleanLoc) return;
		if (DEBUG) console.log("👍 returnCleanGithubCOM() cleanLoc =", cleanLoc);

		// username
		var username = cleanLoc.split(".github.io/")[0];
		if (!username) return;
		if (DEBUG) console.log("👍 returnCleanGithubCOM() username =", username);

		// repo name
		var repo = cleanLoc.split("/")[1];
		if (!repo) return;
		if (DEBUG) console.log("👍 returnCleanGithubCOM() repo =", repo);

		// filepath
		var filepath = cleanLoc.split(repo)[1];
		if (!filepath) return;
		if (DEBUG) console.log("👍 returnCleanGithubCOM() filepath =", filepath);

		// final url
		var url = "https://github.com/" + username + "/" + repo;
		// if not root
		if (filepath != "" && filepath != "/" && filepath != "/index.html")
			url += "/blob/master" + filepath;

		if (!url) return;
		if (DEBUG) console.log("👍 returnCleanGithubCOM() url =", url);

		return url;
	} catch (err) {
		console.error("👍 returnCleanGithubCOM() err =", err);
	}
}




/**
 *	Add a button to test
 */
// (function() {
//
// 	// create button string and append it to page
// 	let btn = "<button class='githubToolsButtonOnPage'>👍</button>";
// 	document.body.insertAdjacentHTML('beforeend', btn);
//
// 	// add button listener
// 	document.querySelector(".githubToolsButtonOnPage").addEventListener('click', () => {
// 		launchGithub();
// 	}, false);
//
// })();
