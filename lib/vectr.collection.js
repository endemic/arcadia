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
		Array.call(this);
		this.activeIndex = 0;
		this.children = this;
	};

	Vectr.Collection.prototype = [];

	/**
	 * @description Get the next "inactive" object in the collection
	 */
	Vectr.Collection.prototype.get = function () {
		if (this.activeIndex === this.length - 1) {
			return null;
		}

		var object = this[this.activeIndex];
		object.active = true;
		this.activeIndex += 1;
		return object;
	};

	/**
	 * @description Mark object as "inactive" and move to end of collection
	 */
	Vectr.Collection.prototype.remove = function (index) {
		this[index].active = false;
		this.push(this.splice(index, 1)[0]);
		this.activeIndex -= 1;
	};

	/**
	 * @description "Passthrough" method which updates children
	 */
	Vectr.Collection.prototype.update = function (delta) {
		var i = this.length;
		while (i--) {
			this[i].update(delta);
		}
	};

	/**
	 * @description "Passthrough" method which draws children
	 */
	Vectr.Collection.prototype.draw = function (context) {
		var i = this.length;
		while (i--) {
			this[i].draw(context);
		}
	};
}(window));