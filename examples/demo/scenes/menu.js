/*jslint browser, this */
/*global window, Arcadia */

(function (root) {
    'use strict';

    var MenuScene = function () {
        Arcadia.Scene.apply(this);

        this.size = {width: 375, height: 667};
        this.color = 'lightgrey';

        var cameraButton = new Arcadia.Button({
        	text: 'camera',
        	font: '20px sans-serif',
        	color: 'blue',
        	border: '2px white',
        	action: function () {
        		Arcadia.changeScene(CameraDemoScene);
        	}
        });
        this.add(cameraButton);
    };

    MenuScene.prototype = new Arcadia.Scene();

    root.MenuScene = MenuScene;
}(window));
