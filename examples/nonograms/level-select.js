var LevelSelect = function (options) {
    Arcadia.Scene.apply(this, arguments);
    
    options = options || {};

    var title, button, _this = this;

    this.difficulty = options.difficulty || 'beginner';
    this.level = 0;

    var backButton = new Arcadia.Button({
        position: { x: 75, y: 35 },
        size: { width: 120, height: 40 },
        border: '5px solid #000',
        color: '#665945',
        shadow: '5px 5px 0 #000',
        label: new Arcadia.Label({
            text: '< back',
            font: '25px uni_05_53',
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
        font: '65px uni_05_53',
        color: '#fff',
        shadow: '0px 0px 10px #000',
        position: {
            x: Arcadia.WIDTH / 2,
            y: 130
        }
    });
    this.add(title);

    var startButton = new Arcadia.Button({
        position: { x: Arcadia.WIDTH / 2, y: Arcadia.HEIGHT - 50 },
        size: { width: 180, height: 50 },
        border: '5px solid #000',
        color: '#665945',
        shadow: '5px 5px 0 #000',
        label: new Arcadia.Label({
            text: 'Play',
            font: '35px uni_05_53',
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
        position: { x: 50, y: 350 },
        size: { width: 60, height: 60 },
        border: '5px solid #000',
        color: '#665945',
        shadow: '5px 5px 0 rgba(0, 0, 0, 0.5)',
        label: new Arcadia.Label({
            text: '<',
            font: '40px uni_05_53',
            position: { x: 0, y: -3 }
        }),
        action: function () {
            Arcadia.playSfx('button');
            _this.previous();
        }
    });

    var nextButton = new Arcadia.Button({
        position: { x: Arcadia.WIDTH - 50, y: 350 },
        size: { width: 60, height: 60 },
        border: '5px solid #000',
        color: '#665945',
        shadow: '5px 5px 0 rgba(0, 0, 0, 0.5)',
        label: new Arcadia.Label({
            text: '>',
            font: '40px uni_05_53',
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

