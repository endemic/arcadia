/*jslint browser, this */
/*global window */

(function (root) {
    'use strict';

    var Arcadia = root.Arcadia || {};

    /**
     * @constructor
     */
    var Label = function (options) {
        options = options || {};

        this._font = {
            size: 10,
            family: 'monospace'
        };
        this._text = 'text goes here';
        this._alignment = 'center';

        Arcadia.Shape.apply(this, arguments);

        var self = this;
        Object.keys(options).forEach(function (property) {
            self[property] = options[property];
        });
    };

    Label.prototype = new Arcadia.Shape();

    /**
     * @description Draw object onto internal <canvas> cache
     * TODO: refactor shape method to use re-usable methods which can then be reused here
     */
    Label.prototype.drawCanvasCache = function () {
        if (!this.canvas) {
            return;
        }

        var self = this;
        var context = this.canvas.getContext('2d');
        var lineCount = 1;
        var newlines = this.text.match(/\n/g);

        if (newlines) {
            lineCount = newlines.length + 1;
        }

        // Determine width/height of text using offscreen <div>
        var element = document.getElementById('text-dimensions');

        if (!element) {
            element = document.createElement('div');
            element.id = 'text-dimensions';
            element.style.position = 'absolute';
            element.style.top = '-9999px';
            element.style.overflow = 'scroll';
            document.body.appendChild(element);
        }

        element.style.font = this.font;
        element.style['line-height'] = 1;
        element.innerHTML = this.text.replace(/\n/g, '<br>').replace(/\s/g, '&nbsp;');

        this.size = {
            width: element.offsetWidth,
            height: element.offsetHeight
        };

        var lineHeight = this.size.height / lineCount * Arcadia.PIXEL_RATIO;

        this.anchor = {
            x: this.size.width / 2,
            y: this.size.height / 2
        };

        this.canvas.width = (this.size.width + this._border.width + Math.abs(this._shadow.x) + this._shadow.blur) * Arcadia.PIXEL_RATIO;
        this.canvas.height = (this.size.height + this._border.width + Math.abs(this._shadow.y) + this._shadow.blur) * Arcadia.PIXEL_RATIO;

        context.font = (this._font.size * Arcadia.PIXEL_RATIO) + 'px ' + this._font.family;
        context.textAlign = this.alignment;  // left, right, center, start, end
        context.textBaseline = 'middle'; // top, hanging, middle, alphabetic, ideographic, bottom

        this.setAnchorPoint();

        if (this.debug) {
            context.lineWidth = 1 * Arcadia.PIXEL_RATIO;
            context.strokeStyle = '#f00';
            context.strokeRect(0, 0, this.canvas.width, this.canvas.height);
            context.arc(this.anchor.x, this.anchor.y, 3, 0, 2 * Math.PI, false);
            context.stroke();
        }

        context.translate(this.anchor.x, this.anchor.y);

        if (this._shadow.x !== 0 || this._shadow.y !== 0 || this._shadow.blur !== 0) {
            context.shadowOffsetX = this._shadow.x * Arcadia.PIXEL_RATIO;
            context.shadowOffsetY = this._shadow.y * Arcadia.PIXEL_RATIO;
            context.shadowBlur = this._shadow.blur * Arcadia.PIXEL_RATIO;
            context.shadowColor = this._shadow.color;
        }

        // Handle x coord of text for alignment
        var x = 0;
        if (this.alignment === 'start' || this.alignment === 'left') {
            x = -this._size.width / 2;
        } else if (this.alignment === 'end' || this.alignment === 'right') {
            x = this._size.width / 2;
        }

        if (this.color) {
            context.fillStyle = this.color;
            if (lineCount > 1) {
                this.text.split('\n').forEach(function (text, index) {
                    context.fillText(text, x, (-self.size.height / 2 * Arcadia.PIXEL_RATIO) + (lineHeight / 2) + (lineHeight * index));
                });
            } else {
                context.fillText(this.text, x, 0);
            }
        }

        // Don't allow border to cast a shadow
        if (this._shadow.x !== 0 || this._shadow.y !== 0 || this._shadow.blur !== 0) {
            context.shadowOffsetX = 0;
            context.shadowOffsetY = 0;
            context.shadowBlur = 0;
        }

        if (this._border.width && this._border.color) {
            context.lineWidth = this._border.width * Arcadia.PIXEL_RATIO;
            context.strokeStyle = this._border.color;
            if (lineCount > 1) {
                this.text.split('\n').forEach(function (text, index) {
                    context.strokeText(text, x, (-self.size.height / 2 * Arcadia.PIXEL_RATIO) + (lineHeight / 2) + (lineHeight * index));
                });
            } else {
                context.strokeText(this.text, x, 0);
            }
        }

        this.dirty = false;
    };

    /**
     * @description Getter/setters for font
     * TODO: Handle bold text
     */
    Object.defineProperty(Label.prototype, 'font', {
        enumerable: true,
        get: function () {
            return this._font.size + 'px ' + this._font.family;
        },
        set: function (font) {
            var values = font.match(/^(\d+)(?:px)?\ (.+)$/);

            if (!values || values.length !== 3) {
                throw new Error('Use format "(size)px (font-family)" when setting Label font');
            }

            this._font.size = values[1];
            this._font.family = values[2];
            this.dirty = true;
        }
    });

    Object.defineProperty(Label.prototype, 'text', {
        enumerable: true,
        get: function () {
            return this._text;
        },
        set: function (value) {
            this._text = String(value);
            this.dirty = true;
        }
    });

    Object.defineProperty(Label.prototype, 'alignment', {
        enumerable: true,
        get: function () {
            return this._alignment;
        },
        set: function (value) {
            var allowedValues = ['left', 'right', 'center', 'start', 'end']
            if (allowedValues.indexOf(value) === -1) {
                throw new Error('Allowed alignment values: left, right, center, start, end');
            }
            this._alignment = value;
            this.dirty = true;
        }
    });

    Arcadia.Label = Label;

    root.Arcadia = Arcadia;
}(window));
