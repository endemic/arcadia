/*jslint sloppy: true, plusplus: true, browser: true */
/*globals Vectr */

(function (window) {
	if (typeof window.Vectr === "undefined") {
		window.Vectr = {};
	}

	/**
	 * @constructor
	 */
	Vectr.Button = function (text, font, textColor, backgroundColor, x, y) {
		// Button contains a label w/ a rectangle drawn around it
		this.label = new Vectr.Label(text, font, textColor, x, y, "center");
		this.position = {
			'x': x,
			'y': y
		};
		this.backgroundColor = backgroundColor;
		this.height = parseInt(font.split(" ").shift(), 10);
		this.active = true;
		this.solid = true;
		this.padding = 10;

		// Attach event listeners
		this.onPointEnd = this.onPointEnd.bind(this);
		Vectr.instance.element.addEventListener('mouseup', this.onPointEnd, false);
		Vectr.instance.element.addEventListener('touchend', this.onPointEnd, false);
	};

	/**
	 * @description Draw the button!
	 */
	Vectr.Button.prototype.draw = function (context) {
		if (this.active === false) {
			return;
		}

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

		// Draw label
		this.label.draw(context);
	};

	/**
	 * @description If touch/mouse end is inside button, execute the user-supplied callback
	 */
	Vectr.Button.prototype.onPointEnd = function (event) {
		if (this.active !== true || typeof this.onUp !== "function") {
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
		var property;

		for (property in this) {
			if (this.hasOwnProperty(property)) {
				delete this[property];
			}
		}

		Vectr.instance.element.removeEventListener('mouseup', this.onPointEnd, false);
		Vectr.instance.element.removeEventListener('touchend', this.onPointEnd, false);
	};

	/**
	 * @description Currently unused
	 */
	Vectr.Button.prototype.update = function (delta) { };
}(window));