/*jslint browser, this */
/*global window */

(function (root) {
    'use strict';

    var Arcadia = root.Arcadia || {};

    /**
     * @constructor
     * @param {Function} factory Factory function that returns a Shape object, to use as a particle
     * @param {Number} [count=25] The number of particles created for the system
     */
    var Emitter = function (factory, count) {
        count = count || 25;
        if (typeof factory !== 'function') {
            throw new Error('Emitter requires a factory function');
        }

        Arcadia.GameObject.apply(this, arguments);
        // TODO: allow these to be set via options arg
        /*
            wishlist:
            1. Fade particles over duration
            2. scale particles over duration
            3. Speed range (minSpeed/maxSpeed)
            4. direction range (i.e. over unit circle)
        */
        this.duration = 1;
        this.fade = false;
        this.scale = 1;
        this.speed = 200;
        this.infinite = false;

        while (count--) {
            this.children.add(factory());
        }

        this.children.deactivateAll();
    };

    Emitter.prototype = new Arcadia.GameObject();

    /**
     * @description Activate a particle emitter
     * @param {number} x Position of emitter on x-axis
     * @param {number} y Position of emitter on y-axis
     */
    Emitter.prototype.activate = function () {
        this.elapsed = 0;

        this.children.activateAll();
        this.reset();

        var index = this.children.length;
        var particle;
        var direction;

        while (index--) {
            particle = this.children.at(index);

            particle.position.x = x;
            particle.position.y = y;

            direction = Math.random() * 2 * Math.PI;
            particle.velocity.x = Math.cos(direction);
            particle.velocity.y = Math.sin(direction);

            particle.speed = Math.random() * this.speed;
        }
    };

    Emitter.prototype.update = function (delta) {
        Arcadia.GameObject.prototype.update.call(this, delta);

        this.elapsed += delta;

        var index = this.children.length;
        var particle;

        while (index--) {
            particle = this.children.at(index);
            particle.elapsed += delta;

            if (this.fade) {
                particle.alpha -= delta / this.duration;
            }

            if (this.scale !== 1) {
                particle.scale += this.scale * delta / this.duration;
            }

            if (particle.elapsed >= this.duration) {
                this.children.deactivate(index);
            }
        }
    };

    Emitter.prototype.reset = function () {
        var index = this.children.length;

        while (index--) {
            if (typeof this.children.at(index).reset === 'function') {
                this.children.at(index).reset();
            }
        }
    };

    Arcadia.Emitter = Emitter;

    root.Arcadia = Arcadia;
}(window));
