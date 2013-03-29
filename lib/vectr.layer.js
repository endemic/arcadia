/*jslint sloppy: true, browser: true */
/*globals Vectr */

/* Layers */
Vectr.Layer = function () {
	// Store game objects in this layer
	this.objects = [];
};

Vectr.Layer.prototype.draw = function (context) {
	if (typeof this.clearColor === "string") {
		// Clear w/ clear color
		context.save();
		context.fillStyle = this.clearColor;
		context.fillRect(0, 0, context.canvas.width, context.canvas.height);
		context.restore();
	} else {
		// Just erase
		context.clearRect(0, 0, context.canvas.width, context.canvas.height);
	}

	var i = this.objects.length;
	while (i--) {
		this.objects[i].draw(context);
	}
};

Vectr.Layer.prototype.update = function (dt) {
	var i = this.objects.length;
	while (i--) {
		this.objects[i].update(dt);
	}
};

Vectr.Layer.prototype.add = function (obj) {
	this.objects.push(obj);
};

Vectr.Layer.prototype.remove = function (obj) {
	var i = this.objects.length;
	while (i--) {
		// Note: this isn't going to work, need to compare object properties
		if (this.objects[i] === obj) {
			this.objects.splice(i, 1);
		}
	}
};

Vectr.Layer.prototype.destroy = function () {
	this.canvas.parentNode.removeChild(this.canvas);
};