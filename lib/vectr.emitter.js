/*jslint sloppy: true, plusplus: true, browser: true */

(function (window) {
	if (typeof window.Vectr === "undefined") {
		window.Vectr = {};
	}

	/**
	 * @constructor Basic particle emitter
	 */
	Vectr.Emitter = function (count, x, y, shape, size, color) {
		var particle,
			negative;

		this.particles = new Vectr.Collection();

		while (count--) {
			particle = new Vectr.Sprite(x, y, shape, size, color);
			negative = Math.random() > 0.5 ? -1 : 1;
			particle.velocity.x = Math.random() * size * negative;
			negative = Math.random() > 0.5 ? -1 : 1;
			particle.velocity.y = Math.random() * size * negative;
			particle.active = false;
			this.particles.push(particle);
		}
	};

	Vectr.Emitter.prototype.start = function () {
		// body...
	};
}(window));