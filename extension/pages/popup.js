// close the popup window
document.getElementById("closeBtn").onclick = function () {
	window.close();
};

document.querySelector("#optionsBtn").addEventListener("click", function () {
	if (chrome.runtime.openOptionsPage) {
		chrome.runtime.openOptionsPage();
	} else {
		window.open(chrome.runtime.getURL("pages/options.html"));
	}
});
