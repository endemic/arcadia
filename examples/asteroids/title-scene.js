/*jslint sloppy: true, plusplus: true */
/*globals Arcadia */

var AsteroidsTitleScene = function () {
    Arcadia.Scene.apply(this, arguments);
    // Background color
    this.color = '#000';

    this.size = {width: 640, height: 480};

    // Basic text label
    var title = new Arcadia.Label({
        position: {
            x: 0,
            y: -this.size.height / 2 + 100
        },
        font: '70px monospace',
        shadow: '0 0 20px #fff',
        text: "'Roids"
    });
    this.add(title);

    // "Start game" button
    var button = new Arcadia.Button({
        position: {x: 0, y: this.size.height / 2 - 100},
        color: '#000',
        border: '2px #fff',
        padding: 15,
        text: 'START',
        font: '20px monospace',
        action: function () {
            Arcadia.changeScene(AsteroidsGameScene);
        }
    });
    this.add(button);
};

AsteroidsTitleScene.prototype = new Arcadia.Scene();
