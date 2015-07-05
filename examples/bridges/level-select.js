/*jslint sloppy: true, plusplus: true */
/*globals Arcadia */

var LevelSelect = function () {
    Arcadia.Scene.apply(this, arguments);
    // Background color
    this.color = 'purple';

    var spacing = 52, // for 40x40 objects
        counter = 0,
        rows = 5,   // Show 25 levels per page; maybe shoot for 100 levels?
        columns = 5,
        centerX = Arcadia.WIDTH / 2,
        centerY = Arcadia.HEIGHT / 2,
        gridWidth = rows * spacing,
        gridHeight = columns * spacing,
        startX = centerX - gridWidth / 2 + spacing / 2,
        startY = centerY - gridHeight / 2 + spacing / 2,
        y,
        x,
        shape;

    // Draw grid of level buttons
    // TODO: support circular buttons?
    for (y = startY; y < startY + gridHeight; y += spacing) {
        for (x = startX; x < startX + gridWidth; x += spacing) {
            shape = new Vertex({
                number: (counter + 1),
                position: { x: x, y: y }
            });
            this.add(shape);
            counter += 1;
        }
    }

    // Create grid of puzzle buttons - clicking one will take you to
    // the puzzle immediately (but temporarily will need a play/edit distinction
    // so that levels can be created)

    // Puzzles hidden behind IAP wall will be red, normal will be purple,
    // completed will be green

    // Need to allow circular buttons in Arcadia.Button

    // Probably need pagination, as well, since will have more puzzles than
    // can fit on one screen

    // Can link to a more info/feedback view from here as well
};

LevelSelect.prototype = new Arcadia.Scene();
