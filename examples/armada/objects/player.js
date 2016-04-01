/*jslint sloppy: true, browser: true */
/*globals Arcadia: false */

var Player = function () {
    Arcadia.Shape.apply(this, arguments);

    this.speed = 100;
    this.vertices = 3;
    this.size = {width: 20, height: 20};
    this.shadow = '0 0 10px ' + this.color;
};

Player.prototype = new Arcadia.Shape();
