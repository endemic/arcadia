/*jslint browser, this */
/*global window, Arcadia */

(function (root) {
    'use strict';

    var CameraDemoScene = function () {
        Arcadia.Scene.apply(this);

        this.size = {width: 1000, height: 1000};
        this.color = 'black';

        // Draw a border around the scene
        var border = new Arcadia.Shape({
            size: this.size,
            border: '10px lime',
            color: null
        });
        this.add(border);

        var scene = this;
        var balls = [];

        // Create a few bouncing ball objects
        ['red', 'green', 'blue', 'cyan', 'yellow', 'magenta'].forEach(function (color) {
            var ball = new Arcadia.Shape({
                vertices: 0,
                size: {width: 15, height: 15},
                color: color,
                position: {
                    x: Arcadia.random(-scene.size.width / 2, scene.size.width / 2),
                    y: Arcadia.random(-scene.size.height / 2, scene.size.height / 2)
                },
                velocity: {
                    x: Arcadia.random(4, 10),
                    y: Arcadia.random(4, 10)
                },
                speed: 10
            });
            ball.update = function (delta) {
                Arcadia.Shape.prototype.update.call(this, delta);

                if (this.position.x > scene.size.width / 2) {
                    this.velocity.x *= -1;
                }

                if (this.position.x < -scene.size.width / 2) {
                    this.velocity.x *= -1;
                }

                if (this.position.y > scene.size.height / 2) {
                    this.velocity.y *= -1;
                }

                if (this.position.y < -scene.size.height / 2) {
                    this.velocity.y *= -1;
                }
            };
            balls.push(ball);
            scene.add(ball);
        });

        // Switch targets every few seconds
        var currentTargetIndex = 0;
        this.target = balls[currentTargetIndex];

        setInterval(function () {
            currentTargetIndex += 1;
            if (currentTargetIndex === balls.length) {
                currentTargetIndex = 0;
            }

            scene.target = balls[currentTargetIndex];
            console.info('Switching to target ' + currentTargetIndex);
        }, 5000);
    };

    CameraDemoScene.prototype = new Arcadia.Scene();

    root.CameraDemoScene = CameraDemoScene;
}(window));
