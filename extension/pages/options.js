// Saves options to chrome.storage
const saveOptions = () => {
	const showBreakpoints = document.getElementById("showBreakpoints").checked;

	chrome.storage.sync.set({ showBreakpoints: showBreakpoints }, () => {
		// Update status to let user know options were saved.
		const status = document.getElementById("status");
		status.textContent = "Options saved.";
		setTimeout(() => {
			status.textContent = "";
		}, 750);
	});
};

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
const restoreOptions = () => {
	chrome.storage.sync.get("showBreakpoints", (res) => {
		document.querySelector("#test").innerText = JSON.stringify(res);
		if (!res.showBreakpoints)
			document.querySelector("#showBreakpoints").checked = false;
		else
			document.querySelector("#showBreakpoints").checked =
				res.showBreakpoints;
	});
};

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
