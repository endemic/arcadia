// var Arcadia = require('arcadia'),
//     PuzzleGrid = require('./puzzle-grid'),
//     LEVELS = require('./levels'),
//     Game;

var Game = function (options) {
    Arcadia.Scene.apply(this, arguments);

    var _this = this;

    Arcadia.playMusic('bgm-tutorial');

    this.difficulty = options.difficulty || 'easy';
    this.level = options.level || 1;

    this.clues = LEVELS[this.difficulty][this.level].clues;
    this.action = Game.MARK;
    this.state = [];

    var i = this.clues.length;
    while (i--) {
        this.state.push(null);
    }

    this.timer = 1740;

    this.filledBlocks = new Arcadia.Pool();
    this.filledBlocks.factory = function () {
        return new Arcadia.Shape({
            size: { width: 17, height: 17 },
            border: '2px solid #000',
            color: '#665945',
            type: 'fill'
        });
    };
    this.add(this.filledBlocks);

    // Pre-instantiate some of these objects
    while (this.filledBlocks.length < 50) {
        this.filledBlocks.activate();
    }
    this.filledBlocks.deactivateAll();

    // `mark` blocks
    this.markedBlocks = new Arcadia.Pool();
    this.markedBlocks.factory = function () {
        return new Arcadia.Shape({
            size: { width: 18, height: 18 },
            color: '#000',
            border: '2px #000',
            type: 'mark',
            path: function (context) {
                context.moveTo(-this.size.width / 2 + 2, this.size.height / 2 - 2);
                context.lineTo(this.size.width / 2 - 2, -this.size.height / 2 + 2);
                context.moveTo(this.size.width / 2 - 2, this.size.height / 2 - 2);
                context.lineTo(-this.size.width / 2 + 2, -this.size.height / 2 + 2);
            }
        });
    };
    this.add(this.markedBlocks);

    while (this.markedBlocks.length < 50) {
        this.markedBlocks.activate();
    }
    this.markedBlocks.deactivateAll();

    this.puzzleGrid = new PuzzleGrid({
        clues: this.clues
    });
    this.puzzleGrid.position.x = 160;
    this.puzzleGrid.position.y = 352;
    this.add(this.puzzleGrid);

    var timeLeft = new Arcadia.Label({
        position: { x: 80, y: 110 },
        text: 'time left',
        font: '22px uni_05_53',
        color: '#000',
    });
    this.add(timeLeft);

    this.timerLabel = new Arcadia.Label({
        position: { x: 80, y: 145 },
        text: '30:00',
        font: '40px uni_05_53',
        color: '#000'
    });

    this.add(this.timerLabel);

    var timeLeftBackground = new Arcadia.Shape({
        size: { width: 150, height: 90 },
        border: '3px solid #000',
        shadow: '5px 5px 0px rgba(0, 0, 0, 0.5)',
        color: '#fff',
        position: { x: 80, y: 135 }
    });

    this.add(timeLeftBackground);

    var preview = new Arcadia.Label({
        position: { x: 240, y: 110 },
        text: 'preview',
        font: '22px uni_05_53',
        color: '#000',
    });
    this.add(preview);

    var previewBackground = new Arcadia.Shape({
        size: { width: 150, height: 90 },
        color: '#fff',
        border: '3px solid #000',
        shadow: '5px 5px 0px rgba(0, 0, 0, 0.5)',
        position: { x: 240, y: 135 }
    });

    this.add(previewBackground);

    this.setupButtons();
};

Game.prototype = new Arcadia.Scene();

Game.FILL = 1;
Game.MARK = 2;

Game.prototype.update = function (delta) {
    Arcadia.Scene.prototype.update.call(this, delta);

    this.timer -= delta;

    var minutes,
        seconds;

    minutes = Math.round(this.timer / 60);
    seconds = Math.round(this.timer % 60);
    // TODO break this out into two labels, to prevent text jumping
    this.timerLabel.text = minutes + ':' + seconds;
};

Game.prototype.onPointStart = function (points) {
    var values, row, column;

    // Determine if within grid bounds
    values = this.puzzleGrid.getRowAndColumn(points[0]);
    row = values[0];
    column = values[1];

    if (row !== null && column !== null) {
        this.markOrFill(row, column);
    }

    this.previousRow = row;
    this.previousColumn = column;
};

Game.prototype.onPointMove = function (points) {
    var values, row, column;

    values = this.puzzleGrid.getRowAndColumn(points[0]);
    row = values[0];
    column = values[1];

    if (row === this.previousRow && column === this.previousColumn) {
        return;
    }

    if (row !== null && column !== null) {
        this.markOrFill(row, column);
    }

    this.previousRow = row;
    this.previousColumn = column;
};

Game.prototype.onPointEnd = function (points) {
    // do something here?
};

