/*jslint sloppy: true, plusplus: true */
/*globals Vectr, Player, PlayerBullet, Enemy, EnemyBullet */

var Game = function (context) {
	Vectr.Layer.apply(this, arguments);
	this.clearColor = 'rgba(0, 0, 0, 0.25)';
	// this.clearColor = '#000';

	var obj,
		i;

	// Player
	this.player = new Player(Vectr.WIDTH / 2, Vectr.HEIGHT / 1.5);
	this.add(this.player);

	// Score label
	this.label = new Vectr.Label("Score: 0", "16px monospace", "rgba(255, 255, 255, 0.8)", 0, 20, "left");
	this.add(this.label);
	this.score = 0;

	// Other game objects
	this.playerBullets = new Vectr.Pool();
	this.add(this.playerBullets);
	this.enemyBullets = new Vectr.Pool();
	this.add(this.enemyBullets);
	this.enemies = new Vectr.Pool();
	this.add(this.enemies);

	// Create some bullets
	i = 20;
	while (i--) {
		this.playerBullets.add(new PlayerBullet());
	}

	i = 40;
	while (i--) {
		this.enemyBullets.add(new EnemyBullet());
	}

	// Create some enemies
	i = 20;
	while (i--) {
		this.enemies.add(new Enemy());
	}
	this.spawnTimer = 999;	// Immediately spawn an enemy

	// Particle emitters
	this.particles = new Vectr.Pool();
	this.add(this.particles);

	i = 5;
	while (i--) {
		obj = new Vectr.Emitter(30, 'circle', 2, 'rgba(255, 0, 0, 0.9)');
		this.particles.add(obj);
	}

	this.playerExplosion = new Vectr.Emitter(30, 'circle', 2, 'rgba(255, 255, 255, 0.9)');
	this.add(this.playerExplosion);

	// Add a starfield background
	this.stars = new Vectr.Pool();
	this.add(this.stars);

	i = 50;
	while (i--) {
		obj = new Vectr.Sprite(Math.random() * Vectr.WIDTH, Math.random() * Vectr.HEIGHT, 'circle', Math.random() + 0.5, 'rgba(255, 255, 255, 1)');
		obj.solid = true;
		obj.velocity.y = 40 / obj.size;
		this.stars.add(obj);
	}
};

Game.prototype = new Vectr.Layer();

Game.prototype.update = function (delta) {
	Vectr.Layer.prototype.update.call(this, delta);

	var angle,
		bullet,
		enemy,
		particles,
		star,
		i,
		j;

	// Update star positions
	i = this.stars.children.length;
	while (i--) {
		star = this.stars.at(i);
		if (star.position.y > Vectr.HEIGHT) {
			star.position.y = 0;
		}
	}

	if (this.gameOver === true) {
		return;
	}

	// Spawn enemies
	this.spawnTimer += delta;
	if (this.spawnTimer > 1) {
		this.spawnTimer = 0;

		enemy = this.enemies.activate();
		if (enemy !== null) {
			enemy.position.y = 0;
			enemy.position.x = Math.random() * Vectr.WIDTH;
		}
	}

	// Update enemy velocity
	i = this.enemies.length;
	while (i--) {
		enemy = this.enemies.at(i);
		angle = Math.atan2(this.player.position.y - enemy.position.y, this.player.position.x - enemy.position.x);
		enemy.rotation = angle * 180 / Math.PI;
		enemy.velocity.x = Math.cos(angle);
		enemy.velocity.y = Math.sin(angle);
		enemy.bulletTimer += delta;

		// Have enemies shoot in a somewhat erratic fashion
		if (enemy.bulletTimer > Math.random() * 2 + 1) {
			enemy.bulletTimer = 0;
			bullet = this.enemyBullets.activate();
			bullet.position.x = enemy.position.x + enemy.velocity.x;
			bullet.position.y = enemy.position.y + enemy.velocity.y;
			bullet.velocity.x = enemy.velocity.x;
			bullet.velocity.y = enemy.velocity.y;
		}
	}

	// Check for enemy bullet collisons
	i = this.enemyBullets.length;
	while (i--) {
		bullet = this.enemyBullets.at(i);

		if (bullet.position.y > Vectr.HEIGHT || bullet.position.y < 0) {
			this.enemyBullets.deactivate(i);
		} else if (bullet.collidesWith(this.player) === true) {
			this.playerExplosion.start(this.player.position.x, this.player.position.y);
			this.showGameOver();
			break;
		}
	}

	// Check for player bullet collisions, etc.
	i = this.playerBullets.length;
	while (i--) {
		bullet = this.playerBullets.at(i);

		// Remove bullets if they go offscreen
		if (bullet !== null && (bullet.position.y > Vectr.HEIGHT || bullet.position.y < 0)) {
			this.playerBullets.deactivate(i);
			break;
		} else {
			j = this.enemies.length;
			while (j--) {
				enemy = this.enemies.at(j);

				// Remove both enemy and bullet if they collide
				if (enemy !== null && enemy.collidesWith(bullet) === true) {
					particles = this.particles.activate();
					if (particles !== null) {
						particles.start(this.playerBullets.at(i).position.x, this.playerBullets.at(i).position.y);
					}
					this.enemies.deactivate(j);
					this.playerBullets.deactivate(i);
					this.score += 10;
					this.label.text = "Score: " + this.score;
					break;
				}
			}
		}
	}
};

