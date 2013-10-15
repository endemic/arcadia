/*jslint sloppy: true, plusplus: true, browser: true */
/*globals Vectr */

Vectr.GameObject = function (x, y) {
    this.position = {
        'x': x || 0,
        'y': y || 0
    };

    this.active = true;
    this.scale = 1;
    this.rotation = 0;
    this.glow = 0;
    this.colors = {
        'red': 255,
        'green': 255,
        'blue': 255,
        'alpha': 1
    };
    this.children = [];
    this.i = 0;
};


/**
 * @description Draw child objects
 * @param {CanvasRenderingContext2D} context
 */
Vectr.GameObject.prototype.draw = function (context, offsetX, offsetY) {
    if (this.active === false) {
        return;
    }

    if (offsetX === undefined) {
        offsetX = 0;
    }

    if (offsetY === undefined) {
        offsetY = 0;
    }

    this.i = this.children.length;
    while (this.i--) {
        this.children[this.i].draw(context, offsetX - this.position.x, offsetY - this.position.y);
    }
};

/**
 * @description Update all child objects
 * @param {Number} delta Time since last update (in seconds)
 */
Vectr.GameObject.prototype.update = function (delta) {
    if (this.active === false) {
        return;
    }

    this.i = this.children.length;
    while (this.i--) {
        this.children[this.i].update(delta);
    }
};

/**
 * @description Add an object to the draw/update loop
 * @param {Shape} object
 */
Vectr.GameObject.prototype.add = function (object) {
    this.children.push(object);
};

/**
 * @description Remove a Shape object from the GameObject
 * @param {Shape} object Shape to be removed; consider setting shape.active = false; instead to re-use the shape later
 */
Vectr.GameObject.prototype.remove = function (object) {
    this.i = this.children.indexOf(object);

    if (this.i !== -1) {
        this.children.splice(this.i, 1);
    }
};

/**
 * @description Clean up all child objects
 */
Vectr.GameObject.prototype.destroy = function () {
    this.i = this.children.length;
    while (this.i--) {
        if (typeof this.children[this.i].destroy === "function") {
            this.children[this.i].destroy();
        }
    }
};
