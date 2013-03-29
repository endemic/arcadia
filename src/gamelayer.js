/*jslint sloppy: true */
/*globals Vectr, Player, PlayerBullet */

var GameLayer = function (context) {
	Vectr.Layer.apply(this, arguments);
	this.clearColor = 'rgba(0, 0, 0, 0.05)';
	// this.clearColor = '#000';

	var b;

	this.player = new Player(160, 160, 'triangle', 25, 'rgb(255, 0, 0)');
	this.player.speed = 50;

	this.add(this.player);

	// Create some bullets
	this.playerBullets = [];
	this.playerBulletIndex = 0;
	while (this.playerBullets.length < 20) {
		b = new PlayerBullet(0, 0, 'square', 1, '#fff');
		this.playerBullets.push(b);
		this.add(b);
	}
};

GameLayer.prototype = new Vectr.Layer();

// Potential particle management:
// Set all bullets to "inactive"
// Index pointer is at 0
// To add a bullet, set bullet at index pointer to active. If index pointer == bullets.length - 1 then return
// To remove a bullet, splice out the bullet at a particular index and push it back on to the end of the array, then decrement the index pointer

GameLayer.prototype.getPlayerBullet = function () {
	if (this.playerBulletIndex === this.playerBullets.length - 1) {
		return null;
	}

	var b = this.playerBullets[this.playerBulletIndex];
	b.active = true;
	this.playerBulletIndex += 1;
	return b;
};

GameLayer.prototype.removePlayerBullet = function (index) {
	this.playerBullets[index].active = false;
	this.playerBullets.push(this.playerBullets.splice(index, 1));
	this.playerBulletIndex -= 1;
};

// GameLayer.prototype.update

/**
 * @description Mouse/touch movement
 */
GameLayer.prototype.onPointMove = function (points) {
	this.player.position = points[0];
};

/**
 * @description Handle keyboard input
 */
GameLayer.prototype.onKeyDown = function (input) {
	var b;

	if (input.z) {
		b = this.getPlayerBullet();

		if (b !== null) {
			b.position.x = this.player.position.x;
			b.position.y = this.player.position.y;
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

/**
 * @description Handle keyboard input
 */
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