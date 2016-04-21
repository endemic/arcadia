/*jslint browser, this */
/*global window */

(function (root) {
    'use strict';

    var Arcadia = root.Arcadia || {};

    /**
     * @constructor
     * @description Main "game" object; sets up screens, input, etc.
     * @param {Object} args Config object. Allowed keys: width, height, scene, scaleToFit
     */
    var Game = function (options) {
        this.size = {
            width: options.width,
            height: options.height
        };

        Arcadia.VIEWPORT_WIDTH = this.size.width;
        Arcadia.VIEWPORT_HEIGHT = this.size.height;

        // If game is scaled up/down, clicks/touches need to be scaled
        this.scale = 1;

        // If element is not at (0, 0) (upper left), clicks/touches need to be offset
        this.offset = {x: 0, y: 0};

        // Static variable tracking performance
        Arcadia.FPS = 60;

        if (options.hasOwnProperty('fps')) {
            Arcadia.FPS_LIMIT = options.fps;
        }

        // Allow embedding the app in a specified container
        if (options.hasOwnProperty('element')) {
            this.element = options.element;
        } else {
            this.element = document.createElement('div');
            this.element.id = 'arcadia';
            document.body.appendChild(this.element);
        }

        this.canvas = document.createElement('canvas');
        this.context = this.canvas.getContext('2d');
        this.element.appendChild(this.canvas);

        this.setPixelRatio();

        // Map of current input, used to prevent duplicate events being sent to handlers
        // ("keydown" events fire continuously while a key is held)
        this.input = {
            left: false,
            up: false,
            right: false,
            down: false,
            w: false,
            a: false,
            s: false,
            d: false,
            enter: false,
            escape: false,
            space: false,
            control: false,
            z: false,
            x: false
        };

        this.keyCodeMap = {
            37: 'left',
            38: 'up',
            39: 'right',
            40: 'down',
            87: 'w',
            65: 'a',
            83: 's',
            68: 'd',
            13: 'enter',
            27: 'escape',
            32: 'space',
            17: 'control',
            90: 'z',
            88: 'x'
        };

        // Stores objects representing mouse/touch input
        this.points = [];

        // Static reference to current game instance
        // Used in Arcadia.changeScene
        Arcadia.instance = this;

        // Bind event handler callbacks
        this.onResize = this.onResize.bind(this);
        this.onPointStart = this.onPointStart.bind(this);
        this.onPointMove = this.onPointMove.bind(this);
        this.onPointEnd = this.onPointEnd.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
        this.onKeyUp = this.onKeyUp.bind(this);
        this.pause = this.pause.bind(this);
        this.resume = this.resume.bind(this);
        this.update = this.update.bind(this);

        // Set up event listeners - mouse and touch use the same ones
        if (Arcadia.ENV.mobile) {
            this.element.addEventListener('touchstart', this.onPointStart, false);
            this.element.addEventListener('touchmove', this.onPointMove, false);
            this.element.addEventListener('touchend', this.onPointEnd, false);
            // Prevent the page from scrolling when touching game element
            this.element.addEventListener('touchmove', function (e) {
                e.preventDefault();
            });
        } else {
            document.addEventListener('keydown', this.onKeyDown, false);
            document.addEventListener('keyup', this.onKeyUp, false);
            this.element.addEventListener('mousedown', this.onPointStart, false);
            this.element.addEventListener('mousemove', this.onPointMove, false);
            this.element.addEventListener('mouseup', this.onPointEnd, false);
        }

        // Add non-standard event listeners for "native" Cordova apps
        if (window.cordova !== undefined) {
            document.addEventListener('pause', this.pause, false);
            document.addEventListener('resume', this.resume, false);
        }

        // Fit <canvas> to window
        if (options.scaleToFit) {
            this.onResize();
            window.addEventListener('resize', this.onResize, false);
        }

        this.activeScene = new options.scene();
        this.start();
    };

    /**
     * @description Pause active scene if it has a pause method
     */
    Game.prototype.pause = function () {
        this.stop();
        if (typeof this.activeScene.pause === 'function') {
            this.activeScene.pause();
        }
    };

    /**
     * @description Resume active scene if it has a pause method
     */
    Game.prototype.resume = function () {
        this.start();
        if (typeof this.activeScene.resume === 'function') {
            this.activeScene.resume();
        }
    };

    /**
     * @description Mouse/touch event callback
     */
    Game.prototype.onPointStart = function (event) {
        // TODO: get rid of the this.points instance variable
        this.getPoints(event);

        if (event.type.indexOf('mouse') !== -1) {
            this.mouseMove = true;
        }

        this.activeScene.onPointStart(this.points);
    };

    /**
     * @description Mouse/touch event callback
     */
    Game.prototype.onPointMove = function (event) {
        if (!this.mouseMove && Arcadia.ENV.desktop) {
            return;
        }
        this.getPoints(event);
        this.activeScene.onPointMove(this.points);
    };

    /**
     * @description Mouse/touch event callback
     */
    Game.prototype.onPointEnd = function (event) {
        var end = true;
        this.getPoints(event, end);

        if (event.type.indexOf('mouse') !== -1) {
            this.mouseMove = false;
        }

        this.activeScene.onPointEnd(this.points);
    };

    /**
     * @description Keyboard event callback
     */
    Game.prototype.onKeyDown = function (event) {
        var key = this.getKey(event.keyCode);

        // Do nothing if key hasn't been released yet
        if (this.input[key]) {
            return;
        }

        this.input[key] = true;

        // Call current screen's "onKeyUp" method
        if (typeof this.activeScene.onKeyDown === 'function') {
            this.activeScene.onKeyDown(key);
        }
    };

    /**
     * @description Keyboard event callback
     */
    Game.prototype.onKeyUp = function (event) {
        var key = this.getKey(event.keyCode);

        this.input[key] = false; // Allow the keyDown event for this key to be sent again

        if (typeof this.activeScene.onKeyUp === 'function') {
            this.activeScene.onKeyUp(key);
        }
    };

    /**
     * @description Translate a keyboard event code into a meaningful string
     */
    Game.prototype.getKey = function (keyCode) {
        // TODO: Make an implemention something like this
        // if (keyCode === 37 ) { this.input['left'] = true; }
        // then send this.input to Scene key handlers
        // they will compare against keys['left'] === true instead of key === 'left'
        // This implementation will allow detecting multiple keys pressed simultaneously, if that matters
        return this.keyCodeMap[keyCode] || '';
    };

    /**
     * @description Static method to translate mouse/touch input to coordinates the
     * game will understand. Takes the <canvas> offset and scale into account
     */
    Game.prototype.getPoints = function (event, touchEnd) {
        var source = 'touches';

        touchEnd = touchEnd || false;

        if (touchEnd) {
            source = 'changedTouches';
        }

        // http://jsperf.com/empty-javascript-array
        while (this.points.length > 0) {
            this.points.pop();
        }

        var cameraOffset = {
            x: this.activeScene.camera.position.x,
            y: this.activeScene.camera.position.y
        };

        if (event.type.indexOf('mouse') !== -1) {
            this.points.unshift({
                x: (event.pageX - this.offset.x) / this.scale - this.size.width / 2 + cameraOffset.x,
                y: (event.pageY - this.offset.y) / this.scale - this.size.height / 2 + cameraOffset.y
            });
        } else {
            var i = event[source].length;
            while (i--) {
                this.points.unshift({
                    x: (event[source][i].pageX - this.offset.x) / this.scale - this.size.width / 2 + cameraOffset.x,
                    y: (event[source][i].pageY - this.offset.y) / this.scale - this.size.height / 2 + cameraOffset.y
                });
            }
        }
    };

    /**
     * @description Start the event/animation loops
     */
    Game.prototype.start = function () {
        this.previousDelta = window.performance.now();

        // Start game loop
        this.updateId = window.requestAnimationFrame(this.update);
    };

    /**
     * @description Cancel draw/update loops
     */
    Game.prototype.stop = function () {
        window.cancelAnimationFrame(this.updateId);
    };

    /**
     * @description Update callback
     */
    Game.prototype.update = function (currentDelta) {
        var delta = currentDelta - this.previousDelta;
        this.updateId = window.requestAnimationFrame(this.update);

        Arcadia.FPS = Arcadia.FPS * 0.9 + 1000 / delta * 0.1; // delta == milliseconds

        // Check against FPS limit; 1000ms / {n}FPS = ms/frame
        if (Arcadia.FPS_LIMIT && delta < 1000 / Arcadia.FPS_LIMIT) {
            return;
        }

        this.activeScene.update(delta / 1000); // call update() using seconds
        this.activeScene.draw(this.context);
        this.previousDelta = currentDelta;
    };

    /**
     * @description Change size of canvas based on pixel density
     */
    Game.prototype.setPixelRatio = function () {
        if (!window.devicePixelRatio) {
            window.devicePixelRatio = 1;
        }

        if (this.context.backingStorePixelRatio === undefined) {
            this.context.backingStorePixelRatio = this.context.webkitBackingStorePixelRatio || 1;
        }

        Arcadia.PIXEL_RATIO = window.devicePixelRatio / this.context.backingStorePixelRatio;

        // Set "real" width/height
        this.canvas.width = this.size.width * Arcadia.PIXEL_RATIO;
        this.canvas.height = this.size.height * Arcadia.PIXEL_RATIO;

        // Scale (via CSS) to screen size
        this.canvas.style.width = this.size.width + 'px';
        this.canvas.style.height = this.size.height + 'px';
    };

    /**
     * @description Handle window resize events. Scale the canvas element to max out the size of the current window, keep aspect ratio
     */
    Game.prototype.onResize = function () {
        var height = window.innerHeight,
            width = window.innerWidth,
            margin,
            orientation,
            aspectRatio;

        if (width > height) {
            orientation = 'landscape';
            aspectRatio = this.size.width / this.size.height;
        } else {
            orientation = 'portrait';
            aspectRatio = this.size.height / this.size.width;
        }

        if (orientation === 'landscape') {
            if (width / aspectRatio > height) {  // Too wide
                width = height * aspectRatio;
                margin = '0 ' + ((window.innerWidth - width) / 2) + 'px';
            } else if (width / aspectRatio < height) {  // Too high
                height = width / aspectRatio;
                margin = ((window.innerHeight - height) / 2) + 'px 0';
            }
        } else if (orientation === 'portrait') {
            if (height / aspectRatio > width) {   // Too high
                height = width * aspectRatio;
                margin = ((window.innerHeight - height) / 2) + 'px 0';
            } else if (height / aspectRatio < width) {  // Too wide
                width = height / aspectRatio;
                margin = '0 ' + ((window.innerWidth - width) / 2) + 'px';
            }
        }

        this.scale = height / this.size.height;
        this.offset.x = (window.innerWidth - width) / 2;
        this.offset.y = (window.innerHeight - height) / 2;

        this.element.setAttribute('style', 'position: relative; width: ' + width + 'px; height: ' + height + 'px; margin: ' + margin + ';');
        this.canvas.style.position = 'absolute';
        this.canvas.style.left = '0';
        this.canvas.style.top = '0';
        this.canvas.style['-webkit-transform'] = 'scale(' + this.scale + ')'; // Safari sux
        this.canvas.style['-webkit-transform-origin'] = '0 0';
        this.canvas.style.transform = 'scale(' + this.scale + ')';
        this.canvas.style['transform-origin'] = '0 0';
    };

    Arcadia.Game = Game;

    root.Arcadia = Arcadia;
}(window));
