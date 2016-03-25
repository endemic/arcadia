/*jslint browser, this */
/*global window, Arcadia */

(function (root) {
    'use strict';

    var CameraDemoScene = function () {
        Arcadia.Scene.apply(this);

        this.size = {width: 1000, height: 1000};
        this.color = 'black';

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

        this.backButton = new Arcadia.Button({
            text: '← main menu',
            font: '20px sans-serif',
            color: 'blue',
            border: '2px white',
            position: {x: -this.size.width / 2 + 40, y: -this.size.height / 2 + 15},
            action: function () {
                Arcadia.changeScene(MenuScene);
            }
        });
        this.add(this.backButton);

        // Draw a border around the scene
        var border = new Arcadia.Shape({
            size: this.size,
            border: '10px lime',
            color: null
        });
        this.add(border);

        // draw a grid to emphasize movement
        for (var i = -this.size.width / 2; i < this.size.width / 2; i += 100) {
            // vertical
            this.add(new Arcadia.Shape({
                vertices: 2,
                position: {x: i, y: 0},
                size: {width: 1, height: this.size.height},
                border: '2px white'
            }));

            // horizontal
            this.add(new Arcadia.Shape({
                vertices: 2,
                position: {x: 0, y: i},
                size: {width: this.size.width, height: 1},
                border: '2px white'
            }));
        }
    };

    CameraDemoScene.prototype = new Arcadia.Scene();

    CameraDemoScene.prototype.update = function (delta) {
        Arcadia.Scene.prototype.update.call(this, delta);

        // To keep the UI "static", its position needs to be updated based
        // on the scene's camera
        this.backButton.position = {
            x: this.camera.position.x - 110,
            y: this.camera.position.y - 310
        }
    };

    root.CameraDemoScene = CameraDemoScene;
}(window));
