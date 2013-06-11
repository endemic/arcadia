/*jslint sloppy: true, plusplus: true, browser: true */
/*globals Vectr */

/**
 * @constructor
 */
Vectr.Scene = function () {
    // Store game objects
    this.children = [];
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

    var i = this.children.length;
    while (i--) {
        this.children[i].draw(context);
    }
};

/**
 * @description Update all child objects
 * @param {Number} delta Time since last update (in seconds)
 */
Vectr.Scene.prototype.update = function (delta) {
    var i = this.children.length;
    while (i--) {
        this.children[i].update(delta);
    }
};

/**
 * @description Add an object to the draw/update loop
 * @param {Shape} object
 */
Vectr.Scene.prototype.add = function (object) {
    this.children.push(object);
};

/**
 * @description Remove a Shape object from the Scene
 * @param {Shape} object Shape to be removed; consider setting shape.active = false; instead to re-use the shape later
 */
Vectr.Scene.prototype.remove = function (object) {
    var index = this.children.indexOf(object);

    if (index !== -1) {
        this.children.splice(index, 1);
    }
};

/**
 * @description Clean up all child objects
 */
Vectr.Scene.prototype.destroy = function () {
    var i = this.children.length;
    while (i--) {
        if (typeof this.children[i].destroy === "function") {
            this.children[i].destroy();
        }
    }
};