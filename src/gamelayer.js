/*jslint sloppy: true, plusplus: true */
/*globals Vectr, Player, PlayerBullet, Enemy */

var GameLayer = function (context) {
	Vectr.Layer.apply(this, arguments);
	this.clearColor = 'rgba(0, 0, 0, 0.05)';
	// this.clearColor = '#000';

	var obj,
		i;

	this.player = new Player(160, 160, 'triangle', 25, 'rgb(255, 0, 0)');
	this.add(this.player);

	this.text = new Vectr.Label("Testing", 160, 160, "20px sans-serif", "rgb(0, 0, 255)");
	this.add(this.text);

	this.playerBullets = new Vectr.Collection();
	this.enemies = new Vectr.Collection();

	// Create some bullets
	i = 20;
	while (i--) {
		obj = new PlayerBullet(0, 0, 'square', 1, '#fff');
		this.playerBullets.push(obj);
		this.add(obj);
	}

	// Create some enemies
	i = 20;
	while (i--) {
		obj = new Enemy(0, 0, 'triangle', 25, 'rgb(0, 255, 0)');
		obj.active = false;
		this.enemies.push(obj);
		this.add(obj);
	}
	this.spawnTimer = 0;
};

GameLayer.prototype = new Vectr.Layer();

GameLayer.prototype.update = function (delta) {
	Vectr.Layer.prototype.update.call(this, delta);

	var angle,
		obj,
		i,
		j;

	this.spawnTimer += delta;
	if (this.spawnTimer > 3) {
		this.spawnTimer = 0;

		obj = this.enemies.get();
		obj.position.y = 0;
		obj.position.x = Math.random() * Vectr.WIDTH;
	}

	// Update enemy angle
	i = this.enemies.length;
	while (i--) {
		obj = this.enemies[i];
		if (obj.active === true) {
			angle = Math.atan2(this.player.position.y - obj.position.y, this.player.position.x - obj.position.x);
			obj.rotation = angle * 180 / Math.PI;
			obj.velocity.x = Math.cos(angle);
			obj.velocity.y = Math.sin(angle);
		}
	}

	// Check for bullet collisions, etc.
	i = this.playerBullets.length;
	while (i--) {
		obj = this.playerBullets[i];

		if (obj.active === true) {
			if (obj.position.x > Vectr.WIDTH || obj.position.x < 0 || obj.position.y > Vectr.HEIGHT || obj.position.y < 0) {
				this.playerBullets.remove(i);
				i += 1;
			}

			j = this.enemies.length;
			while (j--) {
				if (this.enemies[j].active === true && this.enemies[j].collidesWith(obj) === true) {
					this.enemies.remove(j);
					this.playerBullets.remove(i);
					i += 1;
					j += 1;
				}
			}
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