/*jslint sloppy: true, browser: true */
/*globals Arcadia: false */

/**
 * @constructor Set up shape, color, etc.
 */
var Bullet = function () {
    Arcadia.Shape.apply(this, arguments);

    this.size = { width: 4, height: 4 };
    this.vertices = 0;     // it's a circle!
    this.speed = 200;
    this.MAX_LIFESPAN = 1.5; // in seconds
    this.lifespan = 0;
};

Bullet.prototype = new Arcadia.Shape();

Bullet.prototype.update = function (delta) {
    Arcadia.Shape.prototype.update.call(this, delta);

    this.lifespan += delta;
    console.log(this.lifespan);

    // Automatically wrap around the screen
    if (this.position.x + this.size.width / 2 > Arcadia.WIDTH) {
        this.position.x = this.size.width / 2;
    }

    if (this.position.x - this.size.width / 2 < 0) {
        this.position.x = Arcadia.WIDTH - this.size.width / 2;
    }

    if (this.position.y + this.size.height / 2 > Arcadia.HEIGHT) {
        this.position.y = this.size.height / 2;
    }

    if (this.position.y - this.size.height / 2 < 0) {
        this.position.y = Arcadia.HEIGHT - this.size.height / 2;
    }
};

Bullet.prototype.reset = function () {
    this.lifespan = 0;
};
