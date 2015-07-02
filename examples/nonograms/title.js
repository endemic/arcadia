// var Arcadia = require('arcadia'),
//     GameScene = require('./game-scene'),
//     Title;

var Title = function () {
    Arcadia.Scene.apply(this);

    var nonogram = new Arcadia.Label({
        text: 'Nonogram',
        font: '65px uni_05_53',
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
        font: '75px uni_05_53',
        color: '#fff',
        shadow: '0px 0px 10px #000'
    });
    madness.position = {
        x: Arcadia.WIDTH / 2,
        y: 190
    };
    this.add(madness);

    var startButton = new Arcadia.Button({
        position: { x: Arcadia.WIDTH / 2, y: 400 },
        size: { width: 180, height: 50 },
        border: '5px solid #000',
        color: '#665945',
        shadow: '5px 5px 0 rgba(0, 0, 0, 0.5)',
        label: new Arcadia.Label({
            text: 'Start',
            font: '35px uni_05_53',
            position: { x: 0, y: -3 }
        }),
        action: function () {
            Arcadia.playSfx('button');
            Arcadia.changeScene(DifficultySelect);
        }
    });
    this.add(startButton);

    var optionsButton = new Arcadia.Button({
        position: { x: Arcadia.WIDTH / 2, y: 470 },
        size: { width: 180, height: 50 },
        border: '5px solid #000',
        color: '#665945',
        shadow: '5px 5px 0 rgba(0, 0, 0, 0.5)',
        label: new Arcadia.Label({
            text: 'Options',
            font: '35px uni_05_53',
            position: { x: 0, y: -3 }
        }),
        action: function () {
            Arcadia.playSfx('button');
            Arcadia.changeScene(Options);
        }
    });
    this.add(optionsButton);

    var aboutButton = new Arcadia.Button({
        position: { x: Arcadia.WIDTH / 2, y: 540 },
        size: { width: 180, height: 50 },
        border: '5px solid #000',
        color: '#665945',
        shadow: '5px 5px 0 rgba(0, 0, 0, 0.5)',
        label: new Arcadia.Label({
            text: 'About',
            font: '35px uni_05_53',
            position: { x: 0, y: -3 }
        }),
        action: function () {
            Arcadia.playSfx('button');
            Arcadia.changeScene(About);
        }
    });
    this.add(aboutButton);

    Arcadia.playMusic('bgm-one');
};

Title.prototype = new Arcadia.Scene();

// module.exports = Title;
