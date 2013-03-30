/*jslint sloppy: true, plusplus: true */
/*globals Vectr, Player, PlayerBullet */

var GameLayer = function (context) {
	Vectr.Layer.apply(this, arguments);
	this.clearColor = 'rgba(0, 0, 0, 0.05)';
	// this.clearColor = '#000';

	var b,
		i;

	this.player = new Player(160, 160, 'triangle', 25, 'rgb(255, 0, 0)');
	this.add(this.player);

	this.playerBullets = new Vectr.Collection();

	// Create some bullets
	i = 20;
	while (i--) {
		b = new PlayerBullet(0, 0, 'square', 1, '#fff');
		this.playerBullets.push(b);
		this.add(b);
	}
};

GameLayer.prototype = new Vectr.Layer();

GameLayer.prototype.update = function (delta) {
	Vectr.Layer.prototype.update.call(this, delta);

	var b,
		i;

	i = this.playerBullets.length;
	while (i--) {
		b = this.playerBullets[i];

		if (b.active === true && (b.position.x > Vectr.WIDTH || b.position.x < 0 || b.position.y > Vectr.HEIGHT || b.position.y < 0)) {
			this.playerBullets.remove(i);
			i += 1;
		}
	}
};

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
		b = this.playerBullets.get();

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