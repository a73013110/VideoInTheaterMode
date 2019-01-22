/**
 * This js file is to do some webvwiew operating
 * For example: webvwiew hint which like as human machine interface
 */

function ObjectFocus(focus_object, videos, video_siblings_parent_siblings, video_parents, video_grandparents_siblings, video) {
    focus_object["isFocused"] = true;
    focus_object["object"] = video;
    focus_object["ori_style"] = video.attr("style");
    FOCUS_STYLE["height"] = video.css("height");
    FOCUS_STYLE["width"] = video.css("width");
    FOCUS_STYLE["z-index"] = isStyleExist(video, "z-index") ? parseInt(video.css("z-index"))+1 : "auto";
    focus_object["focus-panel"] = $(document.createElement("div"))
    focus_object["focus-panel"].css(FOCUS_STYLE);
    focus_object["focus-panel"].mouseleave(function(){ ObjectUnfocus(focus_object); });
    focus_object["focus-panel"].on("click", function(){ StopToGetFocusVideo(focus_object, videos, video_siblings_parent_siblings, video_parents, video_grandparents_siblings); });
    video.css({"position":"absolute"});
    video.after(focus_object["focus-panel"]);
}

function ObjectUnfocus(focus_object) {
    if (focus_object["isFocused"]) {
        focus_object["focus-panel"].remove();
        restoreStyle(focus_object["object"], focus_object["ori_style"]);
        focus_object["isFocused"] = false;
    }
}

function StartToGetFocusVideo(focus_object, videos, video_siblings_parent_siblings, video_parents, video_grandparents_siblings) {
    $(videos["object"][0].tagName).mouseenter(function(){ ObjectFocus(focus_object, videos, video_siblings_parent_siblings, video_parents, video_grandparents_siblings, $(this)); });
}

function StopToGetFocusVideo(focus_object, videos, video_siblings_parent_siblings, video_parents, video_grandparents_siblings) {
    ObjectUnfocus(focus_object);
    $(videos["object"]).off();
    focus_object["focus-panel"].off();
    videos["object"] = focus_object["object"];
    StartTheaterMode(true, videos, video_siblings_parent_siblings, video_parents, video_grandparents_siblings);
}
