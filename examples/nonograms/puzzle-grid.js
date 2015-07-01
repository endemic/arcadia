
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

    // Draw horizontal clues
    i = this.gridSize;
    var label;
    while (i--) {
        label = new Arcadia.Label({
            text: '  4 2 1 3',
            font: '16px uni_05_53',
            color: '#000',
            alignment: 'right',
            position: { x: -110, y: -58 + (i * 22.8) },
            fixed: false
        });
        this.add(label);
    }

    // Draw vertical clues
    i = this.gridSize;
    while (i--) {
        label = new Arcadia.Label({
            text: "2\n3\n5\n3\n1",
            font: '16px uni_05_53',
            color: '#000',
            alignment: 'center',
            position: { x: -56 + (i * 22.8), y: -115 },
            fixed: false
        });
        this.add(label);
    }

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
