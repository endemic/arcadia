!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.Vectr=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
var Button, GameObject,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

GameObject = _dereq_('./gameobject');

Button = (function(_super) {
  __extends(Button, _super);

  function Button(x, y, text) {
    Button.__super__.constructor.apply(this, arguments);
    this.label = new Vectr.Label(x, y, text);
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
    Vectr.instance.element.addEventListener('mouseup', this.onPointEnd, false);
    Vectr.instance.element.addEventListener('touchend', this.onPointEnd, false);
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
   * @description Update object
   * @param {Number} delta Time since last update (in seconds)
   * TODO: Can this just use the parent method?
   */

  Button.prototype.update = function(delta) {
    if (!this.active) {
      return;
    }
    return Button.__super__.update.call(this, delta);
  };


  /*
   * @description If touch/mouse end is inside button, execute the user-supplied callback
   */

  Button.prototype.onPointEnd = function(event) {
    var i;
    if (!this.active || typeof this.onUp !== 'function') {
      return;
    }
    Vectr.getPoints(event);
    i = Vectr.instance.points.length;
    while (i--) {
      if (this.containsPoint(Vectr.instance.points[i].x, Vectr.instance.points[i].y)) {
        this.onUp();
        return true;
      }
    }
    return false;
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
    Vectr.instance.element.removeEventListener('mouseup', this.onPointEnd, false);
    return Vectr.instance.element.removeEventListener('touchend', this.onPointEnd, false);
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


},{"./gameobject":4}],2:[function(_dereq_,module,exports){
var Emitter, GameObject,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

GameObject = _dereq_('./gameobject');

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
  }


  /*
   * @description Activate a particle emitter
   * @param {number} x Position of emitter on x-axis
   * @param {number} y Position of emitter on y-axis
   */

  Emitter.prototype.start = function(x, y) {
    var direction, i;
    this.particles.activateAll();
    this.active = true;
    this.position.x = x;
    this.position.y = y;
    i = this.particles.length;
    while (i--) {
      this.particles.at(i).position.x = x;
      this.particles.at(i).position.y = y;
      direction = Math.random() * 2 * Math.PI;
      this.particles.at(i).velocity.x = Math.cos(direction);
      this.particles.at(i).velocity.y = Math.sin(direction);
      this.particles.at(i).speed = Math.random() * this.speed;
      this.particles.at(i).color = this.color;
    }
    return this.timer = 0;
  };

  Emitter.prototype.draw = function(context, offsetX, offsetY) {
    if (!this.active) {
      return;
    }
    offsetX = offsetX || 0;
    offsetY = offsetY || 0;
    return this.particles.draw(context, offsetX, offsetY);
  };

  Emitter.prototype.update = function(delta) {
    var i, _results;
    if (!this.active) {
      return;
    }
    i = this.particles.length;
    if (i === 0) {
      this.active = false;
    }
    this.particles.update(delta);
    this.timer += delta;
    _results = [];
    while (i--) {
      if (this.fade) {
        this.particles.at(i).colors.alpha -= delta / this.duration;
      }
      if (this.timer >= this.duration) {
        _results.push(this.particles.deactivate(i));
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };

  return Emitter;

})(GameObject);

module.exports = Emitter;


},{"./gameobject":4}],3:[function(_dereq_,module,exports){
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
    Vectr.WIDTH = width;
    Vectr.HEIGHT = height;
    Vectr.SCALE = 1;
    Vectr.OFFSET = {
      x: 0,
      y: 0
    };
    Vectr.instance = this;
    this.element = document.createElement('div');
    this.element.setAttribute('id', 'vectr');
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
    this.points = [];
    this.active = new SceneClass();
    this.start();
  }


  /*
  @description Pause active scene if it has a pause method
   */

  Game.prototype.pause = function() {
    this.pausedMusic = this.currentMusic;
    Vectr.stopMusic();
    if (typeof this.active.pause === "function") {
      return this.active.pause();
    }
  };


  /*
  @description Resume active scene if it has a pause method
   */

  Game.prototype.resume = function() {
    Vectr.playMusic(this.pausedMusic);
    if (typeof this.active.resume === "function") {
      return this.active.resume();
    }
  };


  /*
  @description Mouse/touch event callback
   */

  Game.prototype.onPointStart = function(event) {
    Vectr.getPoints(event);
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
    Vectr.getPoints(event);
    if (typeof this.active.onPointMove === "function") {
      return this.active.onPointMove(this.points);
    }
  };


  /*
  @description Mouse/touch event callback
   */

  Game.prototype.onPointEnd = function(event) {
    Vectr.getPoints(event);
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
    var previousDelta, update;
    if (window.performance !== void 0) {
      previousDelta = window.performance.now();
    } else {
      previousDelta = Date.now();
    }
    update = (function(_this) {
      return function(currentDelta) {
        var delta;
        delta = currentDelta - previousDelta;
        previousDelta = currentDelta;
        _this.update(delta / 1000);
        return _this.updateId = window.requestAnimationFrame(update);
      };
    })(this);
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
      aspectRatio = Vectr.WIDTH / Vectr.HEIGHT;
    } else {
      orientation = "portrait";
      aspectRatio = Vectr.HEIGHT / Vectr.WIDTH;
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
    Vectr.SCALE = height / Vectr.HEIGHT;
    Vectr.OFFSET.x = (window.innerWidth - width) / 2;
    Vectr.OFFSET.y = (window.innerHeight - height) / 2;
    this.element.setAttribute("style", "position: relative; width: " + width + "px; height: " + height + "px; margin: " + margin + ";");
    return this.canvas.setAttribute("style", "position: absolute; left: 0; top: 0; -webkit-transform: scale(" + Vectr.SCALE + "); -webkit-transform-origin: 0 0; transform: scale(" + Vectr.SCALE + "); transform-origin: 0 0;");
  };

  return Game;

})();

