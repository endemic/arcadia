/*jslint sloppy: true, plusplus: true, continue: true */
/*globals Arcadia, Player, PlayerBullet, Enemy, EnemyBullet */

var GameScene = function () {
    Arcadia.Scene.apply(this, arguments);

    this.color = 'rgba(0, 0, 0, 0.15)';

    var self = this;

    // Player
    this.player = new Player({
        position: {x: 0, y: this.size.height / 3}
    });
    this.add(this.player);

    // Other game objects
    this.playerBullets = new Arcadia.Pool();
    this.playerBullets.factory = function () {
        return new PlayerBullet();
    };
    this.add(this.playerBullets);
    while (this.playerBullets.length < 100) {
        this.playerBullets.activate();
    }
    this.playerBullets.deactivateAll();

    this.enemyBullets = new Arcadia.Pool();
    this.enemyBullets.factory = function () {
        return new EnemyBullet();
    };
    this.add(this.enemyBullets);
    while (this.enemyBullets.length < 500) {
        this.enemyBullets.activate();
    }
    this.enemyBullets.deactivateAll();

    this.enemies = new Arcadia.Pool();
    this.enemies.factory = function () {
        return new Enemy();
    };
    this.add(this.enemies);
    while (this.enemies.length < 100) {
        this.enemies.activate();
    }
    this.enemies.deactivateAll();

    this.spawnTimer = 999;  // Immediately spawn an enemy

    // Particle emitters
    this.particles = new Arcadia.Pool();
    this.particles.factory = function () {
        var factory = function () {
            return new Arcadia.Shape({
                position: {x: 0, y: 0},
                color: 'red',
                size: {width: Arcadia.random(2, 5), height: Arcadia.random(2, 5)}
            });
        };
        var emitter = new Arcadia.Emitter(factory);
        emitter.duration = 0.5;
        return emitter;
    };
    while (this.particles.length < 5) {
        this.particles.activate();
    }
    this.particles.deactivateAll();
    this.add(this.particles);

    // Add a starfield background
    this.stars = new Arcadia.Pool();
    this.stars.factory = function () {
        var star = new Arcadia.Shape({
            position: {
                x: Arcadia.random(-self.size.width / 2, self.size.width / 2),
                y: Arcadia.random(-self.size.height / 2, self.size.height / 2)
            },
            vertices: 3,
            size: {
                width: Arcadia.random(1, 3),
                height: Arcadia.random(1, 3)
            },
            angularVelocity: Arcadia.random(1, 4) * Arcadia.randomSign()
        });

        star.velocity.y = 100 / star.size.width * star.size.height;
        star.update = function (delta) {
            Arcadia.Shape.prototype.update.call(this, delta);   // "super"

            // Reset star position if it goes off the bottom of the screen
            if (this.position.y > self.size.height / 2) {
                this.position.y = -self.size.height / 2;
            }
        };

        return star;
    };
    this.add(this.stars);

    // Create 50 star objects
    while (this.stars.length < 50) {
        this.stars.activate();
    }

    // Text/button that lets player try again
    this.gameOverLabel = new Arcadia.Label({
        position: {
            x: 0,
            y: -this.size.height / 3
        },
        text: 'GAME OVER',
        font: '40px monospace',
        color: 'rgba(255, 255, 255, 0.8)',
        shadow: '0 0 10px #fff',
        zIndex: 0
    });
    this.add(this.gameOverLabel);
    this.deactivate(this.gameOverLabel);

    this.tryAgainButton = new Arcadia.Button({
        position: {x: 0, y: 0},
        color: 'white',
        shadow: '0 0 10px white',
        label: new Arcadia.Label({
            font: '20px monospace',
            color: 'black',
            shadow: '0 0 10px black',
            text: 'TRY AGAIN',
        }),
        padding: 15,
        zIndex: 0,
        action: function () {
            // Just reload this scene
            Arcadia.changeScene(GameScene);
        }
    });
    this.add(this.tryAgainButton);
    this.deactivate(this.tryAgainButton);

    this.scoreLabel = new Arcadia.Label({
        text: 'Score: 0',
        font: '16px monospace',
        shadow: '0 0 10px white',
        position: {
            x: -this.size.width / 2 + 55,
            y: -this.size.height / 2 + 15
        },
        zIndex: 0
    });
    this.add(this.scoreLabel);
    this.score = 0;

    this.fpsLabel = new Arcadia.Label({
        text: 'FPS: 0',
        font: '16px monospace',
        shadow: '0 0 10px white',
        position: {
            x: this.size.width / 2 - 45,
            y: -this.size.height / 2 + 15
        },
        zIndex: 0
    });
    this.add(this.fpsLabel);
};

GameScene.prototype = new Arcadia.Scene();

