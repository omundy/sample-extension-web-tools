// Saves options to chrome.storage
const saveOptions = (options) => {
	console.log("saveOptions() [1]", options);

	let saveObj = {};

	if (options) saveObj = { storedOptions: options };
	else
		saveObj = {
			storedOptions: {
				bindGithubKeys:
					document.getElementById("bindGithubKeys").checked,
				showBreakpoints:
					document.getElementById("showBreakpoints").checked,
				setMoodleThings:
					document.getElementById("setMoodleThings").checked,
			},
		};

	// always remember to send an key:object inside an object!
	chrome.storage.sync.set(saveObj, () => {
		console.log("saveOptions() [2]", saveObj);
		// Update status to let user know options were saved.
		const status = document.getElementById("status");
		status.textContent = "Options saved.";
		setTimeout(() => {
			status.textContent = "";
		}, 750);
	});
};

const defaults = {
	bindGithubKeys: true,
	showBreakpoints: true,
	setMoodleThings: false,
};

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
const restoreOptions = () => {
	chrome.storage.sync.get("storedOptions", (res) => {
		// removeOptions(); // test
		console.log("restoreOptions() [1]", res);

		if (!res || !res.storedOptions || !res.storedOptions.bindGithubKeys) {
			console.log(
				"restoreOptions() [2] not found, using & saving defaults"
			);
			res.storedOptions = defaults;
			saveOptions(defaults);
		}

		// console.log("restoreOptions()", res);
		document.querySelector("#test").innerText = JSON.stringify(res);

		document.querySelector("#bindGithubKeys").checked =
			res.storedOptions.bindGithubKeys;
		document.querySelector("#showBreakpoints").checked =
			res.storedOptions.showBreakpoints;
		document.querySelector("#setMoodleThings").checked =
			res.storedOptions.setMoodleThings;
	});
};

const removeOptions = () => {
	chrome.storage.sync.remove("storedOptions", (res) => {
		console.log("removeOptions()", res);
	});
};

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", function (event) {
	event.preventDefault();
	saveOptions();
});