Game.prototype.markOrFill = function (row, column) {
    var index = row * 10 + column;
    var valid = this.clues[index] === 1;
    var existingBlock = this.state[index];
    var block;
    var offsetToCenter = 3;

    if (this.action === Game.FILL) {
        if (existingBlock && existingBlock.type === 'fill') {
            console.log('already filled');
            // Play "click" sound (or remove the block)
            Arcadia.playSfx('invalid');
        } else if (valid) {
            block = this.filledBlocks.activate();
            block.position.x = column * this.puzzleGrid.cellSize + this.puzzleGrid.gridBounds.left + block.size.width / 2 + offsetToCenter;
            block.position.y = row * this.puzzleGrid.cellSize + this.puzzleGrid.gridBounds.top + block.size.height / 2 + offsetToCenter;
            block.scale = 2;
            block.tween('scale', 1, 200);
            this.state[index] = block;
            Arcadia.playSfx('fill');
        } else {
            // MISTAKE!
            // Subtract time, etc.
            console.debug('wrong answer!');
            Arcadia.playSfx('error');
        }
    } else if (this.action === Game.MARK) {
        if (!existingBlock) {
            block = this.markedBlocks.activate();
            block.position.x = column * this.puzzleGrid.cellSize + this.puzzleGrid.gridBounds.left + block.size.width / 2 + offsetToCenter;
            block.position.y = row * this.puzzleGrid.cellSize + this.puzzleGrid.gridBounds.top + block.size.height / 2 + offsetToCenter;
            block.scale = 2;
            block.tween('scale', 1, 200);
            this.state[index] = block;
            console.log('Trying to mark block');
            Arcadia.playSfx('mark');
        } else if (existingBlock && existingBlock.type === 'mark') {
            this.markedBlocks.deactivate(existingBlock);
            this.state[index] = null;
            console.log('removing mark');
            Arcadia.playSfx('mark');
        } else {
            // block is filled; make "click" noise
            console.log('block already filled');
            Arcadia.playSfx('invalid');
        }
    }

};

Game.prototype.setupButtons = function () {
    var _this = this;

    // "Mark" button
    this.markButton = new Arcadia.Button({
        position: { x: 80, y: 540 },
        size: { width: 145, height: 40 },
        border: '5px solid #000',
        color: '#665945',
        shadow: '5px 5px 0 rgba(0, 0, 0, 0.5)',
        label: new Arcadia.Label({
            text: 'MARK',
            color: 'orange',
            font: '30px uni_05_53',
            position: { x: 0, y: -3 }
        }),
        action: function () {
            Arcadia.playSfx('button');
            _this.action = Game.MARK;
            _this.fillButton.label.color = 'white';
            this.label.color = 'orange';
            console.debug('Setting action to `mark`');
        }
    });
    this.add(this.markButton);

    // "Fill" button
    this.fillButton = new Arcadia.Button({
        position: { x: 240, y: 540 },
        size: { width: 145, height: 40 },
        border: '5px solid #000',
        color: '#665945',
        shadow: '5px 5px 0 rgba(0, 0, 0, 0.5)',
        label: new Arcadia.Label({
            text: 'FILL',
            color: '#fff',
            font: '30px uni_05_53',
            position: { x: 0, y: -3 }
        }),
        action: function () {
            Arcadia.playSfx('button');
            _this.action = Game.FILL;
            _this.markButton.label.color = 'white';
            this.label.color = 'orange';
            console.debug('Setting action to `fill`');
        }
    });
    this.add(this.fillButton);

    // "Clear" button
    this.add(new Arcadia.Button({
        position: { x: 240, y: 50 },
        size: { width: 145, height: 40 },
        border: '5px solid #000',
        color: '#665945',
        shadow: '5px 5px 0 rgba(0, 0, 0, 0.5)',
        label: new Arcadia.Label({
            text: 'CLEAR',
            color: '#fff',
            font: '30px uni_05_53',
            position: { x: 0, y: -3 }
            // position: '0px -3px'
        }),
        action: function () {
            Arcadia.playSfx('button');
            // Reset state
            _this.filledBlocks.deactivateAll();
            _this.markedBlocks.deactivateAll();
            for (var i = 0; i < _this.state.length; i += 1) {
                _this.state[i] = null;
            }
        }
    }));

    // "Quit" button
    this.add(new Arcadia.Button({
        position: { x: 80, y: 50 },
        size: { width: 145, height: 40 },
        border: '5px solid #000',
        color: '#665945',
        shadow: '5px 5px 0 rgba(0, 0, 0, 0.5)',
        label: new Arcadia.Label({
            text: 'QUIT',
            color: '#fff',
            font: '30px uni_05_53',
            position: { x: 0, y: -3 }
            // position: '0px -3px'
        }),
        action: function () {
            Arcadia.playSfx('button');
            if (confirm('Are you sure you want to quit?')) {
                Arcadia.changeScene(Title);
            }
        }
    }));
};

// module.exports = Game;
