/*jslint sloppy: true, plusplus: true, browser: true */
/*globals Vectr */

var Vectr = window.Vectr || {};

/**
 * @constructor
 */
Vectr.Scene = function () {
    Vectr.GameObject.apply(this, arguments);

    // TODO: implement a camera view/drawing offset
    this.camera = null;
};

/**
 * @description Set prototype
 */
Vectr.Scene.prototype = new Vectr.GameObject();

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
    Vectr.GameObject.prototype.draw.call(this, context, this.position.x, this.position.y);
};
