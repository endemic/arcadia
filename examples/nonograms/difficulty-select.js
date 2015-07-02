var DifficultySelect = function (options) {
    Arcadia.Scene.apply(this, arguments);

    var title, _this;

    _this = this;

    var backButton = new Arcadia.Button({
        position: { x: 65, y: 30 },
        size: { width: 100, height: 30 },
        border: '5px solid #000',
        color: '#665945',
        shadow: '5px 5px 0 #000',
        label: new Arcadia.Label({
            text: '< back',
            color: '#fff',
            font: '20px uni_05_53',
            position: { x: 0, y: -3 }
        }),
        action: function () {
            Arcadia.playSfx('button');
            Arcadia.changeScene(Title);
        }
    });
    this.add(backButton);

    title = new Arcadia.Label({
        text: 'Choose\nDifficulty',
        font: '55px uni_05_53',
        color: '#fff',
        shadow: '0px 0px 10px #000'
    });
    title.position = {
        x: Arcadia.WIDTH / 2,
        y: 100
    };
    this.add(title);

    ['beginner', 'easy', 'medium', 'hard', 'random'].forEach(function (difficulty, index) {
        _this.createButton(difficulty, index);
    });
};

DifficultySelect.prototype = new Arcadia.Scene();

DifficultySelect.prototype.createButton = function (difficulty, index) {
    var button = new Arcadia.Button({
        position: { x: Arcadia.WIDTH / 2, y: 220 + (60 * index) },
        size: { width: 175, height: 40 },
        border: '5px solid #000',
        color: '#665945',
        shadow: '5px 5px 0 rgba(0, 0, 0, 0.5)',
        label: new Arcadia.Label({
            text: difficulty,
            color: '#fff',
            font: '30px uni_05_53',
            position: { x: 0, y: -3 }
        }),
        action: function () {
            Arcadia.playSfx('button');
            Arcadia.changeScene(LevelSelect, { difficulty: difficulty });
        }
    });
    this.add(button);
};

// module.exports = Title;
