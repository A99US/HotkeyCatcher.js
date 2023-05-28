// ==UserScript==
// @name        Custom Hotkeys & Sequences
// @namespace   https://github.com/A99US/HotkeyCatcher.js
// @version     1.0.0
// @description Add Custom Hotkeys & Sequences Into websites
// @match       https://twitter.com/*
// @require     https://code.jquery.com/jquery-3.4.1.min.js
// @require     https://cdn.jsdelivr.net/gh/A99US/HotkeyCatcher.js/hotkeycatcher.min.js
// @run-at      document-start
// @grant       GM_addStyle
// @grant       GM_download
// ==/UserScript==
/*- The @grant directive is needed to work around a design change
    introduced in GM 1.0.   It restores the sandbox.
*/
//-- If/when SSL becomes available, switch to only using the https pages.

window.hotkeycatcher.bind( (e,key,array) => {
let urlParse = new URL(document.location.toString());
let website = urlParse.host;
if( website == "twitter.com" ){
	if(["ctrl m","ctrl l","ctrl p"].includes(key)){
	  // CTRL M : Media Tab, when opening someone's profile
		if(key == "ctrl m")
		  $("div[role='tablist']").children("div").eq(2).children("a")[0].click();
		// CTRL L : Likes Tab, when opening someone's profile
		else if(key == "ctrl l")
		  $("div[role='tablist']").children("div").eq(3).children("a")[0].click();
		e.preventDefault();
	}
}
});

