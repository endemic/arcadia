/*jslint sloppy: true, browser: true */
/*globals Arcadia: false */

var PlayerBullet = function () {
    Arcadia.Shape.apply(this, arguments);

    this.vertices = 3;
    this.size = {width: 7, height: 7};
    this.speed = 150;
    this.velocity.y = -1;
    this.angularVelocity = Arcadia.randomSign() * 4;
};

PlayerBullet.prototype = new Arcadia.Shape();
