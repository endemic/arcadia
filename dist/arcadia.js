/**
 * @description One possible way to store common recyclable objects.
 * Assumes the objects you add will have an `active` property, and optionally an
 * `activate()` method which resets the object's state. Inspired by Programming
 * Linux Games (http://en.wikipedia.org/wiki/Programming_Linux_Games)
 */

 /*jslint browser, this */
 /*global window */

(function (root) {
    'use strict';

    var Arcadia = root.Arcadia || {};

    var Pool = function () {
        this.active = [];
        this.inactive = [];

        // Instantiate/return child objects using factory
        this.factory = null;
    };

    /**
     * @description Get length of "active" objects
     */
    Object.defineProperty(Pool.prototype, 'length', {
        enumerable: true,
        get: function () {
            return this.active.length;
        }
    });

    /**
     * @description Convenience accessor
     */
    Pool.prototype.at = function (index) {
        return this.active[index];
    };

    /**
     * @description Add an object into the recycle pool
     * list is z-sorted from 0 -> n, higher z-indices are drawn first
     */
    Pool.prototype.add = function (object) {
        // Add a z-index property
        if (!object.zIndex) {
            object.zIndex = this.active.length + this.inactive.length;
        }

        var index = 0;

        while (index < this.length && object.zIndex > this.active[index].zIndex) {
            index += 1;
        }

        this.active.splice(index, 0, object);

        return this.length;
    };

    /**
     * @description Remove an object from the recycle pool
     */
    Pool.prototype.remove = function (object) {
        var index;

        if (typeof object === 'number') {
            index = object;
            object = this.active.splice(index, 1)[0];
            if (typeof object.destroy === 'function') {
                object.destroy();
            }
            return object;
        }

        if (this.active.indexOf(object) !== -1) {
            index = this.active.indexOf(object);
            object = this.active.splice(index, 1)[0];
            if (typeof object.destroy === 'function') {
                object.destroy();
            }
            return object;
        }

        if (this.inactive.indexOf(object) !== -1) {
            index = this.inactive.indexOf(object);
            object = this.inactive.splice(index, 1)[0];
            if (typeof object.destroy === 'function') {
                object.destroy();
            }
            return object;
        }
    };

    /**
     * @description Get an active object by reference
     */
    Pool.prototype.activate = function (object) {
        var index;

        // Move a specific inactive object into active
        if (object) {
            index = this.inactive.indexOf(object);

            // Return undefined if object is or not found
            if (index === -1) {
                return;
            }

            object = this.inactive.splice(index, 1)[0];
            if (typeof object.reset === 'function') {
                object.reset();
            }

            // swap with another inactive object
            this.index = this.length;
            while (this.index > 0 && this.active[this.index - 1].zIndex > object.zIndex) {
                this.active[this.index] = this.active[this.index - 1];
                this.index -= 1;
            }

            this.active[this.index] = object;

            return object;
        }

        // Move a random inactive object into active
        if (!object && this.inactive.length) {
            object = this.inactive.shift();
            if (typeof object.reset === 'function') {
                object.reset();
            }

            this.index = this.length;
            while (this.index > 0 && this.active[this.index - 1].zIndex > object.zIndex) {
                this.active[this.index] = this.active[this.index - 1];
                this.index -= 1;
            }

            this.active[this.index] = object;

            return object;
        }

        // Generate a new object and add to active
        if (typeof this.factory !== 'function') {
            throw new Error('You tried to activate a Pool object without a factory.');
        }

        this.add(this.factory());
        return this.active[this.length - 1];
    };

    /**
     * @description Deactivate an active object at a particular object/index
     */
    Pool.prototype.deactivate = function (objectOrIndex) {
        var index;

        if (typeof objectOrIndex !== 'number') {
            index = this.active.indexOf(objectOrIndex);
        } else {
            index = objectOrIndex;
        }

        // TODO: Spec this behavior
        if (index === -1) {
            return;
        }

        // Save reference to deactivated object
        var object = this.active.splice(index, 1)[0];

        this.inactive.push(object);

        return object;
    };

    /**
     * @description Deactivate all child objects
     */
    Pool.prototype.deactivateAll = function () {
        this.index = this.length;
        while (this.index--) {
            this.deactivate(this.index);
        }
    };

    /**
     * @description Activate all child objects
     */
    Pool.prototype.activateAll = function () {
        while (this.inactive.length) {
            this.activate();
        }
    };

    /**
     * @description Passthrough method to update active child objects
     */
    Pool.prototype.update = function (delta) {
        this.index = this.length;
        while (this.index--) {
            this.at(this.index).update(delta);
        }
    };

    /**
     * @description Passthrough method to draw active child objects
     */
    Pool.prototype.draw = function () {
        this.index = this.length;
        while (this.index--) {
            this.at(this.index).draw.apply(this.at(this.index), arguments);
        }
    };

    /**
     * @description Event handler for "start" pointer event
     * this.param {Array} points Array of touch/mouse coordinates
     */
    Pool.prototype.onPointStart = function (points) {
        this.index = this.length;
        while (this.index--) {
            this.at(this.index).onPointStart(points);
        }
    };

    /**
     * @description Event handler for "move" pointer event
     * this.param {Array} points Array of touch/mouse coordinates
     */
    Pool.prototype.onPointMove = function (points) {
        this.index = this.length;
        while (this.index--) {
            this.at(this.index).onPointMove(points);
        }
    };

    /**
     * @description Event handler for "end" pointer event
     * this.param {Array} points Array of touch/mouse coordinates
     */
    Pool.prototype.onPointEnd = function (points) {
        this.index = this.length;
        while (this.index--) {
            this.at(this.index).onPointEnd(points);
        }
    };

    Arcadia.Pool = Pool;

    root.Arcadia = Arcadia;
}(window));
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

        // If game is scaled up/down, clicks/touches need to be scaled
        this.scale = 1;

        // If element is not at (0, 0) (upper left), clicks/touches need to be offset
        this.offset = {x: 0, y: 0};

        // Static variable tracking performance
        this.fps = 60;

        if (options.hasOwnProperty('fps')) {
            this.fps_limit = options.fps;
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

        this.activeScene = new options.scene({ parent: this });

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
        if (!this.mouseMove) {
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

        var cameraOffset = {x: 0, y: 0};

        if (this.activeScene.camera) {
            cameraOffset.x = this.activeScene.camera.position.x;
            cameraOffset.y = this.activeScene.camera.position.y;
        }

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

        this.fps = this.fps * 0.9 + 1000 / delta * 0.1; // delta == milliseconds

        // Check against FPS limit; 1000ms / {n}FPS = ms/frame
        if (this.fps_limit && delta < 1000 / this.fps_limit) {
            return;
        }

        this.activeScene.draw(this.context);
        this.activeScene.update(delta / 1000); // call update() using seconds
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
/*jslint browser, this */
/*global window */

(function (root) {
    'use strict';

    var Arcadia = root.Arcadia || {};

    /**
     * @constructor
     */
    var GameObject = function (options) {
        options = options || {};

        this.scale = options.scale || 1;
        this.rotation = options.rotation || 0; // in radians
        this.alpha = options.alpha || 1;
        this.enablePointEvents = options.enablePointEvents || false;
        this.position = options.position || {x: 0, y: 0};

        this.children = new Arcadia.Pool();
    };

    /**
     * @description Draw child objects
     * @param {CanvasRenderingContext2D} context
     */
    GameObject.prototype.draw = function () {
        this.children.draw.apply(this.children, arguments);
    };

    /**
     * @description Update child objects
     * @param {Number} delta Time since last update (in seconds)
     */
    GameObject.prototype.update = function (delta) {
        this.children.update(delta);
    };

    /**
     * @description Add child object to self
     * @param {Object} object Object to be added
     */
    GameObject.prototype.add = function (object) {
        this.children.add(object);
    };

    /**
     * @description Remove child object
     * @param {Object} objectOrIndex Object or index of object to be removed
     */
    GameObject.prototype.remove = function (objectOrIndex) {
        this.children.remove(objectOrIndex);
    };

    /**
     * @description Activate child object
     * @param {Object} objectOrIndex Object or index of object to be activated
     */
    GameObject.prototype.activate = function (objectOrIndex) {
        this.children.activate(objectOrIndex);
    };

    /**
     * @description Deactivate child object
     * @param {Object} objectOrIndex Object or index of object to be deactivated
     */
    GameObject.prototype.deactivate = function (objectOrIndex) {
        this.children.deactivate(objectOrIndex);
    };

    /**
     * @description Event handler for "start" pointer event
     * @param {Array} points Array of touch/mouse coordinates
     */
    GameObject.prototype.onPointStart = function (points) {
        if (!this.enablePointEvents) {
            return;
        }

        this.children.onPointStart(this.offsetPoints(points));
    };

    /**
     * @description Event handler for "move" pointer event
     * @param {Array} points Array of touch/mouse coordinates
     */
    GameObject.prototype.onPointMove = function (points) {
        if (!this.enablePointEvents) {
            return;
        }

        this.children.onPointMove(this.offsetPoints(points));
    };

    /**
     * @description Event handler for "end" pointer event
     * @param {Array} points Array of touch/mouse coordinates
     */
    GameObject.prototype.onPointEnd = function (points) {
        if (!this.enablePointEvents) {
            return;
        }

        this.children.onPointEnd(this.offsetPoints(points));
    };

    /**
     * @description Takes an array of x/y coordinates, and offsets them by own position
     */
    GameObject.prototype.offsetPoints = function (points) {
        var self = this;
        return points.map(function (point) {
            return {
                x: point.x - self.position.x,
                y: point.y - self.position.y
            };
        });
    };

    Arcadia.GameObject = GameObject;

    root.Arcadia = Arcadia;
}(window));
/*jslint browser, this */
/*global window */

(function (root) {
    'use strict';

    var Arcadia = root.Arcadia || {};

    /**
     * @constructor
     */
    var Scene = function (options) {
        Arcadia.GameObject.apply(this, arguments);
        this.enablePointEvents = true;
        options = options || {};
        this.parent = options.parent;
    };

    Scene.prototype = new Arcadia.GameObject();

    /**
     * @description Update the camera if necessary
     * @param {Number} delta
     */
    Scene.prototype.update = function (delta) {
        Arcadia.GameObject.prototype.update.call(this, delta);

        if (!this.camera) {
            return;
        }

        // Follow the target, keeping it in the center of the screen...
        this.camera.position.x = this.camera.target.position.x;
        this.camera.position.y = this.camera.target.position.y;

        // Unless it is too close to boundaries, in which case keep the cam steady
        if (this.camera.position.x < this.camera.bounds.left + this.camera.viewport.width / 2) {
            this.camera.position.x = this.camera.bounds.left + this.camera.viewport.width / 2;
        } else if (this.camera.position.x > this.camera.bounds.right - this.camera.viewport.width / 2) {
            this.camera.position.x = this.camera.bounds.right - this.camera.viewport.width / 2;
        }

        if (this.camera.position.y < this.camera.bounds.top + this.camera.viewport.height / 2) {
            this.camera.position.y = this.camera.bounds.top + this.camera.viewport.height / 2;
        } else if (this.camera.position.y > this.camera.bounds.bottom - this.camera.viewport.height / 2) {
            this.camera.position.y = this.camera.bounds.bottom - this.camera.viewport.height / 2;
        }
    };

    /**
     * @description Clear context, then re-draw all child objects
     * @param {CanvasRenderingContext2D} context
     */
    Scene.prototype.draw = function (context) {
        // TODO: change this to `clearColor` or something
        if (this.color) {
            context.fillStyle = this.color;
            context.fillRect(0, 0, context.canvas.width, context.canvas.height);
        } else {
            context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        }

        var origin = {x: this.size.width / 2, y: this.size.height / 2};

        if (this.camera) {
            origin.x = this.camera.viewport.width / 2 - this.camera.position.x;
            origin.y = this.camera.viewport.height / 2 - this.camera.position.y;
        }

        // Draw child objects
        Arcadia.GameObject.prototype.draw.call(this, context, origin.x, origin.y);
    };

    /**
     * @description Getter/setter for camera target
     */
    Object.defineProperty(Scene.prototype, 'target', {
        enumerable: true,
        get: function () {
            return this.camera && this.camera.target;
        },
        set: function (shape) {
            if (!shape.position) {
                throw new Error('Scene camera target requires a `position` property.');
            }

            var viewportSize = this.parent ? this.parent.size : this.size;

            // implement a camera view/drawing offset
            this.camera = {
                target: shape,
                viewport: {
                    width: viewportSize.width,
                    height: viewportSize.height
                },
                bounds: {
                    top: -this.size.height / 2,
                    bottom: this.size.height / 2,
                    left: -this.size.width / 2,
                    right: this.size.width / 2
                },
                position: {
                    x: shape.position.x,
                    y: shape.position.y
                }
            };
        }
    });

    Arcadia.Scene = Scene;

    root.Arcadia = Arcadia;
}(window));
/*
Easie.coffee (https://github.com/jimjeffers/Easie)
Project created by J. Jeffers

Robert Penner's Easing Equations in CoffeeScript
http://robertpenner.com/easing/

DISCLAIMER: Software provided as is with no warranty of any type.
Don't do bad things with this :)
 */
this.Easie = (function() {
  function Easie() {}

  Easie.backIn = function(time, begin, change, duration, overshoot) {
    if (overshoot == null) {
      overshoot = 1.70158;
    }
    return change * (time /= duration) * time * ((overshoot + 1) * time - overshoot) + begin;
  };

  Easie.backOut = function(time, begin, change, duration, overshoot) {
    if (overshoot == null) {
      overshoot = 1.70158;
    }
    return change * ((time = time / duration - 1) * time * ((overshoot + 1) * time + overshoot) + 1) + begin;
  };

  Easie.backInOut = function(time, begin, change, duration, overshoot) {
    if (overshoot == null) {
      overshoot = 1.70158;
    }
    if ((time = time / (duration / 2)) < 1) {
      return change / 2 * (time * time * (((overshoot *= 1.525) + 1) * time - overshoot)) + begin;
    } else {
      return change / 2 * ((time -= 2) * time * (((overshoot *= 1.525) + 1) * time + overshoot) + 2) + begin;
    }
  };

  Easie.bounceOut = function(time, begin, change, duration) {
    if ((time /= duration) < 1 / 2.75) {
      return change * (7.5625 * time * time) + begin;
    } else if (time < 2 / 2.75) {
      return change * (7.5625 * (time -= 1.5 / 2.75) * time + 0.75) + begin;
    } else if (time < 2.5 / 2.75) {
      return change * (7.5625 * (time -= 2.25 / 2.75) * time + 0.9375) + begin;
    } else {
      return change * (7.5625 * (time -= 2.625 / 2.75) * time + 0.984375) + begin;
    }
  };

  Easie.bounceIn = function(time, begin, change, duration) {
    return change - Easie.bounceOut(duration - time, 0, change, duration) + begin;
  };

  Easie.bounceInOut = function(time, begin, change, duration) {
    if (time < duration / 2) {
      return Easie.bounceIn(time * 2, 0, change, duration) * 0.5 + begin;
    } else {
      return Easie.bounceOut(time * 2 - duration, 0, change, duration) * 0.5 + change * 0.5 + begin;
    }
  };

  Easie.circIn = function(time, begin, change, duration) {
    return -change * (Math.sqrt(1 - (time = time / duration) * time) - 1) + begin;
  };

  Easie.circOut = function(time, begin, change, duration) {
    return change * Math.sqrt(1 - (time = time / duration - 1) * time) + begin;
  };

  Easie.circInOut = function(time, begin, change, duration) {
    if ((time = time / (duration / 2)) < 1) {
      return -change / 2 * (Math.sqrt(1 - time * time) - 1) + begin;
    } else {
      return change / 2 * (Math.sqrt(1 - (time -= 2) * time) + 1) + begin;
    }
  };

  Easie.cubicIn = function(time, begin, change, duration) {
    return change * (time /= duration) * time * time + begin;
  };

  Easie.cubicOut = function(time, begin, change, duration) {
    return change * ((time = time / duration - 1) * time * time + 1) + begin;
  };

  Easie.cubicInOut = function(time, begin, change, duration) {
    if ((time = time / (duration / 2)) < 1) {
      return change / 2 * time * time * time + begin;
    } else {
      return change / 2 * ((time -= 2) * time * time + 2) + begin;
    }
  };

  Easie.elasticOut = function(time, begin, change, duration, amplitude, period) {
    var overshoot;
    if (amplitude == null) {
      amplitude = null;
    }
    if (period == null) {
      period = null;
    }
    if (time === 0) {
      return begin;
    } else if ((time = time / duration) === 1) {
      return begin + change;
    } else {
      if (period == null) {
        period = duration * 0.3;
      }
      if ((amplitude == null) || amplitude < Math.abs(change)) {
        amplitude = change;
        overshoot = period / 4;
      } else {
        overshoot = period / (2 * Math.PI) * Math.asin(change / amplitude);
      }
      return (amplitude * Math.pow(2, -10 * time)) * Math.sin((time * duration - overshoot) * (2 * Math.PI) / period) + change + begin;
    }
  };

  Easie.elasticIn = function(time, begin, change, duration, amplitude, period) {
    var overshoot;
    if (amplitude == null) {
      amplitude = null;
    }
    if (period == null) {
      period = null;
    }
    if (time === 0) {
      return begin;
    } else if ((time = time / duration) === 1) {
      return begin + change;
    } else {
      if (period == null) {
        period = duration * 0.3;
      }
      if ((amplitude == null) || amplitude < Math.abs(change)) {
        amplitude = change;
        overshoot = period / 4;
      } else {
        overshoot = period / (2 * Math.PI) * Math.asin(change / amplitude);
      }
      time -= 1;
      return -(amplitude * Math.pow(2, 10 * time)) * Math.sin((time * duration - overshoot) * (2 * Math.PI) / period) + begin;
    }
  };

  Easie.elasticInOut = function(time, begin, change, duration, amplitude, period) {
    var overshoot;
    if (amplitude == null) {
      amplitude = null;
    }
    if (period == null) {
      period = null;
    }
    if (time === 0) {
      return begin;
    } else if ((time = time / (duration / 2)) === 2) {
      return begin + change;
    } else {
      if (period == null) {
        period = duration * (0.3 * 1.5);
      }
      if ((amplitude == null) || amplitude < Math.abs(change)) {
        amplitude = change;
        overshoot = period / 4;
      } else {
        overshoot = period / (2 * Math.PI) * Math.asin(change / amplitude);
      }
      if (time < 1) {
        return -0.5 * (amplitude * Math.pow(2, 10 * (time -= 1))) * Math.sin((time * duration - overshoot) * ((2 * Math.PI) / period)) + begin;
      } else {
        return amplitude * Math.pow(2, -10 * (time -= 1)) * Math.sin((time * duration - overshoot) * (2 * Math.PI) / period) + change + begin;
      }
    }
  };

  Easie.expoIn = function(time, begin, change, duration) {
    if (time === 0) {
      return begin;
    }
    return change * Math.pow(2, 10 * (time / duration - 1)) + begin;
  };

  Easie.expoOut = function(time, begin, change, duration) {
    if (time === duration) {
      return begin + change;
    }
    return change * (-Math.pow(2, -10 * time / duration) + 1) + begin;
  };

  Easie.expoInOut = function(time, begin, change, duration) {
    if (time === 0) {
      return begin;
    } else if (time === duration) {
      return begin + change;
    } else if ((time = time / (duration / 2)) < 1) {
      return change / 2 * Math.pow(2, 10 * (time - 1)) + begin;
    } else {
      return change / 2 * (-Math.pow(2, -10 * (time - 1)) + 2) + begin;
    }
  };

  Easie.linearNone = function(time, begin, change, duration) {
    return change * time / duration + begin;
  };

  Easie.linearIn = function(time, begin, change, duration) {
    return Easie.linearNone(time, begin, change, duration);
  };

  Easie.linearOut = function(time, begin, change, duration) {
    return Easie.linearNone(time, begin, change, duration);
  };

  Easie.linearInOut = function(time, begin, change, duration) {
    return Easie.linearNone(time, begin, change, duration);
  };

  Easie.quadIn = function(time, begin, change, duration) {
    return change * (time = time / duration) * time + begin;
  };

  Easie.quadOut = function(time, begin, change, duration) {
    return -change * (time = time / duration) * (time - 2) + begin;
  };

  Easie.quadInOut = function(time, begin, change, duration) {
    if ((time = time / (duration / 2)) < 1) {
      return change / 2 * time * time + begin;
    } else {
      return -change / 2 * ((time -= 1) * (time - 2) - 1) + begin;
    }
  };

  Easie.quartIn = function(time, begin, change, duration) {
    return change * (time = time / duration) * time * time * time + begin;
  };

  Easie.quartOut = function(time, begin, change, duration) {
    return -change * ((time = time / duration - 1) * time * time * time - 1) + begin;
  };

  Easie.quartInOut = function(time, begin, change, duration) {
    if ((time = time / (duration / 2)) < 1) {
      return change / 2 * time * time * time * time + begin;
    } else {
      return -change / 2 * ((time -= 2) * time * time * time - 2) + begin;
    }
  };

  Easie.quintIn = function(time, begin, change, duration) {
    return change * (time = time / duration) * time * time * time * time + begin;
  };

  Easie.quintOut = function(time, begin, change, duration) {
    return change * ((time = time / duration - 1) * time * time * time * time + 1) + begin;
  };

  Easie.quintInOut = function(time, begin, change, duration) {
    if ((time = time / (duration / 2)) < 1) {
      return change / 2 * time * time * time * time * time + begin;
    } else {
      return change / 2 * ((time -= 2) * time * time * time * time + 2) + begin;
    }
  };

  Easie.sineIn = function(time, begin, change, duration) {
    return -change * Math.cos(time / duration * (Math.PI / 2)) + change + begin;
  };

  Easie.sineOut = function(time, begin, change, duration) {
    return change * Math.sin(time / duration * (Math.PI / 2)) + begin;
  };

  Easie.sineInOut = function(time, begin, change, duration) {
    return -change / 2 * (Math.cos(Math.PI * time / duration) - 1) + begin;
  };

  return Easie;

})();

if (typeof module !== 'undefined') {
  module.exports = this.Easie;
}
/*jslint browser, this */
/*global window, Easie */

(function (root) {
    'use strict';

    var Arcadia = root.Arcadia || {};

    /**
     * @description Shape constructor
     * @param {Object} options Object representing shape options
     */
    var Shape = function (options) {
        Arcadia.GameObject.apply(this, arguments);

        // Internal cached drawing
        this.canvas = document.createElement('canvas');

        // Trigger initial cache draw
        this.dirty = true;

        // Hold animations
        this.tweens = [];

        // Default graphical options; changing these requires using
        // setters/getters, since the cache needs to be redrawn
        this._color = '#fff';
        this._border = {width: 0, color: '#fff'};
        this._shadow = {x: 0, y: 0, blur: 0, color: '#fff'};
        this._vertices = 4;
        this._size = {width: 10, height: 10};

        this.speed = 1;
        this.velocity = {x: 0, y: 0};
        this.angularVelocity = 0;
        this.acceleration = {x: 0, y: 0};
        this.debug = false;

        // Assign any props passed in through options
        var self = this;
        options = options || {};
        Object.keys(options).forEach(function (property) {
            self[property] = options[property];
        });

        this.anchor = {
            x: this.size.width / 2,
            y: this.size.height / 2
        };
    };

    Shape.prototype = new Arcadia.GameObject();

    /**
     * @description Getters/setters for display properties
     */
    Object.defineProperty(Shape.prototype, 'color', {
        enumerable: true,
        get: function () {
            return this._color;
        },
        set: function (color) {
            this._color = color;
            this.dirty = true;
        }
    });

    Object.defineProperty(Shape.prototype, 'border', {
        enumerable: true,
        get: function () {
            return this._border.width + 'px ' + this._border.color;
        },
        set: function (border) {
            var values = border.match(/^(\d+)(?:px)?\ (.+)$/);

            if (!values || values.length !== 3) {
                throw new Error('Use format "(width)px (color)" when setting borders');
            }

            this._border.width = parseInt(values[1], 10);
            this._border.color = values[2];
            this.dirty = true;
        }
    });

    Object.defineProperty(Shape.prototype, 'shadow', {
        enumerable: true,
        get: function () {
            return "#{this._shadow.x}px #{this._shadow.y}px #{this._shadow.blur}px #{this._shadow.color}";
        },
        set: function (shadow) {
            var values = shadow.match(/^(\d+)(?:px)?\ (\d+)(?:px)?\ (\d+)(?:px)?\ (.+)$/);

            if (!values || values.length !== 5) {
                throw new Error('Use format "(x)px (y)px (blur)px (color)" when setting shadows');
            }

            this._shadow.x = parseInt(values[1], 10);
            this._shadow.y = parseInt(values[2], 10);
            this._shadow.blur = parseInt(values[3], 10);
            this._shadow.color = values[4];
            this.dirty = true;
        }
    });

    Object.defineProperty(Shape.prototype, 'vertices', {
        enumerable: true,
        get: function () {
            return this._vertices;
        },
        set: function (verticies) {
            this._vertices = verticies;
            this.dirty = true;
        }
    });

    Object.defineProperty(Shape.prototype, 'size', {
        enumerable: true,
        get: function () {
            return this._size;
        },
        set: function (size) {
            // Bad things happen if you try to draw a 0x0 canvas
            if (size.width < 1 || size.height < 1) {
                throw new Error('Bad things happen when you make a canvas smaller than 1x1');
            }

            this._size = {width: size.width, height: size.height};
            this.dirty = true;
        }
    });

    Object.defineProperty(Shape.prototype, 'path', {
        enumerable: true,
        get: function () {
            return this._path;
        },
        set: function (path) {
            this._path = path;
            this.dirty = true;
        }
    });

    /**
     * @description Draw object onto internal <canvas> cache
     */
    Shape.prototype.drawCanvasCache = function () {
        if (!this.canvas) {
            return;
        }

        // Canvas cache needs to be large enough to handle shape size, border, and shadow
        this.canvas.width = (this.size.width + this._border.width + Math.abs(this._shadow.x) + this._shadow.blur) * Arcadia.PIXEL_RATIO;
        this.canvas.height = (this.size.height + this._border.width + Math.abs(this._shadow.y) + this._shadow.blur) * Arcadia.PIXEL_RATIO;

        this.setAnchorPoint();

        var context = this.canvas.getContext('2d');
        context.lineJoin = 'miter';

        context.beginPath();

        // Draw anchor point and border in red
        if (this.debug) {
            context.lineWidth = 1 * Arcadia.PIXEL_RATIO;
            context.strokeStyle = '#f00';
            context.strokeRect(0, 0, this.canvas.width, this.canvas.height);
            context.arc(this.anchor.x, this.anchor.y, 3, 0, 2 * Math.PI, false);
            context.stroke();
        }

        context.translate(this.anchor.x, this.anchor.y);

        if (this.path) {
            this.path(context);
        } else {
            switch (this.vertices) {
            case 2:
                context.moveTo(-this.size.width / 2 * Arcadia.PIXEL_RATIO, -this.size.height / 2 * Arcadia.PIXEL_RATIO);
                context.lineTo(this.size.width / 2 * Arcadia.PIXEL_RATIO, this.size.height / 2 * Arcadia.PIXEL_RATIO);
                break;
            case 3:
                context.moveTo(0, -this.size.height / 2 * Arcadia.PIXEL_RATIO);
                context.lineTo(this.size.width / 2 * Arcadia.PIXEL_RATIO, this.size.height / 2 * Arcadia.PIXEL_RATIO);
                context.lineTo(-this.size.width / 2 * Arcadia.PIXEL_RATIO, this.size.height / 2 * Arcadia.PIXEL_RATIO);
                context.lineTo(0, -this.size.height / 2 * Arcadia.PIXEL_RATIO);
                break;
            case 4:
                context.moveTo(-this.size.width / 2 * Arcadia.PIXEL_RATIO, -this.size.height / 2 * Arcadia.PIXEL_RATIO);
                context.lineTo(this.size.width / 2 * Arcadia.PIXEL_RATIO, -this.size.height / 2 * Arcadia.PIXEL_RATIO);
                context.lineTo(this.size.width / 2 * Arcadia.PIXEL_RATIO, this.size.height / 2 * Arcadia.PIXEL_RATIO);
                context.lineTo(-this.size.width / 2 * Arcadia.PIXEL_RATIO, this.size.height / 2 * Arcadia.PIXEL_RATIO);
                context.lineTo(-this.size.width / 2 * Arcadia.PIXEL_RATIO, -this.size.height / 2 * Arcadia.PIXEL_RATIO);
                break;
            default:
                context.arc(0, 0, this.size.width / 2 * Arcadia.PIXEL_RATIO, 0, 2 * Math.PI); // x, y, radius, startAngle, endAngle
                break;
            }
        }

        context.closePath();

        // Draw shadow
        if (this._shadow.x !== 0 || this._shadow.y !== 0 || this._shadow.blur !== 0) {
            context.shadowOffsetX = this._shadow.x * Arcadia.PIXEL_RATIO;
            context.shadowOffsetY = this._shadow.y * Arcadia.PIXEL_RATIO;
            context.shadowBlur = this._shadow.blur * Arcadia.PIXEL_RATIO;
            context.shadowColor = this._shadow.color;
        }

        // Fill with color
        if (this._color) {
            context.fillStyle = this._color;
            context.fill();
        }

        // Don't allow border to cast a shadow
        if (this._shadow.x !== 0 || this._shadow.y !== 0 || this._shadow.blur !== 0) {
            context.shadowOffsetX = 0;
            context.shadowOffsetY = 0;
            context.shadowBlur = 0;
        }

        // Draw border
        if (this._border.width && this._border.color) {
            context.lineWidth = this._border.width * Arcadia.PIXEL_RATIO;
            context.strokeStyle = this._border.color;
            context.stroke();
        }

        this.dirty = false;
    };

    /**
     * @description Find the midpoint of the shape
     */
    Shape.prototype.setAnchorPoint = function () {
        // TODO: ensure correctness of this
        var x = this._size.width / 2 + this._border.width / 2;
        var y = this._size.height / 2 + this._border.width / 2;

        if (this._shadow.blur > 0) {
            x += this._shadow.blur / 2;
            y += this._shadow.blur / 2;
        }

        // Move negatively if shadow is also negative
        if (this._shadow.x < 0) {
            x -= this._shadow.x;
        }
        if (this._shadow.y < 0) {
            y -= this._shadow.y;
        }

        // Set anchor point (midpoint of shape)
        this.anchor.x = x * Arcadia.PIXEL_RATIO;
        this.anchor.y = y * Arcadia.PIXEL_RATIO;
    };

    /**
     * @description Draw object
     * @param {CanvasRenderingContext2D} context
     */
    Shape.prototype.draw = function (context, offsetX, offsetY, offsetRotation, offsetScale, offsetAlpha) {
        offsetX = offsetX || 0;
        offsetY = offsetY || 0;
        offsetRotation = offsetRotation || 0;
        offsetScale = offsetScale || 1;
        offsetAlpha = offsetAlpha || 1;

        context.save();

        context.translate(offsetX * Arcadia.PIXEL_RATIO, offsetY * Arcadia.PIXEL_RATIO);

        if (offsetRotation !== 0) {
            context.rotate(offsetRotation);
        }

        context.translate(this.position.x * Arcadia.PIXEL_RATIO, this.position.y * Arcadia.PIXEL_RATIO);

        if (this.rotation !== 0) {
            context.rotate(this.rotation);
        }

        if (this.scale * offsetScale !== 1) {
            context.scale(this.scale * offsetScale, this.scale * offsetScale);
        }

        if (this.alpha * offsetAlpha < 1) {
            context.globalAlpha = this.alpha * offsetAlpha;
        }

        // Update internal <canvas> cache if necessary
        if (this.dirty) {
            this.drawCanvasCache();
        }

        // Draw from cache
        context.drawImage(this.canvas, -this.anchor.x, -this.anchor.y);

        // Reset scale/rotation/alpha
        context.restore();

        // Draw child objects last, so they will be on the "top"
        Arcadia.GameObject.prototype.draw.call(this, context, this.position.x + offsetX, this.position.y + offsetY, this.rotation + offsetRotation, this.scale * offsetScale, this.alpha * offsetAlpha);
    };

    /**
     * @description Update object
     * @param {Number} delta Time since last update (in seconds)
     */
    Shape.prototype.update = function (delta) {
        Arcadia.GameObject.prototype.update.call(this, delta);

        var i = this.tweens.length;
        var obj;
        var tween;

        while (i--) {
            tween = this.tweens[i];
            tween.time += delta * 1000; // (delta is in seconds)

            if (tween.time > tween.duration) {
                tween.time = tween.duration;
            }

            if (typeof this[tween.property] === 'object') {
                obj = {};

                Object.keys(this[tween.property]).forEach(function (prop) {
                    obj[prop] = tween.easingFunc(tween.time, tween.start[prop], tween.change[prop], tween.duration);
                });

                this[tween.property] = obj;
            } else {
                this[tween.property] = tween.easingFunc(tween.time, tween.start, tween.change, tween.duration); // time,begin,change,duration
            }

            if (tween.time === tween.duration) {
                this.tweens.splice(i, 1);
                if (typeof tween.callback === 'function') {
                    tween.callback();
                }
            }
        }

        this.velocity.x += this.acceleration.x;
        this.velocity.y += this.acceleration.y;

        this.position.x += this.velocity.x * this.speed * delta;
        this.position.y += this.velocity.y * this.speed * delta;

        this.rotation += this.angularVelocity * delta;
    };

    /**
     * @description Basic AABB collision detection
     * @param {Shape} other Shape object to test collision with
     */
    Shape.prototype.collidesWith = function (other) {
        if (this === other) {
            return false;
        }

        return Math.abs(this.position.x - other.position.x) < (this.size.width / 2) + (other.size.width / 2) &&
                Math.abs(this.position.y - other.position.y) < (this.size.height / 2) + (other.size.height / 2);
    };

    /**
     * @description Add a transition to the `tween` stack
     */
    Shape.prototype.tween = function (property, target, duration, easing, callback) {
        duration = duration || 500;

        // Handle "compound" properties that have objects as values
        // e.g. Shape.size = { width: 100, height: 100 }
        var change = {};
        var self = this;

        if (typeof target === 'object') {
            Object.keys(this[property]).forEach(function (key) {
                change[key] = target[key] - self[property][key];
            });
        } else {
            change = target - this[property];
        }

        this.tweens.push({
            time: 0,
            property: property,
            start: this[property],
            change: change,
            duration: duration,
            easingFunc: Easie[easing] || Easie['linearNone'],
            callback: callback
        });
    };

    Arcadia.Shape = Shape;

    root.Arcadia = Arcadia;
}(window));
/*jslint browser, this */
/*global window */

(function (root) {
    'use strict';

    var Arcadia = root.Arcadia || {};

    /**
     * @constructor
     * @param {Function} factory Factory function that returns a Shape object, to use as a particle
     * @param {Number} [count=25] The number of particles created for the system
     */
    var Emitter = function (factory, count) {
        count = count || 25;
        if (typeof factory !== 'function') {
            throw new Error('Emitter requires a factory function');
        }

        Arcadia.GameObject.apply(this, arguments);

        this.duration = 1;
        this.fade = false;
        this.scale = 1;
        this.speed = 200;
        this.i = null;
        this.particle = null;

        while (count--) {
            this.children.add(factory());
        }

        this.children.deactivateAll();
    };

    Emitter.prototype = new Arcadia.GameObject();

    /**
     * @description Activate a particle emitter
     * @param {number} x Position of emitter on x-axis
     * @param {number} y Position of emitter on y-axis
     */
    Emitter.prototype.startAt = function (x, y) {
        this.timer = 0;
        this.position.x = x;
        this.position.y = y;

        this.children.activateAll();
        this.reset();

        var index = this.children.length;
        var particle;
        var direction;

        while (index--) {
            particle = this.children.at(index);

            particle.position.x = x;
            particle.position.y = y;

            direction = Math.random() * 2 * Math.PI;
            particle.velocity.x = Math.cos(direction);
            particle.velocity.y = Math.sin(direction);

            particle.speed = Math.random() * this.speed;
        }
    };

    Emitter.prototype.update = function (delta) {
        Arcadia.GameObject.prototype.update.call(this, delta);

        this.timer += delta;

        var index = this.children.length;
        var particle;

        while (index--) {
            particle = this.children.at(index);

            //particle.colors.alpha -= delta / this.duration if this.fade

            if (this.scale !== 1) {
                particle.scale += this.scale * delta / this.duration;
            }

            if (this.timer >= this.duration) {
                this.children.deactivate(index);
            }
        }
    };

    Emitter.prototype.reset = function () {
        var index = this.children.length;

        while (index--) {
            if (this.children.at(index).reset) {
                this.children.at(index).reset();
            }
        }
    };

    Arcadia.Emitter = Emitter;

    root.Arcadia = Arcadia;
}(window));
/*jslint browser, this */
/*global window */

(function (root) {
    'use strict';

    var Arcadia = root.Arcadia || {};

    /**
     * @constructor
     */
    var Label = function (options) {
        options = options || {};

        this._font = {
            size: 10,
            family: 'monospace'
        };
        this._text = 'text goes here';
        this._alignment = 'center';

        Arcadia.Shape.apply(this, arguments);

        var self = this;
        Object.keys(options).forEach(function (property) {
            self[property] = options[property];
        });

        this.anchor = {
            x: this.size.width / 2,
            y: this.size.height / 2
        };
    };

    Label.prototype = new Arcadia.Shape();

    /**
     * @description Draw object onto internal <canvas> cache
     * TODO: refactor shape method to use re-usable methods which can then be reused here
     */
    Label.prototype.drawCanvasCache = function () {
        if (!this.canvas) {
            return;
        }

        var self = this;
        var context = this.canvas.getContext('2d');
        var lineCount = 1;
        var newlines = this.text.match(/\n/g);

        if (newlines) {
            lineCount = newlines.length + 1;
        }

        // Determine width/height of text using offscreen <div>
        var element = document.getElementById('text-dimensions');

        if (!element) {
            element = document.createElement('div');
            element.id = 'text-dimensions';
            element.style.position = 'absolute';
            element.style.top = '-9999px';
            element.style.overflow = 'scroll';
            document.body.appendChild(element);
        }

        element.style.font = this.font;
        element.style['line-height'] = 1;
        element.innerHTML = this.text.replace(/\n/g, '<br>').replace(/\s/g, '&nbsp;');

        this.size = {
            width: element.offsetWidth,
            height: element.offsetHeight
        };

        var lineHeight = this.size.height / lineCount * Arcadia.PIXEL_RATIO;

        this.anchor = {
            x: this.size.width / 2,
            y: this.size.height / 2
        };

        this.canvas.width = (this.size.width + this._border.width + Math.abs(this._shadow.x) + this._shadow.blur) * Arcadia.PIXEL_RATIO;
        this.canvas.height = (this.size.height + this._border.width + Math.abs(this._shadow.y) + this._shadow.blur) * Arcadia.PIXEL_RATIO;

        context.font = (this._font.size * Arcadia.PIXEL_RATIO) + 'px ' + this._font.family;
        context.textAlign = this.alignment;  // left, right, center, start, end
        context.textBaseline = 'middle'; // top, hanging, middle, alphabetic, ideographic, bottom

        this.setAnchorPoint();

        if (this.debug) {
            context.lineWidth = 1 * Arcadia.PIXEL_RATIO;
            context.strokeStyle = '#f00';
            context.strokeRect(0, 0, this.canvas.width, this.canvas.height);
            context.arc(this.anchor.x, this.anchor.y, 3, 0, 2 * Math.PI, false);
            context.stroke();
        }

        context.translate(this.anchor.x, this.anchor.y);

        if (this._shadow.x !== 0 || this._shadow.y !== 0 || this._shadow.blur !== 0) {
            context.shadowOffsetX = this._shadow.x * Arcadia.PIXEL_RATIO;
            context.shadowOffsetY = this._shadow.y * Arcadia.PIXEL_RATIO;
            context.shadowBlur = this._shadow.blur * Arcadia.PIXEL_RATIO;
            context.shadowColor = this._shadow.color;
        }

        // Handle x coord of text for alignment
        var x = 0;
        if (this.alignment === 'start' || this.alignment === 'left') {
            x = -this._size.width / 2;
        } else if (this.alignment === 'end' || this.alignment === 'right') {
            x = this._size.width / 2;
        }

        if (this.color) {
            context.fillStyle = this.color;
            if (lineCount > 1) {
                this.text.split('\n').forEach(function (text, index) {
                    context.fillText(text, x, (-self.size.height / 2 * Arcadia.PIXEL_RATIO) + (lineHeight / 2) + (lineHeight * index));
                });
            } else {
                context.fillText(this.text, x, 0);
            }
        }

        // Don't allow border to cast a shadow
        if (this._shadow.x !== 0 || this._shadow.y !== 0 || this._shadow.blur !== 0) {
            context.shadowOffsetX = 0;
            context.shadowOffsetY = 0;
            context.shadowBlur = 0;
        }

        if (this._border.width && this._border.color) {
            context.lineWidth = this._border.width * Arcadia.PIXEL_RATIO;
            context.strokeStyle = this._border.color;
            if (lineCount > 1) {
                this.text.split('\n').forEach(function (text, index) {
                    context.strokeText(text, x, (-self.size.height / 2 * Arcadia.PIXEL_RATIO) + (lineHeight / 2) + (lineHeight * index));
                });
            } else {
                context.strokeText(this.text, x, 0);
            }
        }

        this.dirty = false;
    };

    /**
     * @description Getter/setters for font
     * TODO: Handle bold text
     */
    Object.defineProperty(Label.prototype, 'font', {
        enumerable: true,
        get: function () {
            return this._font.size + 'px ' + this._font.family;
        },
        set: function (font) {
            var values = font.match(/^(\d+)(?:px)?\ (.+)$/);

            if (!values || values.length !== 3) {
                throw new Error('Use format "(size)px (font-family)" when setting Label font');
            }

            this._font.size = values[1];
            this._font.family = values[2];
            this.dirty = true;
        }
    });

    Object.defineProperty(Label.prototype, 'text', {
        enumerable: true,
        get: function () {
            return this._text;
        },
        set: function (value) {
            this._text = value;
            this.dirty = true;
        }
    });

    Object.defineProperty(Label.prototype, 'alignment', {
        enumerable: true,
        get: function () {
            return this._alignment;
        },
        set: function (value) {
            var allowedValues = ['left', 'right', 'center', 'start', 'end']
            if (allowedValues.indexOf(value) === -1) {
                throw new Error('Allowed alignment values: left, right, center, start, end');
            }
            this._alignment = value;
            this.dirty = true;
        }
    });

    Arcadia.Label = Label;

    root.Arcadia = Arcadia;
}(window));
/*jslint browser, this */
/*global window */

(function (root) {
    'use strict';

    var Arcadia = root.Arcadia || {};

    var Button = function (options) {
        options = options || {};

        if (!options.label) {
            options.label = new Arcadia.Label({
                text: options.text,
                font: options.font
            });
        }

        this.padding = options.padding || 0; // TODO: perhaps make padding an obj, w/ x/y values?
        this.label = options.label;
        this.label.drawCanvasCache(); // Determine size of text

        Arcadia.Shape.apply(this, arguments);

        this.add(this.label);

        if (typeof options.action === 'function') {
            this.action = options.action;
        }

        this.disabled = false;
        this.enablePointEvents = true;

        if (!options.size) {
            var height;
            if (this.vertices === 0) {
                height = this.label.size.width;
            } else {
                height = this.label.size.height;
            }

            this.size = {
                width: this.label.size.width + this.padding,
                height: height + this.padding
            };
        }
    };

    Button.prototype = new Arcadia.Shape();

    /**
     * @description If touch/mouse end is inside button, execute the user-supplied
     * callback this method will get fired for each different button object on the screen
     */
    Button.prototype.onPointEnd = function (points) {
        Arcadia.Shape.prototype.onPointEnd.call(this, points);

        if (!this.action || this.disabled) {
            return;
        }

        var i = points.length;

        while (i) {
            i -= 1;

            if (this.containsPoint(points[i])) {
                this.action();
            }
        }
    };

    /**
     * @description Helper method to determine if mouse/touch point is inside button
     */
    Button.prototype.containsPoint = function (point) {
        return point.x < this.position.x + this.size.width / 2 + this.padding / 2 &&
                point.x > this.position.x - this.size.width / 2 - this.padding / 2 &&
                point.y < this.position.y + this.size.height / 2 + this.padding / 2 &&
                point.y > this.position.y - this.size.height / 2 - this.padding / 2;
    };

    /**
     * @description Getter/setter for text value
     */
    Object.defineProperty(Button.prototype, 'text', {
        enumerable: true,
        get: function () {
            return this.label.text;
        },
        set: function (text) {
            this.label.text = text;
        }
    });

    /**
     * @description Getter/setter for font value
     */
    Object.defineProperty(Button.prototype, 'font', {
        enumerable: true,
        get: function () {
            return this.label.font;
        },
        set: function (font) {
            this.label.font = font;
        }
    });

    Arcadia.Button = Button;

    root.Arcadia = Arcadia;
}(window));
/*jslint browser */
/*global window */

(function (root) {
    'use strict';

    var Arcadia = root.Arcadia || {};

    /**
     * @description Get information about the current environment
     */
    Arcadia.ENV = (function () {
        var agent = navigator.userAgent.toLowerCase();
        var android = !!(agent.match(/android/i) && agent.match(/android/i).length > 0);
        var ios = !!(agent.match(/ip(hone|od|ad)/i) && agent.match(/ip(hone|od|ad)/i).length > 0);
        var firefox = !!(agent.match(/firefox/i) && agent.match(/firefox/i).length > 0);

        // "mobile" here refers to a touchscreen - this is pretty janky
        var mobile = !!(agent.match(/mobile/i) && agent.match(/mobile/i).length > 0) || android;

        return Object.freeze({
            android: android,
            ios: ios,
            firefox: firefox,
            mobile: mobile,
            desktop: !mobile,
            cordova: window.cordova !== undefined
        });
    }());

    /**
     * @description Change the active scene being displayed
     */
    Arcadia.changeScene = function (SceneClass, options) {
        options = options || {};
        options.parent = Arcadia.instance;
        Arcadia.instance.activeScene = new SceneClass(options);
    };

    /**
     * @description Distance method
     */
    Arcadia.distance = function (one, two) {
        return Math.sqrt(Math.pow(two.x - one.x, 2) + Math.pow(two.y - one.y, 2));
    };

    /**
     * @description Random number method
     */
    Arcadia.random = function (min, max) {
        var diff = max - min;
        return Math.random() * diff + min;
    };

    /**
     * @description Random sign value; returns 1 or -1
     */
    Arcadia.randomSign = function () {
        return Math.random() < 0.5 ? 1 : -1;
    };

    // Normalize requestAnimationFrame
    if (!root.requestAnimationFrame) {
        root.requestAnimationFrame = root.mozRequestAnimationFrame || root.webkitRequestAnimationFrame || root.msRequestAnimationFrame;
    }

    // Normalize cancelAnimationFrame
    if (!root.cancelAnimationFrame) {
        root.cancelAnimationFrame = root.mozCancelAnimationFrame || root.webkitCancelAnimationFrame || root.msCancelAnimationFrame;
    }

    // Normalize window.performance
    if (!root.performance) {
        var nowOffset = Date.now();
        root.performance = {
            now: function () {
                return Date.now() - nowOffset;
            }
        };
    }

    root.Arcadia = Arcadia;

    if (root.module) {
        root.module.exports = Arcadia;
    }
}(window));
