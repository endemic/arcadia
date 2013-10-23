/*jslint sloppy: true, plusplus: true, browser: true */

// point vendor-specific implementations to window.requestAnimationFrame
if (window.requestAnimationFrame === undefined) {
    window.requestAnimationFrame = window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
}

if (window.cancelAnimationFrame === undefined) {
    window.cancelAnimationFrame = window.mozCancelAnimationFrame || window.webkitCancelAnimationFrame || window.msCancelAnimationFrame;
}

var Vectr = {
    'Game': function (width, height, SceneClass, fitWindow) {
        var i,
            context;

        width = parseInt(width, 10) || 320;
        height = parseInt(height, 10) || 480;

        if (typeof SceneClass !== "function") {
            throw 'Please provide a valid Scene object.';
        }

        if (fitWindow === undefined) {
            fitWindow = true;
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

        // Scanline effect
        this.scanlines = document.createElement('canvas');
        this.scanlines.setAttribute('width', width);
        this.scanlines.setAttribute('height', height);
        this.scanlines.setAttribute('style', 'position: absolute; left: 0; top: 0; z-index: 1;');

        context = this.scanlines.getContext('2d');
        context.lineWidth = 0.5;
        context.beginPath();

        for (i = 0; i < height; i += 3) {
            context.moveTo(0, i);
            context.lineTo(width, i);
        }

        context.closePath();
        context.strokeStyle = 'rgba(0, 0, 0, 0.75)';
        context.stroke();

        this.element.appendChild(this.canvas);
        this.element.appendChild(this.scanlines);
        document.body.appendChild(this.element);

        // Bind event handler callbacks
        this.onResize = this.onResize.bind(this);
        this.onPointStart = this.onPointStart.bind(this);
        this.onPointMove = this.onPointMove.bind(this);
        this.onPointEnd = this.onPointEnd.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
        this.onKeyUp = this.onKeyUp.bind(this);
        this.pause = this.pause.bind(this);
        this.resume = this.resume.bind(this);

        // Set up event listeners; Mouse and touch use the same ones
        document.addEventListener('keydown', this.onKeyDown, false);
        document.addEventListener('keyup', this.onKeyUp, false);
        this.element.addEventListener('mousedown', this.onPointStart, false);
        this.element.addEventListener('mouseup', this.onPointEnd, false);
        this.element.addEventListener('touchstart', this.onPointStart, false);
        this.element.addEventListener('touchmove', this.onPointMove, false);
        this.element.addEventListener('touchend', this.onPointEnd, false);

        // Prevent the page from scrolling
        document.addEventListener('touchmove', function (e) {
            e.preventDefault();
        });

        // Fit <canvas> to window
        if (fitWindow === true) {
            this.onResize();
            window.addEventListener('resize', this.onResize, false);
        }

        if (window.cordova !== undefined) {
            document.addEventListener('pause', this.pause, false);
            document.addEventListener('resume', this.resume, false);
        }

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

        // Start animation request
        this.start();
    }
};

/**
 * @description Pause active scene if it has a pause method
 */
Vectr.Game.prototype.pause = function () {
    this.pausedMusic = this.currentMusic;
    Vectr.stopMusic();

    if (typeof this.active.pause === "function") {
        this.active.pause();
    }
};

/**
 * @description Resume active scene if it has a pause method
 */
Vectr.Game.prototype.resume = function () {
    Vectr.playMusic(this.pausedMusic);

    if (typeof this.active.resume === "function") {
        this.active.resume();
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

    if (window.performance !== undefined) {
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
Vectr.Game.prototype.onResize = function () {
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
        if (scaledWidth / aspectRatio > scaledHeight) { // Too wide
            scaledWidth = scaledHeight * aspectRatio;
            margin = '0 ' + ((window.innerWidth - scaledWidth) / 2) + 'px';
        } else if (scaledWidth / aspectRatio < scaledHeight) {  // Too high
            scaledHeight = scaledWidth / aspectRatio;
            margin = ((window.innerHeight - scaledHeight) / 2) + 'px 0';
        }
    } else if (orientation === "portrait") {
        if (scaledHeight / aspectRatio > scaledWidth) {     // Too high
            scaledHeight = scaledWidth * aspectRatio;
            margin = ((window.innerHeight - scaledHeight) / 2) + 'px 0';
        } else if (scaledHeight / aspectRatio < scaledWidth) {  // Too wide
            scaledWidth = scaledHeight / aspectRatio;
            margin = '0 ' + ((window.innerWidth - scaledWidth) / 2) + 'px';
        }
    }

    Vectr.SCALE = scaledHeight / Vectr.HEIGHT;
    Vectr.OFFSET.x = (window.innerWidth - scaledWidth) / 2;
    Vectr.OFFSET.y = (window.innerHeight - scaledHeight) / 2;
    this.element.setAttribute('style', 'position: relative; width: ' + scaledWidth + 'px; height: ' + scaledHeight + 'px; margin: ' + margin);
    this.canvas.setAttribute('style', 'position: absolute; left: 0; top: 0; -webkit-transform: scale(' + Vectr.SCALE + '); -webkit-transform-origin: 0 0; transform: scale(' + Vectr.SCALE + '); transform-origin: 0 0;');
    this.scanlines.setAttribute('style', 'position: absolute; left: 0; top: 0; z-index: 1; -webkit-transform: scale(' + Vectr.SCALE + '); -webkit-transform-origin: 0 0; transform: scale(' + Vectr.SCALE + '); transform-origin: 0 0;');
};

/**
 * @description Try to get some info about the current runtime environment
 */
Vectr.env = (function () {
    var agent,
        android,
        ios,
        firefox,
        mobile;

    agent = navigator.userAgent.toLowerCase();

    android = (agent.match(/android/i) && agent.match(/android/i).length > 0) || false;
    ios = (agent.match(/ip(hone|od|ad)/i) && agent.match(/ip(hone|od|ad)/i).length) > 0 || false;
    firefox = (agent.match(/firefox/i) && agent.match(/firefox/i).length > 0) || false;

    // "mobile" here refers to a touchscreen - this is pretty janky
    mobile = ((agent.match(/mobile/i) && agent.match(/mobile/i).length > 0) || false) || android;

    return {
        android: android,
        ios: ios,
        firefox: firefox,
        mobile: mobile,
        desktop: !mobile,
        cordova: window.cordova !== undefined
    };
}());

/**
 * @description Change the active scene being displayed
 */
Vectr.changeScene = function (SceneClass) {
    if (typeof SceneClass !== "function") {
        throw "Trying to change to an invalid scene.";
    }

    // Clean up previous scene
    Vectr.instance.active.destroy();

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

/* Static variables used to store music/sound effects */
Vectr.music = {};
Vectr.sounds = {};
Vectr.currentMusic = null;

/**
 * @description Static method to play sound effects.
 * Assumes you have an instance property 'sounds' filled with Buzz sound objects.
 * Otherwise you can override this method to use whatever sound library you like.
 */
Vectr.playSfx = function (id) {
    if (localStorage.getItem('playSfx') === "false") {
        return;
    }

    if (Vectr.sounds[id] !== undefined && typeof Vectr.sounds[id].play === "function") {
        Vectr.sounds[id].play();
    }
};

/**
 * @description Static method to play music.
 * Assumes you have an instance property 'music' filled with Buzz sound objects.
 * Otherwise you can override this method to use whatever sound library you like.
 */
Vectr.playMusic = function (id) {
    if (localStorage.getItem('playMusic') === "false") {
        return;
    }

    if (Vectr.currentMusic === id) {
        return;
    }

    if (id === undefined && Vectr.currentMusic !== null) {
        id = Vectr.currentMusic;
    }

    if (Vectr.currentMusic !== null) {
        Vectr.music[Vectr.currentMusic].stop();
    }

    Vectr.music[id].play();
    Vectr.currentMusic = id;
};

/**
 * @description Static method to stop music.
 * Assumes you have an instance property 'music' filled with Buzz sound objects.
 * Otherwise you can override this method to use whatever sound library you like.
 */
Vectr.stopMusic = function () {
    if (Vectr.currentMusic === null) {
        return;
    }

    Vectr.music[Vectr.currentMusic].stop();
    Vectr.currentMusic = null;
};

/*jslint sloppy: true, plusplus: true, browser: true */
/*globals Vectr */

Vectr.GameObject = function (x, y) {
    this.position = {
        'x': x || 0,
        'y': y || 0
    };

    this.active = true;
    this.scale = 1;
    this.rotation = 0;
    this.glow = 0;
    this.colors = {
        'red': 255,
        'green': 255,
        'blue': 255,
        'alpha': 1
    };
    this.children = [];
    this.i = 0;
};


/**
 * @description Draw child objects
 * @param {CanvasRenderingContext2D} context
 */
Vectr.GameObject.prototype.draw = function (context, offsetX, offsetY) {
    if (this.active === false) {
        return;
    }

    offsetX = offsetX || 0;
    offsetY = offsetY || 0;

    this.i = this.children.length;
    while (this.i--) {
        this.children[this.i].draw(context, offsetX, offsetY);
    }
};

/**
 * @description Update all child objects
 * @param {Number} delta Time since last update (in seconds)
 */
Vectr.GameObject.prototype.update = function (delta) {
    if (this.active === false) {
        return;
    }

    this.i = this.children.length;
    while (this.i--) {
        this.children[this.i].update(delta);
    }
};

/**
 * @description Add an object to the draw/update loop
 * @param {Shape} object
 */
Vectr.GameObject.prototype.add = function (object) {
    this.children.push(object);
};

/**
 * @description Remove a Shape object from the GameObject
 * @param {Shape} object Shape to be removed; consider setting shape.active = false; instead to re-use the shape later
 */
Vectr.GameObject.prototype.remove = function (object) {
    this.i = this.children.indexOf(object);

    if (this.i !== -1) {
        this.children.splice(this.i, 1);
    }
};

/**
 * @description Clean up all child objects
 */
Vectr.GameObject.prototype.destroy = function () {
    this.i = this.children.length;
    while (this.i--) {
        if (typeof this.children[this.i].destroy === "function") {
            this.children[this.i].destroy();
        }
    }
};

/**
 * @description Getter/setter for color value
 */
Object.defineProperty(Vectr.GameObject.prototype, 'color', {
    get: function () {
        return 'rgba(' + this.colors.red + ', ' + this.colors.green + ', ' + this.colors.blue + ', ' + this.colors.alpha + ')';
    },
    set: function (color) {
        if (typeof color !== 'string') {
            return;
        }

        var tmp = color.match(/^rgba\((\d+),\s?(\d+),\s?(\d+),\s?(\d?\.?\d*)\)$/);

        if (tmp.length === 5) {
            this.colors.red = parseInt(tmp[1], 10);
            this.colors.green = parseInt(tmp[2], 10);
            this.colors.blue = parseInt(tmp[3], 10);
            this.colors.alpha = parseFloat(tmp[4], 10);
        }
    }
});

/*jslint sloppy: true, plusplus: true, browser: true */
/*globals Vectr */

/**
 * @constructor
 */
Vectr.Button = function (x, y, text) {
    Vectr.GameObject.apply(this, arguments);

    this.label = new Vectr.Label(x, y, text);
    this.add(this.label);

    // Default border/background
    this.backgroundColors = {
        'red': 255,
        'green': 255,
        'blue': 255,
        'alpha': 1
    };

    this.height = parseInt(this.label.fonts.size, 10);
    this.solid = true;
    this.padding = 10;

    // Attach event listeners
    this.onPointEnd = this.onPointEnd.bind(this);
    Vectr.instance.element.addEventListener('mouseup', this.onPointEnd, false);
    Vectr.instance.element.addEventListener('touchend', this.onPointEnd, false);
};

/**
 * @description Set prototype
 */
Vectr.Button.prototype = new Vectr.GameObject();

/**
 * @description Draw object
 * @param {CanvasRenderingContext2D} context
 */
Vectr.Button.prototype.draw = function (context, offsetX, offsetY) {
    if (this.active === false) {
        return;
    }

    this.width = this.label.width(context);

    // Draw button background/border
    context.save();
    context.translate(this.position.x + offsetX, this.position.y + offsetY);

    if (this.glow > 0) {
        context.shadowOffsetX = 0;
        context.shadowOffsetY = 0;
        context.shadowBlur = this.glow;
        context.shadowColor = this.color;
    }

    if (this.solid === true) {
        context.fillStyle =  this.backgroundColor;
        context.fillRect(-this.width / 2 - this.padding / 2, -this.height / 2 - this.padding / 2, this.width + this.padding, this.height + this.padding);
    } else {
        context.strokeStyle = this.backgroundColor;
        context.strokeRect(-this.width / 2 - this.padding / 2, -this.height / 2 - this.padding / 2, this.width + this.padding, this.height + this.padding);
    }
    context.restore();

    // Draw label
    Vectr.GameObject.prototype.draw.call(this, context, this.position.x + offsetX, this.position.y + offsetY);
};

/**
 * @description Update object
 * @param {Number} delta Time since last update (in seconds)
 */
Vectr.Button.prototype.update = function (delta) {
    if (this.active === false) {
        return;
    }

    // Update child objects
    Vectr.GameObject.prototype.update.call(this, delta);
};

/**
 * @description If touch/mouse end is inside button, execute the user-supplied callback
 */
Vectr.Button.prototype.onPointEnd = function (event) {
    if (this.active === false || typeof this.onUp !== "function") {
        return;
    }

    Vectr.getPoints(event);

    var i = Vectr.instance.points.length;
    while (i--) {
        if (this.containsPoint(Vectr.instance.points[i].x, Vectr.instance.points[i].y)) {
            this.onUp();
            break;
        }
    }
};

/**
 * @description Helper method to determine if mouse/touch is inside button graphic
 */
Vectr.Button.prototype.containsPoint = function (x, y) {
    return x < this.position.x + this.width / 2 + this.padding / 2 &&
        x > this.position.x - this.width / 2 - this.padding / 2 &&
        y < this.position.y + this.height / 2 &&
        y > this.position.y - this.height / 2 - this.padding;
};

/**
 * @description Clean up event listeners
 */
Vectr.Button.prototype.destroy = function () {
    Vectr.instance.element.removeEventListener('mouseup', this.onPointEnd, false);
    Vectr.instance.element.removeEventListener('touchend', this.onPointEnd, false);
};

/**
 * @description Getter/setter for background color value
 */
Object.defineProperty(Vectr.Button.prototype, 'backgroundColor', {
    get: function () {
        return 'rgba(' + this.backgroundColors.red + ', ' + this.backgroundColors.green + ', ' + this.backgroundColors.blue + ', ' + this.backgroundColors.alpha + ')';
    },
    set: function (color) {
        if (typeof color !== 'string') {
            return;
        }

        var tmp = color.match(/^rgba\((\d+),\s?(\d+),\s?(\d+),\s?(\d?\.?\d*)\)$/);

        if (tmp.length === 5) {
            this.backgroundColors.red = parseInt(tmp[1], 10);
            this.backgroundColors.green = parseInt(tmp[2], 10);
            this.backgroundColors.blue = parseInt(tmp[3], 10);
            this.backgroundColors.alpha = parseFloat(tmp[4], 10);
        }
    }
});

/**
 * @description Getter/setter for font value
 */
Object.defineProperty(Vectr.Button.prototype, 'font', {
    get: function () {
        return this.label.font;
    },
    set: function (font) {
        if (typeof font !== 'string') {
            return;
        }

        this.label.font = font;
    }
});

/**
 * @description Getter/setter for glow value
 */
// Object.defineProperty(Vectr.Button.prototype, 'glow', {
//     get: function () {
//         return this.glow;
//     },
//     set: function (value) {
//         this.glow = parseInt(value, 10);
//         this.label.glow = this.glow;
//     }
// });

/*jslint sloppy: true, plusplus: true, browser: true */
/*globals Vectr */

/**
 * @constructor
 * @description Basic particle emitter
 * @param {string} [shape='square'] Shape of the particles. Accepts strings that are valid for Shapes (e.g. "circle", "triangle")
 * @param {number} [size=10] Size of the particles
 * @param {number} [count=25] The number of particles created for the system
 */
Vectr.Emitter = function (shape, size, count) {
    Vectr.GameObject.apply(this, arguments);

    var particle;

    this.particles = new Vectr.Pool();
    this.duration = 1;
    this.fade = false;
    this.speed = 200;
    count = count || 25;

    while (count--) {
        particle = new Vectr.Shape(0, 0, shape || 'square', size || 5);
        particle.active = false;
        particle.solid = true;
        this.particles.add(particle);
    }
};

/**
 * @description Set prototype
 */
Vectr.Emitter.prototype = new Vectr.GameObject();

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
        this.particles.at(i).color = this.color;
    }

    this.timer = 0;
};

Vectr.Emitter.prototype.draw = function (context) {
    if (this.active === false) {
        return;
    }

    this.particles.draw(context);
};

Vectr.Emitter.prototype.update = function (delta) {
    if (this.active === false) {
        return;
    }

    var i = this.particles.length;

    if (i === 0) {
        this.active = false;
    }

    this.particles.update(delta);

    this.timer += delta;

    while (i--) {

        if (this.fade) {
            this.particles.at(i).colors.alpha -= delta / this.duration;
        }

        if (this.timer >= this.duration) {
            this.particles.deactivate(i);
        }
    }
};
/*jslint sloppy: true, plusplus: true, browser: true */
/*globals Vectr */

Vectr.Label = function (x, y, text) {
    Vectr.GameObject.apply(this, arguments);

    this.text = text;

    // Default font
    this.fonts = {
        'size': '10px',
        'family': 'monospace'
    };

    //this.alignment = ["left", "right", "center", "start", "end"].indexOf(alignment) !== -1 ? alignment : "center";
    this.alignment = 'center';
    this.solid = true;
};

/**
 * @description Set prototype
 */
Vectr.Label.prototype = new Vectr.GameObject();

/**
 * @description Draw object
 * @param {CanvasRenderingContext2D} context
 */
Vectr.Label.prototype.draw = function (context, offsetX, offsetY) {
    if (this.active === false) {
        return;
    }

    // Draw child objects first, so they will be on the "bottom"
    Vectr.GameObject.prototype.draw.call(this, context, this.position.x + offsetX, this.position.y + offsetY);

    context.save();

    context.font = this.font;
    context.textAlign = this.alignment;

    context.translate(this.position.x + offsetX, this.position.y + parseInt(this.fonts.size, 10) / 3 + offsetY);

    if (this.scale !== 1) {
        context.scale(this.scale, this.scale);
    }

    if (this.rotation !== 0 && this.rotation !== Math.PI * 2) {
        context.rotate(this.rotation);
    }

    if (this.glow > 0) {
        context.shadowOffsetX = 0;
        context.shadowOffsetY = 0;
        context.shadowBlur = this.glow;
        context.shadowColor = this.color;
    }

    if (this.solid === true) {
        context.fillStyle = this.color;
        context.fillText(this.text, 0, 0, Vectr.WIDTH);
    } else {
        context.strokeStyle = this.color;
        context.strokeText(this.text, 0, 0, Vectr.WIDTH);
    }

    context.restore();
};

/**
 * @description Update object
 * @param {Number} delta Time since last update (in seconds)
 */
Vectr.Label.prototype.update = function (delta) {
    if (this.active === false) {
        return;
    }

    // Update child objects
    Vectr.GameObject.prototype.update.call(this, delta);
};

/**
 * @description Utility function to determine the width of the label
 * @param {CanvasRenderingContext2D} context
 */
Vectr.Label.prototype.width = function (context) {
    var metrics;

    context.save();
    context.font = this.fonts.size + ' ' + this.fonts.family;
    context.textAlign = this.alignment;
    metrics = context.measureText(this.text);
    context.restore();

    return metrics.width;
};

/**
 * @description Getter/setter for font value
 */
Object.defineProperty(Vectr.Label.prototype, 'font', {
    get: function () {
        return this.fonts.size + ' ' + this.fonts.family;
    },
    set: function (font) {
        if (typeof font !== 'string') {
            return;
        }

        var tmp = font.split(' '); // e.g. context.font = "20pt Arial";
        if (tmp.length === 2) {
            this.fonts.size = tmp[0];
            this.fonts.family = tmp[1];
        }
    }
});

/*jslint sloppy: true, plusplus: true, browser: true */
/*globals Vectr */

/**
* @description Object pool; One possible way to store common recyclable objects
*/
Vectr.Pool = function () {
    this.length = 0;
    this.children = [];       // Active objects
    this.inactive = [];     // Deadpool
    this.i = 0;             // in-memory iterator/object storage
};

/**
 * @description Get the next "inactive" object in the Pool
 */
Vectr.Pool.prototype.activate = function () {
    if (this.inactive.length === 0) {
        return null;
    }

    this.i = this.inactive.pop();
    this.i.active = true;
    if (typeof this.i.activate === 'function') {
      this.i.activate();
    }
    this.children.push(this.i);
    this.length += 1;

    return this.i;
};

/**
 * @description Activate all the objects in the pool
 */
Vectr.Pool.prototype.activateAll = function () {
    while (this.inactive.length) {
        this.i = this.inactive.pop();
        this.i.active = true;
        if (typeof this.i.activate === 'function') {
          this.i.activate();
        }
        this.children.push(this.i);
        this.length += 1;
    }
};

/**
 * @description Move object to the deadpool
 */
Vectr.Pool.prototype.deactivate = function (index) {
    if (this.children[index] === undefined) {
        return;
    }

    this.children[index].active = false;
    this.inactive.push(this.children[index]);

    // Shift array contents downward
    for (this.i = index; this.i < this.children.length - 1; this.i += 1) {
        this.children[this.i] = this.children[this.i + 1];
    }

    this.children.length -= 1;
    this.length -= 1;

    if (this.length === 0) {
        this.active = false;
    }
};

/**
 * @description Move object to the deadpool
 */
Vectr.Pool.prototype.deactivateAll = function () {
    while (this.children.length) {
        this.i = this.children.pop();
        this.i.active = false;
        this.inactive.push(this.i);
        this.length -= 1;
    }
};

/**
 * @description Convenience method to access a particular child index
 */
Vectr.Pool.prototype.at = function (index) {
    return this.children[index] || null;
};

/**
 * @description Add object to one of the lists
 */
Vectr.Pool.prototype.add = function (object) {
    if (typeof object === "object" && object.active === true) {
        this.children.push(object);
        this.length += 1;
    } else {
        this.inactive.push(object);
    }
};


/**
 * @description "Passthrough" method which updates active child objects
 */
Vectr.Pool.prototype.update = function (delta) {
    this.i = this.children.length;

    while (this.i--) {
        this.children[this.i].update(delta);

        // If a child object is marked as "inactive," move it to the dead pool
        if (this.children[this.i].active === false) {
            this.deactivate(this.i);
        }
    }
};

/**
 * @description "Passthrough" method which draws active child objects
 */
Vectr.Pool.prototype.draw = function (context) {
    this.i = this.children.length;

    while (this.i--) {
        this.children[this.i].draw(context, 0, 0);
    }
};

/*jslint sloppy: true, plusplus: true, browser: true */
/*globals Vectr */

/**
 * @constructor
 */
Vectr.Scene = function () {
    Vectr.GameObject.apply(this, arguments);

    // TODO: implement a camera view/drawing offset
    this.camera = null;
};

/**
 * @description Set prototype
 */
Vectr.Scene.prototype = new Vectr.GameObject();

/**
 * @description Clear context, then re-draw all child objects
 * @param {CanvasRenderingContext2D} context
 */
Vectr.Scene.prototype.draw = function (context) {
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

    // Draw child objects
    Vectr.GameObject.prototype.draw.call(this, context, this.position.x, this.position.y);
};

/*jslint sloppy: true, plusplus: true, browser: true */
/*globals Vectr */

/**
 * @description Shape constructor
 * @param {Number} x Position of shape on x-axis
 * @param {Number} y Position of shape on y-axis
 * @param {String} shape String representing what to draw
 * @param {Number} size Size of shape in pixels
 */
Vectr.Shape = function (x, y, shape, size) {
    Vectr.GameObject.apply(this, arguments);

    this.shape = shape || 'square';
    this.size = size || 10;
    this.lineWidth = 1;
    this.lineJoin = 'round';            // miter, round, bevel
    this.speed = 1;
    this.velocity = {
        'x': 0,
        'y': 0
    };
    this.solid = false;
};

/**
 * @description Set prototype
 */
Vectr.Shape.prototype = new Vectr.GameObject();

/**
 * @description Draw object
 * @param {CanvasRenderingContext2D} context
 */
Vectr.Shape.prototype.draw = function (context, offsetX, offsetY) {
    if (this.active === false) {
        return;
    }

    // Draw child objects first, so they will be on the "bottom"
    Vectr.GameObject.prototype.draw.call(this, context, this.position.x + offsetX, this.position.y + offsetY);

    context.save();
    context.translate(this.position.x + offsetX, this.position.y + offsetY);

    if (this.scale !== 1) {
        context.scale(this.scale, this.scale);
    }

    if (this.rotation !== 0 && this.rotation !== Math.PI * 2) {
        context.rotate(this.rotation);
    }

    if (this.glow > 0) {
        context.shadowOffsetX = 0;
        context.shadowOffsetY = 0;
        context.shadowBlur = this.glow;
        context.shadowColor = this.color;
    }

    context.lineWidth = this.lineWidth;
    context.lineJoin = this.lineJoin;

    // Allow sprite objects to have custom draw functions
    if (typeof this.path === "function") {
        this.path(context);
    } else {
        context.beginPath();
        switch (this.shape) {
        case 'triangle':
            context.moveTo(this.size / 2 * Math.cos(0), this.size / 2 * Math.sin(0));
            context.lineTo(this.size / 2 * Math.cos(120 * Math.PI / 180), this.size / 2 * Math.sin(120 * Math.PI / 180));
            context.lineTo(this.size / 2 * Math.cos(240 * Math.PI / 180), this.size / 2 * Math.sin(240 * Math.PI / 180));
            context.lineTo(this.size / 2 * Math.cos(0), this.size / 2 * Math.sin(0));
            break;
        case 'circle':
            context.arc(0, 0, this.size / 2, Math.PI * 2, false);
            break;
        case 'square':
            context.moveTo(this.size / 2, this.size / 2);
            context.lineTo(this.size / 2, -this.size / 2);
            context.lineTo(-this.size / 2, -this.size / 2);
            context.lineTo(-this.size / 2, this.size / 2);
            context.lineTo(this.size / 2, this.size / 2);
            break;
        }
        context.closePath();

        if (this.solid === true) {
            context.fillStyle = this.color;
            context.fill();
        } else {
            context.strokeStyle = this.color;
            context.stroke();
        }
    }

    context.restore();
};

/**
 * @description Update object
 * @param {Number} delta Time since last update (in seconds)
 */
Vectr.Shape.prototype.update = function (delta) {
    if (this.active === false) {
        return;
    }

    this.position.x += this.velocity.x * this.speed * delta;
    this.position.y += this.velocity.y * this.speed * delta;

    // Update child objects
    Vectr.GameObject.prototype.update.call(this, delta);
};

/**
 * @description Basic collision detection
 * @param {Shape} other Shape object to test collision with
 */
Vectr.Shape.prototype.collidesWith = function (other) {
    if (this.shape === 'square') {
        return Math.abs(this.position.x - other.position.x) < this.size / 2 + other.size / 2 && Math.abs(this.position.y - other.position.y) < this.size / 2 + other.size / 2;
    }
    return Math.sqrt(Math.pow(other.position.x - this.position.x, 2) + Math.pow(other.position.y - this.position.y, 2)) < this.size / 2 + other.size / 2;
};
