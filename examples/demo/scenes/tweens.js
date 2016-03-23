/*jslint browser, this */
/*global window, Arcadia */

(function (root) {
    'use strict';

    var TweenDemoScene = function () {
        Arcadia.Scene.apply(this);
    };

    TweenDemoScene.prototype = new Arcadia.Scene();

    root.TweenDemoScene = TweenDemoScene;
}(window));
