/*jslint sloppy: true, plusplus: true */
/*globals Vectr, Player, PlayerBullet, Enemy */

var Game = function (context) {
	Vectr.Layer.apply(this, arguments);
	this.clearColor = 'rgba(0, 0, 0, 0.05)';
	// this.clearColor = '#000';

	var obj,
		i;

	// Player
	this.player = new Player(Vectr.WIDTH / 2, Vectr.HEIGHT / 1.5);
	this.add(this.player);

	// Score label
	this.label = new Vectr.Label("Score: 0", 0, 20, "16px sans-serif", "rgba(255, 255, 255, 0.8)");
	this.add(this.label);
	this.score = 0;

	// Other game objects
	this.playerBullets = new Vectr.Collection();
	this.add(this.playerBullets);
	this.enemies = new Vectr.Collection();
	this.add(this.enemies);

	// Create some bullets
	i = 20;
	while (i--) {
		this.playerBullets.add(new PlayerBullet());
	}

	// Create some enemies
	i = 20;
	while (i--) {
		this.enemies.add(new Enemy());
	}
	this.spawnTimer = 2;	// Immediately spawn an enemy

	// Particle emitter
	this.particles = new Vectr.Emitter(30, 'triangle', 5, 'rgba(0, 255, 0, 0.9)');
	this.add(this.particles);
};

Game.prototype = new Vectr.Layer();

Game.prototype.update = function (delta) {
	Vectr.Layer.prototype.update.call(this, delta);

	var angle,
		bullet,
		enemy,
		obj,
		i,
		j;

	this.spawnTimer += delta;
	if (this.spawnTimer > 2) {
		this.spawnTimer = 0;

		enemy = this.enemies.activate();
		if (enemy !== null) {
			enemy.position.y = 0;
			enemy.position.x = Math.random() * Vectr.WIDTH;
		}
	}

	// Update enemy angle
	i = this.enemies.children.length;
	while (i--) {
		enemy = this.enemies.at(i);
		if (enemy.active === true) {
			angle = Math.atan2(this.player.position.y - enemy.position.y, this.player.position.x - enemy.position.x);
			enemy.rotation = angle * 180 / Math.PI;
			enemy.velocity.x = Math.cos(angle);
			enemy.velocity.y = Math.sin(angle);
		}
	}

	// Check for bullet collisions, etc.
	i = this.playerBullets.children.length;
	while (i--) {
		bullet = this.playerBullets.at(i);

		if (bullet.active === true) {
			// Remove bullets if they go offscreen
			if (bullet.position.x > Vectr.WIDTH || bullet.position.x < 0 || bullet.position.y > Vectr.HEIGHT || bullet.position.y < 0) {
				this.playerBullets.deactivate(i);
				i += 1;
			}

			j = this.enemies.children.length;
			while (j--) {
				// Remove both enemy and bullet if they collide
				if (this.enemies.at(j).active === true && this.enemies.at(j).collidesWith(bullet) === true) {
					this.particles.start(bullet.position.x, bullet.position.y);
					this.enemies.deactivate(j);
					this.playerBullets.deactivate(i);
					i += 1;
					j += 1;
					this.score += 10;
					this.label.text = "Score: " + this.score;
				}
			}
		}
	}
};

/**
 * @description Mouse/touch movement
 */
Game.prototype.onPointStart = function (points) {
	this.player.position = points[0];
};

Game.prototype.onPointMove = function (points) {
	this.player.position = points[0];
};

Game.prototype.onPointEnd = function (points) {
	var b = this.playerBullets.activate();

	if (b !== null) {
		b.position.x = this.player.position.x;
		b.position.y = this.player.position.y;
	}
};

/**
 * @description Handle keyboard input
 */
Game.prototype.onKeyDown = function (input) {
	var b;

	if (input.z) {
		b = this.playerBullets.activate();

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
Game.prototype.onKeyUp = function (input) {
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