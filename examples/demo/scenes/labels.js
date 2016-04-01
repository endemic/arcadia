/*jslint browser, this */
/*global window, Arcadia */

(function (root) {
    'use strict';

    var LabelDemoScene = function () {
        Arcadia.Scene.apply(this);

        this.color = 'black';

        var leftAlignedText;
        var rightAlignedText;
        var centerAlignedText;
        var bigText;
        var smallText;

        var label = new Arcadia.Label({
            color: '#f0f',
            font: '40px serif',
            text: 'hello world!',
            border: '1px yellow',
            shadow: '0 10px 5px #0ff',
            angularVelocity: Arcadia.randomSign()
        });
        this.add(label);

        var backButton = new Arcadia.Button({
            text: '← main menu',
            font: '20px sans-serif',
            color: 'blue',
            border: '2px white',
            position: {x: -this.size.width / 2 + 75, y: -this.size.height / 2 + 25},
            action: function () {
                Arcadia.changeScene(MenuScene);
            }
        });
        this.add(backButton);
    };

    LabelDemoScene.prototype = new Arcadia.Scene();

    root.LabelDemoScene = LabelDemoScene;
}(window));
