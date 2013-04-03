/*jslint sloppy: true, plusplus: true */
/*globals Vectr, Player, PlayerBullet, Enemy, Game */

var Title = function (context) {
	Vectr.Layer.apply(this, arguments);

	this.clearColor = 'rgba(0, 0, 0, 0.05)';
	// this.clearColor = "#000";

	this.add(new Vectr.Label("ARMADA", "40px sans-serif", "rgba(255, 255, 255, 0.8)", Vectr.WIDTH / 2, Vectr.HEIGHT / 4));
	this.add(new Vectr.Label("Click or tap to start", "20px sans-serif", "rgba(255, 255, 255, 0.8)", Vectr.WIDTH / 2, Vectr.HEIGHT / 2));

	// Add a starfield background
	this.stars = new Vectr.Pool();
	this.add(this.stars);

	var i,
		star;

	i = 100;

	while (i--) {
		star = new Vectr.Sprite(Math.random() * Vectr.WIDTH, Math.random() * Vectr.HEIGHT, 'circle', Math.random() + 1, 'rgba(255, 255, 255, 1)');
		star.solid = true;
		star.velocity.y = 40 / star.size;
		this.stars.add(star);
	}
};

Title.prototype = new Vectr.Layer();

Title.prototype.update = function (delta) {
	Vectr.Layer.prototype.update.call(this, delta);

	var i,
		star;

	// Reset star positions
	i = this.stars.children.length;
	while (i--) {
		star = this.stars.at(i);
		if (star.position.y > Vectr.HEIGHT) {
			star.position.y = 0;
		}
	}
};

/**
 * @description Mouse/touch movement
 */
Title.prototype.onPointEnd = function (points) {
	var point = points[0];

	Vectr.changeLayer(Game);
};