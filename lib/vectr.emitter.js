/*jslint sloppy: true, plusplus: true, browser: true */
/*globals Vectr */

(function (window) {
	if (typeof window.Vectr === "undefined") {
		window.Vectr = {};
	}

	/**
	 * @constructor Basic particle emitter
	 */
	Vectr.Emitter = function (count, shape, size, color) {
		var particle;

		this.particles = new Vectr.Collection();

		while (count--) {
			particle = new Vectr.Sprite(0, 0, shape, size, color);
			particle.active = false;
			this.particles.push(particle);
		}
	};

	Vectr.Emitter.prototype.start = function (x, y) {
		var direction,
			i = this.particles.length;

		while (i--) {
			this.particles[i].position.x = x;
			this.particles[i].position.y = y;

			// Set random velocity/speed
			direction = Math.random() * 2 * Math.PI;
			this.particles[i].velocity.x = Math.cos(direction);
			this.particles[i].velocity.y = Math.sin(direction);
			this.particles[i].speed = Math.random() * 100;

			this.particles[i].active = true;
		}
		this.timer = 0;
	};

	Vectr.Emitter.prototype.draw = function (context) {
		var i = this.particles.length;
		while (i--) {
			this.particles[i].draw(context);
		}
	};

	Vectr.Emitter.prototype.update = function (delta) {
		this.timer += delta;

		var i = this.particles.length;
		while (i--) {
			this.particles[i].update(delta);

			if (this.timer > 0.5) {
				this.particles[i].active = false;
			}
		}
	};
}(window));