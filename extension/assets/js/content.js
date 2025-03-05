/**
 *	Content script
 */

// turn on debugging
let DEBUG = true;

function main() {
	// console.log("Running 👍 Web Tools");
	chrome.storage.sync.get("storedOptions", (res) => {
		let storedOptions = res.storedOptions;
		if (DEBUG) console.log(storedOptions);

		if (storedOptions.bindGithubKeys && Functions.stringInUrl("github")) {
			// bind github helper
			Mousetrap.bind("ctrl+g", FS_Github.launchGithub);
		}

		if (Functions.bootstrapPage() && storedOptions.showBreakpoints) {
			displayBootstrapBreakpoints();
		}

		if (storedOptions.setMoodleThings && Functions.stringInUrl("moodle")) {
			moodleHelper();
			moodleStartStayLoggedInPingInterval();
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
		Functions.setFormField("select-one", "#id_sendstudentnotifications", "0");

		// uncheck dates on assignments
		Functions.setFormField("checkbox", "#id_allowsubmissionsfromdate_enabled", false);
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
	// console.log("👍 Moodle helper ✅");
}

// ping the Moodle server to keep the session alive (on the server).
let courseUrl = "https://moodle.davidson.edu/course/view.php?id=18258"; // DIG211 2025
function moodleStartStayLoggedInPingInterval() {
	setInterval(async function () {
		await fetch(courseUrl)
			.then((res) => {
				console.log("👍", "PING", res.status, new Date().toLocaleString(), res.headers)
			})
			.catch((err) => console.error("👍", err));
	}, 10 * 60 * 1000); // 10 min
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
