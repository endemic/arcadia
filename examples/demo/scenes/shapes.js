/*jslint browser, this */
/*global window, Arcadia */

(function (root) {
    'use strict';

    var ShapeDemoScene = function () {
        Arcadia.Scene.apply(this);
    };

    ShapeDemoScene.prototype = new Arcadia.Scene();

    root.ShapeDemoScene = ShapeDemoScene;
}(window));
