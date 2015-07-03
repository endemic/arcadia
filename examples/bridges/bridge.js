var Bridge = function (options) {
    Arcadia.Shape.apply(this, arguments);

    this.color = '#fff';
    this.border= '2px #fff';
    this.count = 1;
    
    this.path = function (context) {
        if (this.count === 1) {
            if (this.size.height > this.size.width) {
                context.moveTo(0, -this.size.height / 2 * Arcadia.PIXEL_RATIO);
                context.lineTo(0, this.size.height / 2 * Arcadia.PIXEL_RATIO);
            } else {
                context.moveTo(-this.size.width / 2 * Arcadia.PIXEL_RATIO, 0);
                context.lineTo(this.size.width / 2 * Arcadia.PIXEL_RATIO, 0);
            }
        } else {
            if (this.size.height > this.size.width) {
                context.moveTo(4 * Arcadia.PIXEL_RATIO, -this.size.height / 2 * Arcadia.PIXEL_RATIO);
                context.lineTo(4 * Arcadia.PIXEL_RATIO, this.size.height / 2 * Arcadia.PIXEL_RATIO);

                context.moveTo(-4 * Arcadia.PIXEL_RATIO, -this.size.height / 2 * Arcadia.PIXEL_RATIO);
                context.lineTo(-4 * Arcadia.PIXEL_RATIO, this.size.height / 2 * Arcadia.PIXEL_RATIO);
            } else {
                context.moveTo(-this.size.width / 2 * Arcadia.PIXEL_RATIO, 4 * Arcadia.PIXEL_RATIO);
                context.lineTo(this.size.width / 2 * Arcadia.PIXEL_RATIO, 4 * Arcadia.PIXEL_RATIO);

                context.moveTo(-this.size.width / 2 * Arcadia.PIXEL_RATIO, -4 * Arcadia.PIXEL_RATIO);
                context.lineTo(this.size.width / 2 * Arcadia.PIXEL_RATIO, -4 * Arcadia.PIXEL_RATIO);
            }
        }
    };
};

Bridge.prototype = new Arcadia.Shape();

Bridge.prototype.increment = function () {
    if (this.count < 2) {
        this.count += 1;
        this.dirty = true;
    }
};

Bridge.prototype.reset = function () {
    this.count = 1;
};
