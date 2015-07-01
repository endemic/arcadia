var Preview = function () {
    Arcadia.Shape.apply(this, arguments);

    this.size = {
        width: 160,
        height: 160
    };
    this.shadow = '5px 5px 0 rgba(0, 0, 0, 0.5)';

    this.pixels = new Arcadia.Pool();
    this.pixels.factory = function () {
        return new Arcadia.Shape({
            color: '#000'
        });
    };
    this.add(this.pixels);
};

Preview.prototype = new Arcadia.Shape();

Preview.prototype.drawPreview = function (clues) {
    this.pixels.deactivateAll();

    var index,
        pixel,
        x,
        y,
        gridSize,
        previewSize,
        pixelSize;

    gridSize = Math.sqrt(clues.length);
    previewSize = Math.floor(this.size.width / gridSize) * gridSize;
    pixelSize = Math.floor(previewSize / gridSize);

    for (index = 0; index < clues.length; index += 1) {
        if (clues[index] === 1) {
            x = index % gridSize;
            y = Math.floor(index / gridSize);
            pixel = this.pixels.activate();
            pixel.size = { width: pixelSize, height: pixelSize };
            pixel.position = {
                x: -this.size.width / 2 + x * pixelSize + pixelSize / 2,
                y: -this.size.height / 2 + y * pixelSize + pixelSize / 2
            };
        }
    }
};

