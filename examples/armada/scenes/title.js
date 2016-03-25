/*jslint sloppy: true, plusplus: true */
/*globals Arcadia, Player, PlayerBullet, Enemy, Game */

var TitleScene = function () {
    Arcadia.Scene.apply(this, arguments);

    var self = this;

    this.color = 'rgba(0, 0, 0, 0.15)';

    // Add a starfield background
    this.stars = new Arcadia.Pool();
    this.stars.factory = function () {
        var star = new Arcadia.Shape({
            position: {
                x: Arcadia.random(-self.size.width / 2, self.size.width / 2),
                y: Arcadia.random(-self.size.height / 2, self.size.height / 2)
            },
            vertices: 3,
            size: {
                width: Arcadia.random(1, 3),
                height: Arcadia.random(1, 3)
            },
            angularVelocity: Arcadia.random(1, 4) * Arcadia.randomSign()
        });

        star.velocity.y = 100 / star.size.width * star.size.height;
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

    this.button = new Arcadia.Button({
        position: {x: 0, y: 150},
        border: '1px #fff',
        shadow: '0 0 20px #fff',
        color: 'red',
        padding: 15,
        text: 'START',
        font: '20px monospace',
        action: function () {
            Arcadia.changeScene(GameScene);
        }
    });
    this.add(this.button);
};

TitleScene.prototype = new Arcadia.Scene();
