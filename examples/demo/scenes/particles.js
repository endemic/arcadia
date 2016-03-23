/*jslint browser, this */
/*global window, Arcadia */

(function (root) {
    'use strict';

    var ParticleDemoScene = function () {
        Arcadia.Scene.apply(this);
    };

    ParticleDemoScene.prototype = new Arcadia.Scene();

    root.ParticleDemoScene = ParticleDemoScene;
}(window));
