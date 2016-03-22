/*jslint sloppy: true, plusplus: true */
/*globals Arcadia, Player, PlayerBullet, Enemy, Game */

var TitleScene = function () {
    Arcadia.Scene.apply(this, arguments);

    this.size = {width: 320, height: 568};

    var self = this;

    // this.color = 'rgba(0, 0, 0, 0.10)';
    this.color = '#000';

    // Add a starfield background
    this.stars = new Arcadia.Pool();

    this.stars.factory = function () {
        var star = new Arcadia.Shape({
            position: {
                x: Math.random() * self.size.width - self.size.width / 2,
                y: Math.random() * self.size.height - self.size.height / 2
            },
            size: {
                width: Math.random() * 5 + 5,
                height: Math.random() * 5 + 5
            },
            angularVelocity: 4 * Math.random() * (Math.random() > 0.5 ? 1 : -1)
        });
        star.velocity.y = 200 / star.size.width;
        star.update = function (delta) {
            Arcadia.Shape.prototype.update.call(this, delta);   // "super"

            // Reset star position if it goes off the bottom of the screen
            if (this.position.y > self.size.height / 2) {
                this.position.y = -self.size.height / 2;
            }
        };

        return star;
    };
    this.add(this.stars);

    // Create 50 star objects
    while (this.stars.length < 50) {
        this.stars.activate();
    }

    this.shape = new Arcadia.Shape({
        color: '#f00',
        size: { width: 100, height: 100 },
        angularVelocity: 1,
        border: '2px white'
    });
    this.add(this.shape);

    this.shape.add(new Arcadia.Shape({
        size: { width: 25, height: 25 },
        position: { x: 0, y: -60 }
    }));

    var title = new Arcadia.Label({
        position: {
            x: 0,
            y: -100
        },
        color: 'rgba(255, 255, 255, 0.8)',
        font: '70px monospace',
        shadow: '0 0 10px #fff',
        text: "ARMADA"
    });
    this.add(title);

    this.label = new Arcadia.Label({
        color: '#f0f',
        font: '40px serif',
        text: 'hello world!',
        border: '1px yellow',
        shadow: '0 10px 5px #0ff'
    });
    this.add(this.label);

    this.button = new Arcadia.Button({
        position: {x: 0, y: 150},
        border: '1px #fff',
        shadow: '0 0 20px #fff',
        color: 'red',
        padding: 15,
        label: new Arcadia.Label({
            color: '#fff',
            text: 'START',
            font: '20px monospace',
            shadow: '0 0 10px #fff'
        }),
        action: function () {
            Arcadia.changeScene(GameScene);
        }
    });
    this.add(this.button);
};

TitleScene.prototype = new Arcadia.Scene();

TitleScene.prototype.update = function (delta) {
    Arcadia.Scene.prototype.update.call(this, delta);

    this.label.text = 'FPS: ' + Math.round(this.parent.fps);
};

TitleScene.prototype.onPointStart = function (points) {
    Arcadia.Scene.prototype.onPointStart.call(this, points);

    this.shape.position.x = points[0].x;
    this.shape.position.y = points[0].y;
};

TitleScene.prototype.onPointMove = function (points) {
    Arcadia.Scene.prototype.onPointMove.call(this, points);

    this.shape.position.x = points[0].x;
    this.shape.position.y = points[0].y;
};

TitleScene.prototype.onPointEnd = function (points) {
    Arcadia.Scene.prototype.onPointEnd.call(this, points);

    if (this.shape.scale >= 2) {
        this.shape.tween('scale', 1, 1000, 'elasticInOut');
    } else {
        this.shape.tween('scale', 2, 1000, 'elasticInOut');
    }
};