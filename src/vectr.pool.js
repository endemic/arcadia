/*jslint sloppy: true, plusplus: true, browser: true */
/*globals Vectr */

/**
 * @description Object pool; kind of a hacky way to store recyclable objects
 */
(function (window) {
	if (typeof window.Vectr === "undefined") {
		window.Vectr = {};
	}

	Vectr.Pool = function () {
		this.length = 0;
		this.children = [];		// Active objects
		this.inactive = [];		// Deadpool
	};

	/**
	 * @description Get the next "inactive" object in the Pool
	 */
	Vectr.Pool.prototype.activate = function () {
		if (this.inactive.length === 0) {
			return null;
		}

		var object = this.inactive.pop();
		object.active = true;
		this.children.push(object);
		this.length += 1;

		return object;
	};

	/**
	 * @description Activate all the objects in the pool
	 */
	Vectr.Pool.prototype.activateAll = function () {
		var object;

		while (this.inactive.length) {
			object = this.inactive.pop();
			object.active = true;
			this.children.push(object);
			this.length += 1;
		}
	};

	/**
	 * @description Move object to the deadpool
	 */
	Vectr.Pool.prototype.deactivate = function (index) {
		if (typeof this.children[index] === "undefined") {
			return;
		}

		this.children[index].active = false;
		this.inactive.push(this.children[index]);

		var i,
			length;

		// Shift array contents downward
		for (i = index, length = this.children.length - 1; i < length; i += 1) {
			this.children[i] = this.children[i + 1];
		}
		this.children.length = length;
		this.length -= 1;

		if (this.length === 0) {
			this.active = false;
		}
	};

	/**
	 * @description Convenience method to access a particular child index
	 */
	Vectr.Pool.prototype.at = function (index) {
		return this.children[index] || null;
	};

	/**
	 * @description Add object to one of the lists
	 */
	Vectr.Pool.prototype.add = function (object) {
		if (typeof object === "object" && object.active === true) {
			this.children.push(object);
			this.length += 1;
		} else {
			this.inactive.push(object);
		}
	};


	/**
	 * @description "Passthrough" method which updates active child objects
	 */
	Vectr.Pool.prototype.update = function (delta) {
		var i = this.children.length;

		while (i--) {
			this.children[i].update(delta);

			// If a child object is marked as "inactive," move it to the dead pool
			if (this.children[i].active === false) {
				this.deactivate(i);
			}
		}
	};

	/**
	 * @description "Passthrough" method which draws active child objects
	 */
	Vectr.Pool.prototype.draw = function (context) {
		var i = this.children.length;

		while (i--) {
			this.children[i].draw(context);
		}
	};
}(window));