/*jslint sloppy: true, plusplus: true, browser: true */
/*globals Vectr */

var Vectr = window.Vectr || {};

/**
 * @description Shape constructor
 * @param {Number} x Position of shape on x-axis
 * @param {Number} y Position of shape on y-axis
 * @param {String} shape String representing what to draw
 * @param {Number} size Size of shape in pixels
 */
Vectr.Shape = function (x, y, shape, size) {
    Vectr.GameObject.apply(this, arguments);

    this.shape = shape || 'square';
    this.size = size || 10;
    this.lineWidth = 1;
    this.lineJoin = 'round';            // miter, round, bevel
    this.speed = 1;
    this.velocity = {
        'x': 0,
        'y': 0
    };
    this.solid = false;
};

/**
 * @description Set prototype
 */
Vectr.Shape.prototype = new Vectr.GameObject();

/**
 * @description Draw object
 * @param {CanvasRenderingContext2D} context
 */
Vectr.Shape.prototype.draw = function (context, offsetX, offsetY) {
    if (this.active === false) {
        return;
    }

    // Draw child objects first, so they will be on the "bottom"
    Vectr.GameObject.prototype.draw.call(this, context, this.position.x + offsetX, this.position.y + offsetY);

    context.save();
    context.translate(this.position.x + offsetX, this.position.y + offsetY);

    if (this.scale !== 1) {
        context.scale(this.scale, this.scale);
    }

    if (this.rotation !== 0 && this.rotation !== Math.PI * 2) {
        context.rotate(this.rotation);
    }

    if (this.glow > 0) {
        context.shadowOffsetX = 0;
        context.shadowOffsetY = 0;
        context.shadowBlur = this.glow;
        context.shadowColor = this.color;
    }

    context.lineWidth = this.lineWidth;
    context.lineJoin = this.lineJoin;

    // Allow sprite objects to have custom draw functions
    if (typeof this.path === "function") {
        this.path(context);
    } else {
        context.beginPath();
        switch (this.shape) {
        case 'triangle':
            context.moveTo(this.size / 2 * Math.cos(0), this.size / 2 * Math.sin(0));
            context.lineTo(this.size / 2 * Math.cos(120 * Math.PI / 180), this.size / 2 * Math.sin(120 * Math.PI / 180));
            context.lineTo(this.size / 2 * Math.cos(240 * Math.PI / 180), this.size / 2 * Math.sin(240 * Math.PI / 180));
            context.lineTo(this.size / 2 * Math.cos(0), this.size / 2 * Math.sin(0));
            break;
        case 'circle':
            context.arc(0, 0, this.size / 2, Math.PI * 2, false);
            break;
        case 'square':
            context.moveTo(this.size / 2, this.size / 2);
            context.lineTo(this.size / 2, -this.size / 2);
            context.lineTo(-this.size / 2, -this.size / 2);
            context.lineTo(-this.size / 2, this.size / 2);
            context.lineTo(this.size / 2, this.size / 2);
            break;
        }
        context.closePath();

        if (this.solid === true) {
            context.fillStyle = this.color;
            context.fill();
        } else {
            context.strokeStyle = this.color;
            context.stroke();
        }
    }

    context.restore();
};

/**
 * @description Update object
 * @param {Number} delta Time since last update (in seconds)
 */
Vectr.Shape.prototype.update = function (delta) {
    if (this.active === false) {
        return;
    }

    this.position.x += this.velocity.x * this.speed * delta;
    this.position.y += this.velocity.y * this.speed * delta;

    // Update child objects
    Vectr.GameObject.prototype.update.call(this, delta);
};

/**
 * @description Basic collision detection
 * @param {Shape} other Shape object to test collision with
 */
Vectr.Shape.prototype.collidesWith = function (other) {
    if (this.shape === 'square') {
        return Math.abs(this.position.x - other.position.x) < this.size / 2 + other.size / 2 && Math.abs(this.position.y - other.position.y) < this.size / 2 + other.size / 2;
    }
    return Math.sqrt(Math.pow(other.position.x - this.position.x, 2) + Math.pow(other.position.y - this.position.y, 2)) < this.size / 2 + other.size / 2;
};
