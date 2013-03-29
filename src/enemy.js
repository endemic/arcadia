/*jslint sloppy: true, browser: true */
/*globals Vctr */

var Enemy = function (x, y, shape, size, color) {
	Vctr.Sprite.apply(this, arguments);

	this.shadow = '0 0 25 rgb(255, 0, 0)';
};

Enemy.prototype = new Vctr.Sprite();