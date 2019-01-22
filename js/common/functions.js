
/**
 * Get message from _locales
 * @param {String} key 
 */
function getMessage(key) {
    return chrome.i18n.getMessage(key);
}

/**
 * Return if the html element has defined the specified property.
 * @param {Jquery object} object - jquery object which get from "$", array like but one element.
 * @param {*} property - style property which will be check, Ex: height, width,....
 */
function isStyleExist(object, property) {
    if (object[0].style[property] == "") return false;
    else return true;
}

/**
 * Return the value of the html element.
 * @param {Jquery object} object - jquery object which get from "$", array like but one element.
 * @param {*} property - style property which will be check, Ex: height, width,....
 */
function getStyleValue(object, property) {
    return object[0].style[property];
}

/**
 * Restore the object to original style.
 * @param {Jquery object} object - what you want to restore the style.
 * @param {*} style - html style.
 */
function restoreStyle(object, style) {
    if (style === undefined) object.removeAttr("style")
    else object.attr("style", style);
}

/**
 * Stop execute for a while.
 * @param {int} ms - micro-second you want to sleep.
 */
function sleep(ms){
    var start = new Date().getTime();
    var end = start;
    while(end < start + ms) {
      end = new Date().getTime();
   }
 }
 