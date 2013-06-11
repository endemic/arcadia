/*jslint sloppy: true, plusplus: true, browser: true */

// point vendor-specific implementations to window.requestAnimationFrame
if (window.requestAnimationFrame === undefined) {
    window.requestAnimationFrame = window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
}

if (window.cancelAnimationFrame === undefined) {
    window.cancelAnimationFrame = window.mozCancelAnimationFrame || window.webkitCancelAnimationFrame || window.msCancelAnimationFrame;
}

var Vectr = {
    'VERSION': '0.1',
    'Game': function (width, height, SceneClass, fitWindow) {
        if (width === undefined) {
            width = 320;
        }

        if (height === undefined) {
            height = 480;
        }

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

        this.element.appendChild(this.canvas);
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

    if (typeof window.performance !== undefined) {
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
    // this.canvas.setAttribute('style', 'position: absolute; left: 0; top: 0; width: ' + scaledWidth + 'px; height: ' + scaledHeight + 'px;');
    this.canvas.setAttribute('style', 'position: absolute; left: 0; top: 0; -webkit-transform: scale(' + Vectr.SCALE + '); -webkit-transform-origin: 0 0;');
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

    if (typeof Vectr.sounds[id] !== undefined && typeof Vectr.sounds[id].play === "function") {
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

    if (typeof id === undefined && Vectr.currentMusic !== null) {
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