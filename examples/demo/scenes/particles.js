/*jslint browser, this */
/*global window, Arcadia */

(function (root) {
    'use strict';

    var ParticleDemoScene = function () {
        Arcadia.Scene.apply(this);

        this.color = 'black';

        // "tap here" to trigger fireworks sort of thing
        this.particlePool = new Arcadia.Pool();
        this.particlePool.factory = function () {
            var particleFactory = function () {
                return new Arcadia.Shape({
                    vertices: 0,
                    color: 'red',
                    border: '2px white'
                });
            };
            var particleCount = 50;
            var emitter = new Arcadia.Emitter(particleFactory, particleCount);
            emitter.scale = 2;
            emitter.fade = true;
            return emitter;
        };
        this.add(this.particlePool);

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

    	var particles = this.particlePool.activate();
    	particles.position = {x: points[0].x, y: points[0].y};
        particles.activate();
    };

    root.ParticleDemoScene = ParticleDemoScene;
}(window));
