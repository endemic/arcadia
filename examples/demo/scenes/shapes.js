/*jslint browser, this */
/*global window, Arcadia */

(function (root) {
    'use strict';

    var ShapeDemoScene = function () {
        Arcadia.Scene.apply(this);

        this.color = 'black';

        var COLORS = ['cyan', 'yellow', 'magenta', 'lime'];
        Array.prototype.sample = function () {
        	return this[Math.floor(Arcadia.random(0, this.length))];
        };

        var line = new Arcadia.Shape({
        	vertices: 2,
        	angularVelocity: Arcadia.random(0, 2),
        	size: {
        		width: 100,
        		height: 100
        	},
            border: '5px ' + COLORS.sample()
        });
        this.add(line);

        var triangle = new Arcadia.Shape({
        	vertices: 3,
        	angularVelocity: Arcadia.random(0, 2),
        	position: {
        		x: Arcadia.random(-this.size.width / 2, this.size.width / 2),
        		y: Arcadia.random(-this.size.height / 2, this.size.height / 2)
        	},
        	size: {
        		width: 100,
        		height: 100
        	},
        	color: COLORS.sample()
        });
        this.add(triangle);

        var square = new Arcadia.Shape({
        	vertices: 4,
        	angularVelocity: Arcadia.random(0, 2),
        	position: {
        		x: Arcadia.random(-this.size.width / 2, this.size.width / 2),
        		y: Arcadia.random(-this.size.height / 2, this.size.height / 2)
        	},
        	size: {
        		width: 100,
        		height: 100
        	},
        	color: COLORS.sample()
        });
        this.add(square);

        var rectangle = new Arcadia.Shape({
        	vertices: 4,
            angularVelocity: Arcadia.random(0, 2),
        	position: {
        		x: Arcadia.random(-this.size.width / 2, this.size.width / 2),
        		y: Arcadia.random(-this.size.height / 2, this.size.height / 2)
        	},
        	size: {
        		width: 100,
        		height: 200
        	},
        	color: COLORS.sample()
        });
        this.add(rectangle);

        var circleWithSquareInside = new Arcadia.Shape({
        	vertices: 0,
        	angularVelocity: Arcadia.random(0, 2),
        	position: {
        		x: Arcadia.random(-this.size.width / 2, this.size.width / 2),
        		y: Arcadia.random(-this.size.height / 2, this.size.height / 2)
        	},
        	size: {
        		width: 100,
        		height: 100
        	},
        	color: COLORS.sample()
        });
        var smallerSquare = new Arcadia.Shape({
        	vertices: 4,
        	size: {
        		width: 75,
        		height: 75
        	},
        	color: 'white'
        });
        circleWithSquareInside.add(smallerSquare);
        this.add(circleWithSquareInside);

        var arbitraryShape = new Arcadia.Shape({
        	angularVelocity: Arcadia.random(0, 2),
        	position: {
        		x: Arcadia.random(-this.size.width / 2, this.size.width / 2),
        		y: Arcadia.random(-this.size.height / 2, this.size.height / 2)
        	},
        	size: {
        		width: 100,
        		height: 100
        	},
        	color: COLORS.sample()
        });
        arbitraryShape.path = function (context) {
            var x = this.size.width / 2;
            var y = this.size.height / 2;
            context.moveTo(x, y);
        	context.arc(x, y, this.size.width / 4 * Arcadia.PIXEL_RATIO, 0, 2 * Math.PI);
            context.moveTo(x, -y);
            context.arc(x, -y, this.size.width / 4 * Arcadia.PIXEL_RATIO, 0, 2 * Math.PI);
            context.moveTo(-x, -y);
            context.arc(-x, -y, this.size.width / 4 * Arcadia.PIXEL_RATIO, 0, 2 * Math.PI);
            context.moveTo(-x, y);
            context.arc(-x, y, this.size.width / 4 * Arcadia.PIXEL_RATIO, 0, 2 * Math.PI);
        };
        this.add(arbitraryShape);

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

    ShapeDemoScene.prototype = new Arcadia.Scene();

    root.ShapeDemoScene = ShapeDemoScene;
}(window));
