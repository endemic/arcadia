/*jslint browser, this */
/*global window, Arcadia */

(function (root) {
    'use strict';

    var MenuScene = function () {
        Arcadia.Scene.apply(this);

        this.size = {width: 375, height: 667};
        this.color = 'black';
        var BUTTON_MARGIN = 75;
        var BUTTON_SIZE = {width: 150, height: 50};

        var titleLabel = new Arcadia.Label({
            font: '48px Impact',
            text: 'ARCADIA\nDEMO',
            position: {x: 0, y: -this.size.height / 3}
        });
        this.add(titleLabel);

        var cameraButton = new Arcadia.Button({
        	text: 'camera',
        	font: '20px sans-serif',
        	color: 'blue',
        	border: '2px white',
            size: BUTTON_SIZE,
            position: {x: 0, y: titleLabel.position.y + 100},
        	action: function () {
        		Arcadia.changeScene(CameraDemoScene);
        	}
        });
        this.add(cameraButton);

        var labelButton = new Arcadia.Button({
            text: 'labels',
            font: '20px sans-serif',
            color: 'blue',
            border: '2px white',
            size: BUTTON_SIZE,
            position: {x: 0, y: cameraButton.position.y + BUTTON_MARGIN},
            action: function () {
                Arcadia.changeScene(LabelDemoScene);
            }
        });
        this.add(labelButton);

        var particlesButton = new Arcadia.Button({
            text: 'particles',
            font: '20px sans-serif',
            color: 'blue',
            border: '2px white',
            size: BUTTON_SIZE,
            position: {x: 0, y: labelButton.position.y + BUTTON_MARGIN},
            action: function () {
                Arcadia.changeScene(ParticleDemoScene);
            }
        });
        this.add(particlesButton);

        var shapesButton = new Arcadia.Button({
            text: 'shapes',
            font: '20px sans-serif',
            color: 'blue',
            border: '2px white',
            size: BUTTON_SIZE,
            position: {x: 0, y: particlesButton.position.y + BUTTON_MARGIN},
            action: function () {
                Arcadia.changeScene(ShapeDemoScene);
            }
        });
        this.add(shapesButton);

        var tweensButton = new Arcadia.Button({
            text: 'tweens',
            font: '20px sans-serif',
            color: 'blue',
            border: '2px white',
            size: BUTTON_SIZE,
            position: {x: 0, y: shapesButton.position.y + BUTTON_MARGIN},
            action: function () {
                Arcadia.changeScene(TweenDemoScene);
            }
        });
        this.add(tweensButton);
    };

    MenuScene.prototype = new Arcadia.Scene();

    root.MenuScene = MenuScene;
}(window));
