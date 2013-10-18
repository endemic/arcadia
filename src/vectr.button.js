/*jslint sloppy: true, plusplus: true, browser: true */
/*globals Vectr */

/**
 * @constructor
 */
Vectr.Button = function (x, y, text) {
    Vectr.GameObject.apply(this, arguments);

    this.label = new Vectr.Label(x, y, text);
    this.add(this.label);

    // Default border/background
    this.backgroundColors = {
        'red': 255,
        'green': 255,
        'blue': 255,
        'alpha': 1
    };

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

    this.width = this.label.width(context);

    // Draw button background/border
    context.save();
    context.translate(this.position.x, this.position.y);

    if (this.glow > 0) {
        context.shadowOffsetX = 0;
        context.shadowOffsetY = 0;
        context.shadowBlur = this.glow;
        context.shadowColor = this.color;
    }

    if (this.solid === true) {
        context.fillStyle =  this.backgroundColor;
        context.fillRect(-this.width / 2 - this.padding / 2, -this.height / 2 - this.padding / 2, this.width + this.padding, this.height + this.padding);
    } else {
        context.strokeStyle = this.backgroundColor;
        context.strokeRect(-this.width / 2 - this.padding / 2, -this.height / 2 - this.padding / 2, this.width + this.padding, this.height + this.padding);
    }
    context.restore();

    Vectr.GameObject.prototype.draw.call(this, context, this.position.x, this.position.y);
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

    var i = Vectr.instance.points.length;
    while (i--) {
        if (this.containsPoint(Vectr.instance.points[i].x, Vectr.instance.points[i].y)) {
            this.onUp();
            break;
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

/**
 * @description Getter/setter for background color value
 */
Object.defineProperty(Vectr.Button.prototype, 'backgroundColor', {
    get: function () {
        return 'rgba(' + this.backgroundColors.red + ', ' + this.backgroundColors.green + ', ' + this.backgroundColors.blue + ', ' + this.backgroundColors.alpha + ')';
    },
    set: function (color) {
        if (typeof color !== 'string') {
            return;
        }

        var tmp = color.match(/^rgba\((\d+),\s?(\d+),\s?(\d+),\s?(\d?\.?\d*)\)$/);

        if (tmp.length === 5) {
            this.backgroundColors.red = parseInt(tmp[1], 10);
            this.backgroundColors.green = parseInt(tmp[2], 10);
            this.backgroundColors.blue = parseInt(tmp[3], 10);
            this.backgroundColors.alpha = parseFloat(tmp[4], 10);
        }
    }
});

/**
 * @description Getter/setter for font value
 */
Object.defineProperty(Vectr.Button.prototype, 'font', {
    get: function () {
        return this.label.font;
    },
    set: function (font) {
        if (typeof font !== 'string') {
            return;
        }

        this.label.font = font;
    }
});

/**
 * @description Getter/setter for glow value
 */
// Object.defineProperty(Vectr.Button.prototype, 'glow', {
//     get: function () {
//         return this.glow;
//     },
//     set: function (value) {
//         this.glow = parseInt(value, 10);
//         this.label.glow = this.glow;
//     }
// });