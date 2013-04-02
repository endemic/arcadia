/*jslint sloppy: true, browser: true */
/*globals Vectr, Player */

var PlayerBullet = function () {
	Vectr.Sprite.apply(this, arguments);

	this.shape = 'square';
	this.size = 2;
	this.color = {
		'red': 255,
		'blue': 255,
		'green': 255,
		'alpha': 1
	};

	this.speed = 300;
	this.velocity.y = -1;
	this.active = false;
};

PlayerBullet.prototype = new Vectr.Sprite();

PlayerBullet.prototype.update = function (delta) {
	Vectr.Sprite.prototype.update.call(this, delta);
};