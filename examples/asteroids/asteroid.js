/*jslint sloppy: true, browser: true */
/*globals Arcadia */

var Asteroid = function () {
    Arcadia.Shape.apply(this, arguments);

    this.color = null;
    this.border = '2px #fff';
    this.shadow = '0 0 10px #fff';
    this.speed = 15;
    this.size = { width: 100, height: 100 };
    this.type = 'large';

    var _this = this;
    this.path = function (context) {
        var angle, coords, random, size, i;

        coords = [];
        size = _this.size.width / 2;
        random = function (min, max) {
            return Math.random() * (max - min) + min;
        };

        // Move to first "spoke" of the circle
        angle = 0;
        coords.unshift({
            x: Math.cos(angle) * size * random(0.5, 1),
            y: Math.sin(angle) * size * random(0.5, 1)
        });
        context.moveTo(coords[0].x, coords[0].y)

        // Generate other "spokes", with some variation in them
        for (i = 1; i < 7; i += 1) {
            angle = Math.PI * 2 * i / 7;
            coords.unshift({
                x: Math.cos(angle) * size * random(0.5, 1),
                y: Math.sin(angle) * size * random(0.5, 1)
            });
            context.lineTo(coords[0].x, coords[0].y)
        }

        // Connect last point to the start
        context.lineTo(coords[6].x, coords[6].y)
    };
};

Asteroid.prototype = new Arcadia.Shape();

Asteroid.prototype.explode = function (asteroidPool, particleEmitterPool) {
    var a;

    if (this.type === 'large') {
        // Create some "medium" asteroids
        for (var i = 0; i < 3; i +=1) {
            a = asteroidPool.activate()
            a.size = { width: 60, height: 60 };
            a.position = { x: this.position.x, y: this.position.y };
            a.speed = 50;
            a.type = 'medium';
        }

    } else if (this.type === 'medium') {
        // Create some "small" asteroids
        for (var i = 0; i < 4; i +=1) {
            a = asteroidPool.activate()
            a.size = { width: 30, height: 30 };
            a.position = { x: this.position.x, y: this.position.y };
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
        x: Math.random(),
        y: Math.random()
    };
    this.angularVelocity = Math.random() * 0;
    this.speed = 15;
    this.size = { width: 100, height: 100 };
    this.type = 'large';
};

Asteroid.prototype.update = function (delta) {
    Arcadia.Shape.prototype.update.call(this, delta);

    // Automatically wrap around the screen
    if (this.position.x + this.size.width / 2 > Arcadia.WIDTH) {
        this.position.x = this.size.width / 2;
    }

    if (this.position.x - this.size.width / 2 < 0) {
        this.position.x = Arcadia.WIDTH - this.size.width / 2;
    }

    if (this.position.y + this.size.height / 2 > Arcadia.HEIGHT) {
        this.position.y = this.size.height / 2;
    }

    if (this.position.y - this.size.height / 2 < 0) {
        this.position.y = Arcadia.HEIGHT - this.size.height / 2;
    }
};
