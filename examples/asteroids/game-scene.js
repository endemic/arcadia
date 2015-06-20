/*jslint sloppy: true, plusplus: true, continue: true */
/*globals Arcadia, Ship, Asteroid */

var AsteroidsGameScene = function () {
    Arcadia.Scene.apply(this, arguments);

    this.color = 'rgba(0, 0, 0, 0.25)';

    // Player's ship
    this.ship = new Ship();
    this.add(this.ship);

    // Player bullets
    this.bullets = new Arcadia.Pool();
    this.bullets.factory = function () {
        return new Bullet();
    };
    this.add(this.bullets);
    // Pre-instantiate a number of these objects
    while (this.bullets.length < 100) {
        this.bullets.activate();
    }
    // Then deactivate them, so they're not drawn/updated
    this.bullets.deactivateAll();

    // Asteroids
    this.asteroids = new Arcadia.Pool();
    this.asteroids.factory = function () {
        return new Asteroid();
    };
    this.add(this.asteroids);
    // Pre-instantiate a number of these objects
    while (this.asteroids.length < 50) {
        this.asteroids.activate();
    }
    // Then deactivate them, so they're not drawn/updated
    this.asteroids.deactivateAll();

    // Particle emitters
    this.particles = new Arcadia.Pool();
    this.particles.factory = function () {
        var emitter,
            factory;

        factory = function () {
            return new Arcadia.Shape({
                color: '#fff',
                size: { width: 3, height: 3 }
            });
        };
        emitter = new Arcadia.Emitter(factory);
        emitter.duration = 0.5;
        return emitter;
    };
    while (this.particles.length < 5) {
        this.particles.activate();
    }
    this.particles.deactivateAll();
    this.add(this.particles);

    // Text/button that lets player try again
    this.gameOverLabel = new Arcadia.Label({
        position: {
            x: Arcadia.WIDTH / 2,
            y: Arcadia.HEIGHT / 4
        },
        text: 'GAME OVER',
        font: '40px monospace',
        color: '#fff'
    });

    this.add(this.gameOverLabel);
    this.deactivate(this.gameOverLabel);

    this.tryAgainButton = new Arcadia.Button({
        position: {
            x: Arcadia.WIDTH / 2, 
            y: Arcadia.HEIGHT / 2
        },
        border: '2px #fff',
        color: '#000',
        font: '20px monospace',
        text: "TRY AGAIN",
        padding: 15,
        action: function () {
            Arcadia.changeScene(AsteroidsGameScene);
        }
    });
    this.add(this.tryAgainButton);
    this.deactivate(this.tryAgainButton);

    // Score label
    this.scoreLabel = new Arcadia.Label({
        position: { x: 50, y: 15 },
        text: 'Score: 0',
        font: 'bold 16px monospace'
    });
    this.add(this.scoreLabel);
    this.score = 0;

    // Show FPS
    this.fpsLabel = new Arcadia.Label({
        position: { x: Arcadia.WIDTH - 50, y: 15 },
        text: 'FPS: 0',
        font: 'bold 16px monospace'
    });
    this.add(this.fpsLabel);

    this.level = 1;

    this.init();
};

AsteroidsGameScene.prototype = new Arcadia.Scene();

AsteroidsGameScene.prototype.init = function () {
    var i, asteroid;

    for (i = 0; i < this.level; i += 1) {
        asteroid = this.asteroids.activate();
        asteroid.position = {
            x: Math.random() * Arcadia.WIDTH,
            y: Math.random() * Arcadia.HEIGHT
        };
    }

    this.bullets.deactivateAll();

    this.ship.position =  {
        x: Arcadia.WIDTH / 2,
        y: Arcadia.HEIGHT / 2
    };
};

AsteroidsGameScene.prototype.update = function (delta) {
    Arcadia.Scene.prototype.update.call(this, delta);

    this.fpsLabel.text = 'FPS: ' + Math.round(Arcadia.FPS);

    var bullet, asteroid, a, i, j, k;

    if (this.asteroids.length === 0) {
        this.nextLevel();
    }

    // Check for player bullet collisions
    j = this.asteroids.length;
    while (j--) {
        asteroid = this.asteroids.at(j);

        i = this.bullets.length;
        while (i--) {
            bullet = this.bullets.at(i);

            if (bullet.lifespan > bullet.MAX_LIFESPAN) {
                // Remove bullets once they get too old
                this.bullets.deactivate(i);
            } else if (asteroid.collidesWith(bullet)) {
                // Remove both asteroid and bullet if they collide
                this.asteroids.deactivate(j);
                this.bullets.deactivate(i);

                // Handle this asteroid being destroyed
                asteroid.explode(this.asteroids, this.particles);

                // Update score
                this.score += 10;
                this.scoreLabel.text = 'Score: ' + this.score;
            }
        }

        // Only check collision w/ player if game is still running
        if (!this.gameOver && asteroid.collidesWith(this.ship)) {
            return this.showGameOver();
        }
    }
};

/**
 * @description Handle keyboard input
 */
AsteroidsGameScene.prototype.onKeyDown = function (key) {
    if (this.gameOver === true) {
        return;
    }

    var b;

    if (key === "z" || key === "space") {
        b = this.bullets.activate();
        b.velocity.x = Math.cos(this.ship.rotation - Math.PI / 2);
        b.velocity.y = Math.sin(this.ship.rotation - Math.PI / 2);
        b.position.x = this.ship.position.x + this.ship.velocity.x + b.velocity.x;
        b.position.y = this.ship.position.y + this.ship.velocity.y + b.velocity.y;
    }

    if (key === "left") {
        this.ship.angularVelocity = -3;
    }

    if (key === "right") {
        this.ship.angularVelocity = 3;
    }

    if (key === "up") {
        this.ship.move();
    }
};

/**
 * @description Handle keyboard input
 */
AsteroidsGameScene.prototype.onKeyUp = function (key) {
    if (this.gameOver === true) {
        return;
    }

    if (key === "left") {
        this.ship.angularVelocity = 0;
    }

    if (key === "right") {
        this.ship.angularVelocity = 0;
    }

    if (key === "up") {
        this.ship.stop();
    }
};

AsteroidsGameScene.prototype.nextLevel = function() {
    this.level += 1;
    this.init();
};

/**
 * @description Show "game over!" text
 */
AsteroidsGameScene.prototype.showGameOver = function () {
    this.gameOver = true;

    this.deactivate(this.ship);
    this.particles.activate().startAt(this.ship.position.x, this.ship.position.y);

    this.activate(this.gameOverLabel);
    this.activate(this.tryAgainButton);
};
