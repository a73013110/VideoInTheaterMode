/*
 * This is the start of the Extension
 * 
 */

// 滑鼠點擊擴充插件按鈕的事件
chrome.browserAction.onClicked.addListener(function(tab) {
    // 傳送訊息至目前瀏覽器的分頁(tab), sendMessage(integer tabId, any message(Json格式), object options, function responseCallback)
    chrome.tabs.sendMessage(tab.id, {mode: "theater"}, function(response) {
        // console.log("Success to send the message of turning on the theater mode!");
    });
});

// Check whether new version is installed
chrome.runtime.onInstalled.addListener(function(details) {
    if(details.reason == "install") {
        // chrome.tabs.create({url: "../option/index.html"});
        chrome.tabs.create({url: "../option/index.html"});
        alert(getMessage("first_install"));
    }
    else if(details.reason == "update"){
        chrome.tabs.create({url: "../option/log.html"});
        // var thisVersion = chrome.runtime.getManifest().version;
        // alert("Updated from " + details.previousVersion + " to " + thisVersion + "!");
        // chrome.tabs.create({url: "../option/index.html"});
    }
});

// Set icon.
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {  
    if (request.theater_mode) chrome.browserAction.setIcon({path: "../images/icon_on.png", tabId: sender.tab.id});
    else chrome.browserAction.setIcon({path: "../images/icon_off.png", tabId: sender.tab.id});
});
