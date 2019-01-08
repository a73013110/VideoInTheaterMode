/**
 * Get all parent objects of the input object, excluding "HTML".
 * @param {HTMLObject} object - what you want to get its parents.
 */
function GetAllParents(object){
    return $(object).parentsUntil("HTML").toArray();
}

/**
 * Get all sibling objects of the input object, excluding "script" tag.
 * @param {HTMLObject} object - what you want to get its sibling.
 */
function GetSiblingObjects(object){
    return $(object).siblings().not("script");
}

/**
 * Get all objects which are not dirrectly related with the input objects.
 * @param {HTMLObjects Array} objects - array-like what you want to get its sibling.
 */
function GetHideObjects(objects){
    hide_objects = [];
    for (var i=0; i<objects.length; i++){
        var sibling_objects = GetSiblingObjects(objects[i]).toArray();  // If the array which you want to "concat" is in different size, you need to do "toArray()" first.
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
function GetVideoSizeAndLoc(video_object, window_height, window_width){
    var video_height = parseFloat(video_object.style.height);   // Get video height. Bcs "style.height" will return the value which include "px", use "parseFloat" to ignore that.
    var video_width = parseFloat(video_object.style.width); // Get video width. Bcs ... which is the same as above.
    var video_size_loc = Object.assign({}, VIDEO_STYLE);    // Get defined value from CONSTANT.
    if (isNaN(video_height) || isNaN(video_width)){
        video_size_loc["height"] = window_height;
        video_size_loc["width"] = window_width;
    }
    else{
        if (window_width/window_height > video_width/video_height){ // Aspect ratio of browser is bigger than video, which mean: browser is more "rectangle"(horizontal) than video.
            // Bcs width of the browser is enough, assign height of the video first so that the width can be calculated.
            video_size_loc["height"] = window_height;
            video_size_loc["width"] = video_width*(window_height/video_height);
        }
        else{   // Aspect ratio of browser is smaller than video, which mean: browser is more "rectangle"(vertical) than video.
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
 * @param {HTMLObject} video_object - one video object.
 * @param {HTMLObjects Array} theater_dark_objects - the parents of Video.
 * @param {HTMLObjects Array} theater_hide_objects - the objects which are not dirrectly related with the Video.
 * @param {Object} ori_video_style - original style of "video_object".
 * @param {Object Array} ori_theater_dark_styles - original style of "theater_dark_objects".
 * @param {Object Array} ori_theater_dark_classes - original class of "theater_dark_objects".
 * @param {Object Array} ori_theater_hide_styles - original style of "theater_hide_objects".
 */
function StartTheaterMode(backup=true,video_object, theater_dark_objects, theater_hide_objects, ori_video_style, ori_theater_dark_styles, ori_theater_dark_classes, ori_theater_hide_styles){
    // Calculate height/weight.
    var window_height = $(window).height(); // Get browser viewport height.
    var window_width = $(window).width();   // Get browser viewport width.
    var video_size_loc = GetVideoSizeAndLoc(video_object, window_height, window_width);   // Get suitable height/width & top/left.
    // Backup and adjust Video size & location.
    if (backup) ori_video_style["attribute"] = $(video_object).attr("style");
    $(video_object).css({"height": video_size_loc["height"], "width": video_size_loc["width"], "top": video_size_loc["top"], "left": video_size_loc["left"]})
    // Backup and adjust the parents' style & class of Video.
    for (var i=0; i<theater_dark_objects.length; i++){
        if (backup){
            ori_theater_dark_styles[i] = Object.assign({}, THEATER_DARK_STYLES);
            ori_theater_dark_styles[i]["attribute"] = $(theater_dark_objects[i]).attr("style");
            ori_theater_dark_classes[i] = $(theater_dark_objects[i]).attr("class");
            $(theater_dark_objects[i]).removeClass();   // Bcs some class will effect the css style
        }        
        $(theater_dark_objects[i]).css({"background":"rgba(0,0,0)", "margin":"0px", "padding":"0px", "overflow":"hidden", "outline": "none", "height":window_height, "width":window_width});
    }
    // Backup and adjust the siblings' style of Video.
    if (backup){
        for (var i=0; i<theater_hide_objects.length; i++){
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
 * @param {HTMLObject} video_object - one video object.
 * @param {HTMLObjects Array} theater_dark_objects - the parents of Video.
 * @param {HTMLObjects Array} theater_hide_objects - the objects which are not dirrectly related with the Video.
 * @param {Object} ori_video_style - original style of "video_object".
 * @param {Object Array} ori_theater_dark_styles - original style of "theater_dark_objects".
 * @param {Object Array} ori_theater_dark_classes - original class of "theater_dark_objects".
 * @param {Object Array} ori_theater_hide_styles - original style of "theater_hide_objects".
 */
function StopTheaterMode(video_object, theater_dark_objects, theater_hide_objects, ori_video_style, ori_theater_dark_styles, ori_theater_dark_classes, ori_theater_hide_styles){
    // Restore Video size & location.    
    if (ori_video_style["attribute"] === undefined) $(video_object).removeAttr("style");
    else $(video_object).attr("style", ori_video_style["attribute"]);
    // Restore the parents' style of Video.
    for (var i=0; i<theater_dark_objects.length; i++){
        if (ori_theater_dark_styles[i]["attribute"] === undefined) $(theater_dark_objects[i]).removeAttr("style");
        else $(theater_dark_objects[i]).attr("style", ori_theater_dark_styles[i]["attribute"]);
        $(theater_dark_objects[i]).addClass(ori_theater_dark_classes[i]);
    }
    // Restore the siblings' style of Video.
    for (var i=0; i<theater_hide_objects.length; i++){
        $(theater_hide_objects[i]).css("display", ori_theater_hide_styles[i]);
    }
}

/**
 * Get message from _locales
 * @param {String} key 
 */
function getMessage(key){
    return chrome.i18n.getMessage(key);
}