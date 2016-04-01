/*jslint browser, this */
/*global window, Arcadia */

(function (root) {
    'use strict';

    var TweenDemoScene = function () {
        Arcadia.Scene.apply(this);

        this.color = 'black';

        // spinning shape
        var shape1 = new Arcadia.Shape({
        	position: {x: 0, y: -this.size.height / 3},
        	size: {width: 100, height: 100},
        	color: 'red',
            border: '2px white'
        });
        Arcadia.Shape.prototype.spin = function () {
        	var endRotation = this.rotation > 0 ? 0 : Math.PI;
        	// prop, target value, duration (ms), easing function, callback
    		this.tween('rotation', endRotation, 2000, 'elasticInOut', this.spin.bind(this));
        };
        this.add(shape1);
        shape1.spin(); // kick off the animation loop

        // growing/shrinking shape
        var shape2 = new Arcadia.Shape({
        	size: {width: 100, height: 100},
        	color: 'blue',
            border: '2px white'
        });
        Arcadia.Shape.prototype.pulse = function () {
        	var endScale = this.scale > 1 ? 1 : 2;
        	// prop, target value, duration (ms), easing function, callback
    		this.tween('scale', endScale, 2000, 'expoInOut', this.pulse.bind(this));
        };
        this.add(shape2);
        shape2.pulse(); // kick off the animation loop

        // moving back and forth shape
        var shape3 = new Arcadia.Shape({
        	position: {x: 0, y: this.size.height / 3},
        	size: {width: 100, height: 100},
        	color: 'green',
            border: '2px white'
        });
        Arcadia.Shape.prototype.move = function () {
        	var endX = this.position.x > 0 ? -100 : 100;
        	// prop, target value, duration (ms), easing function, callback
    		this.tween('position', {x: endX, y: this.position.y}, 2000, 'quadInOut', this.move.bind(this));
        };
        this.add(shape3);
        shape3.move(); // kick off the animation loop

        var backButton = new Arcadia.Button({
            text: '← main menu',
            font: '20px sans-serif',
            color: 'blue',
            border: '2px white',
            position: {x: -this.size.width / 2 + 75, y: -this.size.height / 2 + 25},
            zIndex: -1,
            action: function () {
                Arcadia.changeScene(MenuScene);
            }
        });
        this.add(backButton);
    };

    TweenDemoScene.prototype = new Arcadia.Scene();

    root.TweenDemoScene = TweenDemoScene;
}(window));
