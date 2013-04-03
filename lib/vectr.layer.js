/*jslint sloppy: true, plusplus: true, browser: true */
/*globals Vectr */

(function (window) {
	if (typeof window.Vectr === "undefined") {
		window.Vectr = {};
	}

	Vectr.Layer = function () {
		// Store game objects in this layer
		this.children = [];
	};

	Vectr.Layer.prototype.draw = function (context) {
		if (typeof this.clearColor === "string") {
			// Clear w/ clear color
			context.save();
			context.fillStyle = this.clearColor;
			context.fillRect(0, 0, context.canvas.width, context.canvas.height);
			context.restore();
		} else {
			// Just erase
			context.clearRect(0, 0, context.canvas.width, context.canvas.height);
		}

		var i = this.children.length;
		while (i--) {
			this.children[i].draw(context);
		}
	};

	Vectr.Layer.prototype.update = function (dt) {
		var i = this.children.length;
		while (i--) {
			this.children[i].update(dt);
		}
	};

	Vectr.Layer.prototype.add = function (obj) {
		this.children.push(obj);
	};

	Vectr.Layer.prototype.remove = function (obj) {
		var i = this.children.length;
		while (i--) {
			// Note: this isn't going to work, need to compare object properties
			if (this.children[i] === obj) {
				this.children.splice(i, 1);
			}
		}
	};

	Vectr.Layer.prototype.destroy = function () {
		this.canvas.parentNode.removeChild(this.canvas);
	};
}(window));