/*jslint sloppy: true, plusplus: true, browser: true */
/*globals Vectr */

/**
 * @constructor
 * @description Basic particle emitter
 * @param {string} [shape='square'] Shape of the particles. Accepts strings that are valid for Shapes (e.g. "circle", "triangle")
 * @param {number} [size=10] Size of the particles
 * @param {number} [count=25] The number of particles created for the system
 */
Vectr.Emitter = function (shape, size, count) {
    Vectr.GameObject.apply(this, arguments);

    var particle;

    this.particles = new Vectr.Pool();
    this.duration = 1;
    this.fade = false;
    this.speed = 200;
    count = count || 25;

    while (count--) {
        particle = new Vectr.Shape(0, 0, shape || 'square', size || 5);
        particle.active = false;
        particle.solid = true;
        this.particles.add(particle);
    }
};

/**
 * @description Set prototype
 */
Vectr.Emitter.prototype = new Vectr.GameObject();

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
        this.particles.at(i).color = this.color;
    }

    this.timer = 0;
};

Vectr.Emitter.prototype.draw = function (context) {
    if (this.active === false) {
        return;
    }

    this.particles.draw(context);
};

Vectr.Emitter.prototype.update = function (delta) {
    if (this.active === false) {
        return;
    }

    var i = this.particles.length;

    if (i === 0) {
        this.active = false;
    }

    this.particles.update(delta);

    this.timer += delta;

    while (i--) {

        if (this.fade) {
            this.particles.at(i).colors.alpha -= delta / this.duration;
        }

        if (this.timer >= this.duration) {
            this.particles.deactivate(i);
        }
    }
};