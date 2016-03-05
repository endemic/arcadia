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

        this.duration = 1;
        this.fade = false;
        this.scale = 1;
        this.speed = 200;
        this.i = null;
        this.particle = null;

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
    Emitter.prototype.startAt = function (x, y) {
        this.timer = 0;
        this.position.x = x;
        this.position.y = y;

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

        this.timer += delta;

        var index = this.children.length;
        var particle;

        while (index--) {
            particle = this.children.at(index);

            //particle.colors.alpha -= delta / this.duration if this.fade

            if (this.scale !== 1) {
                particle.scale += this.scale * delta / this.duration;
            }

            if (this.timer >= this.duration) {
                this.children.deactivate(index);
            }
        }
    };

    Emitter.prototype.reset = function () {
        var index = this.children.length;

        while (index--) {
            if (this.children.at(index).reset) {
                this.children.at(index).reset();
            }
        }
    };

    Arcadia.Emitter = Emitter;

    root.Arcadia = Arcadia;
}(window));
