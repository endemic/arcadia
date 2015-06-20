/*jslint sloppy: true, plusplus: true */
/*globals Arcadia */

var AsteroidsTitleScene = function () {
    Arcadia.Scene.apply(this, arguments);
    
    this.color = '#000';

    var title = new Arcadia.Label({
        position: {
            x: Arcadia.WIDTH / 2,
            y: Arcadia.HEIGHT / 4
        },
        color: '#fff',
        font: '70px monospace',
        shadow: '0 0 20px #fff',
        text: "'Roids"
    });
    this.add(title);

    this.button = new Arcadia.Button({
        position: {
            x: Arcadia.WIDTH / 2,
            y: Arcadia.HEIGHT - 100
        },
        color: '#000',
        border: '2px #fff',
        padding: 15,
        text: 'START',
        font: '20px monospace',
        action: function () {
            Arcadia.changeScene(AsteroidsGameScene);
        }
    });
    this.add(this.button);
};

AsteroidsTitleScene.prototype = new Arcadia.Scene();