GameScene.prototype.update = function (delta) {
    Arcadia.Scene.prototype.update.call(this, delta);

    this.fpsLabel.text = 'FPS: ' + Math.round(Arcadia.FPS);

    var angle,
        bullet,
        enemy,
        i,
        j;

    // Check for player bullet collisions
    var i = this.playerBullets.length;
    while (i--) {
        var bullet = this.playerBullets.at(i);

        if (bullet.position.y > this.size.height / 2 || bullet.position.y < -this.size.height / 2) {
            // Remove bullets if they go offscreen
            this.playerBullets.deactivate(i);
            continue;
        } else {
            var j = this.enemies.length;
            while (j--) {
                var enemy = this.enemies.at(j);

                // Remove both enemy and bullet if they collide
                if (enemy.collidesWith(bullet) === true) {
                    this.particles.activate().startAt(bullet.position.x, bullet.position.y);

                    // Move enemy back to top
                    enemy.position.y = -this.size.height / 2;
                    enemy.position.x = Arcadia.random(-this.size.width / 2, this.size.width / 2);

                    this.playerBullets.deactivate(i);
                    this.score += 10;
                    this.scoreLabel.text = "Score: " + this.score;
                    continue;
                }
            }
        }
    }

    if (this.gameOver) {
        return;
    }

    // Spawn enemies
    this.spawnTimer += delta;
    if (this.spawnTimer > 1) {
        this.spawnTimer = 0;

        enemy = this.enemies.activate();
        enemy.position.y = -this.size.height / 2;
        enemy.position.x = Arcadia.random(-this.size.width / 2, this.size.width / 2);
    }

    // Update enemy velocity
    i = this.enemies.length;
    while (i--) {
        enemy = this.enemies.at(i);
        angle = Math.atan2(this.player.position.y - enemy.position.y, this.player.position.x - enemy.position.x);
        enemy.rotation = angle + Math.PI / 180 * 90;
        enemy.velocity.x = Math.cos(angle);
        enemy.velocity.y = Math.sin(angle);
        enemy.bulletTimer += delta;

        // Have enemies shoot in a somewhat erratic fashion
        if (enemy.bulletTimer > Arcadia.random(1, 3)) {
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

        if (bullet.position.y > this.size.height / 2 || bullet.position.y < -this.size.height / 2) {
            this.enemyBullets.deactivate(i);
        } else if (bullet.collidesWith(this.player)) {
            this.particles.activate().startAt(this.player.position.x, this.player.position.y);
            this.showGameSceneOver();
            break;
        }
    }
};

/**
 * @description Mouse/touch movement
 */
GameScene.prototype.onPointStart = function (points) {
    Arcadia.Scene.prototype.onPointStart.call(this, points);

    if (this.gameOver) {
        return;
    }

    var angle = Math.atan2(points.coordinates[0].y - this.player.position.y, points.coordinates[0].x - this.player.position.x);

    if (this.player.position.x !== points.coordinates[0].x && this.player.position.y !== points.coordinates[0].y) {
        this.player.velocity.x = Math.cos(angle);
        this.player.velocity.y = Math.sin(angle);
    }
};

GameScene.prototype.onPointMove = function (points) {
    Arcadia.Scene.prototype.onPointMove.call(this, points);

    if (this.gameOver) {
        return;
    }

    var angle = Math.atan2(points.coordinates[0].y - this.player.position.y, points.coordinates[0].x - this.player.position.x);

    if (this.player.position.x !== points.coordinates[0].x && this.player.position.y !== points.coordinates[0].y) {
        this.player.velocity.x = Math.cos(angle);
        this.player.velocity.y = Math.sin(angle);
    }
};

GameScene.prototype.onPointEnd = function (points) {
    Arcadia.Scene.prototype.onPointEnd.call(this, points);

    if (this.gameOver) {
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
GameScene.prototype.onKeyDown = function (key) {
    if (this.gameOver) {
        return;
    }

    if (key === 'z' || key === 'space') {
        var b = this.playerBullets.activate();
        b.position.x = this.player.position.x;
        b.position.y = this.player.position.y - this.player.size.height / 2;
    }

    if (key === 'left') {
        this.player.velocity.x -= 1;
    }

    if (key === 'right') {
        this.player.velocity.x += 1;
    }

    if (key === 'up') {
        this.player.velocity.y -= 1;
    }

    if (key === 'down') {
        this.player.velocity.y += 1;
    }
};

/**
 * @description Handle keyboard input
 */
GameScene.prototype.onKeyUp = function (key) {
    if (this.gameOver) {
        return;
    }

    if (key === 'left') {
        this.player.velocity.x += 1;
    }

    if (key === 'right') {
        this.player.velocity.x -= 1;
    }

    if (key === 'up') {
        this.player.velocity.y += 1;
    }

    if (key === 'down') {
        this.player.velocity.y -= 1;
    }
};

/**
 * @description Show "game over!" text
 */
GameScene.prototype.showGameSceneOver = function () {
    this.gameOver = true;

    this.children.deactivate(this.player);

    this.children.activate(this.gameOverLabel);
    this.children.activate(this.tryAgainButton);
};
