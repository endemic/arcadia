/* Layers */
Vctr.Layer = function () {
	// Store game objects in this layer
	this.objects = [];
};

Vctr.Layer.prototype.update = function (context, dt) {
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
		this.objects[i].update(dt);
		this.objects[i].draw(context);
	}
};

// TODO: Separate drawing from update
Vctr.Layer.prototype.blarg = function (dt) {
	var i = this.objects.length;
	while (i--) {
		this.objects[i].update(dt);
	}	
};

Vctr.Layer.prototype.add = function (obj) {
	this.objects.push(obj);
};

Vctr.Layer.prototype.remove = function (obj) {
	var i = this.objects.length;
	while (i--) {
		// Note: this isn't going to work, need to compare object properties
		if (this.objects[i] === obj) {
			this.objects.splice(i, 1);
		}
	}	
};

Vctr.Layer.prototype.destroy = function () {
	this.canvas.parentNode.removeChild(this.canvas);
};