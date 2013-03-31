/*jslint sloppy: true, plusplus: true, browser: true */

// Potential particle management:
// Set all bullets to "inactive"
// Index pointer is at 0
// To add a bullet, set bullet at index pointer to active. If index pointer == bullets.length - 1 then return
// To remove a bullet, splice out the bullet at a particular index and push it back on to the end of the array, then decrement the index pointer

(function (window) {
	if (typeof window.Vectr === "undefined") {
		window.Vectr = {};
	}

	Vectr.Collection = function () {
		Array.call(this);
		this.activeIndex = 0;
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
	 * @description Shortcut for adding all objects in the collection to a layer
	 */
	Vectr.Collection.prototype.add = function (layer) {
		var i = this.length;
		while (i--) {
			layer.add(this[i]);
		}
	};
}(window));