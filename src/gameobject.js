/*jslint browser, this */
/*global window */

(function (root) {
    var Arcadia = root.Arcadia || {};

    /**
     * @constructor
     */
    Arcadia.GameObject = function (options) {
        this.scale = 1;
        this.rotation = 0; // in radians
        this.alpha = 1;
        this.enablePointEvents = false;
        this.position = {x: 0, y: 0};
        this.children = new Pool();

        // Assign any props passed in through options
        // TODO: determine if there are reference problems here when setting position
        // previous implementation was `@position = { x: args.position.x, y: args.position.y }`
        for (property of Object.keys(options)) {
            this[property] = options[property];
        }
    };

    /**
     * @description Draw child objects
     * @param {CanvasRenderingContext2D} context
     */
    Arcadia.GameObject.prototype.draw = function () {
        this.children.draw.apply(this.children, arguments);
    };

    /**
     * @description Update child objects
     * @param {Number} delta Time since last update (in seconds)
     */
    Arcadia.GameObject.prototype.update = function (delta) {
        this.children.update(delta);
    };

    /**
     * @description Add child object to self
     * @param {Object} object Object to be added
     */
    Arcadia.GameObject.prototype.add = function (object) {
        this.children.add(object);
    };

    /**
     * @description Remove child object
     * @param {Object} objectOrIndex Object or index of object to be removed
     */
    Arcadia.GameObject.prototype.remove = function (objectOrIndex) {
        this.children.remove(objectOrIndex);
    };

    /**
     * @description Activate child object
     * @param {Object} objectOrIndex Object or index of object to be activated
     */
    Arcadia.GameObject.prototype.activate = function (objectOrIndex) {
        this.children.activate(objectOrIndex);
    };

    /**
     * @description Deactivate child object
     * @param {Object} objectOrIndex Object or index of object to be deactivated
     */
    Arcadia.GameObject.prototype.deactivate = function (objectOrIndex) {
        this.children.deactivate(objectOrIndex);
    };

    /**
     * @description Event handler for "start" pointer event
     * @param {Array} points Array of touch/mouse coordinates
     */
    Arcadia.GameObject.prototype.onPointStart = function (points) {
        if (!this.enablePointEvents) {
            return;
        }

        this.children.onPointStart(points);
    };

    /**
     * @description Event handler for "move" pointer event
     * @param {Array} points Array of touch/mouse coordinates
     */
    Arcadia.GameObject.prototype.onPointMove = function (points) {
        if (!this.enablePointEvents) {
            return;
        }

        this.children.onPointMove(points);
    };

    /**
     * @description Event handler for "end" pointer event
     * @param {Array} points Array of touch/mouse coordinates
     */
    Arcadia.GameObject.prototype.onPointEnd = function (points) {
        if (!this.enablePointEvents) {
            return;
        }

        this.children.onPointEnd(points);
    };
}(window));
