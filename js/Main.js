/*
 * This is the start of the Extension
 * 
 */

// 滑鼠點擊擴充插件按鈕的事件
chrome.browserAction.onClicked.addListener(function(tab){
    // 傳送訊息至目前瀏覽器的分頁(tab), sendMessage(integer tabId, any message(Json格式), object options, function responseCallback)
    chrome.tabs.sendMessage(tab.id, {mode: "theater"}, function(response) {
        // alert("Done！");
   });
});

// Check whether new version is installed
chrome.runtime.onInstalled.addListener(function(details){
    if(details.reason == "install") {
        // chrome.tabs.create({url: "../option/index.html"});
        alert(getMessage("first_install"));
    }
    else if(details.reason == "update"){
        // var thisVersion = chrome.runtime.getManifest().version;
        // alert("Updated from " + details.previousVersion + " to " + thisVersion + "!");
        chrome.tabs.create({url: "../option/index.html"});
    }
});