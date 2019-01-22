/*
 * This JavaScript is embeded in the web what you surf
 * Use to listen the event of this Chrome extension's Button Click
 */

var video = {"object": [], "attr": [], "video_size_loc":undefined};	// Store all "Video".
var video_siblings_parent_siblings = {"objects": [], "attr": []};
var video_parents = {"objects": [], "attr": []};	// "objects": the grandparents of "Video", "attr": original style and class of "objects"
var video_grandparents_siblings = {"objects": [], "attr": []};	// "objects": no related with "Video", "attr": original style and class of "objects"

var focus_object = Object.assign({}, FOCUS_OBJECT);

gObserver = new ResizeObserver(objects => {
	object = objects[0]	// I only observer the one video, so now objects.length is 1.
	// Skip the first resize event when start the theater mode.
	// When the video size change, then StopTheaterMode.
	if (!document.fullscreen &&
		(Math.floor(object.contentRect.height) != Math.floor(video["video_size_loc"]["height"]) || 
		Math.floor(object.contentRect.width) != Math.floor(video["video_size_loc"]["width"])))
		StopTheaterMode(video, video_siblings_parent_siblings, video_parents, video_grandparents_siblings);
	// If the video is in full screen, let it to be the 21:9 ratio
	console.log(document.fullscreen)
	console.log(object.contentRect.height, screen.height)
	console.log(object.contentRect.width, screen.width)
	if (object.contentRect.height == screen.height || object.contentRect.width == screen.width) {
		var height = screen.width * parseInt(video["object"].css("height")) / parseInt(video["object"].css("width"))
		video["object"].css({"height": height, 
							 "width": screen.width, 
							 "top": (screen.height-height)/2,
							 "left": "0px",
							 "object-fit": "cover"});
	}
});

// Listening all events
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {	// function(any message, MessageSender sender, function sendResponse) {...};
	// Capture message of the theater mode chrome extension, and the wabpage can't be fullscreen
	if(request["mode"] == "theater" && !document.fullscreen) {
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
		// sendResponse({content: "response message"});
		return true; // 若回傳True, 表示onMessage與sendResponse為異步執行, 所有動作結束後才會sendResponse
	}
});

// Fullscreen event. if change state from fullscreen to normal screen, then StopTheaterMode.
document.addEventListener("fullscreenchange", function(event) {
	if (gTheater_mode && document.fullscreenElement == null) {
		StopTheaterMode(video, video_siblings_parent_siblings, video_parents, video_grandparents_siblings);
	}
});