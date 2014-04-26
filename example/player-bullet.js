/*jslint sloppy: true, browser: true */
/*globals Arcadia: false */

var PlayerBullet = function () {
    Arcadia.Shape.apply(this, arguments);

    this.vertices = 0;
    this.size = 3;
    this.lineWidth = 3;
    this.speed = 150;
    this.velocity.y = -1;
};

PlayerBullet.prototype = new Arcadia.Shape();
