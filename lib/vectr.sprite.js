/*jslint sloppy: true, plusplus: true, browser: true */

(function (window) {
	if (typeof window.Vectr === "undefined") {
		window.Vectr = {};
	}

	Vectr.Sprite = function (x, y, shape, size, color) {
		this.shape = shape;
		this.size = size;
		this.color = color;
		this.scale = 1;
		this.speed = 1;
		this.rotation = 0;
		this.shadow = '';	// format: x-offset y-offset blur color
		this.position = {
			'x': x,
			'y': y
		};
		this.velocity = {
			'x': 0,
			'y': 0
		};
		this.active = true;
	};

	Vectr.Sprite.prototype.draw = function (context) {
		var tmp;

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

		if (this.rotation !== 0 && this.rotation !== 360) {
			context.rotate(this.rotation * Math.PI / 180);
		}

		tmp = this.shadow.split(' ');
		if (tmp.length > 0) {
			context.shadowOffsetX = tmp.shift();
			context.shadowOffsetY = tmp.shift();
			context.shadowBlur = tmp.shift();
			context.shadowColor = tmp.join(' ');	// If in rgba(X, X, X, X) format, need to re-constitute string
		}

		context.fillStyle = this.color;
		context.strokeStyle = this.color;

		context.beginPath();
		// Draw w/ anchor point at the center of the object
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
			context.fill();
		} else {
			context.stroke();
		}

		context.restore();
	};

	Vectr.Sprite.prototype.update = function (dt) {
		if (this.active === false) {
			return;
		}

		this.position.x += this.velocity.x * this.speed * dt;
		this.position.y += this.velocity.y * this.speed * dt;
	};

	Vectr.Sprite.prototype.collidesWith = function (other) {
		return Math.abs(this.position.x - other.position.x) < this.size / 2 + other.size / 2 && Math.abs(this.position.y - other.position.y) < this.size / 2 + other.size / 2;
	};
}(window));