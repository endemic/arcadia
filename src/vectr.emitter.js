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

		this.particles = new Vectr.Pool();

		while (count--) {
			particle = new Vectr.Shape(0, 0, shape, size, color);
			particle.active = false;
			this.particles.add(particle);
		}
	};

	Vectr.Emitter.prototype.start = function (x, y) {
		this.particles.activateAll();
		this.active = true;
		
		var direction,
			i = this.particles.length;

		while (i--) {
			this.particles.at(i).position.x = x;
			this.particles.at(i).position.y = y;

			// Set random velocity/speed
			direction = Math.random() * 2 * Math.PI;
			this.particles.at(i).velocity.x = Math.cos(direction);
			this.particles.at(i).velocity.y = Math.sin(direction);
			this.particles.at(i).speed = Math.random() * 200;
			this.particles.at(i).color.alpha = 1;
		}

		this.timer = 0;
	};

	Vectr.Emitter.prototype.draw = function (context) {
		var i = this.particles.length;
		while (i--) {
			this.particles.at(i).draw(context);
		}
	};

	Vectr.Emitter.prototype.update = function (delta) {
		this.timer += delta;

		var i = this.particles.length;

		if (i === 0) {
			this.active = false;
		}

		while (i--) {
			this.particles.at(i).update(delta);
			this.particles.at(i).color.alpha -= 0.03;

			if (this.particles.at(i).color.alpha <= 0) {
				this.particles.deactivate(i);
			}
		}
	};
}(window));