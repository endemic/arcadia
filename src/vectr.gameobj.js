/*jslint sloppy: true, plusplus: true, browser: true */
/*globals Vectr */

Vectr.GameObject = function (x, y) {
    this.position = {
        'x': x,
        'y': y
    };

    this.active = true;
    this.children = [];
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

    var i = this.children.length;
    while (i--) {
        this.children[i].draw(context, offsetX - this.position.x, offsetY - this.position.y);
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

    var i = this.children.length;
    while (i--) {
        this.children[i].update(delta);
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
    var index = this.children.indexOf(object);

    if (index !== -1) {
        this.children.splice(index, 1);
    }
};