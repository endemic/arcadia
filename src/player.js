/*jslint sloppy: true, browser: true */
/*globals Vectr, Player */

var Player = function (x, y, shape, size, color) {
	Vectr.Sprite.apply(this, arguments);

	// this.velocity = {
	// 	'x': 75,
	// 	'y': 50
	// };
	this.shadow = '0 0 25 rgb(255, 0, 0)';
	this.direction = 1;
	// this.solid = true;
};

Player.prototype = new Vectr.Sprite();

Player.prototype.update = function (dt) {
	Vectr.Sprite.prototype.update.call(this, dt);
	
	this.rotation += 0.01;
	// this.scale += 0.1 * this.direction;

	// if (this.scale >= 5 || this.scale <= 1) {
	// 	this.direction *= -1;	
	// }

	// console.log(this.velocity);

	if (this.position.x + this.size / 2 > Vectr.WIDTH) {
		this.velocity.x *= -1;
	}

	if (this.position.x - this.size / 2 < 0) {
		this.velocity.x *= -1;
	}

	if (this.position.y + this.size / 2 > Vectr.HEIGHT) {
		this.velocity.y *= -1;
	}

	if (this.position.y - this.size / 2 < 0) {
		this.velocity.y *= -1;
	}
}