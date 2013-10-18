/*jslint sloppy: true, plusplus: true */
/*globals Vectr, Player, PlayerBullet, Enemy, Game */

var Title = function () {
    Vectr.Scene.apply(this, arguments);

    var i,
        star,
        title;

    this.clearColor = 'rgba(0, 0, 0, 0.15)';

    title = new Vectr.Label(Vectr.WIDTH / 2, Vectr.HEIGHT / 4, "ARMADA");
    title.font = '40px monospace';
    title.color = 'rgba(255, 255, 255, 0.8)';
    title.glow = 10;
    this.add(title);

    this.button = new Vectr.Button(Vectr.WIDTH / 2, Vectr.HEIGHT / 2, "START"); // x, y, text
    this.button.font = '20px monospace';
    this.button.solid = false;
    this.button.padding = 20;
    this.button.glow = 20;
    this.button.onUp = function () {
        Vectr.changeScene(Game);
    };
    this.add(this.button);

    // Add a starfield background
    this.stars = new Vectr.Pool();
    this.add(this.stars);

    i = 50;
    while (i--) {
        star = new Vectr.Shape(Math.random() * Vectr.WIDTH, Math.random() * Vectr.HEIGHT, 'circle', Math.random() + 0.5);
        star.color = 'rgba(255, 255, 255, 1)';
        star.solid = true;
        star.velocity.y = 40 / star.size;
        this.stars.add(star);
    }
};

Title.prototype = new Vectr.Scene();

Title.prototype.update = function (delta) {
    Vectr.Scene.prototype.update.call(this, delta);

    var i,
        star;

    // Reset star positions
    i = this.stars.length;
    while (i--) {
        star = this.stars.at(i);
        if (star.position.y > Vectr.HEIGHT) {
            star.position.y = 0;
        }
    }
};
