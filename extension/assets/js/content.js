/**
 *	Content script
 */

// turn on debugging
let DEBUG = false;

function main() {
	// console.log("Running 👍 Web Tools");
	chrome.storage.sync.get("storedOptions", (res) => {
		let storedOptions = res.storedOptions;
		if (DEBUG) console.log(storedOptions);

		if (storedOptions.bindGithubKeys && Functions.stringInUrl("github")) {
			bindGithubHelper();
		}

		if (Functions.bootstrapPage() && storedOptions.showBreakpoints) {
			displayBootstrapBreakpoints();
		}

		if (storedOptions.setMoodleThings && Functions.stringInUrl("moodle")) {
			moodleHelper();
		}

		setBadgeText();
	});
}
if (document.readyState !== "loading") {
	main();
} else {
	document.addEventListener("DOMContentLoaded", main);
}

let callResize;
window.addEventListener("resize", (event) => {
	// clearTimeout(callResize);
	// callResize = setTimeout(setBadgeText, 100);

	setBadgeText();
	// console.log(event);
});

function getBootstrapBreakpoint() {
	let w = window.innerWidth;
	let b = "XS";
	if (w >= 576) b = "SM";
	if (w >= 768) b = "MD";
	if (w >= 992) b = "LG";
	if (w >= 1200) b = "XL";
	if (w >= 1400) b = "XXL";
	return b;
}

function setBadgeText() {
	try {
		chrome.runtime.sendMessage(
			{
				action: "setBadgeText",
				data: getBootstrapBreakpoint(),
			},
			function (response) {
				// console.log(response);
			}
		);
	} catch (err) {
		console.error(err);
	}
}

/**
 *	Add Bootstrap Helper - Mainly breakpoints
 */
function displayBootstrapBreakpoints(breakpoints) {
	console.log("👍 Adding Bootstrap breakpoints");
	// also used here https://codepen.io/owenmundy/pen/oNLZpWM?editors=1100
	let breakpoint = `
    <div class="no-print" style="position: fixed; top: 0; right: 0; font-size: .9rem;">
    <code style="background-color: #eee; display: inline-block; padding: 0px 2px; border-radius: 4px; color: #577590ff;">
        <a href="https://getbootstrap.com/docs/5.3/layout/breakpoints/" target="_blank">Breakpoint</a>:
        <span class="d-none">Always hidden</span>
        <span class="d-sm-none">xs <576px </span>
            <span class="d-none d-sm-inline d-md-none">sm ≥576px</span>
            <span class="d-none d-md-inline d-lg-none">md ≥768px</span>
            <span class="d-none d-lg-inline d-xl-none">lg ≥992px</span>
            <span class="d-none d-xl-inline d-xxl-none">xl ≥1200px</span>
            <span class="d-none d-xxl-inline">xxl ≥1400px</span>
    </code>
    </div>`;
	document.body.insertAdjacentHTML("beforeend", breakpoint);
	console.log("👍 Adding Bootstrap breakpoints ✅");
}

/**
 *	Moodle Helper - Updates annoying Moodle settings
 */
function moodleHelper() {
	console.log("👍 Running Moodle helper");

	if (Functions.moodleGraderPage()) {
		// "notify student" checkbox and select
		Functions.setFormField(
			"checkbox",
			'input[name="sendstudentnotifications"]',
			false
		);
	}
	if (Functions.moodleSettingsPage()) {
		Functions.setFormField(
			"select-one",
			"#id_sendstudentnotifications",
			"0"
		);

		// uncheck dates on assignments
		Functions.setFormField(
			"checkbox",
			"#id_allowsubmissionsfromdate_enabled",
			false
		);
		Functions.setFormField("checkbox", "#id_duedate_enabled", false);
		Functions.setFormField("checkbox", "#id_cutoffdate_enabled", false);
		Functions.setFormField("checkbox", "#id_gradingduedate_enabled", false);

		// check "online text" submission
		Functions.setFormField(
			"checkbox",
			"#id_assignsubmission_onlinetext_enabled",
			true
		);
	}
	console.log("👍 Moodle helper ✅");
}

function bindGithubHelper() {
	Mousetrap.bind("ctrl+g", launchGithub);
}

/**
 *	Launch a Github.com or Github.io page
 */
function launchGithub() {
	try {
		console.log("launchGithub()");

		var url;

		if (Functions.stringInUrl("github.com")) {
			url = returnCleanGithubIO(window.location.href);
		} else if (Functions.stringInUrl("github.io")) {
			url = returnCleanGithubCOM(window.location.href);
		}
		if (!url) return;

		// open if url returned
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
		var cleanLoc = loc.replace("https://github.com/", "");
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
		var cleanLoc = loc.replace("https://", "");
		if (!cleanLoc) return;
		if (DEBUG)
			console.log("👍 returnCleanGithubCOM() cleanLoc =", cleanLoc);

		// username
		var username = cleanLoc.split(".github.io/")[0];
		if (!username) return;
		if (DEBUG)
			console.log("👍 returnCleanGithubCOM() username =", username);

		// repo name
		var repo = cleanLoc.split("/")[1];
		if (!repo) return;
		if (DEBUG) console.log("👍 returnCleanGithubCOM() repo =", repo);

		// filepath
		var filepath = cleanLoc.split(repo)[1];
		if (!filepath) return;
		if (DEBUG)
			console.log("👍 returnCleanGithubCOM() filepath =", filepath);

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
