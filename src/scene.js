/*jslint browser, this */
/*global window */

(function (root) {
    'use strict';

    var Arcadia = root.Arcadia || {};

    /**
     * @constructor
     */
    var Scene = function (options) {
        options = options || {};
        Arcadia.GameObject.call(this, options);

        var DEFAULT_SIZE = {
            width: Arcadia.VIEWPORT_WIDTH,
            height: Arcadia.VIEWPORT_HEIGHT
        };

        this.size = options.size || DEFAULT_SIZE;
        this.enablePointEvents = true;

        // implement a camera view/drawing offset
        this.camera = {
            target: null,
            viewport: {
                width: Arcadia.VIEWPORT_WIDTH,
                height: Arcadia.VIEWPORT_HEIGHT
            },
            position: {x: 0, y: 0}
        };
    };

    Scene.prototype = new Arcadia.GameObject();

    /**
     * @description Update the camera if necessary
     * @param {Number} delta
     */
    Scene.prototype.update = function (delta) {
        Arcadia.GameObject.prototype.update.call(this, delta);

        if (!this.camera.target) {
            return;
        }

        // Follow the target, keeping it in the center of the screen...
        this.camera.position.x = this.camera.target.position.x;
        this.camera.position.y = this.camera.target.position.y;

        // Unless it is too close to boundaries, in which case keep the cam steady
        if (this.camera.position.x < this.camera.bounds.left + this.camera.viewport.width / 2) {
            this.camera.position.x = this.camera.bounds.left + this.camera.viewport.width / 2;
        } else if (this.camera.position.x > this.camera.bounds.right - this.camera.viewport.width / 2) {
            this.camera.position.x = this.camera.bounds.right - this.camera.viewport.width / 2;
        }

        if (this.camera.position.y < this.camera.bounds.top + this.camera.viewport.height / 2) {
            this.camera.position.y = this.camera.bounds.top + this.camera.viewport.height / 2;
        } else if (this.camera.position.y > this.camera.bounds.bottom - this.camera.viewport.height / 2) {
            this.camera.position.y = this.camera.bounds.bottom - this.camera.viewport.height / 2;
        }
    };

    /**
     * @description Clear context, then re-draw all child objects
     * @param {CanvasRenderingContext2D} context
     */
    Scene.prototype.draw = function (context) {
        // TODO: change this to `clearColor` or something
        if (this.color) {
            context.fillStyle = this.color;
            context.fillRect(0, 0, context.canvas.width, context.canvas.height);
        } else {
            context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        }

        var origin = {
            x: this.camera.viewport.width / 2 - this.camera.position.x,
            y: this.camera.viewport.height / 2 - this.camera.position.y
        };

        // Draw child objects
        Arcadia.GameObject.prototype.draw.call(this, context, origin.x, origin.y);
    };

    /**
     * @description Getter/setter for camera target
     */
    Object.defineProperty(Scene.prototype, 'target', {
        enumerable: true,
        get: function () {
            return this.camera && this.camera.target;
        },
        set: function (shape) {
            if (!shape.position) {
                throw new Error('Scene camera target requires a `position` property.');
            }

            this.camera.target = shape;
            this.camera.bounds = {
                top: -this.size.height / 2,
                bottom: this.size.height / 2,
                left: -this.size.width / 2,
                right: this.size.width / 2
            };
            this.camera.position.x = this.camera.target.position.x;
            this.camera.position.y = this.camera.target.position.y;
        }
    });

    Arcadia.Scene = Scene;

    root.Arcadia = Arcadia;
}(window));
