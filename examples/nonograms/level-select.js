var LevelSelect = function (options) {
    Arcadia.Scene.apply(this, arguments);

    var title, button, _this = this;

    this.difficulty = options.difficulty || 'beginner';
    this.level = 0;

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
            Arcadia.changeScene(DifficultySelect);
        }
    });
    this.add(backButton);

    title = new Arcadia.Label({
        text: 'Choose\nPuzzle',
        font: '55px uni_05_53',
        color: '#fff',
        shadow: '0px 0px 10px #000',
        position: {
            x: Arcadia.WIDTH / 2,
            y: 100
        }
    });
    this.add(title);

    var startButton = new Arcadia.Button({
        position: { x: Arcadia.WIDTH / 2, y: 500 },
        size: { width: 145, height: 40 },
        border: '5px solid #000',
        color: '#665945',
        shadow: '5px 5px 0 #000',
        label: new Arcadia.Label({
            text: 'START',
            color: '#fff',
            font: '30px uni_05_53',
            position: { x: 0, y: -3 }
        }),
        action: function () {
            Arcadia.playSfx('button');
            Arcadia.changeScene(Game, {
                difficulty: _this.difficulty,
                level: _this.level
            });
        }
    });
    this.add(startButton);

    // Create previous/next buttons
    var previousButton = new Arcadia.Button({
        position: { x: 80, y: 400 },
        size: { width: 40, height: 40 },
        border: '5px solid #000',
        color: '#665945',
        shadow: '5px 5px 0 rgba(0, 0, 0, 0.5)',
        label: new Arcadia.Label({
            text: '<',
            color: '#fff',
            font: '30px uni_05_53',
            position: { x: 0, y: -3 }
        }),
        action: function () {
            Arcadia.playSfx('button');
            _this.previous();
        }
    });

    var nextButton = new Arcadia.Button({
        position: { x: Arcadia.WIDTH - 80, y: 400 },
        size: { width: 40, height: 40 },
        border: '5px solid #000',
        color: '#665945',
        shadow: '5px 5px 0 rgba(0, 0, 0, 0.5)',
        label: new Arcadia.Label({
            text: '>',
            color: '#fff',
            font: '30px uni_05_53',
            position: { x: 0, y: -3 }
        }),
        action: function () {
            Arcadia.playSfx('button');
            _this.next();
        }
    });

    this.add(previousButton);
    this.add(nextButton);

    this.preview = new Preview();
    this.preview.position = {
        x: Arcadia.WIDTH / 2,
        y: Arcadia.HEIGHT / 2
    };
    this.add(this.preview);

    this.preview.drawPreview(LEVELS[this.difficulty][this.level].clues);
};

LevelSelect.prototype = new Arcadia.Scene();

LevelSelect.prototype.next = function () {
    // Show the next level
    if (this.level < LEVELS[this.difficulty].length - 1) {
        this.level += 1;
        this.preview.drawPreview(LEVELS[this.difficulty][this.level].clues);
    }
};

LevelSelect.prototype.previous = function () {
    // Show the previous level
    if (this.level > 0) {
        this.level -= 1;
        this.preview.drawPreview(LEVELS[this.difficulty][this.level].clues);
    }
};

