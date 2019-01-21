
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
 * @param {*} style - style property which will be check, Ex: height, width,....
 */
function isStyleExist(object, property) {
    if (object[0].style[property] == "") return false;
    else return true;
}

/**
 * Return the value of the html element.
 * @param {Jquery object} object - jquery object which get from "$", array like but one element.
 * @param {*} style - style property which will be check, Ex: height, width,....
 */
function getStyleValue(object, property) {
    return object[0].style[property];
}