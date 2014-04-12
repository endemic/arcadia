/*jslint sloppy: true, plusplus: true */
/*globals Arcadia, Player, PlayerBullet, Enemy, Game */

var Title = function () {
    Arcadia.Scene.apply(this, arguments);
    this.clearColor = 'rgba(0, 0, 0, 0.15)';

    var title = new Arcadia.Label(Arcadia.WIDTH / 2, Arcadia.HEIGHT / 4, "ARMADA");
    title.font = '40px monospace';
    title.color = 'rgba(255, 255, 255, 0.8)';
    title.glow = 10;
    this.add(title);

    this.button = new Arcadia.Button(Arcadia.WIDTH / 2, Arcadia.HEIGHT / 2, "START"); // x, y, text
    this.button.font = '20px monospace';
    this.button.solid = false;
    this.button.padding = 20;
    this.button.glow = 20;
    this.button.onUp = function () {
        Arcadia.changeScene(Game);
    };
    this.add(this.button);

    // Add a starfield background
    this.stars = new Arcadia.Pool();
    this.stars.factory = function () {
        var star = new Arcadia.Shape(Math.random() * Arcadia.WIDTH, Math.random() * Arcadia.HEIGHT, 'circle', Math.random() * 4 + 1);
        star.solid = true;
        star.velocity.y = 40 / star.size;
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
