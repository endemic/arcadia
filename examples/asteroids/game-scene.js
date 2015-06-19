/*jslint sloppy: true, plusplus: true, continue: true */
/*globals Arcadia, Ship, Asteroid */

var AsteroidsGameScene = function () {
    Arcadia.Scene.apply(this, arguments);

    this.color = 'rgba(0, 0, 0, 0.25)';

    this.level = 1;

    // Player's ship
    this.ship = new Ship({
        position: {
            x: Arcadia.WIDTH / 2,
            y: Arcadia.HEIGHT / 2
        }
    });
    this.add(this.ship);

    // Player bullets
    this.bullets = new Arcadia.Pool();
    this.bullets.factory = function () {
        return new Arcadia.Shape({
            size: { width: 4, height: 4 },
            vertices: 0,     // it's a circle!
            speed: 200
        });
    };
    this.add(this.bullets);
    while (this.bullets.length < 100) {
        this.bullets.activate();
    }
    this.bullets.deactivateAll();

    // Asteroids
    this.asteroids = new Arcadia.Pool();
    this.asteroids.factory = function () {
        return new Asteroid();
    };
    this.add(this.asteroids);
    while (this.asteroids.length < 50) {
        this.asteroids.activate();
    }
    this.asteroids.deactivateAll();

    // Particle emitters
    this.particles = new Arcadia.Pool();
    this.particles.factory = function () {
        var emitter,
            factory;

        factory = function () {
            return new Arcadia.Shape({
                color: 'rgb(255, 0, 0)',
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
        color: '#fff',
        shadow: '0 0 10px #fff'
    });

    this.add(this.gameOverLabel);
    this.deactivate(this.gameOverLabel);

    this.tryAgainButton = new Arcadia.Button({
        position: {
            x: Arcadia.WIDTH / 2, 
            y: Arcadia.HEIGHT / 2
        },
        border: '1px rgba(255, 255, 255, 0.8)',
        color: null,
        font: '20px monospace',
        shadow: '0 0 10px #fff',
        text: "TRY AGAIN",
        padding: 15
    });
    this.tryAgainButton.onUp = function () {
        Arcadia.changeScene(Game);
    };

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

    this.fpsLabel = new Arcadia.Label({
        position: { x: Arcadia.WIDTH - 50, y: 15 },
        text: 'FPS: 0',
        font: 'bold 16px monospace'
    });
    this.add(this.fpsLabel);

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
        asteroid.velocity = {
          x: Math.random() * asteroid.speed,
          y: Math.random() * asteroid.speed
        };
        asteroid.angularVelocity = Math.random();
    }
};

AsteroidsGameScene.prototype.update = function (delta) {
    Arcadia.Scene.prototype.update.call(this, delta);

    this.fpsLabel.text = Math.round(Arcadia.FPS);

    var bullet,
        asteroid,
        i,
        j;

    // Check for player bullet collisions
    i = this.bullets.length;
    while (i--) {
        bullet = this.bullets.at(i);

        if (bullet.position.y > Arcadia.HEIGHT || bullet.position.y < 0) {
            // Remove bullets if they go offscreen
            this.bullets.deactivate(i);
        } else {
            j = this.asteroids.length;
            while (j--) {
                asteroid = this.asteroids.at(j);

                // Remove both asteroid and bullet if they collide
                if (asteroid.collidesWith(bullet)) {
                    // this.particles.activate().startAt(bullet.position.x, bullet.position.y);

                    // Deactivate asteroid
                    this.deactivate(j);

                    // Deactivate bullet
                    this.bullets.deactivate(i);

                    // Create new asteroids
                    // for (j = 0; j < 3; j += 1) {
                    this.asteroids.activate().init(asteroid.vertices - 1);
                    // }

                    // Update score
                    this.score += 10;
                    this.scoreLabel.text = 'Score: ' + this.score;
                    continue;
                }
            }
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

/**
 * @description Show "game over!" text
 */
AsteroidsGameScene.prototype.showGameOver = function () {
    this.gameOver = true;

    this.children.deactivate(this.ship);

    this.children.activate(this.gameOverLabel);
    this.children.activate(this.tryAgainButton);
};
