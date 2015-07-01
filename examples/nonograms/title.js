// var Arcadia = require('arcadia'),
//     GameScene = require('./game-scene'),
//     Title;

var Title = function () {
    Arcadia.Scene.apply(this);

    var nonogram = new Arcadia.Label({
        text: 'Nonogram',
        font: '55px uni_05_53',
        color: '#fff',
        shadow: '0px 0px 10px #000'
    });
    nonogram.position = {
        x: Arcadia.WIDTH / 2,
        y: 100
    };
    this.add(nonogram);
    var madness = new Arcadia.Label({
        text: 'Madness',
        font: '60px uni_05_53',
        color: '#fff',
        shadow: '0px 0px 10px #000'
    });
    madness.position = {
        x: Arcadia.WIDTH / 2,
        y: 200
    };
    this.add(madness);

    var startButton = new Arcadia.Button({
        position: { x: Arcadia.WIDTH / 2, y: 400 },
        size: { width: 145, height: 40 },
        border: '5px solid #000',
        color: '#665945',
        shadow: '5px 5px 0 #000',
        label: new Arcadia.Label({
            text: 'Start',
            color: '#fff',
            font: '30px uni_05_53',
            position: { x: 0, y: -3 }
        }),
        action: function () {
            Arcadia.playSfx('button');
            Arcadia.changeScene(DifficultySelect);
        }
    });
    this.add(startButton);

    var settingsButton = new Arcadia.Button({
        position: { x: Arcadia.WIDTH / 2, y: 460 },
        size: { width: 145, height: 40 },
        border: '5px solid #000',
        color: '#665945',
        shadow: '5px 5px 0 #000',
        label: new Arcadia.Label({
            text: 'Options',
            color: '#fff',
            font: '30px uni_05_53',
            position: { x: 0, y: -3 }
        }),
        action: function () {
            Arcadia.playSfx('button');
            Arcadia.changeScene(Options);
        }
    });
    this.add(settingsButton);

    Arcadia.playMusic('bgm-one');
};

Title.prototype = new Arcadia.Scene();

// module.exports = Title;
