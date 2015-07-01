
var PuzzleGrid = function (args) {
    Arcadia.Shape.apply(this, arguments);

    this.size = {
        width: 320,
        height: 320
    };
    this.clues = args.clues;
    this.state = [];
    this.gridSize = Math.sqrt(this.clues.length);
    
    // Grid goes over ~70% of background; rest is for clues
    this.cellSize = this.size.width * 5/7 / this.gridSize;

    // this.border = '5px #000';
    this.shadow = '5px 5px 0px #000';

    this.horizontalClues = [];
    this.verticalClues = [];

    // Draw horizontal clues
    i = this.gridSize;
    var label;
    while (i--) {
        label = new Arcadia.Label({
            font: '16px uni_05_53',
            color: '#000',
            alignment: 'right',
            position: { x: -110, y: -58 + (i * 22.8) },
            fixed: false
        });
        this.add(label);
        this.horizontalClues.unshift(label);
    }

    // Draw vertical clues
    i = this.gridSize;
    while (i--) {
        label = new Arcadia.Label({
            font: '16px uni_05_53',
            color: '#000',
            alignment: 'center',
            position: { x: -56 + (i * 22.8), y: -115 },
            fixed: false
        });
        this.add(label);
        this.verticalClues.unshift(label);
    }

    this.generateClueLabels();

    this.path = function (context) {
        var i,
            left, right,
            top, bottom;

        left = -this.size.width / 2;
        right = this.size.width / 2;
        top = -this.size.height / 2;
        bottom = this.size.height / 2;

        context.fillStyle = '#fff';
        context.fillRect(left * Arcadia.PIXEL_RATIO, top * Arcadia.PIXEL_RATIO, this.size.width * Arcadia.PIXEL_RATIO, this.size.height * Arcadia.PIXEL_RATIO);

        for (i = 0; i <= this.gridSize; i += 1) {
            // horizontal lines
            context.moveTo(left * Arcadia.PIXEL_RATIO, (bottom - this.cellSize * i) * Arcadia.PIXEL_RATIO);
            context.lineTo(right * Arcadia.PIXEL_RATIO, (bottom - this.cellSize * i) * Arcadia.PIXEL_RATIO);

            // vertical lines
            context.moveTo((right - this.cellSize * i) * Arcadia.PIXEL_RATIO, top * Arcadia.PIXEL_RATIO);
            context.lineTo((right - this.cellSize * i) * Arcadia.PIXEL_RATIO, bottom * Arcadia.PIXEL_RATIO);
        }

        // Draw grid
        context.lineWidth = 2 * Arcadia.PIXEL_RATIO;
        context.strokeStyle = '#000';
        context.stroke();

        // Draw border
        context.strokeRect(left * Arcadia.PIXEL_RATIO, top * Arcadia.PIXEL_RATIO, this.size.width * Arcadia.PIXEL_RATIO, this.size.height * Arcadia.PIXEL_RATIO);

        // Get bounds of user interactive area
        this.gridBounds = {
            right: right + this.position.x,
            left: (right - (this.cellSize * this.gridSize)) + this.position.x,
            bottom: bottom + this.position.y,
            top: (bottom - (this.cellSize * this.gridSize)) + this.position.y
        };
    };
};

PuzzleGrid.prototype = new Arcadia.Shape();

PuzzleGrid.prototype.generateClueLabels = function () {
    for (var i = 0; i < this.gridSize; i += 1) {
        var horizontalClue = '',
            verticalClue = '',
            horizontalCounter = 0,
            verticalCounter = 0,
            previousVertical = false,
            previousHorizontal = false,
            j, index;

        // Horizontal clues
        for (j = 0; j < this.gridSize; j += 1) {
            index = i * this.gridSize + j;
            if (this.clues[index] === 1) {
                horizontalCounter += 1;
                this.totalHits += 1;
                previousHorizontal = true;
            } else if (previousHorizontal) {
                horizontalClue += horizontalCounter + ' ';
                horizontalCounter = 0;
                previousHorizontal = false;
            }
        }

        // Vertical clues
        for (j = 0; j < this.gridSize; j += 1) {
            index = j * this.gridSize + i;
            if (this.clues[index] === 1) {
                verticalCounter += 1;
                previousVertical = true;
            } else if (previousVertical) {
                verticalClue += verticalCounter + '\n';
                verticalCounter = 0;
                previousVertical = false;
            }
        }

         // Check for condition when a row or column ends with filled blocks
        if (previousHorizontal) {
            horizontalClue += horizontalCounter;
        }

        if (previousVertical) {
            verticalClue += verticalCounter + '\n';
        }

        // Handle when there are no clues for a row/column
        if (horizontalClue === '') {
            horizontalClue = '0';
            // @elem.find('.horizontal.clue').eq(i).addClass('complete')
        }
        if (verticalClue === '') {
            verticalClue = '0\n';
            // @elem.find('.vertical.clue').eq(i).addClass('complete')
        }

        // match = verticalClue.match(/<br>/g)
        // length = if match? then match.length else 0

        // # Add some manual padding for vertical clues so they are bottom aligned
        // if length < 5
        //   for [length .. 4]
        //     verticalClue = "<br>#{verticalClue}"

        this.horizontalClues[i].text = horizontalClue;
        this.verticalClues[i].text = verticalClue;
    }
};

PuzzleGrid.prototype.containsPoint = function (point) {
    return point.x < this.gridBounds.right &&
      point.x > this.gridBounds.left &&
      point.y < this.gridBounds.bottom &&
      point.y > this.gridBounds.top;
};

PuzzleGrid.prototype.getRowAndColumn = function (point) {
    if (!this.containsPoint(point)) {
        return [null, null];
    }

    var row, column;

    // NOTE: current levels consider 0, 0 to be upper left instead of lower left
    //row = Math.floor((this.gridBounds.bottom - point.y) / this.cellSize);

    row = Math.floor((point.y - this.gridBounds.top) / this.cellSize);
    column = Math.floor((point.x - this.gridBounds.left) / this.cellSize);

    return [row, column];
};

// module.exports = PuzzleGrid;
