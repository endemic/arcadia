/*jslint browser, this */
/*global window, Arcadia */

(function (root) {
    'use strict';

    var LabelDemoScene = function () {
        Arcadia.Scene.apply(this);
    };

    LabelDemoScene.prototype = new Arcadia.Scene();

    root.LabelDemoScene = LabelDemoScene;
}(window));
