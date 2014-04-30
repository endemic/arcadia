/*jslint sloppy: true, browser: true */
/*globals Arcadia: false */

var Player = function () {
    Arcadia.Shape.apply(this, arguments);

    this.speed = 100;
    this.vertices = 3;
    this.size = 20;
    this.lineWidth = 3;
    this.rotation = 270 * Math.PI / 180;
    // this.shadow.x = this.shadow.y = 0;
    // this.shadow.blur = 20;
    // this.shadow.color = this.color;
    this.generateCache();
};

Player.prototype = new Arcadia.Shape();

Player.prototype.update = function (delta) {
    Arcadia.Shape.prototype.update.call(this, delta);

    if (this.position.x + this.size / 2 > Arcadia.WIDTH) {
        this.position.x = Arcadia.WIDTH - this.size / 2;
    }

    if (this.position.x - this.size / 2 < 0) {
        this.position.x = this.size / 2;
    }

    if (this.position.y + this.size / 2 > Arcadia.HEIGHT) {
        this.position.y = Arcadia.HEIGHT - this.size / 2;
    }

    if (this.position.y - this.size / 2 < 0) {
        this.position.y = this.size / 2;
    }
};
