var Bullet = function (x, y, shape, size, color) {
	Vctr.Sprite.apply(this, arguments);
};

Bullet.prototype = new Vctr.Sprite();