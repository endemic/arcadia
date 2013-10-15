/*jslint sloppy: true, plusplus: true, browser: true */
/*globals Vectr */

/**
 * @constructor
 */
Vectr.Button = function (x, y, text) {
    Vectr.GameObject.apply(this, arguments);

    this.label = new Vectr.Label(x, y, text, font);
    this.backgroundColor = backgroundColor || color;
    this.height = parseInt(this.label.fonts.size, 10);
    this.solid = true;
    this.padding = 10;

    // Attach event listeners
    this.onPointEnd = this.onPointEnd.bind(this);
    Vectr.instance.element.addEventListener('mouseup', this.onPointEnd, false);
    Vectr.instance.element.addEventListener('touchend', this.onPointEnd, false);
};

/**
 * @description Set prototype
 */
Vectr.Button.prototype = new Vectr.GameObject();

/**
 * @description Draw object
 * @param {CanvasRenderingContext2D} context
 */
Vectr.Button.prototype.draw = function (context) {
    if (this.active === false) {
        return;
    }

    // Draw child objects first, so they will be on the "bottom"
    Vectr.GameObject.prototype.draw.call(this, context, this.position.x, this.position.y);

    this.width = this.label.width(context);

    // Draw button background/border
    context.save();
    context.translate(this.position.x, this.position.y);

    if (this.solid === true) {
        context.fillStyle =  this.backgroundColor;
        context.fillRect(-this.width / 2 - this.padding / 2, -this.height / 2 - this.padding, this.width + this.padding, this.height + this.padding);
    } else {
        context.strokeStyle = this.backgroundColor;
        context.strokeRect(-this.width / 2 - this.padding / 2, -this.height / 2 - this.padding / 2, this.width + this.padding, this.height + this.padding);
    }
    context.restore();
};

/**
 * @description Update object
 * @param {Number} delta Time since last update (in seconds)
 */
Vectr.Label.prototype.update = function (delta) {
    if (this.active === false) {
        return;
    }

    // Update child objects
    Vectr.GameObject.prototype.update.call(this, delta);
};

/**
 * @description If touch/mouse end is inside button, execute the user-supplied callback
 */
Vectr.Button.prototype.onPointEnd = function (event) {
    if (this.active === false || typeof this.onUp !== "function") {
        return;
    }

    Vectr.getPoints(event);

    if (event.type.indexOf('mouse') !== -1) {
        if (this.containsPoint(Vectr.instance.points[0].x, Vectr.instance.points[0].y)) {
            this.onUp();
        }
    } else {
        var i = Vectr.instance.points.length;
        while (i--) {
            if (this.containsPoint(Vectr.instance.points[i].x, Vectr.instance.points[i].y)) {
                this.onUp();
                break;
            }
        }
    }
};

/**
 * @description Helper method to determine if mouse/touch is inside button graphic
 */
Vectr.Button.prototype.containsPoint = function (x, y) {
    return x < this.position.x + this.width / 2 + this.padding / 2 &&
        x > this.position.x - this.width / 2 - this.padding / 2 &&
        y < this.position.y + this.height / 2 &&
        y > this.position.y - this.height / 2 - this.padding;
};

/**
 * @description Clean up event listeners
 */
Vectr.Button.prototype.destroy = function () {
    Vectr.instance.element.removeEventListener('mouseup', this.onPointEnd, false);
    Vectr.instance.element.removeEventListener('touchend', this.onPointEnd, false);
};
