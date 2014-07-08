/*jslint sloppy: true, plusplus: true */
/*globals Arcadia, Player, PlayerBullet, Enemy, Game */

var Title = function () {
    Arcadia.Scene.apply(this, arguments);

    this.color = 'rgba(0, 0, 0, 0.10)';

    var title = new Arcadia.Label({
        position: {
            x: Arcadia.WIDTH / 2,
            y: Arcadia.HEIGHT / 4
        },
        color: 'rgba(255, 255, 255, 0.8)',
        font: '70px monospace',
        shadow: '0 0 10px #fff',
        text: "ARMADA"
    });
    this.add(title);

    this.button = new Arcadia.Button({
        position: {
            x: Arcadia.WIDTH / 2,
            y: Arcadia.HEIGHT / 2
        },
        border: '5px rgba(255, 255, 255, 0.8)',
        font: '20px monospace',
        shadow: '0 0 10px #fff',
        text: "START"
    });
    this.button.onUp = function () {
        Arcadia.changeScene(Game);
    };
    this.add(this.button);

    // Add a starfield background
    this.stars = new Arcadia.Pool();
    this.stars.factory = function () {
        var star = new Arcadia.Shape({
            position: {
                x: Math.random() * Arcadia.WIDTH,
                y: Math.random() * Arcadia.HEIGHT
            },
            vertices: 4,
            size: Math.random() * 5 + 5,
            color: '#fff',
            angularVelocity: 4 * Math.random() * (Math.random() > 0.5 ? 1 : -1)
        });
        star.velocity.y = 200 / star.size;
        star.update = function (delta) {
            Arcadia.Shape.prototype.update.call(this, delta);   // "super"

            // Reset star position if it goes off the bottom of the screen
            if (this.position.y > Arcadia.HEIGHT) {
                this.position.y = 0;
            }
        };

        return star;
    };
    this.add(this.stars);

    // Create 50 star objects
    while (this.stars.length < 50) {
        this.stars.activate();
    }
};

Title.prototype = new Arcadia.Scene();

Title.prototype.update = function (delta) {
    Arcadia.Scene.prototype.update.call(this, delta);
};
