/*jslint sloppy: true, plusplus: true, browser: true */
/*globals Vectr */

var Vectr = window.Vectr || {};

/**
 * @constructor
 */
Vectr.Scene = function () {
    Vectr.GameObject.apply(this, arguments);

    // implement a camera view/drawing offset
    this.camera = {
        target: null,
        viewport: {
            x: Vectr.WIDTH,
            y: Vectr.HEIGHT
        },
        bounds: {
            top: -Vectr.HEIGHT / 2,
            bottom: Vectr.HEIGHT / 2,
            left: -Vectr.WIDTH / 2,
            right: Vectr.WIDTH / 2
        },
        position: {
            x: 0,
            y: 0
        }
    };
};

/**
 * @description Set prototype
 */
Vectr.Scene.prototype = new Vectr.GameObject();

/**
 * @description Update the camera if necessary
 * @param {Number} delta
 */
Vectr.Scene.prototype.update = function (delta) {
    Vectr.Scene.prototype.update.call(this, delta);

    if (this.camera.target !== null) {
        // Follow the target, keeping it in the center of the screen
        this.camera.position = this.camera.target.position;

        // Unless it is too close to boundaries, in which case keep the cam steady
        if (this.camera.position.x < this.camera.bounds.left + this.camera.viewport.x / 2) {
            this.camera.position.x = this.camera.bounds.left + this.camera.viewport.x / 2;
        }

        if (this.camera.position.x > this.camera.bounds.right - this.camera.viewport.x / 2) {
            this.camera.position.x = this.camera.bounds.right + this.camera.viewport.x / 2;
        }

        if (this.camera.position.y < this.camera.bounds.bottom + this.camera.viewport.y / 2) {
            this.camera.position.y = this.camera.bounds.bottom + this.camera.viewport.y / 2;
        }

        if (this.camera.position.y > this.camera.bounds.top - this.camera.viewport.y / 2) {
            this.camera.position.y = this.camera.bounds.top + this.camera.viewport.y / 2;
        }
    }
};

/**
 * @description Clear context, then re-draw all child objects
 * @param {CanvasRenderingContext2D} context
 */
Vectr.Scene.prototype.draw = function (context) {
    if (typeof this.clearColor === "string") {
        // Clear w/ clear color
        context.save();
        context.fillStyle = this.clearColor;
        context.fillRect(0, 0, context.canvas.width, context.canvas.height);
        context.restore();
    } else {
        // Just erase
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    }

    // Draw child objects
    Vectr.GameObject.prototype.draw.call(this, context, this.camera.position.x, this.camera.position.y);
};
