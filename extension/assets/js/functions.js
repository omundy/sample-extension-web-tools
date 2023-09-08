"use strict";

/*  FUNCTIONS
 ******************************************************************************/

var Functions = (function () {
	let DEBUG = true;

	function stringInUrl(str) {
		let result = window.location.href.includes(str);
		if (DEBUG) console.log(`stringInUrl(${str})`, result);
		return result;
	}
	function bootstrapPage() {
		let result = Functions.elementContains("script", "src", "bootstrap.");
		if (DEBUG) console.log("bootstrapPage()", result);
		return result;
	}

	function moodleSettingsPage() {
		let moodle = stringInUrl("moodle");
		let settings = window.location.href.includes("modedit.php");
		if (DEBUG) console.log("moodleSettingsPage()", settings);
		return moodle && settings;
	}
	function moodleGraderPage() {
		let moodle = stringInUrl("moodle");
		let grader = window.location.href.includes("grader");
		if (DEBUG) console.log("moodleSettingsPage()", grader);
		return moodle && grader;
	}

	function elementContains(ele, attr, str) {
		let elements = document.querySelectorAll(ele);
		// if (DEBUG) console.log("elementContains()", elements);
		for (let i = 0; i < elements.length; i++) {
			let attribute = elements[i][attr];
			// if (DEBUG) console.log("elementContains()", attribute);
			if (typeof attribute !== "undefined") {
				if (attribute.toLowerCase().lastIndexOf(str) !== -1) {
					return true;
					break;
				}
			}
		}
		return false;
	}

	/**
	 * Sets a form field to a specific state
	 */
	function setFormField(type, search, state) {
		let field = document.querySelector(search);
		if (DEBUG) console.log("setFormField()", field, type, search, state);
		if (!field) {
			console.info("⚠️ setFormField() ^ NOT FOUND");
			return;
		}
		// console.log("field.type =", field.type);
		// console.log("field.checked =", field.checked);
		// console.log("field.value =", field.value);
		if (field && field.type == "checkbox") {
			if (DEBUG)
				console.log(
					"setFormField()",
					"checkbox",
					field.type,
					field,
					field.checked
				);
			field.checked = state;
		} else if (field && field.type == "select-one") {
			if (DEBUG)
				console.log(
					"setFormField()",
					"select",
					field.type,
					field,
					field.value
				);
			field.value = state;
		}
	}

	return {
		elementContains: elementContains,
		stringInUrl: stringInUrl,
		bootstrapPage: bootstrapPage,
		moodleSettingsPage: moodleSettingsPage,
		moodleGraderPage: moodleGraderPage,
		setFormField: setFormField,
	};
})();

// if running in node, then export module
if (typeof process === "object") module.exports = Functions;
// otherwise add as "global" object window for browser / extension
else window.FS_Date = Functions;
