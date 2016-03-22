/*jslint sloppy: true, plusplus: true, continue: true */
/*globals Arcadia, Ship, Asteroid */

var GameScene = function () {
    Arcadia.Scene.apply(this, arguments);

    this.color = 'rgba(0, 0, 0, 0.25)';
    this.size = {width: 640, height: 480};

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
        var factory = function () {
            return new Arcadia.Shape({
                color: '#fff',
                size: {width: 3, height: 3}
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

    // Text/button that lets player try again
    this.gameOverLabel = new Arcadia.Label({
        position: {
            x: 0,
            y: -this.size.height - 200
        },
        text: 'GAME OVER',
        font: '40px monospace',
        color: '#fff'
    });

    this.add(this.gameOverLabel);
    this.deactivate(this.gameOverLabel);

    this.tryAgainButton = new Arcadia.Button({
        position: {x: 0, y: 0},
        border: '2px #fff',
        color: '#000',
        font: '20px monospace',
        text: "TRY AGAIN",
        padding: 15,
        action: function () {
            Arcadia.changeScene(GameScene);
        }
    });
    this.add(this.tryAgainButton);
    this.deactivate(this.tryAgainButton);

    // Score label
    this.scoreLabel = new Arcadia.Label({
        position: {x: 50, y: 15},
        text: 'Score: 0',
        font: '16px monospace'
    });
    this.scoreLabel.position = {
        x: -this.size.width / 2 + 50,
        y: -this.size.height / 2 + this.scoreLabel.size.height
    };
    this.add(this.scoreLabel);
    this.score = 0;

    // Show FPS
    this.fpsLabel = new Arcadia.Label({
        text: 'FPS: 1000',
        font: '16px monospace'
    });
    this.fpsLabel.position = {
        x: this.size.width / 2 - 50,
        y: -this.size.height / 2 + this.fpsLabel.size.height
    };
    this.add(this.fpsLabel);

    this.level = 1;

    this.init();
};

GameScene.prototype = new Arcadia.Scene();

GameScene.prototype.init = function () {
    var i,
        asteroid;

    for (i = 0; i < this.level; i += 1) {
        asteroid = this.asteroids.activate();
        asteroid.position = {
            x: Math.random() * this.size.width - (this.size.width / 2),
            y: Math.random() * this.size.height - (this.size.height / 2)
        };
    }

    this.bullets.deactivateAll();

    this.ship.position = {x: 0, y: 0};
};

GameScene.prototype.update = function (delta) {
    Arcadia.Scene.prototype.update.call(this, delta);

    this.fpsLabel.text = 'FPS: ' + Math.round(this.parent.fps);

    if (this.asteroids.length === 0) {
        this.nextLevel();
    }

    this.wrapAroundScreen(this.ship);

    // Check for player bullet collisions
    var j = this.asteroids.length;
    while (j--) {
        var asteroid = this.asteroids.at(j);
        this.wrapAroundScreen(asteroid);

        var i = this.bullets.length;
        while (i--) {
            var bullet = this.bullets.at(i);
            this.wrapAroundScreen(bullet);

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
GameScene.prototype.onKeyDown = function (key) {
    if (this.gameOver === true) {
        return;
    }

    if (key === 'z' || key === 'space') {
        var b = this.bullets.activate();
        b.velocity.x = Math.cos(this.ship.rotation - Math.PI / 2);
        b.velocity.y = Math.sin(this.ship.rotation - Math.PI / 2);
        b.position.x = this.ship.position.x + this.ship.velocity.x + b.velocity.x;
        b.position.y = this.ship.position.y + this.ship.velocity.y + b.velocity.y;
    }

    if (key === 'left') {
        this.ship.turnLeft();
    }

    if (key === 'right') {
        this.ship.turnRight();
    }

    if (key === 'up') {
        this.ship.move();
    }
};

/**
 * @description Handle keyboard input
 */
GameScene.prototype.onKeyUp = function (key) {
    if (this.gameOver === true) {
        return;
    }

    if (key === 'left' || key === 'right') {
        this.ship.stopTurning();
    }

    if (key === 'up') {
        this.ship.stop();
    }
};

GameScene.prototype.nextLevel = function() {
    this.level += 1;
    this.init();
};

/**
 * @description Show "game over!" text
 */
GameScene.prototype.showGameOver = function () {
    this.gameOver = true;

    this.deactivate(this.ship);
    this.particles.activate().startAt(this.ship.position.x, this.ship.position.y);

    this.activate(this.gameOverLabel);
    this.activate(this.tryAgainButton);
};

/**
 * @description Call on a Shape object to have it wrap around the screen, Asteroids-style
 */
GameScene.prototype.wrapAroundScreen = function (object) {
    if (object.position.x - object.size.width / 2 > this.size.width / 2) {
        object.position.x = -this.size.width / 2;
    }

    if (object.position.x + object.size.width / 2 < -this.size.width / 2) {
        object.position.x = this.size.width / 2;
    }

    if (object.position.y - object.size.height / 2 > this.size.height / 2) {
        object.position.y = -this.size.height / 2;
    }

    if (object.position.y + object.size.height / 2 < -this.size.height / 2) {
        object.position.y = this.size.height / 2;
    }
};
