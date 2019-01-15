/**
 * This js file is to do some backend compute
 * For example: what object will be hide
 */

/**
 * Get parent and sibling objects of input object, total 2 stages includeing video object.
 * The first object which this function return is Video.
 * The first object which this function return is parent of Video.
 * @param {Jquery object} video_object - what you want to get its parents.
 */
function GetResizeObjects(video_object) {
    var resize_objects = $();
    $.merge(resize_objects, video_object); // Concat video object.
    var parent = video_object.parent();
    $.merge(resize_objects, parent); // Concat parent of video object.
    $.merge(resize_objects, GetSiblingObjects(parent));  // Concat sibling of parent of video object.
    return resize_objects;
}

/**
 * Get all parent objects of the grandparent of input object, excluding "HTML".
 * @param {Jquery object} video_object - what you want to get its parents.
 */
function GetDarkObjects(video_object) {
    return video_object.parent().parentsUntil("HTML");
}

/**
 * Get all sibling objects of the input object, excluding "script" tag.
 * If the array which you want to "concat" is in different size, you need to do "toArray()" first.
 * @param {Jquery object} object - what you want to get its sibling.
 */
function GetSiblingObjects(object) {
    return object.siblings().not("script");
}

/**
 * Get all objects which are not dirrectly related with the input objects.
 * @param {Jquery object} objects - array-like what you want to get its sibling.
 */
function GetHideObjects(objects) {
    var hide_objects = GetSiblingObjects(objects);
    return hide_objects;
}

/**
 * According to aspect ratio of the video object, calculating the suitable size to fill the browser viewport and loaction.
 * @param {Jquery object} video_object - what you want to get suitable size.
 * @param {Float} window_height - height of the Viewport.
 * @param {Float} window_width - width of the Viewport.
 */
function GetVideoSizeAndLoc(video_object, window_height, window_width) {
    var video_height = parseFloat(video_object[0].style.height);   // Get video height. Bcs "style.height" will return the value which include "px", use "parseFloat" to ignore that.
    var video_width = parseFloat(video_object[0].style.width); // Get video width. Bcs ... which is the same as above.
    var video_size_loc = Object.assign({}, VIDEO_STYLE);    // Get defined value from CONSTANT.
    if (isNaN(video_height) || isNaN(video_width)) {
        video_size_loc["height"] = window_height;
        video_size_loc["width"] = window_width;
    }
    else {
        if (window_width/window_height > video_width/video_height) { // Aspect ratio of browser is bigger than video, which mean: browser is more "rectangle"(horizontal) than video.
            // Bcs width of the browser is enough, assign height of the video first so that the width can be calculated.
            video_size_loc["height"] = window_height;
            video_size_loc["width"] = video_width*(window_height/video_height);
        }
        else {   // Aspect ratio of browser is smaller than video, which mean: browser is more "rectangle"(vertical) than video.
            // Bcs height of the browser is enough, assign width of the video first so that the height can be calculated.
            video_size_loc["height"] = video_height*(window_width/video_width);
            video_size_loc["width"] = window_width;
        }
    }    
    video_size_loc["top"] = (window_height - video_size_loc["height"]) / 2;
    video_size_loc["left"] = (window_width - video_size_loc["width"]) / 2;
    return video_size_loc;
}

/**
 * 
 * @param {Dictionary include jquery object} video_object - 1.a Videos; 2.original style.
 * @param {Dictionary include jquery object} theater_resize_objects - 1.the parent and its sibling of the Video; 2.original style.
 * @param {Dictionary include jquery object} theater_dark_objects - 1.the grandparents of Video; 2.original style.
 * @param {Dictionary include jquery object} theater_hide_objects - 1.the objects which are not dirrectly related with the Video; ; 2.original style.
 */
function SetTheaterObjects(video_object, theater_resize_objects, theater_dark_objects, theater_hide_objects) {
    theater_resize_objects["objects"] = GetResizeObjects(video_object["object"]);
    theater_dark_objects["objects"] = GetDarkObjects(video_object["object"]);
    theater_hide_objects["objects"] = GetHideObjects(theater_dark_objects["objects"]);
    // Put parent of video into "theater_dark_objects" and remove it from "theater_resize_objects"
    $.merge(theater_dark_objects["objects"], theater_resize_objects["objects"].eq(1));
    theater_resize_objects["objects"].splice(0, 2);	// splice(index, number), remove "number" object array element from "index"
}

/**
 * Start Theater Mode.
 * 1. Set Video to fill the viewport of browser.
 * 2. Let the parents of Video turn to dark and adjust some style.
 * 3. Let the objects which are not dirrectly related with the Video hide.
 * @param {Boolean} backup - store original HTMLObject styles if true.
 * @param {Dictionary include jquery object} video_object - 1.a Videos; 2.original style.
 * @param {Dictionary include jquery object} theater_resize_objects - 1.the parent and its sibling of the Video; 2.original style.
 * @param {Dictionary include jquery object} theater_dark_objects - 1.the grandparents of Video; 2.original style.
 * @param {Dictionary include jquery object} theater_hide_objects - 1.the objects which are not dirrectly related with the Video; ; 2.original style.
 */
