/*jslint sloppy: true, browser: true */
/*globals Vectr, Player */

var Player = function (x, y, shape, size, color) {
	Vectr.Sprite.apply(this, arguments);

	this.speed = 100;
	// this.shadow = '0 0 25 rgb(255, 0, 0)';
	this.direction = 1;
	this.solid = true;
};

Player.prototype = new Vectr.Sprite();

Player.prototype.update = function (dt) {
	Vectr.Sprite.prototype.update.call(this, dt);

	this.rotation += 0.01;

	if (this.position.x + this.size / 2 > Vectr.WIDTH) {
		this.position.x = Vectr.WIDTH - this.size / 2;
	}

	if (this.position.x - this.size / 2 < 0) {
		this.position.x = this.size / 2;
	}

	if (this.position.y + this.size / 2 > Vectr.HEIGHT) {
		this.position.y = Vectr.HEIGHT - this.size / 2;
	}

	if (this.position.y - this.size / 2 < 0) {
		this.position.y = this.size / 2;
	}
};