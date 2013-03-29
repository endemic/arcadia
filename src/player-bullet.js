/*jslint sloppy: true, browser: true */
/*globals Vctr, Player */

var PlayerBullet = function (x, y, shape, size, color) {
	Vctr.Sprite.apply(this, arguments);
	this.speed = 100;
	this.velocity.y = -1;
	this.active = false;
};

PlayerBullet.prototype = new Vctr.Sprite();