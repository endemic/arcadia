/*jslint browser, this */
/*global window */

(function (root) {
    'use strict';

    var Arcadia = root.Arcadia || {};

    Arcadia.Button = function (options) {

        options = options || {};

        if (!options.label) {
            options.label = new Arcadia.Label({
                text: options.text,
                font: options.font
            });
        }

        this.padding = options.padding || 0; // TODO: perhaps make padding an obj, w/ x/y values?
        this.label = options.label;
        this.label.drawCanvasCache(); // Determine size of text

        Arcadia.Shape.apply(this, arguments);

        this.add(this.label);

        if (typeof options.action === 'function') {
            this.action = options.action;
        }

        this.disabled = false;
        this.enablePointEvents = true;

        if (!options.size) {
            var height;
            if (this.vertices === 0) {
                height = this.label.size.width;
            } else {
                height = this.label.size.height;
            }

            this.size = {
                width: this.label.size.width + this.padding,
                height: height + this.padding
            };
        }
    };

    Arcadia.Button.prototype = new Arcadia.Shape();

    /**
     * @description If touch/mouse end is inside button, execute the user-supplied
     * callback this method will get fired for each different button object on the screen
     */
    Arcadia.Button.prototype.onPointEnd = function (points) {
        Arcadia.Shape.apply(this, arguments);

        if (!this.action || this.disabled) {
            return;
        }

        var i = points.length;

        while (i) {
            i -= 1;

            if (this.containsPoint(points[i])) {
                this.action();
            }
        }
    };

    /**
     * @description Helper method to determine if mouse/touch point is inside button
     */
    Arcadia.Button.prototype.containsPoint = function (point) {
        return point.x < this.position.x + this.size.width / 2 + this.padding / 2 &&
                point.x > this.position.x - this.size.width / 2 - this.padding / 2 &&
                point.y < this.position.y + this.size.height / 2 + this.padding / 2 &&
                point.y > this.position.y - this.size.height / 2 - this.padding / 2;
    };

    /**
     * @description Getter/setter for text value
     */
    Object.defineProperty(Arcadia.Button, 'text', {
        enumerable: true,
        get: function () {
            return this.label.text;
        },
        set: function (text) {
            this.label.text = text;
        }
    });

    /**
     * @description Getter/setter for font value
     */
    Object.defineProperty(Arcadia.Button, 'font', {
        enumerable: true,
        get: function () {
            return this.label.font;
        },
        set: function (font) {
            this.label.font = font;
        }
    });
}(window));
