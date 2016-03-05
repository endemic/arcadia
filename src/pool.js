/**
 * @description One possible way to store common recyclable objects.
 * Assumes the objects you add will have an `active` property, and optionally an
 * `activate()` method which resets the object's state. Inspired by Programming
 * Linux Games (http://en.wikipedia.org/wiki/Programming_Linux_Games)
 */

 /*jslint browser, this */
 /*global window */

(function (root) {
    'use strict';

    var Arcadia = root.Arcadia || {};

    var Pool = function () {
        this.active = [];
        this.inactive = [];

        // Instantiate/return child objects using factory
        this.factory = null;
    };

    /**
     * @description Get length of "active" objects
     */
    Object.defineProperty(Pool.prototype, 'length', {
        enumerable: true,
        get: function () {
            return this.active.length;
        }
    });

    /**
     * @description Convenience accessor
     */
    Pool.prototype.at = function (index) {
        return this.active[index];
    };

    /**
     * @description Add an object into the recycle pool
     * list is z-sorted from 0 -> n, higher z-indices are drawn first
     */
    Pool.prototype.add = function (object) {
        // Add a z-index property
        if (!object.zIndex) {
            object.zIndex = this.active.length + this.inactive.length;
        }

        var index = 0;

        while (index < this.length && object.zIndex > this.active[index].zIndex) {
            index += 1;
        }

        this.active.splice(index, 0, object);

        return this.length;
    };

    /**
     * @description Remove an object from the recycle pool
     */
    Pool.prototype.remove = function (object) {
        var index;

        if (typeof object === 'number') {
            index = object;
            object = this.active.splice(index, 1)[0];
            if (typeof object.destroy === 'function') {
                object.destroy();
            }
            return object;
        }

        if (this.active.indexOf(object) !== -1) {
            index = this.active.indexOf(object);
            object = this.active.splice(index, 1)[0];
            if (typeof object.destroy === 'function') {
                object.destroy();
            }
            return object;
        }

        if (this.inactive.indexOf(object) !== -1) {
            index = this.inactive.indexOf(object);
            object = this.inactive.splice(index, 1)[0];
            if (typeof object.destroy === 'function') {
                object.destroy();
            }
            return object;
        }
    };

    /**
     * @description Get an active object by reference
     */
    Pool.prototype.activate = function (object) {
        var index;

        // Move a specific inactive object into active
        if (object) {
            index = this.inactive.indexOf(object);

            // Return undefined if object is or not found
            if (index === -1) {
                return;
            }

            object = this.inactive.splice(index, 1)[0];
            if (typeof object.reset === 'function') {
                object.reset();
            }

            // swap with another inactive object
            this.index = this.length;
            while (this.index > 0 && this.active[this.index - 1].zIndex > object.zIndex) {
                this.active[this.index] = this.active[this.index - 1];
                this.index -= 1;
            }

            this.active[this.index] = object;

            return object;
        }

        // Move a random inactive object into active
        if (!object && this.inactive.length) {
            object = this.inactive.shift();
            if (typeof object.reset === 'function') {
                object.reset();
            }

            this.index = this.length;
            while (this.index > 0 && this.active[this.index - 1].zIndex > object.zIndex) {
                this.active[this.index] = this.active[this.index - 1];
                this.index -= 1;
            }

            this.active[this.index] = object;

            return object;
        }

        // Generate a new object and add to active
        if (typeof this.factory !== 'function') {
            throw new Error('You tried to activate a Pool object without a factory.');
        }

        this.add(this.factory());
        return this.active[this.length - 1];
    };

    /**
     * @description Deactivate an active object at a particular object/index
     */
    Pool.prototype.deactivate = function (objectOrIndex) {
        var index;

        if (typeof objectOrIndex !== 'number') {
            index = this.active.indexOf(objectOrIndex);
        } else {
            index = objectOrIndex;
        }

        // TODO: Spec this behavior
        if (index === -1) {
            return;
        }

        // Save reference to deactivated object
        var object = this.active.splice(index, 1)[0];

        this.inactive.push(object);

        return object;
    };

    /**
     * @description Deactivate all child objects
     */
    Pool.prototype.deactivateAll = function () {
        this.index = this.length;
        while (this.index--) {
            this.deactivate(this.index);
        }
    };

    /**
     * @description Activate all child objects
     */
    Pool.prototype.activateAll = function () {
        while (this.inactive.length) {
            this.activate();
        }
    };

    /**
     * @description Passthrough method to update active child objects
     */
    Pool.prototype.update = function (delta) {
        this.index = this.length;
        while (this.index--) {
            this.at(this.index).update(delta);
        }
    };

    /**
     * @description Passthrough method to draw active child objects
     */
    Pool.prototype.draw = function () {
        this.index = this.length;
        while (this.index--) {
            this.at(this.index).draw.apply(this.at(this.index), arguments);
        }
    };

    /**
     * @description Event handler for "start" pointer event
     * this.param {Array} points Array of touch/mouse coordinates
     */
    Pool.prototype.onPointStart = function (points) {
        this.index = this.length;
        while (this.index--) {
            this.at(this.index).onPointStart(points);
        }
    };

    /**
     * @description Event handler for "move" pointer event
     * this.param {Array} points Array of touch/mouse coordinates
     */
    Pool.prototype.onPointMove = function (points) {
        this.index = this.length;
        while (this.index--) {
            this.at(this.index).onPointMove(points);
        }
    };

    /**
     * @description Event handler for "end" pointer event
     * this.param {Array} points Array of touch/mouse coordinates
     */
    Pool.prototype.onPointEnd = function (points) {
        this.index = this.length;
        while (this.index--) {
            this.at(this.index).onPointEnd(points);
        }
    };

    Arcadia.Pool = Pool;

    root.Arcadia = Arcadia;
}(window));
