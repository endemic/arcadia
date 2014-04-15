/*jslint sloppy: true, plusplus: true, continue: true */
/*globals Arcadia, Player, PlayerBullet, Enemy, EnemyBullet */

var Game = function () {
    Arcadia.Scene.apply(this, arguments);
    this.clearColor = 'rgba(0, 0, 0, 0.15)';

    // Text/button that lets player try again
    this.gameOverLabel = new Arcadia.Label(Arcadia.WIDTH / 2, Arcadia.HEIGHT / 4, "GAME OVER");
    this.gameOverLabel.font = '40px monospace';
    this.gameOverLabel.color = 'rgba(255, 255, 255, 0.8)';
    this.gameOverLabel.glow = 10;

    this.children.add(this.gameOverLabel);
    this.children.deactivate(this.gameOverLabel);

    this.tryAgainButton = new Arcadia.Button(Arcadia.WIDTH / 2, Arcadia.HEIGHT / 2, "TRY AGAIN");
    this.tryAgainButton.font = '20px monospace';
    this.tryAgainButton.solid = false;
    this.tryAgainButton.padding = 20;
    this.tryAgainButton.glow = 20;
    this.tryAgainButton.onUp = function () {
        Arcadia.changeScene(Game);
    };

    this.children.add(this.tryAgainButton);
    this.children.deactivate(this.tryAgainButton);

    // Score label
    this.label = new Arcadia.Label(10, 20, "Score: 0");
    this.label.font = '16px monospace';
    this.label.alignment = 'left';
    this.label.glow = 10;
    this.children.add(this.label);
    this.score = 0;

    // Player
    this.player = new Player(Arcadia.WIDTH / 2, Arcadia.HEIGHT / 1.5);
    this.children.add(this.player);
    this.camera.target = this.player;

    // Other game objects
    this.playerBullets = new Arcadia.Pool();
    this.playerBullets.factory = function () {
        return new PlayerBullet();
    };
    this.children.add(this.playerBullets);

    this.enemyBullets = new Arcadia.Pool();
    this.enemyBullets.factory = function () {
        return new EnemyBullet();
    };
    this.children.add(this.enemyBullets);

    this.enemies = new Arcadia.Pool();
    this.enemies.factory = function () {
        return new Enemy();
    };
    this.children.add(this.enemies);

    this.spawnTimer = 999;  // Immediately spawn an enemy

    // Particle emitters
    this.particles = new Arcadia.Pool();
    this.particles.factory = function () {
        var obj = new Arcadia.Emitter('circle', 4, 30);
        obj.color = 'rgba(255, 0, 0, 1)';
        obj.duration = 0.5;
        return obj;
    };
    this.children.add(this.particles);

    // i = 5;
    // while (i--) {
    //     // shape, size, color, count, duration, fade
    //     obj = new Arcadia.Emitter('circle', 4, 30);
    //     obj.color = 'rgba(255, 0, 0, 1)';
    //     obj.duration = 0.5;
    //     this.particles.add(obj);
    // }

    this.playerExplosion = new Arcadia.Emitter('circle', 4, 30);
    this.playerExplosion.color = 'rgba(255, 255, 255, 1)';
    this.playerExplosion.duration = 0.5;
    this.children.add(this.playerExplosion);

    // Add a starfield background
    this.stars = new Arcadia.Pool();
    this.stars.factory = function () {
        var star = new Arcadia.Shape(Math.random() * Arcadia.WIDTH, Math.random() * Arcadia.HEIGHT, 'circle', Math.random() * 4 + 1);
        star.solid = true;
        star.velocity.y = 40 / star.size;
        star.update = function (delta) {
            Arcadia.Shape.prototype.update.call(this, delta);   // "super"

            // Reset star position if it goes off the bottom of the screen
            if (this.position.y > Arcadia.HEIGHT) {
                this.position.y = 0;
            }
        };

        return star;
    };

    this.children.add(this.stars);

    // Create 50 star objects
    while (this.stars.length < 50) {
        this.stars.activate();
    }
};

Game.prototype = new Arcadia.Scene();

