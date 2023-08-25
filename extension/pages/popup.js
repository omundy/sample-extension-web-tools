// close the popup window
document.getElementById("closeBtn").onclick = function () {
	window.close();
};

// open options window
document.querySelector("#optionsBtn").addEventListener("click", function () {
	if (chrome.runtime.openOptionsPage) {
		chrome.runtime.openOptionsPage();
	} else {
		window.open(chrome.runtime.getURL("pages/options.html"));
	}
});


/**
 * Generate random password
 * https://stackoverflow.com/a/51540480/441878
 */
var generatePassword = (
	length = 20,
	wishlist = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz~!@-#$"
) =>
	Array.from(crypto.getRandomValues(new Uint32Array(length)))
		.map((x) => wishlist[x % wishlist.length])
		.join("");

let passwordField = document.querySelector("#pass");
passwordField.value = generatePassword();

/**
 * Copy to clipboard
 */
let info = document.querySelector("#info");
passwordField.addEventListener("click", async function (event) {
	try {
		await navigator.clipboard.writeText(this.value);
		info.innerHTML = "password copied";
	} catch (err) {
		info.innerHTML = "password failed to copy! " + err;
	}
});
