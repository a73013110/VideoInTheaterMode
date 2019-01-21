/**
 * This js file is to do some backend compute
 * For example: what object will be hide
 */

/**
 * Get parent and sibling objects of input object, total 2 stages includeing video object.
 * The first object which this function return is Video.
 * The Second object which this function return is parent of Video.
 * @param {Jquery object} video - what you want to get its parents.
 */
function GetVideoAndSiblingsAndParentAndParentSiblings(video) {
    var objects = $();
    $.merge(objects, video); // Concat video object.
    var parent = video.parent();
    $.merge(objects, parent); // Concat parent of video object.
    $.merge(objects, GetSiblingObjects(video));  // Concat sibling of parent of video object.
    $.merge(objects, GetSiblingObjects(parent));  // Concat sibling of parent of video object.
    return objects;
}

/**
 * Get all parent objects of the grandparent of input object, excluding "HTML".
 * @param {Jquery object} video - what you want to get its parents.
 */
function GetGrandparents(video) {
    return video.parent().parentsUntil("HTML");
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
function GetGrandparentsSiblings(objects) {
    return GetSiblingObjects(objects);
}

/**
 * According to aspect ratio of the video object, calculating the suitable size to fill the browser viewport and loaction.
 * @param {Jquery object} video - what you want to get suitable size.
 * @param {Float} window_height - height of the Viewport.
 * @param {Float} window_width - width of the Viewport.
 */
function GetVideoSizeAndLoc(video, window_height, window_width) {
    // Get video height. Bcs "style.height" will return the value which include "px", use "parseFloat" to ignore that.
    var video_height = video[0].style.height.includes("%") ? parseFloat(video.css("height")) : parseFloat(video[0].style.height);
    // Get video width. Bcs ... which is the same as above.
    var video_width = video[0].style.width.includes("%") ? parseFloat(video.css("width")) : parseFloat(video[0].style.width);
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
 * @param {Dictionary include jquery object} video - 1.the Videos; 2.original style.
 * @param {Dictionary include jquery object} video_siblings_parent_siblings - 1.the video's sibling and its parent's sibling; 2.original style.
 * @param {Dictionary include jquery object} video_parents - 1.the grandparents of the Video; 2.original style.
 * @param {Dictionary include jquery object} video_grandparents_siblings - 1.the grandparents' sibling of the Video; ; 2.original style.
 */
function SetTheaterObjects(video, video_siblings_parent_siblings, video_parents, video_grandparents_siblings) {
    // Get video's siblings, its parent, and its parent's sibling.
    video_siblings_parent_siblings["objects"] = GetVideoAndSiblingsAndParentAndParentSiblings(video["object"]);
    // Get video's grandparent, great-grandparent, great-great-grandparent, ...
    video_parents["objects"] = GetGrandparents(video["object"]);
    // Get siblings of video's grandparent, great-grandparent, great-great-grandparent, ...
    video_grandparents_siblings["objects"] = GetGrandparentsSiblings(video_parents["objects"]);
    // Put video's parent into "video_parents" and remove it with video from "video_siblings_parent_siblings"
    $.merge(video_parents["objects"], video_siblings_parent_siblings["objects"].eq(1));
    video_siblings_parent_siblings["objects"].splice(0, 2);	// splice(index, number), remove "number" object array element from "index"

    // Check that whether video's siblings contain another video. 
    // If true, move it to the video_grandparents_siblings which will none-display it and clear that.
    if (video_siblings_parent_siblings["objects"].has(video["object"][0].tagName).length) {
        $.merge(video_grandparents_siblings["objects"], video_siblings_parent_siblings["objects"]);
        video_siblings_parent_siblings["objects"] = $();
    }
}

/**
 * Start Theater Mode.
 * 1. Set Video to fill the viewport of browser.
 * 2. Let the parents of Video turn to dark and adjust some style.
 * 3. Let the objects which are not dirrectly related with the Video hide.
 * @param {Boolean} backup - store original HTMLObject styles if true.
 * @param {Dictionary include jquery object} video - 1.the Videos; 2.original style.
 * @param {Dictionary include jquery object} video_siblings_parent_siblings - 1.the video's sibling and its parent's sibling; 2.original style.
 * @param {Dictionary include jquery object} video_parents - 1.the grandparents of the Video; 2.original style.
 * @param {Dictionary include jquery object} video_grandparents_siblings - 1.the grandparents' sibling of the Video; ; 2.original style.
 */
function StartTheaterMode(backup=true, video, video_siblings_parent_siblings, video_parents, video_grandparents_siblings) {
    // Set(Get) theater object
    SetTheaterObjects(video, video_siblings_parent_siblings, video_parents, video_grandparents_siblings);
    // Backup the scroll position
    gScroll["left"] = window.pageXOffset;
    gScroll["top"] = window.pageYOffset;
    // Calculate height/weight.
    var window_height = window.innerHeight; // Get browser viewport height.
    var window_width = window.innerWidth;   // Get browser viewport width.
    var video_size_loc = GetVideoSizeAndLoc(video["object"], window_height, window_width);   // Get suitable height/width & top/left.
    var video_ori_height = video["object"].css("height");
    var video_ori_width = video["object"].css("width");
    // Backup and adjust Video size & location.
    if (backup) {        
        video["attr"] = Object.assign({}, THEATER_VIDEO_STYLES);
        video["attr"]["style"] = video["object"].attr("style");
    }
    console.log(video_size_loc);
    video["object"].css({"height": video_size_loc["height"], "width": video_size_loc["width"], "top": video_size_loc["top"], "left": video_size_loc["left"]});
    // Backup and adjust parent and sibling of Video size & location.
    for (var i=0; i<video_siblings_parent_siblings["objects"].length; i++) {
        if (backup) {
            video_siblings_parent_siblings["attr"][i] = Object.assign({}, THEATER_RESIZE_STYLES);
            video_siblings_parent_siblings["attr"][i]["style"] = video_siblings_parent_siblings["objects"].eq(i).attr("style"); // eq(i): 以jquery object的形式回傳第i個元素
        }
        // If something cover on video, which cause user can't click video to pause and play, let it 可穿透的.
        if (video_siblings_parent_siblings["objects"].eq(i).css("height") == video_ori_height && video_siblings_parent_siblings["objects"].eq(i).css("width") == video_ori_width) {
            video_siblings_parent_siblings["objects"].eq(i).css({"color":"white", "pointer-events": "none"});
        }
        else {
            video_siblings_parent_siblings["objects"].eq(i).css({"color":"white"});
        }
    }
    // Backup and adjust the grandparents' style & class of Video.
    for (var i=0; i<video_parents["objects"].length; i++) {
        if (backup) {
            video_parents["attr"][i] = Object.assign({}, THEATER_DARK_STYLES);
            video_parents["attr"][i]["style"] = video_parents["objects"].eq(i).attr("style");
            video_parents["attr"][i]["class"] = video_parents["objects"].eq(i).attr("class");
        }        
        video_parents["objects"].eq(i).css({"background":"rgba(0,0,0)", "margin":"0px", "padding":"0px", "overflow":"hidden", "outline":"none", 
                                                   "height": isStyleExist(video_parents["objects"].eq(i), "height") ? window_height : "100%", 
                                                   "width": isStyleExist(video_parents["objects"].eq(i), "width") ? window_width : "100%"});
        video_parents["objects"].eq(i).removeClass();   // Bcs some class will effect the css style
    }
    // Backup and adjust the siblings' style of Video.
    if (backup) {
        for (var i=0; i<video_grandparents_siblings["objects"].length; i++) {
            video_grandparents_siblings["attr"][i] = video_grandparents_siblings["objects"].get(i).style.display;
            video_grandparents_siblings["objects"].eq(i).css("display", "none");
        }
    }
}

/**
 * Stop Theater Mode.
 * 1. Restore Video size in the viewport of browser.
 * 2. Restore the parents of Video turn to un-dark and restore some style.
 * 3. Restore the objects which are not dirrectly related with the Video display.
 * @param {Dictionary include jquery object} video - 1.the Videos; 2.original style.
 * @param {Dictionary include jquery object} video_siblings_parent_siblings - 1.the video's sibling and its parent's sibling; 2.original style.
 * @param {Dictionary include jquery object} video_parents - 1.the grandparents of the Video; 2.original style.
 * @param {Dictionary include jquery object} video_grandparents_siblings - 1.the grandparents' sibling of the Video; ; 2.original style.
 */
function StopTheaterMode(video, video_siblings_parent_siblings, video_parents, video_grandparents_siblings){
    // Restore Video size & location.
    if (video["attr"]["style"] === undefined) video["object"].removeAttr("style");
    else video["object"].attr("style", video["attr"]["style"]);
    // Backup and adjust parent and sibling of Video size & location.
    for (var i=0; i<video_siblings_parent_siblings["objects"].length; i++) {
        if (video_siblings_parent_siblings["attr"][i]["style"] === undefined) video_siblings_parent_siblings["objects"].eq(i).removeAttr("style");
        else video_siblings_parent_siblings["objects"].eq(i).attr("style", video_siblings_parent_siblings["attr"][i]["style"]);
    }
    // Restore the grandparents' style of Video.
    for (var i=0; i<video_parents["objects"].length; i++) {
        if (video_parents["attr"][i]["style"] === undefined) video_parents["objects"].eq(i).removeAttr("style");
        else video_parents["objects"].eq(i).attr("style", video_parents["attr"][i]["style"]);
        video_parents["objects"].eq(i).addClass(video_parents["attr"][i]["class"]);
    }
    // Restore the siblings' style of Video.
    for (var i=0; i<video_grandparents_siblings["objects"].length; i++) {
        video_grandparents_siblings["objects"].eq(i).css("display", video_grandparents_siblings["attr"][i]);
    }
    // Restore the scroll position
    window.scrollTo(gScroll["left"], gScroll["top"]);
}
