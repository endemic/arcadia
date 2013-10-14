/*jslint sloppy: true, plusplus: true, browser: true */
/*globals Vectr */

/**
 * @description Shape constructor
 * @param {Number} x Position of shape on x-axis
 * @param {Number} y Position of shape on y-axis
 * @param {String} shape String representing what to draw
 * @param {Number} size Size of shape in pixels
 */
Vectr.Shape = function (x, y, shape, size) {
    this.shape = shape || 'square';
    this.size = size || 10;
    this.lineWidth = 1;
    this.lineJoin = 'round';            // miter, round, bevel
    this.scale = 1;
    this.speed = 1;
    this.rotation = 0;
    this.position = {
        'x': x,
        'y': y
    };
    this.velocity = {
        'x': 0,
        'y': 0
    };
    this.active = true;
    this.solid = false;

    // Default color - white w/ no alpha
    this.colors = {
        'red': 255,
        'green': 255,
        'blue': 255,
        'alpha': 1
    };

    // Default glow size - none
    this.glow = 0;
};

/**
 * @description Getter/setter for color value
 */
Object.defineProperty(Vectr.Shape.prototype, 'color', {
    get: function () {
        return 'rgba(' + this.colors.red + ', ' + this.colors.green + ', ' + this.colors.blue + ', ' + this.colors.alpha + ')';
    },
    set: function (color) {
        if (typeof color !== 'string') {
            return;
        }

        var tmp = color.match(/^rgba\((\d+),\s?(\d+),\s?(\d+),\s?(\d?\.?\d*)\)$/);

        if (tmp.length === 5) {
            this.colors.red = parseInt(tmp[1], 10);
            this.colors.green = parseInt(tmp[2], 10);
            this.colors.blue = parseInt(tmp[3], 10);
            this.colors.alpha = parseFloat(tmp[4], 10);
        }
    }
});

Vectr.Shape.prototype.draw = function (context) {

    if (this.active === false) {
        return;
    }

    context.save();
    context.translate(this.position.x, this.position.y);

    // Debug anchor point
    // context.fillStyle = 'rgb(0, 255, 0)';
    // context.beginPath();
    // context.arc(0, 0, 1, 360, false);
    // context.closePath();
    // context.fill();
    // End debug anchor point

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
        context.shadowColor = 'rgba(' + this.colors.red + ', ' + this.colors.green + ', ' + this.colors.blue + ', ' + this.colors.alpha + ')';
    }

    context.lineWidth = this.lineWidth;
    context.lineJoin = this.lineJoin;

    // Allow sprite objects to have custom draw functions
    if (typeof this.customPath === "function") {
        this.customPath(context);
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
            context.arc(0, 0, this.size / 2, 360, false);
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
            context.fillStyle = 'rgba(' + this.colors.red + ', ' + this.colors.green + ', ' + this.colors.blue + ', ' + this.colors.alpha + ')';
            context.fill();
        } else {
            context.strokeStyle = 'rgba(' + this.colors.red + ', ' + this.colors.green + ', ' + this.colors.blue + ', ' + this.colors.alpha + ')';
            context.stroke();
        }
    }

    context.restore();
};

Vectr.Shape.prototype.update = function (dt) {
    if (this.active === false) {
        return;
    }

    this.position.x += this.velocity.x * this.speed * dt;
    this.position.y += this.velocity.y * this.speed * dt;
};

Vectr.Shape.prototype.collidesWith = function (other) {
    if (this.shape === 'square') {
        return Math.abs(this.position.x - other.position.x) < this.size / 2 + other.size / 2 && Math.abs(this.position.y - other.position.y) < this.size / 2 + other.size / 2;
    }
    return Math.sqrt(Math.pow(other.position.x - this.position.x, 2) + Math.pow(other.position.y - this.position.y, 2)) < this.size / 2 + other.size / 2;
};