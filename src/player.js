/*jslint sloppy: true, browser: true */
/*globals Vectr, Player */

var Player = function (x, y) {
	Vectr.Sprite.apply(this, arguments);

	this.speed = 100;
	this.shape = 'triangle';
	this.size = 20;
	this.shadow = {
		'x': 0,
		'y': 0,
		'blur': 25,
		'color': {
			'red': 255,
			'green': 255,
			'blue': 255,
			'alpha': 1
		}
	};
	this.rotation = 270;
};

Player.prototype = new Vectr.Sprite();

Player.prototype.customPath = function (context) {
	context.beginPath();
	context.moveTo(this.size / 2 * Math.cos(0), this.size / 2 * Math.sin(0));
	context.lineTo(this.size / 2 * Math.cos(120 * Math.PI / 180), this.size / 2 * Math.sin(120 * Math.PI / 180));
	context.lineTo(-this.size / 10, 0);
	context.lineTo(this.size / 2 * Math.cos(240 * Math.PI / 180), this.size / 2 * Math.sin(240 * Math.PI / 180));
	context.lineTo(this.size / 2 * Math.cos(0), this.size / 2 * Math.sin(0));
	context.closePath();

	context.strokeStyle = 'rgba(' + this.color.red + ', ' + this.color.green + ', ' + this.color.blue + ', ' + this.color.alpha + ')';
	context.stroke();
}

Player.prototype.update = function (dt) {
	Vectr.Sprite.prototype.update.call(this, dt);

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