/**
 * @description Mouse/touch movement
 */
Game.prototype.onPointStart = function (points) {
	if (this.gameOver === true) {
		return;
	}

	var angle = Math.atan2(points[0].y - this.player.position.y, points[0].x - this.player.position.x);

	if (this.player.position.x !== points[0].x && this.player.position.y !== points[0].y) {
		this.player.velocity.x = Math.cos(angle);
		this.player.velocity.y = Math.sin(angle);
	}
};

Game.prototype.onPointMove = function (points) {
	if (this.gameOver === true) {
		return;
	}

	var angle = Math.atan2(points[0].y - this.player.position.y, points[0].x - this.player.position.x);

	if (this.player.position.x !== points[0].x && this.player.position.y !== points[0].y) {
		this.player.velocity.x = Math.cos(angle);
		this.player.velocity.y = Math.sin(angle);
	}
};

Game.prototype.onPointEnd = function (points) {
	if (this.gameOver === true) {
		return;
	}

	var b = this.playerBullets.activate();

	if (b !== null) {
		b.position.x = this.player.position.x;
		b.position.y = this.player.position.y;
	}

	if (points.length === 1) {
		this.player.velocity.x = 0;
		this.player.velocity.y = 0;
	}
};

/**
 * @description Handle keyboard input
 */
Game.prototype.onKeyDown = function (input) {
	if (this.gameOver === true) {
		return;
	}

	var b;

	if (input.z || input.space) {
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
	if (this.gameOver === true) {
		return;
	}
	
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

/**
 * @description Show "game over!" text
 */
Game.prototype.showGameOver = function () {
	this.gameOver = true;

	this.player.active = false;

	// Show text allowing the user to try again
	this.add(new Vectr.Label("GAME OVER", "40px monospace", "rgba(255, 255, 255, 0.8)", Vectr.WIDTH / 2, Vectr.HEIGHT / 4));
	// this.add(new Vectr.Label("Hit ESC to retry", "20px monospace", "rgba(255, 255, 255, 0.8)", Vectr.WIDTH / 2, Vectr.HEIGHT / 2));

	this.button = new Vectr.Button("TRY AGAIN", "20px monospace", "rgba(255, 255, 255, 1)", "rgba(255, 255, 255, 1)", Vectr.WIDTH / 2, Vectr.HEIGHT / 2);
	this.button.solid = false;
	this.button.padding = 10;
	this.button.onUp = function () {
		Vectr.changeLayer(Game);
	};
	this.add(this.button);
};