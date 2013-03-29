/*jslint sloppy: true, browser: true */
(function (window) {
	var DEG2RAD,
		Vectr;

	DEG2RAD = Math.PI / 180;

	Vectr = {
		'VERSION': '0.1',
		'Game': function (width, height, layers) {
			if (typeof layers !== "object" || Array.isArray(layers) === false) {
				throw "Need to provide the Game() constructor with an array of layer classes.";
			}

			this.layers = [];

			var i = layers.length;
			while (i--) {
				this.layers.push(new layers[i]());
			}

			this.active = this.layers[0];

			if (typeof width === "undefined") {
				width = 320;
			}

			if (typeof height === "undefined") {
				height = 480;
			}

			Vectr.WIDTH = width;
			Vectr.HEIGHT = height;

			// Create the #vectr container, give it a size, etc.
			this.element = document.createElement('div');
			this.element.setAttribute('id', 'vectr');
			this.element.setAttribute('width', width);
			this.element.setAttribute('height', height);
			this.element.setAttribute('style', 'position: relative; width: ' + width + 'px; height: ' + height + 'px;');

			this.canvas = document.createElement('canvas');
			this.canvas.setAttribute('width', width);
			this.canvas.setAttribute('height', height);
			this.canvas.setAttribute('style', 'position: absolute; left: 0; top: 0; width: ' + width + 'px; height: ' + height + 'px;');
			this.context = this.canvas.getContext('2d');

			this.element.appendChild(this.canvas);
			document.body.appendChild(this.element);

			// Bind event handler callbacks
			this.onPointStart = this.onPointStart.bind(this);
			this.onPointMove = this.onPointMove.bind(this);
			this.onPointEnd = this.onPointEnd.bind(this);
			this.onKeyDown = this.onKeyDown.bind(this);
			this.onKeyUp = this.onKeyUp.bind(this);

			// Set up event listeners; Mouse and touch use the same ones
			document.addEventListener('keydown', this.onKeyDown, false);
			document.addEventListener('keyup', this.onKeyUp, false);
			this.element.addEventListener('mousedown', this.onPointStart, false);
			this.element.addEventListener('mouseup', this.onPointEnd, false);
			this.element.addEventListener('touchstart', this.onPointStart, false);
			this.element.addEventListener('touchmove', this.onPointMove, false);
			this.element.addEventListener('touchend', this.onPointEnd, false);

			// Map of current input, used to prevent duplicate events being sent to handlers
			this.input = {
				'left': false,
				'up': false,
				'right': false,
				'down': false,
				'w': false,
				'a': false,
				's': false,
				'd': false,
				'enter': false,
				'escape': false,
				'space': false,
				'control': false,
				'z': false,
				'x': false
			};
		}
	};

	Vectr.Game.prototype.onPointStart = function (event) {
		var i = 0,
			length,
			points = [];

		if (event.type.indexOf('mouse') !== -1) {
			points.push({
				'x': event.pageX,
				'y': event.pageY
			});

			this.element.addEventListener('mousemove', this.onPointMove, false);
		} else {
			length = event.touches.length;
			while (i < length) {
				points.push({
					'x': event.touches[i].pageX,
					'y': event.touches[i].pageY
				});

				i += 1;
			}
		}

		if (typeof this.active.onPointStart === "function") {
			this.active.onPointStart(points);
		}
	};

	Vectr.Game.prototype.onPointMove = function (event) {
		var i = 0,
			length,
			points = [];

		if (event.type.indexOf('mouse') !== -1) {
			points.push({
				'x': event.pageX,
				'y': event.pageY
			});
		} else {
			length = event.touches.length;
			while (i < length) {
				points.push({
					'x': event.touches[i].pageX,
					'y': event.touches[i].pageY
				});

				i += 1;
			}
		}

		if (typeof this.active.onPointMove === "function") {
			this.active.onPointMove(points);
		}
	};

	Vectr.Game.prototype.onPointEnd = function (event) {
		var i = 0,
			length,
			points = [];

		if (event.type.indexOf('mouse') !== -1) {
			points.push({
				'x': event.pageX,
				'y': event.pageY
			});

			this.element.removeEventListener('mousemove', this.onPointMove, false);
		} else {
			length = event.touches.length;
			while (i < length) {
				points.push({
					'x': event.touches[i].pageX,
					'y': event.touches[i].pageY
				});

				i += 1;
			}
		}

		if (typeof this.active.onPointEnd === "function") {
			this.active.onPointEnd(points);
		}
	};

	Vectr.Game.prototype.onKeyDown = function (event) {
		var input = {},
			key;

		switch (event.keyCode) {
		case 37:
			key = 'left';
			break;
		case 38:
			key = 'up';
			break;
		case 39:
			key = 'right';
			break;
		case 40:
			key = 'down';
			break;
		case 87:
			key = 'w';
			break;
		case 65:
			key = 'a';
			break;
		case 83:
			key = 's';
			break;
		case 68:
			key = 'd';
			break;
		case 13:
			key = 'enter';
			break;
		case 27:
			key = 'escape';
			break;
		case 32:
			key = 'space';
			break;
		case 17:
			key = 'control';
			break;
		case 90:
			key = 'z';
			break;
		case 88:
			key = 'x';
			break;
		default:
			break;
		}

		// Do nothing if a duplicate input
		if (this.input[key] === true) {
			return;
		}

		this.input[key] = true;
		input[key] = true;

		if (typeof this.active.onKeyDown === "function") {
			this.active.onKeyDown(input);
		}
	};

	Vectr.Game.prototype.onKeyUp = function (event) {
		var input = {},
			key;

		switch (event.keyCode) {
		case 37:
			key = 'left';
			break;
		case 38:
			key = 'up';
			break;
		case 39:
			key = 'right';
			break;
		case 40:
			key = 'down';
			break;
		case 87:
			key = 'w';
			break;
		case 65:
			key = 'a';
			break;
		case 83:
			key = 's';
			break;
		case 68:
			key = 'd';
			break;
		case 13:
			key = 'enter';
			break;
		case 27:
			key = 'escape';
			break;
		case 32:
			key = 'space';
			break;
		case 17:
			key = 'control';
			break;
		case 90:
			key = 'z';
			break;
		case 88:
			key = 'x';
			break;
		default:
			break;
		}

		this.input[key] = false; // Allow the keyDown event for this key to be sent again
		input[key] = true;

		if (typeof this.active.onKeyUp === "function") {
			this.active.onKeyUp(input);
		}
	};

	Vectr.Game.prototype.start = function () {
		var previousDelta,
			self,
			drawCallback,
			updateCallback;

		self = this;

		drawCallback = function (currentDelta) {
			self.drawId = window.requestAnimationFrame(drawCallback);
			self.draw(self.context);
		};

		// Start draw loop
		this.drawId = window.requestAnimationFrame(drawCallback);

		previousDelta = new Date().getTime();

		updateCallback = function () {
			var currentDelta,
				delta;

			self.updateId = window.setTimeout(updateCallback, 1000 / 60);	// Try to run at 60 times/second

			currentDelta = new Date().getTime();
			delta = currentDelta - previousDelta;
			previousDelta = currentDelta;

			self.update(delta / 1000);
		};

		// Start update loop
		this.updateId = window.setTimeout(updateCallback, 1000 / 60);
	};

	Vectr.Game.prototype.stop = function () {
		window.cancelAnimationFrame(this.drawId);
		window.clearTimeout(this.updateId);
	};

	Vectr.Game.prototype.draw = function (context) {
		this.active.draw(context);
	};

	Vectr.Game.prototype.update = function (delta) {
		this.active.update(delta);
	};

	window.Vectr = Vectr;
})(window);