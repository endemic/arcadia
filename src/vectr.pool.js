/*jslint sloppy: true, plusplus: true, browser: true */
/*globals Vectr */

/**
* @description Object pool; One possible way to store common recyclable objects
*/
Vectr.Pool = function () {
    this.length = 0;
    this.children = [];       // Active objects
    this.inactive = [];     // Deadpool
    this.i = 0;             // in-memory iterator/object storage
};

/**
 * @description Get the next "inactive" object in the Pool
 */
Vectr.Pool.prototype.activate = function () {
    if (this.inactive.length === 0) {
        return null;
    }

    this.i = this.inactive.pop();
    this.i.active = true;
    this.children.push(this.i);
    this.length += 1;

    return this.i;
};

/**
 * @description Activate all the objects in the pool
 */
Vectr.Pool.prototype.activateAll = function () {
    while (this.inactive.length) {
        this.i = this.inactive.pop();
        this.i.active = true;
        this.children.push(this.i);
        this.length += 1;
    }
};

/**
 * @description Move object to the deadpool
 */
Vectr.Pool.prototype.deactivate = function (index) {
    if (this.children[index] === undefined) {
        return;
    }

    this.children[index].active = false;
    this.inactive.push(this.children[index]);

    // Shift array contents downward
    for (this.i = index; this.i < this.children.length - 1; this.i += 1) {
        this.children[this.i] = this.children[this.i + 1];
    }

    this.children.length -= 1;
    this.length -= 1;

    if (this.length === 0) {
        this.active = false;
    }
};

/**
 * @description Move object to the deadpool
 */
Vectr.Pool.prototype.deactivateAll = function () {
    while (this.children.length) {
        this.i = this.children.pop();
        this.i.active = false;
        this.inactive.push(this.i);
        this.length -= 1;
    }
};

/**
 * @description Convenience method to access a particular child index
 */
Vectr.Pool.prototype.at = function (index) {
    return this.children[index] || null;
};

/**
 * @description Add object to one of the lists
 */
Vectr.Pool.prototype.add = function (object) {
    if (typeof object === "object" && object.active === true) {
        this.children.push(object);
        this.length += 1;
    } else {
        this.inactive.push(object);
    }
};


/**
 * @description "Passthrough" method which updates active child objects
 */
Vectr.Pool.prototype.update = function (delta) {
    this.i = this.children.length;

    while (this.i--) {
        this.children[this.i].update(delta);

        // If a child object is marked as "inactive," move it to the dead pool
        if (this.children[this.i].active === false) {
            this.deactivate(this.i);
        }
    }
};

/**
 * @description "Passthrough" method which draws active child objects
 */
Vectr.Pool.prototype.draw = function (context) {
    this.i = this.children.length;

    while (this.i--) {
        this.children[this.i].draw(context, 0, 0);
    }
};