var Arcadia = Arcadia || {};

/**
 * @description Get information about the current environment
 */
Arcadia.ENV = (function () {
    var agent,
        android,
        ios,
        firefox;
        mobile;

    agent = navigator.userAgent.toLowerCase();
    android = !!(agent.match(/android/i) && agent.match(/android/i).length > 0);
    ios = !!(agent.match(/ip(hone|od|ad)/i) && agent.match(/ip(hone|od|ad)/i).length > 0);
    firefox = !!(agent.match(/firefox/i) && agent.match(/firefox/i).length > 0);

    // "mobile" here refers to a touchscreen - this is pretty janky
    mobile = !!(agent.match(/mobile/i) && agent.match(/mobile/i).length > 0) || android;

    return Object.freeze({
        android: android,
        ios: ios,
        firefox: firefox,
        mobile: mobile,
        desktop: !mobile,
        cordova: window.cordova !== undefined
    });
})();

/**
 * @description Change the active scene being displayed
 */
Arcadia.changeScene = function (SceneClass, options) {
    options = options || {};
    Arcadia.instance.activeScene = new SceneClass(options);
};

/**
 * @description Distance method
 */
Arcadia.distance = function (one, two) {
    return Math.sqrt(Math.pow(two.x - one.x, 2) + Math.pow(two.y - one.y, 2));
};

/**
 * @description Random number method
 */
Arcadia.random = function (min, max) {
    throw new Error("Implement a function that gets a random number between #{min} and #{max}!")
};

// Normalize requestAnimationFrame
if (root.requestAnimationFrame === undefined) {
    root.requestAnimationFrame = root.mozRequestAnimationFrame || root.webkitRequestAnimationFrame || root.msRequestAnimationFrame;
}

// Normalize cancelAnimationFrame
if (root.cancelAnimationFrame === undefined) {
    root.cancelAnimationFrame = root.mozCancelAnimationFrame || root.webkitCancelAnimationFrame || root.msCancelAnimationFrame
}

// Normalize window.performance
if (root.performance === undefined) {
    var nowOffset = Date.now();
    root.performance = {
        now: function () {
            return Date.now() - nowOffset;
        }
    };
}

if (typeof module !== 'undefined') {
    module.exports = Arcadia;
}
