/*jslint sloppy: true, browser: true */
/*globals Arcadia */

var Enemy = function () {
    Arcadia.Shape.apply(this, arguments);

    this.size = 20;
    this.vertices = 3;
    this.color = 'rgba(255, 0, 0, 1)';
    this.shadow = '0 0 20px ' + this.color;
    this.speed = 40;
    
    this.bulletTimer = 0;
};

Enemy.prototype = new Arcadia.Shape();