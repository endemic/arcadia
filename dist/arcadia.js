!function(e){"object"==typeof exports?module.exports=e():"function"==typeof define&&define.amd?define(e):"undefined"!=typeof window?window.Arcadia=e():"undefined"!=typeof global?global.Arcadia=e():"undefined"!=typeof self&&(self.Arcadia=e())}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function() {
  var Arcadia;

  if (window.requestAnimationFrame === void 0) {
    window.requestAnimationFrame = window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
  }

  if (window.cancelAnimationFrame === void 0) {
    window.cancelAnimationFrame = window.mozCancelAnimationFrame || window.webkitCancelAnimationFrame || window.msCancelAnimationFrame;
  }

  Function.prototype.property = function(prop, desc) {
    return Object.defineProperty(this.prototype, prop, desc);
  };

  Arcadia = {
    Game: require('./game.coffee'),
    Button: require('./button.coffee'),
    Emitter: require('./emitter.coffee'),
    GameObject: require('./gameobject.coffee'),
    Label: require('./label.coffee'),
    Pool: require('./pool.coffee'),
    Scene: require('./scene.coffee'),
    Shape: require('./shape.coffee')
  };

  module.exports = Arcadia;

  /*
  @description Get information about the current environment
  */


  Arcadia.env = (function() {
    var agent, android, firefox, ios, mobile;
    agent = navigator.userAgent.toLowerCase();
    android = (agent.match(/android/i) && agent.match(/android/i).length > 0) || false;
    ios = (agent.match(/ip(hone|od|ad)/i) && agent.match(/ip(hone|od|ad)/i).length) > 0 || false;
    firefox = (agent.match(/firefox/i) && agent.match(/firefox/i).length > 0) || false;
    mobile = ((agent.match(/mobile/i) && agent.match(/mobile/i).length > 0) || false) || android;
    return {
      android: android,
      ios: ios,
      firefox: firefox,
      mobile: mobile,
      desktop: !mobile,
      cordova: window.cordova !== void 0
    };
  })();

  /*
  @description Change the active scene being displayed
  */


  Arcadia.changeScene = function(SceneClass) {
    if (typeof SceneClass !== "function") {
      throw "Invalid scene!";
    }
    Arcadia.instance.active.destroy();
    return Arcadia.instance.active = new SceneClass();
  };

  /*
  @description Static method to translate mouse/touch input to coordinates the game will understand
               Takes the <canvas> offset and scale into account
  */


  Arcadia.getPoints = function(event) {
    var i, _results;
    if (event.type.indexOf('mouse') !== -1) {
      Arcadia.instance.points.length = 1;
      return Arcadia.instance.points.coordinates[0] = {
        x: (event.pageX - Arcadia.OFFSET.x) / Arcadia.SCALE,
        y: (event.pageY - Arcadia.OFFSET.y) / Arcadia.SCALE
      };
    } else {
      Arcadia.instance.points.length = event.touches.length;
      i = 0;
      _results = [];
      while (i < length) {
        Arcadia.instance.points.coordinates[i].x = (event.touches[i].pageX - Arcadia.OFFSET.x) / Arcadia.SCALE;
        Arcadia.instance.points.coordinates[i].y = (event.touches[i].pageY - Arcadia.OFFSET.y) / Arcadia.SCALE;
        _results.push(i += 1);
      }
      return _results;
    }
  };

  /*
  @description Static variables used to store music/sound effects
  */


  Arcadia.music = {};

  Arcadia.sounds = {};

  Arcadia.currentMusic = null;

  /*/**
  @description Static method to play sound effects.
               Assumes you have an instance property 'sounds' filled with Buzz sound objects.
               Otherwise you can override this method to use whatever sound library you like.
  */


  Arcadia.playSfx = function(id) {
    if (localStorage.getItem('playSfx') === "false") {
      return;
    }
    if (Arcadia.sounds[id] !== void 0 && typeof Arcadia.sounds[id].play === "function") {
      return Arcadia.sounds[id].play();
    }
  };

  /*
   * @description Static method to play music.
   * Assumes you have an instance property 'music' filled with Buzz sound objects.
   * Otherwise you can override this method to use whatever sound library you like.
  */


  Arcadia.playMusic = function(id) {
    var _ref, _ref1;
    if (localStorage.getItem('playMusic') === "false") {
      return;
    }
    if (Arcadia.currentMusic === id) {
      return;
    }
    if (id === void 0 && Arcadia.currentMusic !== null) {
      id = Arcadia.currentMusic;
    }
    if (Arcadia.currentMusic !== null) {
      if ((_ref = Arcadia.music[Arcadia.currentMusic]) != null) {
        _ref.stop();
      }
    }
    if ((_ref1 = Arcadia.music[id]) != null) {
      _ref1.play();
    }
    return Arcadia.currentMusic = id;
  };

  /*
  @description Static method to stop music.
               Assumes you have an instance property 'music' filled with Buzz sound objects.
               Otherwise you can override this method to use whatever sound library you like.
  */


  Arcadia.stopMusic = function() {
    var _ref;
    if (Arcadia.currentMusic === null) {
      return;
    }
    if ((_ref = Arcadia.music[Arcadia.currentMusic]) != null) {
      _ref.stop();
    }
    return Arcadia.currentMusic = null;
  };

}).call(this);


},{"./button.coffee":2,"./emitter.coffee":3,"./game.coffee":4,"./gameobject.coffee":5,"./label.coffee":6,"./pool.coffee":7,"./scene.coffee":8,"./shape.coffee":9}],2:[function(require,module,exports){
(function() {
  var Button, GameObject,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  GameObject = require('./gameobject.coffee');

  Button = (function(_super) {
    __extends(Button, _super);

    function Button(x, y, text) {
      Button.__super__.constructor.apply(this, arguments);
      this.label = new Arcadia.Label(x, y, text);
      this.add(this.label);
      this.backgroundColors = {
        'red': 255,
        'green': 255,
        'blue': 255,
        'alpha': 1
      };
      this.height = parseInt(this.label.fonts.size, 10);
      this.solid = true;
      this.padding = 10;
      this.fixed = true;
      this.onPointEnd = this.onPointEnd.bind(this);
      Arcadia.instance.element.addEventListener('mouseup', this.onPointEnd, false);
      Arcadia.instance.element.addEventListener('touchend', this.onPointEnd, false);
    }

    /*
     * @description Draw object
     * @param {CanvasRenderingContext2D} context
    */


    Button.prototype.draw = function(context, offsetX, offsetY) {
      if (!this.active) {
        return;
      }
      Button.__super__.draw.call(this, context, this.position.x + offsetX, this.position.y + offsetY);
      if (this.fixed) {
        offsetX = offsetY = 0;
      }
      this.width = this.label.width(context);
      context.save();
      context.translate(this.position.x + offsetX, this.position.y + offsetY);
      if (this.glow > 0) {
        context.shadowOffsetX = 0;
        context.shadowOffsetY = 0;
        context.shadowBlur = this.glow;
        context.shadowColor = this.color;
      }
      if (this.solid === true) {
        context.fillStyle = this.backgroundColor;
        context.fillRect(-this.width / 2 - this.padding / 2, -this.height / 2 - this.padding / 2, this.width + this.padding, this.height + this.padding);
      } else {
        context.strokeStyle = this.backgroundColor;
        context.strokeRect(-this.width / 2 - this.padding / 2, -this.height / 2 - this.padding / 2, this.width + this.padding, this.height + this.padding);
      }
      return context.restore();
    };

    /*
     * @description If touch/mouse end is inside button, execute the user-supplied callback
    */


    Button.prototype.onPointEnd = function(event) {
      var i;
      if (!this.active || typeof this.onUp !== 'function') {
        return;
      }
      Arcadia.getPoints(event);
      i = Arcadia.instance.points.length;
      while (i--) {
        if (this.containsPoint(Arcadia.instance.points.coordinates[i].x, Arcadia.instance.points.coordinates[i].y)) {
          this.onUp();
          return;
        }
      }
    };

    /*
     * @description Helper method to determine if mouse/touch is inside button graphic
    */


    Button.prototype.containsPoint = function(x, y) {
      return x < this.position.x + this.width / 2 + this.padding / 2 && x > this.position.x - this.width / 2 - this.padding / 2 && y < this.position.y + this.height / 2 + this.padding / 2 && y > this.position.y - this.height / 2 - this.padding / 2;
    };

    /*
     * @description Clean up event listeners
    */


    Button.prototype.destroy = function() {
      Arcadia.instance.element.removeEventListener('mouseup', this.onPointEnd, false);
      return Arcadia.instance.element.removeEventListener('touchend', this.onPointEnd, false);
    };

    /*
     * @description Getter/setter for background color value
    */


    Button.property('backgroundColor', {
      get: function() {
        return "rgba(" + this.backgroundColors.red + ", " + this.backgroundColors.green + ", " + this.backgroundColors.blue + ", " + this.backgroundColors.alpha + ")";
      },
      set: function(color) {
        var tmp;
        tmp = color.match(/^rgba\((\d+),\s?(\d+),\s?(\d+),\s?(\d?\.?\d*)\)$/);
        if (tmp.length === 5) {
          this.backgroundColors.red = parseInt(tmp[1], 10);
          this.backgroundColors.green = parseInt(tmp[2], 10);
          this.backgroundColors.blue = parseInt(tmp[3], 10);
          return this.backgroundColors.alpha = parseFloat(tmp[4], 10);
        }
      }
    });

    /*
     * @description Getter/setter for font value
    */


    Button.property('font', {
      get: function() {
        return this.label.font;
      },
      set: function(font) {
        return this.label.font = font;
      }
    });

    return Button;

  })(GameObject);

  module.exports = Button;

}).call(this);


},{"./gameobject.coffee":5}],3:[function(require,module,exports){
(function() {
  var Emitter, GameObject, Pool, Shape,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  GameObject = require('./gameobject.coffee');

  Pool = require('./pool.coffee');

  Shape = require('./shape.coffee');

  Emitter = (function(_super) {
    __extends(Emitter, _super);

    /*
     * @constructor
     * @description Basic particle emitter
     * @param {string} [shape='square'] Shape of the particles. Accepts strings that are valid for Shapes (e.g. "circle", "triangle")
     * @param {number} [size=10] Size of the particles
     * @param {number} [count=25] The number of particles created for the system
    */


    function Emitter(shape, size, count) {
      var particle;
      Emitter.__super__.constructor.apply(this, arguments);
      this.duration = 1;
      this.fade = false;
      this.speed = 200;
      this.active = false;
      count = count || 25;
      while (count--) {
        particle = new Shape(0, 0, shape || 'square', size || 5);
        particle.active = false;
        particle.solid = true;
        this.children.add(particle);
      }
    }

    /*
     * @description Activate a particle emitter
     * @param {number} x Position of emitter on x-axis
     * @param {number} y Position of emitter on y-axis
    */


    Emitter.prototype.start = function(x, y) {
      var direction;
      this.children.activateAll();
      this.i = this.children.length;
      while (this.i--) {
        this.particle = this.children.at(this.i);
        this.particle.position.x = x;
        this.particle.position.y = y;
        direction = Math.random() * 2 * Math.PI;
        this.particle.velocity.x = Math.cos(direction);
        this.particle.velocity.y = Math.sin(direction);
        this.particle.speed = Math.random() * this.speed;
        this.particle.color = this.color;
      }
      this.active = true;
      this.timer = 0;
      this.position.x = x;
      return this.position.y = y;
    };

    Emitter.prototype.draw = function(context, offsetX, offsetY) {
      if (!this.active) {
        return;
      }
      offsetX = offsetX || 0;
      offsetY = offsetY || 0;
      return this.children.draw(context, offsetX, offsetY);
    };

    Emitter.prototype.update = function(delta) {
      if (!this.active || !this.children.active) {
        return;
      }
      this.children.update(delta);
      this.timer += delta;
      this.i = this.children.length;
      while (this.i--) {
        this.particle = this.children.at(this.i);
        if (this.fade) {
          this.particle.colors.alpha -= delta / this.duration;
        }
        if (this.timer >= this.duration) {
          this.children.deactivate(this.i);
        }
      }
    };

    return Emitter;

  })(GameObject);

  module.exports = Emitter;

}).call(this);


},{"./gameobject.coffee":5,"./pool.coffee":7,"./shape.coffee":9}],4:[function(require,module,exports){
(function() {
  var Game;

  Game = (function() {
    /*
     * @constructor
     * @description Main "game" object; sets up screens, input, etc.
     * @param {String} [width=640] Width of game view
     * @param {Number} [height=480] Height of game view
     * @param {Boolean} [scaleToFit=true] Full screen or not
    */

    function Game(width, height, SceneClass, scaleToFit) {
      width = parseInt(width, 10) || 640;
      height = parseInt(height, 10) || 480;
      scaleToFit = scaleToFit || true;
      Arcadia.WIDTH = width;
      Arcadia.HEIGHT = height;
      Arcadia.SCALE = 1;
      Arcadia.OFFSET = {
        x: 0,
        y: 0
      };
      Arcadia.instance = this;
      this.element = document.createElement('div');
      this.element.setAttribute('id', 'arcadia');
      this.canvas = document.createElement('canvas');
      this.canvas.setAttribute('width', width);
      this.canvas.setAttribute('height', height);
      this.context = this.canvas.getContext('2d');
      this.element.appendChild(this.canvas);
      document.body.appendChild(this.element);
      this.onResize = this.onResize.bind(this);
      this.onPointStart = this.onPointStart.bind(this);
      this.onPointMove = this.onPointMove.bind(this);
      this.onPointEnd = this.onPointEnd.bind(this);
      this.onKeyDown = this.onKeyDown.bind(this);
      this.onKeyUp = this.onKeyUp.bind(this);
      this.pause = this.pause.bind(this);
      this.resume = this.resume.bind(this);
      document.addEventListener('keydown', this.onKeyDown, false);
      document.addEventListener('keyup', this.onKeyUp, false);
      this.element.addEventListener('mousedown', this.onPointStart, false);
      this.element.addEventListener('mouseup', this.onPointEnd, false);
      this.element.addEventListener('touchstart', this.onPointStart, false);
      this.element.addEventListener('touchmove', this.onPointMove, false);
      this.element.addEventListener('touchend', this.onPointEnd, false);
      this.element.addEventListener('touchmove', function(e) {
        return e.preventDefault();
      });
      if (scaleToFit === true) {
        this.onResize();
        window.addEventListener('resize', this.onResize, false);
      }
      if (window.cordova !== void 0) {
        document.addEventListener('pause', this.pause, false);
        document.addEventListener('resume', this.resume, false);
      }
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
      this.points = {
        length: 0,
        coordinates: [
          {
            x: null,
            y: null
          }, {
            x: null,
            y: null
          }, {
            x: null,
            y: null
          }, {
            x: null,
            y: null
          }, {
            x: null,
            y: null
          }, {
            x: null,
            y: null
          }, {
            x: null,
            y: null
          }, {
            x: null,
            y: null
          }, {
            x: null,
            y: null
          }, {
            x: null,
            y: null
          }
        ]
      };
      this.active = new SceneClass();
      this.start();
    }

    /*
    @description Pause active scene if it has a pause method
    */


    Game.prototype.pause = function() {
      this.pausedMusic = this.currentMusic;
      Arcadia.stopMusic();
      if (typeof this.active.pause === "function") {
        return this.active.pause();
      }
    };

    /*
    @description Resume active scene if it has a pause method
    */


    Game.prototype.resume = function() {
      Arcadia.playMusic(this.pausedMusic);
      if (typeof this.active.resume === "function") {
        return this.active.resume();
      }
    };

    /*
    @description Mouse/touch event callback
    */


    Game.prototype.onPointStart = function(event) {
      Arcadia.getPoints(event);
      if (event.type.indexOf('mouse') !== -1) {
        this.element.addEventListener('mousemove', this.onPointMove, false);
      }
      if (typeof this.active.onPointStart === "function") {
        return this.active.onPointStart(this.points);
      }
    };

    /*
    @description Mouse/touch event callback
    */


    Game.prototype.onPointMove = function(event) {
      Arcadia.getPoints(event);
      if (typeof this.active.onPointMove === "function") {
        return this.active.onPointMove(this.points);
      }
    };

    /*
    @description Mouse/touch event callback
    */


    Game.prototype.onPointEnd = function(event) {
      Arcadia.getPoints(event);
      if (event.type.indexOf('mouse') !== -1) {
        this.element.removeEventListener('mousemove', this.onPointMove, false);
      }
      if (typeof this.active.onPointEnd === "function") {
        return this.active.onPointEnd(this.points);
      }
    };

    /*
    @description Keyboard event callback
    */


    Game.prototype.onKeyDown = function(event) {
      var key;
      key = this.getKey(event.keyCode);
      if (this.input[key]) {
        return;
      }
      this.input[key] = true;
      if (typeof this.active.onKeyDown === "function") {
        return this.active.onKeyDown(key);
      }
    };

    /*
    @description Keyboard event callback
    */


    Game.prototype.onKeyUp = function(event) {
      var key;
      key = this.getKey(event.keyCode);
      this.input[key] = false;
      if (typeof this.active.onKeyUp === "function") {
        return this.active.onKeyUp(key);
      }
    };

    /*
    @description Translate a keyboard event code into a meaningful string
    */


    Game.prototype.getKey = function(keyCode) {
      switch (keyCode) {
        case 37:
          return 'left';
        case 38:
          return 'up';
        case 39:
          return 'right';
        case 40:
          return 'down';
        case 87:
          return 'w';
        case 65:
          return 'a';
        case 83:
          return 's';
        case 68:
          return 'd';
        case 13:
          return 'enter';
        case 27:
          return 'escape';
        case 32:
          return 'space';
        case 17:
          return 'control';
        case 90:
          return 'z';
        case 88:
          return 'x';
      }
    };

    /*
     * @description Start the event/animation loops
    */


    Game.prototype.start = function() {
      var previousDelta, update,
        _this = this;
      if (window.performance !== void 0) {
        previousDelta = window.performance.now();
      } else {
        previousDelta = Date.now();
      }
      update = function(currentDelta) {
        var delta;
        delta = currentDelta - previousDelta;
        previousDelta = currentDelta;
        _this.update(delta / 1000);
        return _this.updateId = window.requestAnimationFrame(update);
      };
      return this.updateId = window.requestAnimationFrame(update);
    };

    /*
    @description Cancel draw/update loops
    */


    Game.prototype.stop = function() {
      return window.cancelAnimationFrame(this.updateId);
    };

    /*
    @description Update callback
    */


    Game.prototype.update = function(delta) {
      this.active.draw(this.context);
      return this.active.update(delta);
    };

    /*
    @description Handle window resize events. Scale the canvas element to max out the size of the current window, keep aspect ratio
    */


    Game.prototype.onResize = function() {
      var aspectRatio, height, margin, orientation, width;
      width = window.innerWidth;
      height = window.innerHeight;
      if (width > height) {
        orientation = "landscape";
        aspectRatio = Arcadia.WIDTH / Arcadia.HEIGHT;
      } else {
        orientation = "portrait";
        aspectRatio = Arcadia.HEIGHT / Arcadia.WIDTH;
      }
      if (orientation === "landscape") {
        if (width / aspectRatio > height) {
          width = height * aspectRatio;
          margin = '0 ' + ((window.innerWidth - width) / 2) + 'px';
        } else if (width / aspectRatio < height) {
          height = width / aspectRatio;
          margin = ((window.innerHeight - height) / 2) + 'px 0';
        }
      } else if (orientation === "portrait") {
        if (height / aspectRatio > width) {
          height = width * aspectRatio;
          margin = ((window.innerHeight - height) / 2) + 'px 0';
        } else if (height / aspectRatio < width) {
          width = height / aspectRatio;
          margin = '0 ' + ((window.innerWidth - width) / 2) + 'px';
        }
      }
      Arcadia.SCALE = height / Arcadia.HEIGHT;
      Arcadia.OFFSET.x = (window.innerWidth - width) / 2;
      Arcadia.OFFSET.y = (window.innerHeight - height) / 2;
      this.element.setAttribute("style", "position: relative; width: " + width + "px; height: " + height + "px; margin: " + margin + ";");
      return this.canvas.setAttribute("style", "position: absolute; left: 0; top: 0; -webkit-transform: scale(" + Arcadia.SCALE + "); -webkit-transform-origin: 0 0; transform: scale(" + Arcadia.SCALE + "); transform-origin: 0 0;");
    };

    return Game;

  })();

  module.exports = Game;

}).call(this);


},{}],5:[function(require,module,exports){
(function() {
  var GameObject, Pool;

  Pool = require('./pool.coffee');

  GameObject = (function() {
    function GameObject(x, y) {
      if (x == null) {
        x = 0;
      }
      if (y == null) {
        y = 0;
      }
      this.position = {
        'x': x,
        'y': y
      };
      this.fixed = false;
      this.scale = 1;
      this.rotation = 0;
      this.glow = 0;
      this.colors = {
        'red': 255,
        'green': 255,
        'blue': 255,
        'alpha': 1
      };
      this.i = 0;
    }

    /*
     * @description Draw child objects
     * @param {CanvasRenderingContext2D} context
    */


    GameObject.prototype.draw = function(context, offsetX, offsetY) {
      var _results;
      if (offsetX == null) {
        offsetX = 0;
      }
      if (offsetY == null) {
        offsetY = 0;
      }
      if (this.children === void 0) {
        return;
      }
      this.i = this.children.length;
      _results = [];
      while (this.i--) {
        _results.push(this.children.at(this.i).draw(context, offsetX, offsetY));
      }
      return _results;
    };

    /*
     * @description Update all child objects
     * @param {Number} delta Time since last update (in seconds)
    */


    GameObject.prototype.update = function(delta) {
      var _results;
      if (this.children === void 0) {
        return;
      }
      this.i = this.children.length;
      _results = [];
      while (this.i--) {
        _results.push(this.children.at(this.i).update(delta));
      }
      return _results;
    };

    /*
     * @description Add an object to the draw/update loop
     * @param {Shape} object
    */


    GameObject.prototype.add = function(object) {
      if (this.children === void 0) {
        this.children = new Pool();
      }
      this.children.add(object);
      return object.parent = this;
    };

    /*
     @description Clean up child objects
    */


    GameObject.prototype.destroy = function() {
      var _results;
      if (this.children === void 0) {
        return;
      }
      this.i = this.children.length;
      _results = [];
      while (this.i--) {
        if (typeof this.children.at(this.i).destroy === 'function') {
          _results.push(this.children.at(this.i).destroy());
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    /*
     @description Getter/setter for color value
    */


    GameObject.property('color', {
      get: function() {
        return "rgba(" + this.colors.red + ", " + this.colors.green + ", " + this.colors.blue + ", " + this.colors.alpha + ")";
      },
      set: function(color) {
        var tmp;
        tmp = color.match(/^rgba\((\d+),\s?(\d+),\s?(\d+),\s?(\d?\.?\d*)\)$/);
        if (tmp.length === 5) {
          this.colors.red = parseInt(tmp[1], 10);
          this.colors.green = parseInt(tmp[2], 10);
          this.colors.blue = parseInt(tmp[3], 10);
          return this.colors.alpha = parseFloat(tmp[4], 10);
        }
      }
    });

    return GameObject;

  })();

  module.exports = GameObject;

}).call(this);


},{"./pool.coffee":7}],6:[function(require,module,exports){
(function() {
  var GameObject, Label,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  GameObject = require('./gameobject.coffee');

  Label = (function(_super) {
    __extends(Label, _super);

    function Label(x, y, text) {
      Label.__super__.constructor.apply(this, arguments);
      this.text = text;
      this.fixed = true;
      this.fonts = {
        size: '10px',
        family: 'monospace'
      };
      this.alignment = 'center';
      this.solid = true;
    }

    /*
     * @description Draw object
     * @param {CanvasRenderingContext2D} context
    */


    Label.prototype.draw = function(context, offsetX, offsetY) {
      if (!this.active) {
        return;
      }
      Label.__super__.draw.call(this, context, this.position.x + offsetX, this.position.y + offsetY);
      if (this.fixed) {
        offsetX = offsetY = 0;
      }
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
      if (this.solid) {
        context.fillStyle = this.color;
        context.fillText(this.text, 0, 0, Arcadia.WIDTH);
      } else {
        context.strokeStyle = this.color;
        context.strokeText(this.text, 0, 0, Arcadia.WIDTH);
      }
      return context.restore();
    };

    /*
     * @description Update object
     * @param {Number} delta Time since last update (in seconds)
    */


    Label.prototype.update = function(delta) {
      if (!this.active) {
        return;
      }
      return Label.__super__.update.call(this, delta);
    };

    /*
     * @description Utility function to determine the width of the label
     * @param {CanvasRenderingContext2D} context
    */


    Label.prototype.width = function(context) {
      var metrics;
      context.save();
      context.font = this.fonts.size + ' ' + this.fonts.family;
      context.textAlign = this.alignment;
      metrics = context.measureText(this.text);
      context.restore();
      return metrics.width;
    };

    /*
     * @description Getter/setter for font value
    */


    Label.property('font', {
      get: function() {
        return "" + this.fonts.size + " " + this.fonts.family;
      },
      set: function(font) {
        var tmp;
        tmp = font.split(' ');
        if (tmp.length === 2) {
          this.fonts.size = tmp[0];
          return this.fonts.family = tmp[1];
        }
      }
    });

    return Label;

  })(GameObject);

  module.exports = Label;

}).call(this);


},{"./gameobject.coffee":5}],7:[function(require,module,exports){
/*
@description One possible way to store common recyclable objects.
Assumes the objects you add will have an `active` property, and optionally an
`activate()` method which resets the object's state. Inspired by Programming
Linux Games (http://en.wikipedia.org/wiki/Programming_Linux_Games)
*/


(function() {
  var Pool;

  Pool = (function() {
    function Pool() {
      this.children = [];
      this.length = 0;
      this.tmp = null;
      this.factory = null;
    }

    Pool.prototype.at = function(index) {
      if (index >= this.length) {
        return null;
      }
      return this.children[index];
    };

    /*
    @description Push an object into the recycle pool
    */


    Pool.prototype.add = function(object) {
      this.children.push(object);
      if (this.length < this.children.length) {
        this.tmp = this.children[this.children.length - 1];
        this.children[this.children.length - 1] = this.children[this.length];
        this.children[this.length] = this.tmp;
      }
      return this.length += 1;
    };

    /*
    @description Get an active object
    */


    Pool.prototype.activate = function(object) {
      if (object == null) {
        object = null;
      }
      if (this.length < this.children.length) {
        this.tmp = this.children[this.length];
        if (typeof this.tmp.activate === 'function') {
          this.tmp.activate();
        }
      } else {
        if (typeof this.factory !== 'function') {
          throw 'A Recycle Pool needs a factory defined!';
        }
        this.tmp = this.factory();
        this.children.push(this.tmp);
      }
      this.length += 1;
      return this.tmp;
    };

    /*
    @description Deactivate an active object at a particular object/index
    */


    Pool.prototype.deactivate = function(index) {
      if (typeof index === 'object') {
        index = this.children.indexOf(index);
      }
      if (index >= this.length || index < 0) {
        return false;
      }
      this.tmp = this.children[index];
      this.children[index] = this.children[this.children.length - 1];
      this.children[this.length - 1] = this.tmp;
      this.length -= 1;
      return this.tmp;
    };

    /*
    @description Deactivate all child objects
    */


    Pool.prototype.deactivateAll = function() {
      return this.length = 0;
    };

    /*
    @description Activate all child objects
    */


    Pool.prototype.activateAll = function() {
      this.length = this.children.length;
      while (this.length--) {
        this.tmp = this.children[this.length];
        if (typeof this.tmp.activate === 'function') {
          this.tmp.activate();
        }
      }
      return this.length = this.children.length;
    };

    /*
    @description Passthrough method to update active child objects
    */


    Pool.prototype.update = function(delta) {
      var _results;
      this.tmp = this.length;
      _results = [];
      while (this.tmp--) {
        _results.push(this.children[this.tmp].update(delta));
      }
      return _results;
    };

    /*
    @description Passthrough method to draw active child objects
    */


    Pool.prototype.draw = function(context, offsetX, offsetY) {
      var _results;
      if (offsetX == null) {
        offsetX = 0;
      }
      if (offsetY == null) {
        offsetY = 0;
      }
      this.tmp = this.length;
      _results = [];
      while (this.tmp--) {
        _results.push(this.children[this.tmp].draw(context, offsetX, offsetY));
      }
      return _results;
    };

    return Pool;

  })();

  module.exports = Pool;

}).call(this);


},{}],8:[function(require,module,exports){
(function() {
  var GameObject, Scene,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  GameObject = require('./gameobject.coffee');

  Scene = (function(_super) {
    __extends(Scene, _super);

    function Scene() {
      Scene.__super__.constructor.apply(this, arguments);
      this.camera = {
        target: null,
        viewport: {
          width: Arcadia.WIDTH,
          height: Arcadia.HEIGHT
        },
        bounds: {
          top: 0,
          bottom: Arcadia.HEIGHT,
          left: 0,
          right: Arcadia.WIDTH
        },
        position: {
          x: Arcadia.WIDTH / 2,
          y: Arcadia.HEIGHT / 2
        }
      };
    }

    /*
     * @description Update the camera if necessary
     * @param {Number} delta
    */


    Scene.prototype.update = function(delta) {
      Scene.__super__.update.call(this, delta);
      if (this.camera.target !== null) {
        this.camera.position.x = this.camera.target.position.x;
        this.camera.position.y = this.camera.target.position.y;
        if (this.camera.position.x < this.camera.bounds.left + this.camera.viewport.width / 2) {
          this.camera.position.x = this.camera.bounds.left + this.camera.viewport.width / 2;
        } else if (this.camera.position.x > this.camera.bounds.right - this.camera.viewport.width / 2) {
          this.camera.position.x = this.camera.bounds.right - this.camera.viewport.width / 2;
        }
        if (this.camera.position.y < this.camera.bounds.top + this.camera.viewport.height / 2) {
          return this.camera.position.y = this.camera.bounds.top + this.camera.viewport.height / 2;
        } else if (this.camera.position.y > this.camera.bounds.bottom - this.camera.viewport.height / 2) {
          return this.camera.position.y = this.camera.bounds.bottom - this.camera.viewport.height / 2;
        }
      }
    };

    /*
     * @description Clear context, then re-draw all child objects
     * @param {CanvasRenderingContext2D} context
    */


    Scene.prototype.draw = function(context) {
      if (typeof this.clearColor === "string") {
        context.save();
        context.fillStyle = this.clearColor;
        context.fillRect(0, 0, context.canvas.width, context.canvas.height);
        context.restore();
      } else {
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
      }
      return Scene.__super__.draw.call(this, context, this.camera.viewport.width / 2 - this.camera.position.x, this.camera.viewport.height / 2 - this.camera.position.y);
    };

    /*
     * Getter/setter for camera target
    */


    Scene.property('target', {
      get: function() {
        return this.camera.target;
      },
      set: function(shape) {
        if (!(shape != null ? shape.position : void 0)) {
          return;
        }
        this.camera.target = shape;
        this.camera.position.x = shape.position.x;
        return this.camera.position.y = shape.position.y;
      }
    });

    return Scene;

  })(GameObject);

  module.exports = Scene;

}).call(this);


},{"./gameobject.coffee":5}],9:[function(require,module,exports){
(function() {
  var GameObject, Shape,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  GameObject = require('./gameobject.coffee');

  Shape = (function(_super) {
    __extends(Shape, _super);

    /*
     * @description Shape constructor
     * @param {Number} x Position of shape on x-axis
     * @param {Number} y Position of shape on y-axis
     * @param {String} shape String representing what to draw
     * @param {Number} size Size of shape in pixels
    */


    function Shape(x, y, shape, size) {
      Shape.__super__.constructor.call(this, x, y);
      this.shape = shape || 'square';
      this.size = size || 10;
      this.lineWidth = 1;
      this.lineJoin = 'round';
      this.speed = 1;
      this.velocity = {
        x: 0,
        y: 0
      };
      this.solid = false;
    }

    /*
     * @description Draw object
     * @param {CanvasRenderingContext2D} context
    */


    Shape.prototype.draw = function(context, offsetX, offsetY) {
      if (!this.active) {
        return;
      }
      if (this.fixed) {
        offsetX = offsetY = 0;
      }
      Shape.__super__.draw.call(this, context, this.position.x + offsetX, this.position.y + offsetY);
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
        }
        context.closePath();
        if (this.solid) {
          context.fillStyle = this.color;
          context.fill();
        } else {
          context.strokeStyle = this.color;
          context.stroke();
        }
      }
      return context.restore();
    };

    /*
     * @description Update object
     * @param {Number} delta Time since last update (in seconds)
    */


    Shape.prototype.update = function(delta) {
      if (!this.active) {
        return;
      }
      this.position.x += this.velocity.x * this.speed * delta;
      this.position.y += this.velocity.y * this.speed * delta;
      return Shape.__super__.update.call(this, delta);
    };

    /*
     * @description Basic collision detection
     * @param {Shape} other Shape object to test collision with
    */


    Shape.prototype.collidesWith = function(other) {
      if (this.shape === 'square') {
        return Math.abs(this.position.x - other.position.x) < this.size / 2 + other.size / 2 && Math.abs(this.position.y - other.position.y) < this.size / 2 + other.size / 2;
      } else {
        return Math.sqrt(Math.pow(other.position.x - this.position.x, 2) + Math.pow(other.position.y - this.position.y, 2)) < this.size / 2 + other.size / 2;
      }
    };

    return Shape;

  })(GameObject);

  module.exports = Shape;

}).call(this);


},{"./gameobject.coffee":5}]},{},[1])
(1)
});
;