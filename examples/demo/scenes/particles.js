/*jslint browser, this */
/*global window, Arcadia */

(function (root) {
    'use strict';

    var ParticleDemoScene = function () {
        Arcadia.Scene.apply(this);

        // "tap here" to trigger fireworks sort of thing

        var backButton = new Arcadia.Button({
            text: '← main menu',
            font: '20px sans-serif',
            color: 'blue',
            border: '2px white',
            position: {x: -this.size.width / 2 + 75, y: -this.size.height / 2 + 25},
            zIndex: -1,
            action: function () {
                Arcadia.changeScene(MenuScene);
            }
        });
        this.add(backButton);
    };

    ParticleDemoScene.prototype = new Arcadia.Scene();

    ParticleDemoScene.prototype.onPointEnd = function (points) {
    	Arcadia.Scene.prototype.onPointEnd.call(this, points);

    	var particles = this.particleFactory.activate();
    	particles.startAt(points[0].x, points[0].y);
    };

    root.ParticleDemoScene = ParticleDemoScene;
}(window));
