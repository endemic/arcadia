/*jslint sloppy: true, browser: true */
/*globals Vectr */

var Enemy = function (x, y, shape, size, color) {
	Vectr.Sprite.apply(this, arguments);

	this.color = {
		'red': 255,
		'green': 0,
		'blue': 0,
		'alpha': 1
	};

	this.shadow = {
		'x': 0,
		'y': 0,
		'blur': 25,
		'color': {
			'red': 255,
			'green': 0,
			'blue': 0,
			'alpha': 1
		}
	};
	this.speed = 40;
	this.size = 20;
	this.shape = 'triangle';
	this.active = false;
	this.bulletTimer = 0;
};

Enemy.prototype = new Vectr.Sprite();