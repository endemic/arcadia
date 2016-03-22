/*jslint browser */
/*global window */

(function (root) {
    'use strict';

    var Arcadia = root.Arcadia || {};

    /**
     * @description Get information about the current environment
     */
    Arcadia.ENV = (function () {
        var agent = navigator.userAgent.toLowerCase();
        var android = !!(agent.match(/android/i) && agent.match(/android/i).length > 0);
        var ios = !!(agent.match(/ip(hone|od|ad)/i) && agent.match(/ip(hone|od|ad)/i).length > 0);
        var firefox = !!(agent.match(/firefox/i) && agent.match(/firefox/i).length > 0);

        // "mobile" here refers to a touchscreen - this is pretty janky
        var mobile = !!(agent.match(/mobile/i) && agent.match(/mobile/i).length > 0) || android;

        return Object.freeze({
            android: android,
            ios: ios,
            firefox: firefox,
            mobile: mobile,
            desktop: !mobile,
            cordova: window.cordova !== undefined
        });
    }());

    /**
     * @description Change the active scene being displayed
     */
    Arcadia.changeScene = function (SceneClass, options) {
        options = options || {};
        options.parent = Arcadia.instance;
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
        var diff = max - min;
        return Math.random() * diff + min;
    };

    /**
     * @description Random sign value; returns 1 or -1
     */
    Arcadia.randomSign = function () {
        return Math.random() < 0.5 ? 1 : -1;
    };

    // Normalize requestAnimationFrame
    if (!root.requestAnimationFrame) {
        root.requestAnimationFrame = root.mozRequestAnimationFrame || root.webkitRequestAnimationFrame || root.msRequestAnimationFrame;
    }

    // Normalize cancelAnimationFrame
    if (!root.cancelAnimationFrame) {
        root.cancelAnimationFrame = root.mozCancelAnimationFrame || root.webkitCancelAnimationFrame || root.msCancelAnimationFrame;
    }

    // Normalize window.performance
    if (!root.performance) {
        var nowOffset = Date.now();
        root.performance = {
            now: function () {
                return Date.now() - nowOffset;
            }
        };
    }

    root.Arcadia = Arcadia;

    if (root.module) {
        root.module.exports = Arcadia;
    }
}(window));
