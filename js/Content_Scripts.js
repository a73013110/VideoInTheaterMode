/*
 * This JavaScript is embeded in the web what you surf
 * Use to listen the event of this Chrome extension's Button Click
 */

var video_objects = [];	// Store all "Video".
var ori_video_style = Object.assign({}, VIDEO_STYLE);	// Store the only "Video" style which you want to let it be theater mode.
var theater_dark_objects = [];	// The objects which is the parents of "Video".
var ori_theater_dark_styles = [];	// Store original style of "theater_dark_objects".
var ori_theater_dark_classes = [];	// Store original class of "theater_dark_objects".
var theater_hide_objects = [];	// The objects which is no related with "Video".
var ori_theater_hide_styles = [];	// Store original style of "theater_hide_objects".
var theater_mode = false;	// Record theater mode ON/OFF.

// Listening all events
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {	// function(any message, MessageSender sender, function sendResponse) {...};
	// Capture message of the theater mode chrome extension
	if(request.mode == "theater"){
		if (theater_mode){
			StopTheaterMode(video_objects[0], theater_dark_objects, theater_hide_objects, ori_video_style, ori_theater_dark_styles, ori_theater_dark_classes, ori_theater_hide_styles);
		}
		else{
			video_objects = $("video");
			if (video_objects.length == 0) alert(getMessage("no_video"));
			else if (video_objects.length == 1){
				theater_dark_objects = GetAllParents(video_objects[0])
				theater_hide_objects = GetHideObjects(theater_dark_objects);
				StartTheaterMode(true, video_objects[0], theater_dark_objects, theater_hide_objects, ori_video_style, ori_theater_dark_styles, ori_theater_dark_classes, ori_theater_hide_styles);
			}
			else{
				alert("Video count: " + video_objects.length + " in this page\nThis chrome extension support only when one video in the webpage");
			}
		}
		theater_mode = !theater_mode;
		// sendResponse({content: "response message"});
		// return true; // 若回傳True, 表示onMessage與sendResponse為異步執行, 所有動作結束後才會sendResponse
	}
});

// Windows Resize Event, if in theater mode then stop theater mode.
$(window).resize(function() {
	if (theater_mode){
		StopTheaterMode(video_objects[0], theater_dark_objects, theater_hide_objects, ori_video_style, ori_theater_dark_styles, ori_theater_dark_classes, ori_theater_hide_styles);
		theater_mode = !theater_mode;		
	}
});