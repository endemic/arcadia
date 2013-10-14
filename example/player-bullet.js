/*jslint sloppy: true, browser: true */
/*globals Vectr, Player */

var PlayerBullet = function () {
    Vectr.Shape.apply(this, arguments);

    this.shape = 'square';
    this.size = 2;
    this.colors = {
        'red': 255,
        'blue': 255,
        'green': 255,
        'alpha': 1
    };
    this.lineWidth = 3;
    this.speed = 150;
    this.velocity.y = -1;
    this.active = false;
};

PlayerBullet.prototype = new Vectr.Shape();