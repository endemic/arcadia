/*jslint sloppy: true, plusplus: true, browser: true */
/*globals Vectr */

/**
 * @constructor
 * @description Basic particle emitter
 * @param {number} [count=25] The number of particles created for the system
 * @param {number} [duration=1] Length of time the particles appear (in seconds)
 * @param {string} [shape='square'] Shape of the particles. Accepts strings that are valid for Shapes (e.g. "circle", "triangle")
 * @param {number} [size=10] Size of the particles
 * @param {string} [color='rgba(255, 255, 255, 1)'] Color of particles, 'rgba(x, x, x, x)' format
 * @param {boolean} [fade=false] Whether to fade the particles out when they are displayed
 */
Vectr.Emitter = function (shape, size, color, count, duration, fade) {
    var particle,
        tmp;

    count = count || 25;
    this.duration = duration || 1;
    this.fade = fade || false;
    this.particles = new Vectr.Pool();
    this.speed = 200;

    if (tmp = color.match(/^rgba\((\d+),\s?(\d+),\s?(\d+),\s?(\d?\.?\d*)\)$/)) {
        this.color = {
            'red': parseInt(tmp[1], 10),
            'green': parseInt(tmp[2], 10),
            'blue': parseInt(tmp[3], 10)
        };
    }

    while (count--) {
        particle = new Vectr.Shape(0, 0, shape, size);
        particle.active = false;
        particle.solid = true;
        this.particles.add(particle);
    }
};

/**
 * @description Activate a particle emitter
 * @param {number} x Position of emitter on x-axis
 * @param {number} y Position of emitter on y-axis
 */
Vectr.Emitter.prototype.start = function (x, y) {
    this.particles.activateAll();
    this.active = true;

    var direction,
        i = this.particles.length;

    while (i--) {
        this.particles.at(i).position.x = x;
        this.particles.at(i).position.y = y;

        // Set random velocity/speed
        direction = Math.random() * 2 * Math.PI;
        this.particles.at(i).velocity.x = Math.cos(direction);
        this.particles.at(i).velocity.y = Math.sin(direction);
        this.particles.at(i).speed = Math.random() * this.speed;
        this.particles.at(i).color.red = this.color.red;
        this.particles.at(i).color.green = this.color.green;
        this.particles.at(i).color.blue = this.color.blue;
        this.particles.at(i).color.alpha = 1;
    }

    this.timer = 0;
};

Vectr.Emitter.prototype.draw = function (context) {
    var i = this.particles.length;
    while (i--) {
        this.particles.at(i).draw(context);
    }
};

Vectr.Emitter.prototype.update = function (delta) {
    this.timer += delta;

    var i = this.particles.length;

    if (i === 0) {
        this.active = false;
    }

    while (i--) {
        this.particles.at(i).update(delta);

        if (this.fade) {
            this.particles.at(i).color.alpha -= delta / this.duration;
        }

        if (this.timer >= this.duration) {
            this.particles.deactivate(i);
        }
    }
};