// ==UserScript==
// @name        Custom Hotkeys & Sequences
// @description Add Custom Hotkeys & Sequences Into websites
// @namespace   https://github.com/A99US
// @version     20230625
// @downloadURL https://cdn.jsdelivr.net/gh/A99US/HotkeyCatcher.js@latest/hotkeycatcher-userscript.js
// @updateURL   https://cdn.jsdelivr.net/gh/A99US/HotkeyCatcher.js@latest/hotkeycatcher-userscript.js
// @author      A99US (Agus Setiawan)
// @copyright   MIT
// @match       https://twitter.com/*
// @match       https://pbs.twimg.com/*
// @match       https://www.w3schools.com/*
// @require     https://code.jquery.com/jquery-3.4.1.min.js
// @require     https://cdn.jsdelivr.net/gh/A99US/HotkeyCatcher.js/hotkeycatcher.min.js
// @run-at      document-end
// ==/UserScript==

/*
chrome-extension://dhdgffkkebhmkfjojejmpbldmpobfkfo/options.html#nav=36b02080-a57f-4f52-8058-41f8e79d1af9+editor
*/

window.hotkeycatcher.bind( (e,key,result) => {
	let docUrl = document.location.toString();
	let urlParse = new URL(docUrl);
	let website = urlParse.hostname;
	if( website == "twitter.com" && ["ctrl m","ctrl l","ctrl p"].includes(key) ){
		e.preventDefault();
		// CTRL M : Media Tab, when opening someone's profile
		if(key == "ctrl m")
			$("div[role='tablist']").children("div").eq(2).children("a")[0].click();
		// CTRL L : Likes Tab, when opening someone's profile
		else if(key == "ctrl l")
			$("div[role='tablist']").children("div").eq(3).children("a")[0].click();
	}
	else if( website == "pbs.twimg.com" && ["z","x","c","v","b","n","m"].includes(key) ){
		e.preventDefault();
		let arr = {z:"orig",x:"large",c:"medium",v:"900x900",b:"small",n:"360x360",m:"240x240"},
		name = urlParse.searchParams.get('name');
		if(name != arr[result['key'][0]]){
			docUrl = docUrl.replace(name,arr[result['key'][0]]);
			document.location = docUrl;
		}
	}
	else if( website == "www.w3schools.com" && ["ctrl r","ctrl s"].includes(key) ){
		e.preventDefault();
		let runbtn = $("#runbtn");
		if(key == "ctrl r") runbtn.click();
	}
});
