/*jslint sloppy: true, browser: true */
/*globals Vectr: false */

var PlayerBullet = function () {
    Vectr.Shape.apply(this, arguments);

    this.shape = 'square';
    this.size = 2;
    this.lineWidth = 3;
    this.speed = 150;
    this.velocity.y = -1;
    this.active = false;
};

PlayerBullet.prototype = new Vectr.Shape();
