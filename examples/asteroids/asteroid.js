/*jslint sloppy: true, browser: true */
/*globals Arcadia */

var Asteroid = function () {
    Arcadia.Shape.apply(this, arguments);

    this.color = null;
    this.border = '2px #fff';
    this.shadow = '0 0 10px #fff';
    this.speed = 15;
    this.size = {width: 100, height: 100};
    this.type = 'large';
};

Asteroid.prototype = new Arcadia.Shape();

Asteroid.prototype.path = function (context) {
    var size = this.size.width / 2;

    // Move to first "spoke" of the circle
    var angle = 0;
    var start = {
        x: Math.cos(angle) * size * Arcadia.random(0.5, 1),
        y: Math.sin(angle) * size * Arcadia.random(0.5, 1)
    };
    context.moveTo(start.x, start.y);

    // Generate other "spokes", with some variation in them
    for (var i = 1; i < 7; i += 1) {
        angle = Math.PI * 2 * i / 7;
        context.lineTo(Math.cos(angle) * size * Arcadia.random(0.5, 1),
                       Math.sin(angle) * size * Arcadia.random(0.5, 1));
    }

    // Connect last point to the start
    context.lineTo(start.x, start.y);
};

Asteroid.prototype.explode = function (asteroidPool, particleEmitterPool) {
    var a;

    if (this.type === 'large') {
        // Create some "medium" asteroids
        for (var i = 0; i < 3; i +=1) {
            a = asteroidPool.activate()
            a.size = {width: 60, height: 60};
            a.position = {x: this.position.x, y: this.position.y};
            a.speed = 50;
            a.type = 'medium';
        }

    } else if (this.type === 'medium') {
        // Create some "small" asteroids
        for (var i = 0; i < 4; i +=1) {
            a = asteroidPool.activate()
            a.size = {width: 30, height: 30};
            a.position = {x: this.position.x, y: this.position.y};
            a.speed = 100;
            a.type = 'small';
        }
    } else {
        // Do nothing, the small asteroids are just destroyed
    }

    // Create an explosion!
    particleEmitterPool.activate().startAt(this.position.x, this.position.y);
};

Asteroid.prototype.reset = function () {
    this.velocity = {
        x: Arcadia.random(-1, 1),
        y: Arcadia.random(-1, 1)
    };
    this.angularVelocity = Math.random();
    this.speed = 15;
    this.size = {width: 100, height: 100};
    this.type = 'large';
};
