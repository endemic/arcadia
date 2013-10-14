/*jslint sloppy: true, browser: true */
/*globals Vectr */

var Enemy = function () {
    Vectr.Shape.apply(this, arguments);

    this.colors = {
        'red': 255,
        'green': 0,
        'blue': 0,
        'alpha': 1
    };

    this.glow = 20;
    this.speed = 40;
    this.size = 20;
    this.shape = 'triangle';
    this.active = false;
    this.bulletTimer = 0;
    this.lineWidth = 3;
};

Enemy.prototype = new Vectr.Shape();