/**
 * This js file is to do some webvwiew operating
 * For example: webvwiew hint which like as human machine interface
 */

function RestoreStyle(focus_object) {
    if (focus_object["style"] === undefined) $(focus_object["object"]).removeAttr("style");
    else $(focus_object["object"]).attr("style", focus_object["style"]);
    focus_object["style"] = undefined;
    focus_object["focused"] = false;
}

function ObjectFocus(focus_object) {
    if (focus_object["focused"]) RestoreStyle(focus_object);    // restore "focus_object"
    // store "focus_object"
    focus_object["object"] = document.activeElement;
    focus_object["style"] = $(focus_object["object"]).attr("style");
    $(focus_object["object"]).css({"border":"medium solid red"});
    focus_object["focused"] = true;
}

function StartToGetFocusVideo(focus_object) {
    $(document).on("click", function(){ ObjectFocus(focus_object); });
    $("iframe").contents().on("click", function(){ ObjectFocus(focus_object); });
}

function StopToGetFocusVideo(focus_object) {
    RestoreStyle(focus_object);
    $(document).off();
    $("iframe").contents().off();
}
