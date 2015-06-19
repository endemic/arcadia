/*jslint sloppy: true, browser: true */
/*globals Arcadia */

var Asteroid = function () {
    Arcadia.Shape.apply(this, arguments);

    this.vertices = 5;
    this.speed = 2;
    this.size = { width: 100, height: 100 };
    this.color = null;
    this.border = '2px #fff';
    this.shadow = '0 0 10px #fff';
};

Asteroid.prototype = new Arcadia.Shape();

Asteroid.prototype.init = function (vertices) {
    var diff = this.vertices - vertices;

    this.vertices = vertices;
    this.speed += diff;
    this.size = {
        width: this.size.width - 20 * diff,
        height: this.size.height - 20 * diff
    };
};

Asteroid.prototype.reset = function () {
    this.vertices = 4;
    this.speed = 2;
    this.size = { width: 100, height: 100 };
};