Game.prototype.update = function (delta) {
    Arcadia.Scene.prototype.update.call(this, delta);

    var angle,
        bullet,
        enemy,
        particles,
        i,
        j;

    // Check for player bullet collisions
    i = this.playerBullets.length;
    while (i--) {
        bullet = this.playerBullets.at(i);

        if (bullet.position.y > Arcadia.HEIGHT || bullet.position.y < 0) {
            // Remove bullets if they go offscreen
            this.playerBullets.deactivate(i);
            continue;
        } else {
            j = this.enemies.length;
            while (j--) {
                enemy = this.enemies.at(j);

                // Remove both enemy and bullet if they collide
                if (enemy.collidesWith(bullet) === true) {
                    // Create particle effect
                    particles = this.particles.activate();
                    particles.start(this.playerBullets.at(i).position.x, this.playerBullets.at(i).position.y);

                    // Spawn a new enemy
                    enemy = this.enemies.activate();
                    enemy.position.y = 0;
                    enemy.position.x = Math.random() * Arcadia.WIDTH;

                    this.enemies.deactivate(j);
                    this.playerBullets.deactivate(i);
                    this.score += 10;
                    this.label.text = "Score: " + this.score;
                    continue;
                }
            }
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
        enemy.position.y = 0;
        enemy.position.x = Math.random() * Arcadia.WIDTH;
    }

    // Update enemy velocity
    i = this.enemies.length;
    while (i--) {
        enemy = this.enemies.at(i);

        angle = Math.atan2(this.player.position.y - enemy.position.y, this.player.position.x - enemy.position.x);
        enemy.rotation = angle;
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

        if (bullet.position.y > Arcadia.HEIGHT || bullet.position.y < 0) {
            this.enemyBullets.deactivate(i);
        } else if (bullet.collidesWith(this.player) === true) {
            this.playerExplosion.start(this.player.position.x, this.player.position.y);
            this.showGameOver();
            break;
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

    var angle = Math.atan2(points.coordinates[0].y - this.player.position.y, points.coordinates[0].x - this.player.position.x);

    if (this.player.position.x !== points.coordinates[0].x && this.player.position.y !== points.coordinates[0].y) {
        this.player.velocity.x = Math.cos(angle);
        this.player.velocity.y = Math.sin(angle);
    }
};

Game.prototype.onPointMove = function (points) {
    if (this.gameOver === true) {
        return;
    }

    var angle = Math.atan2(points.coordinates[0].y - this.player.position.y, points.coordinates[0].x - this.player.position.x);

    if (this.player.position.x !== points.coordinates[0].x && this.player.position.y !== points.coordinates[0].y) {
        this.player.velocity.x = Math.cos(angle);
        this.player.velocity.y = Math.sin(angle);
    }
};

Game.prototype.onPointEnd = function (points) {
    if (this.gameOver === true) {
        return;
    }

    var b = this.playerBullets.activate();
    b.position.x = this.player.position.x;
    b.position.y = this.player.position.y;

    if (points.length === 1) {
        this.player.velocity.x = 0;
        this.player.velocity.y = 0;
    }
};

/**
 * @description Handle keyboard input
 */
Game.prototype.onKeyDown = function (key) {
    if (this.gameOver === true) {
        return;
    }

    var b;

    if (key === "z" || key === "space") {
        b = this.playerBullets.activate();

        b.position.x = this.player.position.x;
        b.position.y = this.player.position.y - this.player.size / 2;
    }

    if (key === "left") {
        this.player.velocity.x -= 1;
    }

    if (key === "right") {
        this.player.velocity.x += 1;
    }

    if (key === "up") {
        this.player.velocity.y -= 1;
    }

    if (key === "down") {
        this.player.velocity.y += 1;
    }
};

/**
 * @description Handle keyboard input
 */
Game.prototype.onKeyUp = function (key) {
    if (this.gameOver === true) {
        return;
    }

    if (key === "left") {
        this.player.velocity.x += 1;
    }

    if (key === "right") {
        this.player.velocity.x -= 1;
    }

    if (key === "up") {
        this.player.velocity.y += 1;
    }

    if (key === "down") {
        this.player.velocity.y -= 1;
    }
};

/**
 * @description Show "game over!" text
 */
Game.prototype.showGameOver = function () {
    this.gameOver = true;

    this.children.deactivate(this.player);

    this.children.activate(this.gameOverLabel);
    this.children.activate(this.tryAgainButton);
};
