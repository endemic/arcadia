/*jslint sloppy: true, browser: true */
/*globals Vectr */

var EnemyBullet = function () {
	Vectr.Sprite.apply(this, arguments);

	this.shape = 'circle';
	this.size = 4;
	this.color = {
		'red': 0,
		'blue': 0,
		'green': 255,
		'alpha': 1
	};
	this.speed = 150;
	this.active = false;
};

EnemyBullet.prototype = new Vectr.Sprite();