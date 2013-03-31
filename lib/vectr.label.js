/*jslint sloppy: true, plusplus: true, browser: true */

(function (window) {
	if (typeof window.Vectr === "undefined") {
		window.Vectr = {};
	}

	Vectr.Label = function (text, x, y, font, color) {
		this.text = text;
		this.font = font; // e.g. context.font = "20pt Arial";
		this.color = color;
		this.scale = 1;
		this.rotation = 0;
		this.shadow = '';	// format: x-offset y-offset blur color
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

		tmp = this.shadow.split(' ');
		if (tmp.length > 0) {
			context.shadowOffsetX = tmp.shift();
			context.shadowOffsetY = tmp.shift();
			context.shadowBlur = tmp.shift();
			context.shadowColor = tmp.join(' ');	// If in rgba(X, X, X, X) format, need to re-constitute string
		}

		if (this.solid === true) {
			context.fillStyle = this.color;
			context.fillText(this.text, 0, 0);
		} else {
			context.strokeStyle = this.color;
			context.strokeText(this.text, 0, 0);
		}

		context.restore();
	};

	Vectr.Label.prototype.update = function (dt) {
		return;
	};
}(window));