/*jslint sloppy: true */
/*globals Vctr, Player, PlayerBullet */

var GameLayer = function (context) {
	Vctr.Layer.apply(this, arguments);

	var b;

	this.player = new Player(160, 160, 'triangle', 25, 'rgb(255, 0, 0)');
	this.player.speed = 50;

	this.add(this.player);

	this.clearColor = 'rgba(0, 0, 0, 0.05)';
	// this.clearColor = '#000';

	// Create some bullets
	this.bullets = [];
	this.bulletIndex = 0;
	while (this.bullets.length < 20) {
		b = new PlayerBullet(0, 0, 'square', 1, '#fff');
		this.bullets.push(b);
		this.add(b);
	}
};

GameLayer.prototype = new Vctr.Layer();

GameLayer.prototype.addPlayerBullet = function (b) {
	if (this.activePlayerBullets > this.maxPlayerBullets) {
		return;
	}

	this.playerBullets[this.activePlayerBullets] = b;
	this.activePlayerBullets += 1;
};

GameLayer.prototype.removePlayerBullet = function (index) {
	this.playerBullets[index] = this.playerBullets[this.activePlayerBullets - 1];
	this.activePlayerBullets -= 1;
};

GameLayer.prototype.onPointMove = function (points) {
	this.player.position = points[0];
};

GameLayer.prototype.onKeyDown = function (input) {
	if (input.space) {
		this.bullets[this.bulletIndex].position.x = this.player.position.x;
		this.bullets[this.bulletIndex].position.y = this.player.position.y;
		this.bullets[this.bulletIndex].active = true;
		this.bulletIndex += 1;

		if (this.bulletIndex === this.bullets.length) {
			this.bulletIndex = 0;
		}
	}

	if (input.left) {
		this.player.velocity.x -= 1;
	}

	if (input.right) {
		this.player.velocity.x += 1;
	}

	if (input.up) {
		this.player.velocity.y -= 1;
	}

	if (input.down) {
		this.player.velocity.y += 1;
	}
};

GameLayer.prototype.onKeyUp = function (input) {
	if (input.left) {
		this.player.velocity.x += 1;
	}

	if (input.right) {
		this.player.velocity.x -= 1;
	}

	if (input.up) {
		this.player.velocity.y += 1;
	}

	if (input.down) {
		this.player.velocity.y -= 1;
	}
};