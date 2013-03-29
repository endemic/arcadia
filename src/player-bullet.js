/*jslint sloppy: true, browser: true */
/*globals Vectr, Player */

var PlayerBullet = function (x, y, shape, size, color) {
	Vectr.Sprite.apply(this, arguments);
	this.speed = 300;
	this.velocity.y = -1;
	this.active = false;
};

PlayerBullet.prototype = new Vectr.Sprite();