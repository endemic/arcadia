/*jslint sloppy: true, plusplus: true, browser: true */
/*globals Vectr */

(function (window) {
	if (typeof window.Vectr === "undefined") {
		window.Vectr = {};
	}

	/**
	 * @constructor
	 * @description Basic particle emitter
	 * @param {number} [count=25] The number of particles created for the system
	 * @param {number} [duration=1] Length of time the particles appear (in seconds)
	 * @param {string} [shape='square'] Shape of the particles. Accepts strings that are valid for Shapes (e.g. "circle", "triangle")
	 * @param {number} [size=10] Size of the particles
	 * @param {string} [color='rgba(255, 255, 255, 1)'] Color of particles, 'rgba(x, x, x, x)' format
	 * @param {boolean} [fade=false] Whether to fade the particles out when they are displayed
	 */
	Vectr.Emitter = function (count, duration, shape, size, color, fade) {
		var particle,
			tmp;

		count = count || 25;
		this.duration = duration || 1;
		this.fade = fade || false;
		this.particles = new Vectr.Pool();
		this.speed = 200;

		while (count--) {
			particle = new Vectr.Shape(0, 0, shape, size, color);
			particle.active = false;
			particle.solid = true;
			this.particles.add(particle);
		}
	};

	/**
	 * @description Activate a particle emitter
	 * @param {number} x Position of emitter on x-axis
	 * @param {number} y Position of emitter on y-axis
	 */
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
			this.particles.at(i).speed = Math.random() * this.speed;
			this.particles.at(i).color.alpha = 1;
		}

		this.timer = 0;
	};

	/**
	 * @description Set the color of all the particles in the system
	 * @param {string} color Color of particles, 'rgba(x, x, x, x)' format
	 */
	Vectr.Emitter.prototype.setColor = function (color) {
		var i,
			red,
			green,
			blue,
			tmp;

		i = this.particles.length;
		tmp = color.split(',');

		if (tmp.length === 4) {
			this.red = parseInt(tmp[0].replace('rgba(', ''), 10);
			this.green = parseInt(tmp[1], 10);
			this.blue = parseInt(tmp[2], 10);

			while (i--) {
				this.particles.at(i).color.red = red;
				this.particles.at(i).color.green = green;
				this.particles.at(i).color.blue = blue;
			}
		}
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

			if (this.fade) {
				this.particles.at(i).color.alpha -= delta / this.duration;
			}

			if (this.timer >= this.duration) {
				this.particles.deactivate(i);
			}
		}
	};
}(window));