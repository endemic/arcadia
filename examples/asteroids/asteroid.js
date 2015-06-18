/*jslint sloppy: true, browser: true */
/*globals Arcadia */

var Asteroid = function () {
    Arcadia.Shape.apply(this, arguments);

    this.vertices = 5;
    this.size = { width: 20, height: 20 };
    this.color = '#fff';
    this.shadow = '0 0 10px ' + this.color;

    this.speed = 40;
};

Asteroid.prototype = new Arcadia.Shape();
