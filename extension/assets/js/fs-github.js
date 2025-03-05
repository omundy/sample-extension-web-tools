"use strict";

/*  Github Tools
 ******************************************************************************/

/**
 *	Return a URL converted from github.com > github.io
 */
function comToIo(url) {
	try {
		console.log("👍 comToIo() url =", url);

		let username = "",
			repo = "",
			filepath = "",
			clean = "";

		// tests
		// url = "https://github.com/omundy/dig245-critical-web-design/blob/master/demos/javascript/0-hello-console-variables/0-lamp.html";

		if (!url) return;
		// console.log(url);

		let newUrl = new URL(url);
		if (DEBUG) console.log("👍 ioToCom() newUrl =", newUrl);

		// SPLIT PATH
		filepath = newUrl.pathname;
		filepath = removeFirstCharIf(filepath, "/");
		if (filepath == "") return;

		// USERNAME
		username = filepath.split("/")[0];
		if (DEBUG) console.log("👍 ioToCom() username =", username);

		// remove username from filepath
		filepath = filepath.replace(username, "");
		filepath = removeFirstCharIf(filepath, "/");
		if (DEBUG) console.log("👍 ioToCom() filepath =", filepath);

		// REPO
		repo = filepath.split("/")[0];
		if (DEBUG) console.log("👍 ioToCom() repo =", repo);

		// remove repo name from filepath
		filepath = filepath.replace(repo, "");
		if (DEBUG) console.log("👍 ioToCom() filepath =", filepath);

		if (filepath != "") {
			// filepath
			filepath = filepath
				.split("/blob/master")
				.join("^")
				.split("/blob/main")
				.join("^")
				.split("^")[1];
			if (!filepath) {
				// if we get this far we know we're on Github.com, but in a repo directory
				// filepath = "/index.html";
			}
			if (DEBUG) console.log("👍 comToIo() filepath =", filepath);
		}

		// create clean url
		clean = "https://" + username + ".github.io/" + repo + filepath;
		if (!clean) return;
		if (DEBUG) console.log("👍 comToIo() clean =", clean);

		return clean;
	} catch (err) {
		console.error("👍 comToIo() err =", err);
	}
}

/**
 *	Return a URL converted from github.io > github.com
 */
function ioToCom(url) {
	try {
		console.log("👍 ioToCom() url =", url);

		let username = "",
			repo = "",
			filepath = "",
			clean = "";

		// tests
		// url = "https://omundy.github.io/dig245-critical-web-design/";
		// url = "https://omundy.github.io/dig245-critical-web-design/demos/javascript/0-hello-console-variables/0-lamp.html";
		// url = "https://criticalwebdesign.github.io/";

		if (!url) return;
		// console.log(url);

		let newUrl = new URL(url);
		if (DEBUG) console.log("👍 ioToCom() newUrl =", newUrl);

		// USERNAME
		username = newUrl.hostname.split(".github.io")[0];
		if (!username) return;
		if (DEBUG) console.log("👍 ioToCom() username =", username);

		// SPLIT PATH
		filepath = newUrl.pathname;
		filepath = removeFirstCharIf(filepath, "/");

		// skip if home page, e.g. https://criticalwebdesign.github.io/
		if (filepath.length > 0) {
			// repo name
			repo = filepath.split("/")[0];
			if (DEBUG) console.log("👍 ioToCom() repo =", repo);

			// filepath
			filepath = filepath.replace(repo, "");
			if (DEBUG) console.log("👍 ioToCom() filepath =", filepath);
		}

		// create clean url
		clean = "https://github.com/" + username;
		if (repo != "") clean += "/" + repo;
		// if not root
		if (filepath != "" && filepath != "/" && filepath != "/index.html")
			clean += "/tree/master" + filepath;
		if (!clean) return;
		if (DEBUG) console.log("👍 ioToCom() clean =", clean);

		return clean;
	} catch (err) {
		console.error("👍 ioToCom() err =", err);
	}
}

function removeFirstCharIf(str, char = "/") {
	if (str.indexOf(char) == 0) str = str.substring(1);
	return str.trim();
}

var FS_Github = (function () {
	// PUBLIC
	return {
		isNumber: (val) => {
			return isNumber(val);
		},
		isEven: (val) => {
			try {
				if (!isNumber(val)) return false;
				let result = false;
				if (val % 2 === 0) {
					result = true;
				}
				return result;
			} catch (err) {
				console.error(err);
			}
		},

		/**
		 *	Launch a Github.com or Github.io page
		 */
		launchGithub: () => {
			try {
				console.log("launchGithub()");

				let url;

				if (Functions.stringInUrl("github.com")) {
					url = comToIo(window.location.href);
				} else if (Functions.stringInUrl("github.io")) {
					url = ioToCom(window.location.href);
				}
				if (!url) return;

				// open if url returned
				let html = window.open(url, "this page on github.io / github.com");
			} catch (err) {
				console.error(err);
			}
		},
	};
})();

// if running in node, then export module
if (typeof process === "object") module.exports = FS_Number;
// otherwise add as "global" object window for browser / extension
else self.FS_Github = FS_Github;
