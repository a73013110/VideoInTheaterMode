/*
 * This JavaScript is embeded in the web what you surf
 * Use to listen the event of this Chrome extension's Button Click
 */

var video_objects = [];	// Store all "Video".
var theater_resize_objects = []
var ori_theater_resize_attr = []
var theater_dark_objects = [];	// The objects which is the parents of "Video".
var ori_theater_dark_attr = [];	// Store original style and class of "theater_dark_objects".
var theater_hide_objects = [];	// The objects which is no related with "Video".
var ori_theater_hide_styles = [];	// Store original style of "theater_hide_objects".
var theater_mode = false;	// Record theater mode ON/OFF.

var focus_object = Object.assign({}, FOCUS_OBJECT);

// Listening all events
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {	// function(any message, MessageSender sender, function sendResponse) {...};
	// Capture message of the theater mode chrome extension.
	if(request["mode"] == "theater") {
		if (theater_mode) {
			StopTheaterMode(theater_resize_objects, theater_dark_objects, theater_hide_objects, ori_theater_resize_attr, ori_theater_dark_attr, ori_theater_hide_styles);
		}
		else {
			video_objects = $("video");	// Expectation of video_objects.length: 1.
			video_objects = (video_objects.length != 0) ? video_objects : $("iframe");	// number of videos: 0, try to detect "iframe" tag
			// If video_objects.length != 1
			if (video_objects.length == 0) {
				alert(getMessage("no_video"));
				return true;
			}
			else if (video_objects.length > 1) {	// number of videos: 2, 3, 4, ...
				if (focus_object["focused"]) {
					video_objects = [focus_object["object"]];
					StopToGetFocusVideo(focus_object);
					focus_object = Object.assign({}, FOCUS_OBJECT);
				}
				else {
					var result = confirm(getMessage("many_videos"));
					// if (result == true) video_objects = [document.activeElement];	// get the video which one click
					if (result == true) {
						StartToGetFocusVideo(focus_object);	// get the video which one click
					}
					return true;		
				}						
			} 
			
			// video count: 1
			theater_resize_objects = GetResizeObjects(video_objects[0]);
			theater_dark_objects = GetDarkObjects(video_objects[0]);
			theater_hide_objects = GetHideObjects(theater_dark_objects);
			// Put parent of video into first of "theater_dark_objects" and remove it from "theater_resize_objects"
			theater_dark_objects.unshift(theater_resize_objects[1])	// [1, 2, 3] => unshift(0) => [0, 1, 2, 3]
			theater_resize_objects.splice(1, 1);	// splice(index, number), remove "number" object array element from "index"
			StartTheaterMode(true, theater_resize_objects, theater_dark_objects, theater_hide_objects, ori_theater_resize_attr, ori_theater_dark_attr, ori_theater_hide_styles);
		}
		theater_mode = !theater_mode;
		// sendResponse({content: "response message"});
		return true; // 若回傳True, 表示onMessage與sendResponse為異步執行, 所有動作結束後才會sendResponse
	}
});

// $('iframe').mouseenter(function(){
//     if (focus_object["focused"]) RestoreStyle(focus_object);    // restore "focus_object"
//     // store "focus_object"
//     console.log($(this)[0]);
//     focus_object["object"] = $(this)[0];
//     focus_object["style"] = $(focus_object["object"]).attr("style");
//     $(focus_object["object"]).css({"border":"medium solid red"});
//     focus_object["focused"] = true;
// })
// $('iframe').mouseleave(function(){
//     if (focus_object["focused"]) RestoreStyle(focus_object);    // restore "focus_object"
//     // store "focus_object"
// })

// Windows Resize Event, if in theater mode then stop theater mode.
$(window).resize(function() {
	if (theater_mode){
		StopTheaterMode(theater_resize_objects, theater_dark_objects, theater_hide_objects, ori_theater_resize_attr, ori_theater_dark_attr, ori_theater_hide_styles);
		theater_mode = !theater_mode;		
	}
});