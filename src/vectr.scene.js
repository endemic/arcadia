/*jslint sloppy: true, plusplus: true, browser: true */
/*globals Vectr */

(function (window) {
	if (typeof window.Vectr === "undefined") {
		window.Vectr = {};
	}

	/**
	 * @constructor
	 */
	Vectr.Scene = function () {
		// Store game objects
		this.children = [];
	};

	/**
	 * @description Clear context, then re-draw all child objects
	 */
	Vectr.Scene.prototype.draw = function (context) {
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

	/**
	 * @description Update all child objects
	 */
	Vectr.Scene.prototype.update = function (delta) {
		var i = this.children.length;
		while (i--) {
			this.children[i].update(delta);
		}
	};

	/**
	 * @description Add an object to the draw/update loop
	 */
	Vectr.Scene.prototype.add = function (object) {
		this.children.push(object);
	};

	/**
	 * @description Remove a drawn/updated object
	 */
	Vectr.Scene.prototype.remove = function (object) {
		var index = this.children.indexOf(object);

		if (index !== -1) {
			this.children.splice(index, 1);
		}
	};

	/**
	 * @description Clean up all child objects
	 */
	Vectr.Scene.prototype.destroy = function () {
		var i = this.children.length;
		while (i--) {
			if (typeof this.children[i].destroy === "function") {
				this.children[i].destroy();
			}
		}
	};
}(window));