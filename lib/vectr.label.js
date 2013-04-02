/*jslint sloppy: true, plusplus: true, browser: true */
/*globals Vectr */

(function (window) {
	if (typeof window.Vectr === "undefined") {
		window.Vectr = {};
	}

	Vectr.Label = function (text, x, y, font, color) {
		var tmp;

		this.text = text;

		tmp = font.split(' '); // e.g. context.font = "20pt Arial";
		this.font = {
			'size': tmp[0],
			'family': tmp[1]
		};

		// Default color - white w/ no alpha
		this.color = {
			'red': 255,
			'green': 255,
			'blue': 255,
			'alpha': 1
		};

		if (typeof color !== "undefined") {
			tmp = color.split(',');
			if (tmp.length === 4) {
				this.color.red = parseInt(tmp[0].replace('rgba(', ''), 10);
				this.color.green = parseInt(tmp[1], 10);
				this.color.blue = parseInt(tmp[2], 10);
				this.color.alpha = parseFloat(tmp[3].replace(')', ''), 10);
			}
		}

		this.scale = 1;
		this.rotation = 0;
		this.position = {
			'x': x,
			'y': y
		};
		this.active = true;
		this.solid = true;
	};

	Vectr.Label.prototype.draw = function (context) {
		var tmp;

		if (this.active === false) {
			return;
		}

		context.save();
		context.translate(this.position.x, this.position.y);

		if (this.scale !== 1) {
			context.scale(this.scale, this.scale);
		}

		if (this.rotation !== 0 && this.rotation !== 360) {
			context.rotate(this.rotation);
		}

		context.font = this.font.size + ' ' + this.font.family;

		if (this.solid === true) {
			context.fillStyle = 'rgba(' + this.color.red + ', ' + this.color.green + ', ' + this.color.blue + ', ' + this.color.alpha + ')';
			context.fillText(this.text, 0, 0);
		} else {
			context.strokeStyle = 'rgba(' + this.color.red + ', ' + this.color.green + ', ' + this.color.blue + ', ' + this.color.alpha + ')';
			context.strokeText(this.text, 0, 0);
		}

		context.restore();
	};

	Vectr.Label.prototype.update = function (dt) {
		return;
	};
}(window));