function StartTheaterMode(backup=true, video_object, theater_resize_objects, theater_dark_objects, theater_hide_objects) {
    // Set(Get) theater object
    SetTheaterObjects(video_object, theater_resize_objects, theater_dark_objects, theater_hide_objects);
    // Backup the scroll position
    gScroll["left"] = window.pageXOffset;
    gScroll["top"] = window.pageYOffset;
    // Calculate height/weight.
    var window_height = window.innerHeight; // Get browser viewport height.
    var window_width = window.innerWidth;   // Get browser viewport width.
    var video_size_loc = GetVideoSizeAndLoc(video_object["object"], window_height, window_width);   // Get suitable height/width & top/left.
    // Backup and adjust Video size & location.
    if (backup) {        
        video_object["attr"] = Object.assign({}, THEATER_VIDEO_STYLES);
        video_object["attr"]["style"] = video_object["object"].attr("style");
    }
    video_object["object"].css({"height": video_size_loc["height"], "width": video_size_loc["width"], "top": video_size_loc["top"], "left": video_size_loc["left"]});
    // Backup and adjust parent and sibling of Video size & location.
    for (var i=0; i<theater_resize_objects["objects"].length; i++) {
        if (backup) {
            theater_resize_objects["attr"][i] = Object.assign({}, THEATER_RESIZE_STYLES);
            theater_resize_objects["attr"][i]["style"] = theater_resize_objects["objects"].eq(i).attr("style"); // eq(i): 以jquery object的形式回傳第i個元素
        }
        // Set both height and width of Video and its parent, the other only set left, text color, and background-image(Which youtube use this)
        theater_resize_objects["objects"].eq(i).css({"color":"white"});
    }
    // Backup and adjust the grandparents' style & class of Video.
    for (var i=0; i<theater_dark_objects["objects"].length; i++) {
        if (backup) {
            theater_dark_objects["attr"][i] = Object.assign({}, THEATER_DARK_STYLES);
            theater_dark_objects["attr"][i]["style"] = theater_dark_objects["objects"].eq(i).attr("style");
            theater_dark_objects["attr"][i]["class"] = theater_dark_objects["objects"].eq(i).attr("class");
        }        
        theater_dark_objects["objects"].eq(i).css({"background":"rgba(0,0,0)", "margin":"0px", "padding":"0px", "overflow":"hidden", "outline":"none", 
                                                   "height": isStyleExist(theater_dark_objects["objects"].eq(i), "height") ? window_height : "", 
                                                   "width": isStyleExist(theater_dark_objects["objects"].eq(i), "width") ? window_width : ""});
        theater_dark_objects["objects"].eq(i).removeClass();   // Bcs some class will effect the css style
    }
    // Backup and adjust the siblings' style of Video.
    if (backup) {
        for (var i=0; i<theater_hide_objects["objects"].length; i++) {
            theater_hide_objects["attr"][i] = theater_hide_objects["objects"].get(i).style.display;
            theater_hide_objects["objects"].eq(i).css("display", "none");
        }
    }
}

/**
 * Stop Theater Mode.
 * 1. Restore Video size in the viewport of browser.
 * 2. Restore the parents of Video turn to un-dark and restore some style.
 * 3. Restore the objects which are not dirrectly related with the Video display.
 * @param {Dictionary include jquery object} video_object - 1.a Videos; 2.original style.
 * @param {Dictionary include jquery object} theater_resize_objects - 1.the parent and its sibling of the Video; 2.original style.
 * @param {Dictionary include jquery object} theater_dark_objects - the grandparents of Video; 2.original style.
 * @param {Dictionary include jquery object} theater_hide_objects - 1.the objects which are not dirrectly related with the Video; ; 2.original style.
 */
function StopTheaterMode(video_object, theater_resize_objects, theater_dark_objects, theater_hide_objects){
    // Restore Video size & location.
    if (video_object["attr"]["style"] === undefined) video_object["object"].removeAttr("style");
    else video_object["object"].attr("style", video_object["attr"]["style"]);
    // Backup and adjust parent and sibling of Video size & location.
    for (var i=0; i<theater_resize_objects["objects"].length; i++) {
        if (theater_resize_objects["attr"][i]["style"] === undefined) theater_resize_objects["objects"].eq(i).removeAttr("style");
        else theater_resize_objects["objects"].eq(i).attr("style", theater_resize_objects["attr"][i]["style"]);
    }
    // Restore the grandparents' style of Video.
    for (var i=0; i<theater_dark_objects["objects"].length; i++) {
        if (theater_dark_objects["attr"][i]["style"] === undefined) theater_dark_objects["objects"].eq(i).removeAttr("style");
        else theater_dark_objects["objects"].eq(i).attr("style", theater_dark_objects["attr"][i]["style"]);
        theater_dark_objects["objects"].eq(i).addClass(theater_dark_objects["attr"][i]["class"]);
    }
    // Restore the siblings' style of Video.
    for (var i=0; i<theater_hide_objects["objects"].length; i++) {
        theater_hide_objects["objects"].eq(i).css("display", theater_hide_objects["attr"][i]);
    }
    // Restore the scroll position
    window.scrollTo(gScroll["left"], gScroll["top"]);
}
