/*jslint sloppy: true, plusplus: true */
/*globals Vectr, Player, PlayerBullet, Enemy, Game */

var Title = function (context) {
	Vectr.Layer.apply(this, arguments);

	// this.clearColor = 'rgba(0, 0, 0, 0.05)';
	this.clearColor = "#000";

	this.add(new Vectr.Label("Uchuu Sensou", 10, Vectr.HEIGHT / 4, "40px sans-serif", "rgb(255, 255, 255)"));
	this.add(new Vectr.Label("Click or tap to start", 10, Vectr.HEIGHT / 2, "20px sans-serif", "rgb(255, 255, 255)"));

	// Add a starfield background
	this.stars = new Vectr.Collection();
	this.add(this.stars);
	
	var i,
		star;

	i = 100;

	while (i--) {
		star = new Vectr.Sprite(Math.random() * Vectr.WIDTH, Math.random() * Vectr.HEIGHT, 'circle', Math.round(Math.random() * 3), '#fff');
		star.solid = true;
		star.velocity.y = 30 / star.size;
		this.stars.push(star);
	}
};

Title.prototype = new Vectr.Layer();

Title.prototype.update = function (delta) {
	Vectr.Layer.prototype.update.call(this, delta);

	var i,
		star;

	// Update stars
	i = this.stars.length;
	while (i--) {
		star = this.stars[i];
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