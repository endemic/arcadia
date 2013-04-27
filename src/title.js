/*jslint sloppy: true, plusplus: true */
/*globals Vectr, Player, PlayerBullet, Enemy, Game */

var Title = function (context) {
	Vectr.Layer.apply(this, arguments);

	this.clearColor = 'rgba(0, 0, 0, 0.25)';
	// this.clearColor = "#000";

	this.add(new Vectr.Label("ARMADA", "40px monospace", "rgba(255, 255, 255, 0.8)", Vectr.WIDTH / 2, Vectr.HEIGHT / 4));
	// this.add(new Vectr.Label("Hit Z or SPACE to start", "20px monospace", "rgba(255, 255, 255, 0.8)", Vectr.WIDTH / 2, Vectr.HEIGHT / 2));

	this.button = new Vectr.Button("START", "20px monospace", "rgba(255, 255, 255, 1)", "rgba(255, 255, 255, 1)", Vectr.WIDTH / 2, Vectr.HEIGHT / 2);
	this.button.solid = false;
	this.button.padding = 10;
	this.button.onUp = function () {
		Vectr.changeLayer(Game);
	};
	this.add(this.button);

	// Add a starfield background
	this.stars = new Vectr.Pool();
	this.add(this.stars);

	var i,
		star;

	i = 50;

	while (i--) {
		star = new Vectr.Shape(Math.random() * Vectr.WIDTH, Math.random() * Vectr.HEIGHT, 'circle', Math.random() + 0.5, 'rgba(255, 255, 255, 1)');
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

// Change to game scene
Title.prototype.onPointEnd = function (points) {

};

Title.prototype.onKeyUp = function (input) {
	if (input.z || input.space) {
		Vectr.changeLayer(Game);
	}
};