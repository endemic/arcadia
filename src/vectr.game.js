/*jslint sloppy: true, plusplus: true, browser: true */
(function (window) {
	// point vendor-specific implementations to window.requestAnimationFrame
	if (typeof window.requestAnimationFrame === "undefined") {
		window.requestAnimationFrame = window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
	}

	if (typeof window.cancelAnimationFrame === "undefined") {
		window.cancelAnimationFrame = window.mozCancelAnimationFrame || window.webkitCancelAnimationFrame || window.msCancelAnimationFrame;
	}

	var Vectr = {
		'VERSION': '0.1',
		'Game': function (width, height, SceneClass) {
			if (typeof width === "undefined") {
				width = 320;
			}

			if (typeof height === "undefined") {
				height = 480;
			}

			Vectr.WIDTH = width;
			Vectr.HEIGHT = height;
			Vectr.SCALE = 1;
			Vectr.OFFSET = {
				'x': 0,
				'y': 0
			};
			Vectr.instance = this;

			// Create the #vectr container, give it a size, etc.
			this.element = document.createElement('div');
			this.element.setAttribute('id', 'vectr');

			this.canvas = document.createElement('canvas');
			this.canvas.setAttribute('width', width);
			this.canvas.setAttribute('height', height);
			this.context = this.canvas.getContext('2d');

			// Fit <canvas> to window
			this.onResize();

			this.element.appendChild(this.canvas);
			document.body.appendChild(this.element);

			// Bind event handler callbacks
			this.onResize = this.onResize.bind(this);
			this.onPointStart = this.onPointStart.bind(this);
			this.onPointMove = this.onPointMove.bind(this);
			this.onPointEnd = this.onPointEnd.bind(this);
			this.onKeyDown = this.onKeyDown.bind(this);
			this.onKeyUp = this.onKeyUp.bind(this);

			// Set up event listeners; Mouse and touch use the same ones
			window.addEventListener('resize', this.onResize, false);
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

			// Stores objects representing mouse/touch input
			this.points = [];

			// Instantiate initial scene
			this.active = new SceneClass();
		}
	};

	/**
	 * @description Mouse/touch event callback
	 */
	Vectr.Game.prototype.onPointStart = function (event) {
		Vectr.getPoints(event);

		if (event.type.indexOf('mouse') !== -1) {
			this.element.addEventListener('mousemove', this.onPointMove, false);
		}

		if (typeof this.active.onPointStart === "function") {
			this.active.onPointStart(this.points);
		}
	};

	/**
	 * @description Mouse/touch event callback
	 */
	Vectr.Game.prototype.onPointMove = function (event) {
		Vectr.getPoints(event);

		if (typeof this.active.onPointMove === "function") {
			this.active.onPointMove(this.points);
		}
	};

	/**
	 * @description Mouse/touch event callback
	 */
	Vectr.Game.prototype.onPointEnd = function (event) {
		Vectr.getPoints(event);

		if (event.type.indexOf('mouse') !== -1) {
			this.element.removeEventListener('mousemove', this.onPointMove, false);
		}

		if (typeof this.active.onPointEnd === "function") {
			this.active.onPointEnd(this.points);
		}
	};

	/**
	 * @description Keyboard event callback
	 */
	Vectr.Game.prototype.onKeyDown = function (event) {
		var key;

		switch (event.keyCode) {
		case 37: key = 'left'; break;
		case 38: key = 'up'; break;
		case 39: key = 'right'; break;
		case 40: key = 'down'; break;
		case 87: key = 'w'; break;
		case 65: key = 'a'; break;
		case 83: key = 's'; break;
		case 68: key = 'd'; break;
		case 13: key = 'enter'; break;
		case 27: key = 'escape'; break;
		case 32: key = 'space'; break;
		case 17: key = 'control'; break;
		case 90: key = 'z'; break;
		case 88: key = 'x'; break;
		default: break;
		}

		// Do nothing if key hasn't been released yet
		if (this.input[key] === true) {
			return;
		}

		this.input[key] = true;

		if (typeof this.active.onKeyDown === "function") {
			this.active.onKeyDown(key);
		}
	};

	/**
	 * @description Keyboard event callback
	 */
	Vectr.Game.prototype.onKeyUp = function (event) {
		var key;

		switch (event.keyCode) {
		case 37: key = 'left'; break;
		case 38: key = 'up'; break;
		case 39: key = 'right'; break;
		case 40: key = 'down'; break;
		case 87: key = 'w'; break;
		case 65: key = 'a'; break;
		case 83: key = 's'; break;
		case 68: key = 'd'; break;
		case 13: key = 'enter'; break;
		case 27: key = 'escape'; break;
		case 32: key = 'space'; break;
		case 17: key = 'control'; break;
		case 90: key = 'z'; break;
		case 88: key = 'x'; break;
		default: break;
		}

		this.input[key] = false; // Allow the keyDown event for this key to be sent again

		if (typeof this.active.onKeyUp === "function") {
			this.active.onKeyUp(key);
		}
	};

	/**
	 * @description Start the event/animation loops
	 */
	Vectr.Game.prototype.start = function () {
		var previousDelta,
			self,
			update;

		self = this;

		if (typeof window.performance !== "undefined") {
			previousDelta = window.performance.now();
		} else {
			previousDelta = Date.now();
		}

		update = function (currentDelta) {
			var delta = currentDelta - previousDelta;

			previousDelta = currentDelta;

			self.update(delta / 1000);

			self.updateId = window.requestAnimationFrame(update);
		};

		// Start game loop
		this.updateId = window.requestAnimationFrame(update);
	};

	/**
	 * @description Cancel draw/update loops
	 */
	Vectr.Game.prototype.stop = function () {
		window.cancelAnimationFrame(this.updateId);
	};

	/**
	 * @description Update callback
	 */
	Vectr.Game.prototype.update = function (delta) {
		this.active.draw(this.context);
		this.active.update(delta);
	};

	/**
	 * @description Handle window resize events. Scale the canvas element to max out the size of the current window, keep aspect ratio
	 */
	Vectr.Game.prototype.onResize = function (e) {
		var scaledWidth,
			scaledHeight,
			aspectRatio,
			orientation,
			margin;

		scaledWidth = window.innerWidth;
		scaledHeight = window.innerHeight;

		if (scaledWidth > scaledHeight) {
			orientation = "landscape";
			aspectRatio = Vectr.WIDTH / Vectr.HEIGHT;
		} else {
			orientation = "portrait";
			aspectRatio = Vectr.HEIGHT / Vectr.WIDTH;
		}

		if (orientation === "landscape") {
			if (scaledWidth / aspectRatio > scaledHeight) {	// Too wide
				scaledWidth = scaledHeight * aspectRatio;
				margin = '0 ' + ((window.innerWidth - scaledWidth) / 2) + 'px';
			} else if (scaledWidth / aspectRatio < scaledHeight) {	// Too high
				scaledHeight = scaledWidth / aspectRatio;
				margin = ((window.innerHeight - scaledHeight) / 2) + 'px 0';
			}
		} else if (orientation === "portrait") {
			if (scaledHeight / aspectRatio > scaledWidth) {		// Too high
				scaledHeight = scaledWidth * aspectRatio;
				margin = ((window.innerHeight - scaledHeight) / 2) + 'px 0';
			} else if (scaledHeight / aspectRatio < scaledWidth) {	// Too wide
				scaledWidth = scaledHeight / aspectRatio;
				margin = '0 ' + ((window.innerWidth - scaledWidth) / 2) + 'px';
			}
		}

		Vectr.SCALE = scaledHeight / Vectr.HEIGHT;
		Vectr.OFFSET.x = (window.innerWidth - scaledWidth) / 2;
		Vectr.OFFSET.y = (window.innerHeight - scaledHeight) / 2;
		this.element.setAttribute('style', 'position: relative; width: ' + scaledWidth + 'px; height: ' + scaledHeight + 'px; margin: ' + margin);
		this.canvas.setAttribute('style', 'position: absolute; left: 0; top: 0; width: ' + scaledWidth + 'px; height: ' + scaledHeight + 'px;');
	};

	/**
	 * @description Change the active scene being displayed
	 */
	Vectr.changeScene = function (SceneClass) {
		if (typeof SceneClass !== "function") {
			throw "Trying to change to an invalid scene.";
		}

		Vectr.instance.active = new SceneClass();
	};

	/**
	 * @description Static method to translate mouse/touch input to coordinates the game will understand
	 * Takes the <canvas> offset and scale into account
	 */
	Vectr.getPoints = function (event) {
		var i = 0,
			length;

		// Truncate existing "points" array
		Vectr.instance.points.length = 0;

		if (event.type.indexOf('mouse') !== -1) {
			Vectr.instance.points.push({
				'x': (event.pageX - Vectr.OFFSET.x) / Vectr.SCALE,
				'y': (event.pageY - Vectr.OFFSET.y) / Vectr.SCALE
			});
		} else {
			length = event.touches.length;
			while (i < length) {
				Vectr.instance.points.push({
					'x': (event.touches[i].pageX - Vectr.OFFSET.x) / Vectr.SCALE,
					'y': (event.touches[i].pageY - Vectr.OFFSET.y) / Vectr.SCALE
				});

				i += 1;
			}
		}
	};

	window.Vectr = Vectr;
}(window));