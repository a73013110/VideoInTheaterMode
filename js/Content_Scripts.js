/*
 * This JavaScript is embeded in the web what you surf
 * Use to listen the event of this Chrome extension's Button Click
 */

var video = {"object": [], "attr": []};	// Store all "Video".
var video_siblings_parent_siblings = {"objects": [], "attr": []};
var video_parents = {"objects": [], "attr": []};	// "objects": the grandparents of "Video", "attr": original style and class of "objects"
var video_grandparents_siblings = {"objects": [], "attr": []};	// "objects": no related with "Video", "attr": original style and class of "objects"

var focus_object = Object.assign({}, FOCUS_OBJECT);

// Listening all events
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {	// function(any message, MessageSender sender, function sendResponse) {...};
	// Capture message of the theater mode chrome extension.
	if(request["mode"] == "theater") {
		if (gTheater_mode) {
			StopTheaterMode(video, video_siblings_parent_siblings, video_parents, video_grandparents_siblings);
		}
		else {
			video["object"] = $("video").filter(":visible");	// Expectation of video.length: 1.
			video["object"] = (video["object"].length != 0) ? video["object"] : $("iframe").filter(":visible");	// number of videos: 0, try to detect "iframe" tag
			// If video.length != 1
			if (video["object"].length == 0) {
				alert(getMessage("no_video"));
				return true;
			}
			else if (video["object"].length > 1) {	// number of videos: 2, 3, 4, ...
				var result = confirm(getMessage("many_videos"));
				if (result == true) {
					StartToGetFocusVideo(focus_object, video, video_siblings_parent_siblings, video_parents, video_grandparents_siblings);	// get the video which one click
				}
				return true;
			}
			StartTheaterMode(true, video, video_siblings_parent_siblings, video_parents, video_grandparents_siblings);
		}
		gTheater_mode = !gTheater_mode;
		// sendResponse({content: "response message"});
		return true; // 若回傳True, 表示onMessage與sendResponse為異步執行, 所有動作結束後才會sendResponse
	}
});

// Windows Resize Event, if in theater mode then stop theater mode.
$(window).resize(function() {
	if (gTheater_mode){
		StopTheaterMode(video, video_siblings_parent_siblings, video_parents, video_grandparents_siblings);
		gTheater_mode = !gTheater_mode;		
	}
});