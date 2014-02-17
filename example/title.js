/*jslint sloppy: true, plusplus: true */
/*globals Arcadia, Player, PlayerBullet, Enemy, Game */

var Title = function () {
    Arcadia.Scene.apply(this, arguments);

    var i,
        star,
        title;

    this.clearColor = 'rgba(0, 0, 0, 0.15)';

    title = new Arcadia.Label(Arcadia.WIDTH / 2, Arcadia.HEIGHT / 4, "ARMADA");
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
    this.add(this.stars);

    i = 50;
    while (i--) {
        star = new Arcadia.Shape(Math.random() * Arcadia.WIDTH, Math.random() * Arcadia.HEIGHT, 'circle', Math.random() * 4 + 1);
        star.solid = true;
        star.velocity.y = 40 / star.size;
        this.stars.add(star);
    }
};

Title.prototype = new Arcadia.Scene();

Title.prototype.update = function (delta) {
    Arcadia.Scene.prototype.update.call(this, delta);

    var i,
        star;

    // Reset star positions
    i = this.stars.length;
    while (i--) {
        star = this.stars.at(i);
        if (star.position.y > Arcadia.HEIGHT) {
            star.position.y = 0;
        }
    }
};
