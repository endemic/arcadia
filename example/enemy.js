/*jslint sloppy: true, browser: true */
/*globals Arcadia */

var Enemy = function () {
    Arcadia.Shape.apply(this, arguments);

    this.vertices = 3;
    this.width = this.height = this.size = 20;
    this.color = '#f00';
    this.shadow = '0 0 10px ' + this.color;

    this.speed = 40;
    this.bulletTimer = 0;
};

Enemy.prototype = new Arcadia.Shape();
