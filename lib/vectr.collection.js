/*jslint sloppy: true, plusplus: true, browser: true */
/*globals Vectr */

/**
 * @description Extends an array; kind of a hacky way to store recyclable objects
 */
(function (window) {
	if (typeof window.Vectr === "undefined") {
		window.Vectr = {};
	}

	Vectr.Collection = function () {
		this.index = 0;			// Pointer to most recent active object

		this.children = [];
	};

	/**
	 * @description Get the next "inactive" object in the collection
	 */
	Vectr.Collection.prototype.activate = function () {
		if (this.index >= this.children.length - 1) {
			return null;
		}

		var object = this.children[this.index];
		object.active = true;

		this.index += 1;

		return object;
	};

	/**
	 * @description Mark object as "inactive" and move to end of collection
	 */
	Vectr.Collection.prototype.deactivate = function (index) {
		this.children[index].active = false;
		this.children.push(this.children.splice(index, 1)[0]);
		this.index -= 1;
	};

	/**
	 * @description Convenience method to access a particular child index
	 */
	Vectr.Collection.prototype.at = function (index) {
		return this.children[index];
	};

	/**
	 * @description Add object to collection
	 */
	Vectr.Collection.prototype.add = function (object) {
		this.children.push(object);
	};

	/**
	 * @description Remove object from collection
	 */
	Vectr.Collection.prototype.remove = function (index) {
		this.children.splice(index, 1);
	};

	/**
	 * @description "Passthrough" method which updates children
	 */
	Vectr.Collection.prototype.update = function (delta) {
		var i = this.children.length;

		while (i--) {
			this.children[i].update(delta);
		}
	};

	/**
	 * @description "Passthrough" method which draws children
	 */
	Vectr.Collection.prototype.draw = function (context) {
		var i = this.children.length;

		while (i--) {
			this.children[i].draw(context);
		}
	};
}(window));