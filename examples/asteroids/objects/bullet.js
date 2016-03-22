/*jslint sloppy: true, browser: true */
/*globals Arcadia: false */

/**
 * @constructor Set up shape, color, etc.
 */
var Bullet = function () {
    Arcadia.Shape.apply(this, arguments);

    this.size = {width: 4, height: 4};
    this.vertices = 0;     // it's a circle!
    this.speed = 200;
    this.MAX_LIFESPAN = 1.5; // in seconds
    this.lifespan = 0;
};

Bullet.prototype = new Arcadia.Shape();

Bullet.prototype.update = function (delta) {
    Arcadia.Shape.prototype.update.call(this, delta);

    this.lifespan += delta;
};

Bullet.prototype.reset = function () {
    this.lifespan = 0;
};
