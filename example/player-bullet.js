/*jslint sloppy: true, browser: true */
/*globals Arcadia: false */

var PlayerBullet = function () {
    Arcadia.Shape.apply(this, arguments);

    this.shape = 'square';
    this.size = 2;
    this.lineWidth = 3;
    this.speed = 150;
    this.velocity.y = -1;
    // this.active = false;
};

PlayerBullet.prototype = new Arcadia.Shape();
