/**
 * This js file is to do some webvwiew operating
 * For example: webvwiew hint which like as human machine interface
 */

function ObjectFocus(focus_object, video_object, theater_resize_objects, theater_dark_objects, theater_hide_objects, video) {
    focus_object["isFocused"] = true;
    focus_object["object"] = video;
    FOCUS_STYLE["height"] = video.css("height");
    FOCUS_STYLE["width"] = video.css("width");
    FOCUS_STYLE["z-index"] = isStyleExist(video, "z-index") ? parseInt(video.css("z-index"))+1 : "auto";
    focus_object["focus-panel"] = $(document.createElement("div"))
    focus_object["focus-panel"].css(FOCUS_STYLE);
    focus_object["focus-panel"].mouseleave(function(){ ObjectUnfocus(focus_object); });
    focus_object["focus-panel"].on("click", function(){ StopToGetFocusVideo(focus_object, video_object, theater_resize_objects, theater_dark_objects, theater_hide_objects); });
    $(video).after(focus_object["focus-panel"]);
}

function ObjectUnfocus(focus_object) {
    if (focus_object["isFocused"]) {
        focus_object["focus-panel"].remove();
    }
    focus_object["isFocused"] = false;
}

function StartToGetFocusVideo(focus_object, video_object, theater_resize_objects, theater_dark_objects, theater_hide_objects) {
    $(video_object["object"][0].tagName).mouseenter(function(){ ObjectFocus(focus_object, video_object, theater_resize_objects, theater_dark_objects, theater_hide_objects, $(this)); });
}

function StopToGetFocusVideo(focus_object, video_object, theater_resize_objects, theater_dark_objects, theater_hide_objects) {
    ObjectUnfocus(focus_object);
    $(video_object["object"]).off();
    focus_object["focus-panel"].off();
    video_object["object"] = focus_object["object"];
    StartTheaterMode(true, video_object, theater_resize_objects, theater_dark_objects, theater_hide_objects);
    gTheater_mode = true;   // set global variable
}
