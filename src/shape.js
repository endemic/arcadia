/*jslint browser, this */
/*global window, Easie */

(function (root) {
    'use strict';

    var Arcadia = root.Arcadia || {};

    /**
     * @description Shape constructor
     * @param {Object} options Object representing shape options
     */
    var Shape = function (options) {
        Arcadia.GameObject.apply(this, arguments);

        // Internal cached drawing
        this.canvas = document.createElement('canvas');

        // Trigger initial cache draw
        this.dirty = true;

        // Hold animations
        this.tweens = [];

        // Default graphical options; changing these requires using
        // setters/getters, since the cache needs to be redrawn
        this._color = '#fff';
        this._border = {width: 0, color: '#fff'};
        this._shadow = {x: 0, y: 0, blur: 0, color: '#fff'};
        this._vertices = 4;
        this._size = {width: 10, height: 10};

        this.speed = 1;
        this.velocity = {x: 0, y: 0};
        this.angularVelocity = 0;
        this.acceleration = {x: 0, y: 0};
        this.debug = false;

        // Assign any props passed in through options
        var self = this;
        options = options || {};
        Object.keys(options).forEach(function (property) {
            self[property] = options[property];
        });

        this.anchor = {
            x: this.size.width / 2,
            y: this.size.height / 2
        };
    };

    Shape.prototype = new Arcadia.GameObject();

    /**
     * @description Getters/setters for display properties
     */
    Object.defineProperty(Shape.prototype, 'color', {
        enumerable: true,
        get: function () {
            return this._color;
        },
        set: function (color) {
            this._color = color;
            this.dirty = true;
        }
    });

    Object.defineProperty(Shape.prototype, 'border', {
        enumerable: true,
        get: function () {
            return this._border.width + 'px ' + this._border.color;
        },
        set: function (border) {
            var values = border.match(/^(\d+)(?:px)?\ (.+)$/);

            if (!values || values.length !== 3) {
                throw new Error('Use format "(width)px (color)" when setting borders');
            }

            this._border.width = parseInt(values[1], 10);
            this._border.color = values[2];
            this.dirty = true;
        }
    });

    Object.defineProperty(Shape.prototype, 'shadow', {
        enumerable: true,
        get: function () {
            return "#{this._shadow.x}px #{this._shadow.y}px #{this._shadow.blur}px #{this._shadow.color}";
        },
        set: function (shadow) {
            var values = shadow.match(/^(\d+)(?:px)?\ (\d+)(?:px)?\ (\d+)(?:px)?\ (.+)$/);

            if (!values || values.length !== 5) {
                throw new Error('Use format "(x)px (y)px (blur)px (color)" when setting shadows');
            }

            this._shadow.x = parseInt(values[1], 10);
            this._shadow.y = parseInt(values[2], 10);
            this._shadow.blur = parseInt(values[3], 10);
            this._shadow.color = values[4];
            this.dirty = true;
        }
    });

    Object.defineProperty(Shape.prototype, 'vertices', {
        enumerable: true,
        get: function () {
            return this._vertices;
        },
        set: function (verticies) {
            this._vertices = verticies;
            this.dirty = true;
        }
    });

    Object.defineProperty(Shape.prototype, 'size', {
        enumerable: true,
        get: function () {
            return this._size;
        },
        set: function (size) {
            if (size.width === 0 || size.height === 0) {
                throw new Error('Bad things happen if you try to draw a 0x0 canvas!');
            }

            this._size = {width: size.width, height: size.height};
            this.dirty = true;
        }
    });

    Object.defineProperty(Shape.prototype, 'path', {
        enumerable: true,
        get: function () {
            return this._path;
        },
        set: function (path) {
            this._path = path;
            this.dirty = true;
        }
    });

    /**
     * @description Draw object onto internal <canvas> cache
     */
    Shape.prototype.drawCanvasCache = function () {
        if (!this.canvas) {
            return;
        }

        // Canvas cache needs to be large enough to handle shape size, border, and shadow
        this.canvas.width = (this.size.width + this._border.width + Math.abs(this._shadow.x) + this._shadow.blur * 2) * Arcadia.PIXEL_RATIO;
        this.canvas.height = (this.size.height + this._border.width + Math.abs(this._shadow.y) + this._shadow.blur * 2) * Arcadia.PIXEL_RATIO;

        this.setAnchorPoint();

        var context = this.canvas.getContext('2d');
        context.lineJoin = 'miter';

        context.beginPath();

        // Draw anchor point and border in red
        if (this.debug) {
            context.lineWidth = 1 * Arcadia.PIXEL_RATIO;
            context.strokeStyle = '#f00';
            context.strokeRect(0, 0, this.canvas.width, this.canvas.height);
            context.arc(this.anchor.x, this.anchor.y, 3, 0, 2 * Math.PI, false);
            context.stroke();
        }

        context.translate(this.anchor.x, this.anchor.y);

        if (this.path) {
            this.path(context);
        } else {
            switch (this.vertices) {
            case 2:
                context.moveTo(-this.size.width / 2 * Arcadia.PIXEL_RATIO, -this.size.height / 2 * Arcadia.PIXEL_RATIO);
                context.lineTo(this.size.width / 2 * Arcadia.PIXEL_RATIO, this.size.height / 2 * Arcadia.PIXEL_RATIO);
                break;
            case 3:
                context.moveTo(0, -this.size.height / 2 * Arcadia.PIXEL_RATIO);
                context.lineTo(this.size.width / 2 * Arcadia.PIXEL_RATIO, this.size.height / 2 * Arcadia.PIXEL_RATIO);
                context.lineTo(-this.size.width / 2 * Arcadia.PIXEL_RATIO, this.size.height / 2 * Arcadia.PIXEL_RATIO);
                context.lineTo(0, -this.size.height / 2 * Arcadia.PIXEL_RATIO);
                break;
            case 4:
                context.moveTo(-this.size.width / 2 * Arcadia.PIXEL_RATIO, -this.size.height / 2 * Arcadia.PIXEL_RATIO);
                context.lineTo(this.size.width / 2 * Arcadia.PIXEL_RATIO, -this.size.height / 2 * Arcadia.PIXEL_RATIO);
                context.lineTo(this.size.width / 2 * Arcadia.PIXEL_RATIO, this.size.height / 2 * Arcadia.PIXEL_RATIO);
                context.lineTo(-this.size.width / 2 * Arcadia.PIXEL_RATIO, this.size.height / 2 * Arcadia.PIXEL_RATIO);
                context.lineTo(-this.size.width / 2 * Arcadia.PIXEL_RATIO, -this.size.height / 2 * Arcadia.PIXEL_RATIO);
                break;
            default:
                context.arc(0, 0, this.size.width / 2 * Arcadia.PIXEL_RATIO, 0, 2 * Math.PI); // x, y, radius, startAngle, endAngle
                break;
            }
        }

        context.closePath();

        // Draw shadow
        if (this._shadow.x !== 0 || this._shadow.y !== 0 || this._shadow.blur !== 0) {
            context.shadowOffsetX = this._shadow.x * Arcadia.PIXEL_RATIO;
            context.shadowOffsetY = this._shadow.y * Arcadia.PIXEL_RATIO;
            context.shadowBlur = this._shadow.blur * Arcadia.PIXEL_RATIO;
            context.shadowColor = this._shadow.color;
        }

        // Fill with color
        if (this._color) {
            context.fillStyle = this._color;
            context.fill();
        }

        // Don't allow border to cast a shadow
        if (this._shadow.x !== 0 || this._shadow.y !== 0 || this._shadow.blur !== 0) {
            context.shadowOffsetX = 0;
            context.shadowOffsetY = 0;
            context.shadowBlur = 0;
        }

        // Draw border
        if (this._border.width && this._border.color) {
            context.lineWidth = this._border.width * Arcadia.PIXEL_RATIO;
            context.strokeStyle = this._border.color;
            context.stroke();
        }

        this.dirty = false;
    };

    /**
     * @description Find the midpoint of the shape
     */
    Shape.prototype.setAnchorPoint = function () {
        // TODO: ensure correctness of this
        var x = this._size.width / 2 + this._border.width / 2;
        var y = this._size.height / 2 + this._border.width / 2;

        if (this._shadow.blur > 0) {
            x += this._shadow.blur;
            y += this._shadow.blur;
        }

        // Move negatively if shadow is also negative
        if (this._shadow.x < 0) {
            x -= this._shadow.x;
        }
        if (this._shadow.y < 0) {
            y -= this._shadow.y;
        }

        // Set anchor point (midpoint of shape)
        this.anchor.x = x * Arcadia.PIXEL_RATIO;
        this.anchor.y = y * Arcadia.PIXEL_RATIO;
    };

    /**
     * @description Draw object
     * @param {CanvasRenderingContext2D} context
     */
    Shape.prototype.draw = function (context, offsetX, offsetY, offsetRotation, offsetScale, offsetAlpha) {
        offsetX = offsetX === undefined ? 0 : offsetX;
        offsetY = offsetY === undefined ? 0 : offsetY;
        offsetRotation = offsetRotation === undefined ? 0 : offsetRotation;
        offsetScale = offsetScale === undefined ? 1 : offsetScale;
        offsetAlpha = offsetAlpha === undefined ? 1 : offsetAlpha;

        context.save();

        context.translate(offsetX * Arcadia.PIXEL_RATIO, offsetY * Arcadia.PIXEL_RATIO);

        if (offsetRotation !== 0) {
            context.rotate(offsetRotation);
        }

        context.translate(this.position.x * Arcadia.PIXEL_RATIO, this.position.y * Arcadia.PIXEL_RATIO);

        if (this.rotation !== 0) {
            context.rotate(this.rotation);
        }

        if (this.scale * offsetScale !== 1) {
            context.scale(this.scale * offsetScale, this.scale * offsetScale);
        }

        if (this.alpha * offsetAlpha < 1) {
            context.globalAlpha = this.alpha * offsetAlpha;
        }

        // Update internal <canvas> cache if necessary
        if (this.dirty) {
            this.drawCanvasCache();
        }

        // Draw from cache
        context.drawImage(this.canvas, -this.anchor.x, -this.anchor.y);

        // Reset scale/rotation/alpha
        context.restore();

        // Draw child objects last, so they will be on the "top"
        Arcadia.GameObject.prototype.draw.call(this, context, this.position.x + offsetX, this.position.y + offsetY, this.rotation + offsetRotation, this.scale * offsetScale, this.alpha * offsetAlpha);
    };

    /**
     * @description Update object
     * @param {Number} delta Time since last update (in seconds)
     */
    Shape.prototype.update = function (delta) {
        Arcadia.GameObject.prototype.update.call(this, delta);

        var i = this.tweens.length;
        var obj;
        var tween;

        while (i--) {
            tween = this.tweens[i];
            tween.time += delta * 1000; // (delta is in seconds)

            if (tween.time > tween.duration) {
                tween.time = tween.duration;
            }

            if (typeof this[tween.property] === 'object') {
                obj = {};

                Object.keys(this[tween.property]).forEach(function (prop) {
                    obj[prop] = tween.easingFunc(tween.time, tween.start[prop], tween.change[prop], tween.duration);
                });

                this[tween.property] = obj;
            } else {
                this[tween.property] = tween.easingFunc(tween.time, tween.start, tween.change, tween.duration); // time,begin,change,duration
            }

            if (tween.time === tween.duration) {
                this.tweens.splice(i, 1);
                if (typeof tween.callback === 'function') {
                    tween.callback();
                }
            }
        }

        this.velocity.x += this.acceleration.x;
        this.velocity.y += this.acceleration.y;

        this.position.x += this.velocity.x * this.speed * delta;
        this.position.y += this.velocity.y * this.speed * delta;

        this.rotation += this.angularVelocity * delta;
    };

    /**
     * @description Basic AABB collision detection
     * @param {Shape} other Shape object to test collision with
     */
    Shape.prototype.collidesWith = function (other) {
        if (this === other) {
            return false;
        }

        return Math.abs(this.position.x - other.position.x) < (this.size.width / 2) + (other.size.width / 2) &&
                Math.abs(this.position.y - other.position.y) < (this.size.height / 2) + (other.size.height / 2);
    };

    /**
     * @description Add a transition to the `tween` stack
     */
    Shape.prototype.tween = function (property, target, duration, easing, callback) {
        duration = duration || 500;

        // Handle "compound" properties that have objects as values
        // e.g. Shape.size = { width: 100, height: 100 }
        var change = {};
        var self = this;

        if (typeof target === 'object') {
            Object.keys(this[property]).forEach(function (key) {
                change[key] = target[key] - self[property][key];
            });
        } else {
            change = target - this[property];
        }

        this.tweens.push({
            time: 0,
            property: property,
            start: this[property],
            change: change,
            duration: duration,
            easingFunc: Easie[easing] || Easie['linearNone'],
            callback: callback
        });
    };

    Arcadia.Shape = Shape;

    root.Arcadia = Arcadia;
}(window));