module.exports = Game;


},{}],4:[function(_dereq_,module,exports){
var GameObject;

GameObject = (function() {
  function GameObject(x, y) {
    this.position = {
      'x': x || 0,
      'y': y || 0
    };
    this.active = true;
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
    this.children = [];
    this.i = 0;
  }


  /*
   * @description Draw child objects
   * @param {CanvasRenderingContext2D} context
   */

  GameObject.prototype.draw = function(context, offsetX, offsetY) {
    var _results;
    if (!this.active) {
      return;
    }
    offsetX = offsetX || 0;
    offsetY = offsetY || 0;
    this.i = this.children.length;
    _results = [];
    while (this.i--) {
      _results.push(this.children[this.i].draw(context, offsetX, offsetY));
    }
    return _results;
  };


  /*
   * @description Update all child objects
   * @param {Number} delta Time since last update (in seconds)
   */

  GameObject.prototype.update = function(delta) {
    var _results;
    if (!this.active) {
      return;
    }
    this.i = this.children.length;
    _results = [];
    while (this.i--) {
      _results.push(this.children[this.i].update(delta));
    }
    return _results;
  };


  /*
   * @description Add an object to the draw/update loop
   * @param {Shape} object
   */

  GameObject.prototype.add = function(object) {
    this.children.push(object);
    return object.parent = this;
  };


  /*
   * @description Remove a Shape object from the GameObject
   * @param {Shape} object Shape to be removed consider setting shape.active = false instead to re-use the shape later
   */

  GameObject.prototype.remove = function(object) {
    this.i = this.children.indexOf(object);
    if (this.i !== -1) {
      delete object.parent;
      return this.children.splice(this.i, 1);
    }
  };


  /*
   * @description Clean up all child objects
   */

  GameObject.prototype.destroy = function() {
    var _results;
    this.i = this.children.length;
    _results = [];
    while (this.i--) {
      if (typeof this.children[this.i].destroy === "function") {
        _results.push(this.children[this.i].destroy());
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };


  /*
   * @description Getter/setter for color value
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


},{}],5:[function(_dereq_,module,exports){
var GameObject, Label,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

GameObject = _dereq_('./gameobject');

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
      context.fillText(this.text, 0, 0, Vectr.WIDTH);
    } else {
      context.strokeStyle = this.color;
      context.strokeText(this.text, 0, 0, Vectr.WIDTH);
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


},{"./gameobject":4}],6:[function(_dereq_,module,exports){

/*
* @description Object pool One possible way to store common recyclable objects
 */
var Pool;

Pool = (function() {
  function Pool() {
    this.length = 0;
    this.children = [];
    this.inactive = [];
    this.i = 0;
  }


  /*
   * @description Get the next "inactive" object in the Pool
   */

  Pool.prototype.activate = function() {
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


  /*
   * @description Activate all the objects in the pool
   */

  Pool.prototype.activateAll = function() {
    var _results;
    _results = [];
    while (this.inactive.length) {
      this.i = this.inactive.pop();
      this.i.active = true;
      if (typeof this.i.activate === 'function') {
        this.i.activate();
      }
      this.children.push(this.i);
      _results.push(this.length += 1);
    }
    return _results;
  };


  /*
   * @description Move object to the deadpool
   */

  Pool.prototype.deactivate = function(index) {
    if (this.children[index] === void 0) {
      return;
    }
    this.children[index].active = false;
    this.inactive.push(this.children[index]);
    this.i = index;
    while (this.i < this.children.length - 1) {
      this.children[this.i] = this.children[this.i + 1];
      this.i += 1;
    }
    this.children.length -= 1;
    this.length -= 1;
    if (this.length === 0) {
      return this.active = false;
    }
  };


  /*
   * @description Move object to the deadpool
   */

  Pool.prototype.deactivateAll = function() {
    var _results;
    _results = [];
    while (this.children.length) {
      this.i = this.children.pop();
      this.i.active = false;
      this.inactive.push(this.i);
      _results.push(this.length -= 1);
    }
    return _results;
  };


  /*
   * @description Convenience method to access a particular child index
   */

  Pool.prototype.at = function(index) {
    return this.children[index] || null;
  };


  /*
   * @description Add object to one of the lists
   */

  Pool.prototype.add = function(object) {
    if (object.active === void 0) {
      throw "Pool objects need an 'active' property.";
    }
    if (object.active) {
      this.children.push(object);
      return this.length += 1;
    } else {
      return this.inactive.push(object);
    }
  };


  /*
   * @description "Passthrough" method which updates active child objects
   */

  Pool.prototype.update = function(delta) {
    var _results;
    this.i = this.children.length;
    _results = [];
    while (this.i--) {
      this.children[this.i].update(delta);
      if (!this.children[this.i].active) {
        _results.push(this.deactivate(this.i));
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };


  /*
   * @description "Passthrough" method which draws active child objects
   */

  Pool.prototype.draw = function(context, offsetX, offsetY) {
    var _results;
    this.i = this.children.length;
    offsetX = offsetX || 0;
    offsetY = offsetY || 0;
    _results = [];
    while (this.i--) {
      _results.push(this.children[this.i].draw(context, offsetX, offsetY));
    }
    return _results;
  };

  return Pool;

})();

module.exports = Pool;


},{}],7:[function(_dereq_,module,exports){
var GameObject, Scene,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

GameObject = _dereq_('./gameobject');

Scene = (function(_super) {
  __extends(Scene, _super);

  function Scene() {
    Scene.__super__.constructor.apply(this, arguments);
    this.camera = {
      target: null,
      viewport: {
        width: Vectr.WIDTH,
        height: Vectr.HEIGHT
      },
      bounds: {
        top: 0,
        bottom: Vectr.HEIGHT,
        left: 0,
        right: Vectr.WIDTH
      },
      position: {
        x: Vectr.WIDTH / 2,
        y: Vectr.HEIGHT / 2
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


},{"./gameobject":4}],8:[function(_dereq_,module,exports){
var GameObject, Shape,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

GameObject = _dereq_('./gameobject');

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


},{"./gameobject":4}],9:[function(_dereq_,module,exports){
var Vectr;

if (window.requestAnimationFrame === void 0) {
  window.requestAnimationFrame = window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
}

if (window.cancelAnimationFrame === void 0) {
  window.cancelAnimationFrame = window.mozCancelAnimationFrame || window.webkitCancelAnimationFrame || window.msCancelAnimationFrame;
}

Function.prototype.property = function(prop, desc) {
  return Object.defineProperty(this.prototype, prop, desc);
};

Vectr = {
  Game: _dereq_('./game'),
  Button: _dereq_('./button'),
  Emitter: _dereq_('./emitter'),
  GameObject: _dereq_('./gameobject'),
  Label: _dereq_('./label'),
  Pool: _dereq_('./pool'),
  Scene: _dereq_('./scene'),
  Shape: _dereq_('./shape')
};

module.exports = Vectr;


/*
@description Get information about the current environment
 */

Vectr.env = (function() {
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

Vectr.changeScene = function(SceneClass) {
  if (typeof SceneClass !== "function") {
    throw "Invalid scene!";
  }
  Vectr.instance.active.destroy();
  return Vectr.instance.active = new SceneClass();
};


/*
@description Static method to translate mouse/touch input to coordinates the game will understand
Takes the <canvas> offset and scale into account
 */

Vectr.getPoints = function(event) {
  var i, length, _results;
  Vectr.instance.points.length = 0;
  if (event.type.indexOf('mouse') !== -1) {
    return Vectr.instance.points.push({
      'x': (event.pageX - Vectr.OFFSET.x) / Vectr.SCALE,
      'y': (event.pageY - Vectr.OFFSET.y) / Vectr.SCALE
    });
  } else {
    length = event.touches.length;
    i = 0;
    _results = [];
    while (i < length) {
      Vectr.instance.points.push({
        x: (event.touches[i].pageX - Vectr.OFFSET.x) / Vectr.SCALE,
        y: (event.touches[i].pageY - Vectr.OFFSET.y) / Vectr.SCALE
      });
      _results.push(i += 1);
    }
    return _results;
  }
};


/*
@description Static variables used to store music/sound effects
 */

Vectr.music = {};

Vectr.sounds = {};

Vectr.currentMusic = null;


/*/**
@description Static method to play sound effects.
             Assumes you have an instance property 'sounds' filled with Buzz sound objects.
             Otherwise you can override this method to use whatever sound library you like.
 */

Vectr.playSfx = function(id) {
  if (localStorage.getItem('playSfx') === "false") {
    return;
  }
  if (Vectr.sounds[id] !== void 0 && typeof Vectr.sounds[id].play === "function") {
    return Vectr.sounds[id].play();
  }
};


/*
 * @description Static method to play music.
 * Assumes you have an instance property 'music' filled with Buzz sound objects.
 * Otherwise you can override this method to use whatever sound library you like.
 */

Vectr.playMusic = function(id) {
  var _ref, _ref1;
  if (localStorage.getItem('playMusic') === "false") {
    return;
  }
  if (Vectr.currentMusic === id) {
    return;
  }
  if (id === void 0 && Vectr.currentMusic !== null) {
    id = Vectr.currentMusic;
  }
  if (Vectr.currentMusic !== null) {
    if ((_ref = Vectr.music[Vectr.currentMusic]) != null) {
      _ref.stop();
    }
  }
  if ((_ref1 = Vectr.music[id]) != null) {
    _ref1.play();
  }
  return Vectr.currentMusic = id;
};


/*
@description Static method to stop music.
             Assumes you have an instance property 'music' filled with Buzz sound objects.
             Otherwise you can override this method to use whatever sound library you like.
 */

Vectr.stopMusic = function() {
  var _ref;
  if (Vectr.currentMusic === null) {
    return;
  }
  if ((_ref = Vectr.music[Vectr.currentMusic]) != null) {
    _ref.stop();
  }
  return Vectr.currentMusic = null;
};


},{"./button":1,"./emitter":2,"./game":3,"./gameobject":4,"./label":5,"./pool":6,"./scene":7,"./shape":8}]},{},[9])
(9)
});