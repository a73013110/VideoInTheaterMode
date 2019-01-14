/**
 * This js file is to do some backend compute
 * For example: what object will be hide
 */

/**
 * Get parent and sibling objects of input object, total 2 stages includeing video object.
 * The first object which this function return is Video.
 * The first object which this function return is parent of Video.
 * @param {HTMLObject} object - what you want to get its parents.
 */
function GetResizeObjects(object) {
    var resize_objects = [];
    resize_objects = resize_objects.concat(object); // Concat video object.
    var parent = $(object).parent().toArray();
    resize_objects = resize_objects.concat(parent); // Concat parent of video object.
    resize_objects = resize_objects.concat(GetSiblingObjects(parent));  // Concat sibling of parent of video object.
    return resize_objects;
}

/**
 * Get all parent objects of the parent of input object, excluding "HTML".
 * @param {HTMLObject} object - what you want to get its parents.
 */
function GetDarkObjects(object) {
    return $(object).parent().parentsUntil("HTML").toArray();
}

/**
 * Get all sibling objects of the input object, excluding "script" tag.
 * If the array which you want to "concat" is in different size, you need to do "toArray()" first.
 * @param {HTMLObject} object - what you want to get its sibling.
 */
function GetSiblingObjects(object) {
    return $(object).siblings().not("script").toArray();
}

/**
 * Get all objects which are not dirrectly related with the input objects.
 * @param {HTMLObjects Array} objects - array-like what you want to get its sibling.
 */
function GetHideObjects(objects) {
    var hide_objects = [];
    for (var i=0; i<objects.length; i++) {
        var sibling_objects = GetSiblingObjects(objects[i]);
        if (sibling_objects.length > 0) { hide_objects = hide_objects.concat(sibling_objects); }    // Do not "concat" if no sibling.
    }
    return hide_objects;
}

/**
 * According to aspect ratio of the video object, calculating the suitable size to fill the browser viewport and loaction.
 * @param {HTMLObjects} video_object - what you want to get suitable size.
 * @param {Float} window_height - height of the Viewport.
 * @param {Float} window_width - width of the Viewport.
 */
function GetVideoSizeAndLoc(video_object, window_height, window_width) {
    var video_height = parseFloat(video_object.style.height);   // Get video height. Bcs "style.height" will return the value which include "px", use "parseFloat" to ignore that.
    var video_width = parseFloat(video_object.style.width); // Get video width. Bcs ... which is the same as above.
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
 * Start Theater Mode.
 * 1. Set Video to fill the viewport of browser.
 * 2. Let the parents of Video turn to dark and adjust some style.
 * 3. Let the objects which are not dirrectly related with the Video hide.
 * @param {HTMLObject} backup - store original HTMLObject styles if true.
 * @param {HTMLObject} theater_resize_objects - the parent and its sibling of the Video.
 * @param {HTMLObjects Array} theater_dark_objects - the parents of parent of Video.
 * @param {HTMLObjects Array} theater_hide_objects - the objects which are not dirrectly related with the Video.
 * @param {Object} ori_theater_resize_attr - original style of "theater_resize_objects".
 * @param {Object Array} ori_theater_dark_attr - original style and class of "theater_dark_objects".
 * @param {Object Array} ori_theater_hide_styles - original style of "theater_hide_objects".
 */
function StartTheaterMode(backup=true, theater_resize_objects, theater_dark_objects, theater_hide_objects, ori_theater_resize_attr, ori_theater_dark_attr, ori_theater_hide_styles) {
    // Calculate height/weight.
    var window_height = window.innerHeight; // Get browser viewport height.
    var window_width = window.innerWidth;   // Get browser viewport width.
    var video_size_loc = GetVideoSizeAndLoc(theater_resize_objects[0], window_height, window_width);   // Get suitable height/width & top/left.
    // Backup and adjust Video size & location.
    for (var i=0; i<theater_resize_objects.length; i++) {
        if (backup) {
            ori_theater_resize_attr[i] = Object.assign({}, THEATER_RESIZE_STYLES);
            ori_theater_resize_attr[i]["style"] = $(theater_resize_objects[i]).attr("style");
        }
        // Set both height and width of Video and its parent, the other only set left, text color, and background-image(Which youtube use this)
        if (i == 0) {
            $(theater_resize_objects[i]).css({"height": video_size_loc["height"], "width": video_size_loc["width"], "top": video_size_loc["top"], "left": video_size_loc["left"]});
        }
        else {
            $(theater_resize_objects[i]).css({"color":"white"});
        }
    }
    // Backup and adjust the parents' style & class of Video.
    for (var i=0; i<theater_dark_objects.length; i++) {
        if (backup) {
            ori_theater_dark_attr[i] = Object.assign({}, THEATER_DARK_STYLES);
            ori_theater_dark_attr[i]["style"] = $(theater_dark_objects[i]).attr("style");
            ori_theater_dark_attr[i]["class"] = $(theater_dark_objects[i]).attr("class");
        }        
        $(theater_dark_objects[i]).css({"background":"rgba(0,0,0)", "margin":"0px", "padding":"0px", "overflow":"hidden", "outline":"none", "height":window_height, "width":window_width});
        $(theater_dark_objects[i]).removeClass();   // Bcs some class will effect the css style
    }
    // Backup and adjust the siblings' style of Video.
    if (backup) {
        for (var i=0; i<theater_hide_objects.length; i++) {
            ori_theater_hide_styles[i] = $(theater_hide_objects[i])[0].style.display;
            $(theater_hide_objects[i]).css("display", "none");
        }
    }    
}

/**
 * Stop Theater Mode.
 * 1. Restore Video size in the viewport of browser.
 * 2. Restore the parents of Video turn to un-dark and restore some style.
 * 3. Restore the objects which are not dirrectly related with the Video display.
 * @param {HTMLObject} theater_resize_objects - the parent and its sibling of the Video.
 * @param {HTMLObjects Array} theater_dark_objects - the parents of parent of Video.
 * @param {HTMLObjects Array} theater_hide_objects - the objects which are not dirrectly related with the Video.
 * @param {Object} ori_theater_resize_attr - original style of "theater_resize_objects".
 * @param {Object Array} ori_theater_dark_attr - original style and class of "theater_dark_objects".
 * @param {Object Array} ori_theater_hide_styles - original style of "theater_hide_objects".
 */
function StopTheaterMode(theater_resize_objects, theater_dark_objects, theater_hide_objects, ori_theater_resize_attr, ori_theater_dark_attr, ori_theater_hide_styles){
    // Restore Video size & location.
    for (var i=0; i<theater_resize_objects.length; i++) {
        if (ori_theater_resize_attr[i]["style"] === undefined) $(theater_resize_objects[i]).removeAttr("style");
        else $(theater_resize_objects[i]).attr("style", ori_theater_resize_attr[i]["style"]);
    }
    // Restore the parents' style of Video.
    for (var i=0; i<theater_dark_objects.length; i++) {
        if (ori_theater_dark_attr[i]["style"] === undefined) $(theater_dark_objects[i]).removeAttr("style");
        else $(theater_dark_objects[i]).attr("style", ori_theater_dark_attr[i]["style"]);
        $(theater_dark_objects[i]).addClass(ori_theater_dark_attr[i]["class"]);
    }
    // Restore the siblings' style of Video.
    for (var i=0; i<theater_hide_objects.length; i++) {
        $(theater_hide_objects[i]).css("display", ori_theater_hide_styles[i]);
    }
}
