/*jslint sloppy: true, browser: true */
/*globals Vectr */

var Enemy = function (x, y, shape, size, color) {
	Vectr.Sprite.apply(this, arguments);

	this.shadow = '0 0 25 rgb(255, 0, 0)';
};

Enemy.prototype = new Vectr.Sprite();