console.log("👍 Hello from the background script!");

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	try {
		if (request.action == "setBadgeText") {
			setBadgeText(request.data);
			sendResponse({
				action: request.action,
				message: 1,
			});
		}
	} catch (err) {
		console.log(err);
	}
});

function setBadgeText(_text) {
	try {
		if (!_text || _text == "") return;
		// show tracker numbers in badge
		chrome.action.setBadgeBackgroundColor({
			color: [12, 109, 189, 255],
		});
		chrome.action.setBadgeText({
			text: "" + _text,
		});
	} catch (err) {
		console.error(err);
	}
}
