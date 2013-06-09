/*jslint sloppy: true, plusplus: true, browser: true */
/*globals Vectr */

Vectr.Shape = function (x, y, shape, size, color, shadow) {
    var tmp;

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
    this.color = {
        'red': 255,
        'green': 255,
        'blue': 255,
        'alpha': 1
    };

    if (typeof color === "string" && (tmp = color.match(/^rgba\((\d+),\s?(\d+),\s?(\d+),\s?(\d?\.?\d*)\)$/))) {
        this.color.red = parseInt(tmp[1], 10);
        this.color.green = parseInt(tmp[2], 10);
        this.color.blue = parseInt(tmp[3], 10);
        this.color.alpha = parseFloat(tmp[4], 10);
    }

    // Default shadow - none
    this.shadow = {
        'x': 0,
        'y': 0,
        'blur': 0,
        'color': {
            'red': 255,
            'green': 255,
            'blue': 255,
            'alpha': 1
        }
    };

    if (typeof shadow === "string" && (tmp = shadow.match(/^(\d+(?:px)?)\s(\d+(?:px)?)\s(\d+(?:px)?)\srgba\((\d+),\s?(\d+),\s?(\d+),\s?(\d?\.?\d*)\)$/))) {
        this.shadow.x = parseInt(tmp[1], 10);
        this.shadow.y = parseInt(tmp[2], 10);
        this.shadow.blur = parseInt(tmp[3], 10);

        this.shadow.color.red = parseInt(tmp[4], 10);
        this.shadow.color.green = parseInt(tmp[5], 10);
        this.shadow.color.blue = parseInt(tmp[6], 10);
        this.shadow.color.alpha = parseFloat(tmp[7], 10);
    }
};

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

    if (this.shadow.x > 0 || this.shadow.y > 0 || this.shadow.blur > 0) {
        context.shadowOffsetX = this.shadow.x;
        context.shadowOffsetY = this.shadow.y;
        context.shadowBlur = this.shadow.blur;
        context.shadowColor = 'rgba(' + this.shadow.color.red + ', ' + this.shadow.color.green + ', ' + this.shadow.color.blue + ', ' + this.shadow.color.alpha + ')';
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
            context.fillStyle = 'rgba(' + this.color.red + ', ' + this.color.green + ', ' + this.color.blue + ', ' + this.color.alpha + ')';
            context.fill();
        } else {
            context.strokeStyle = 'rgba(' + this.color.red + ', ' + this.color.green + ', ' + this.color.blue + ', ' + this.color.alpha + ')';
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