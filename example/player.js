/*jslint sloppy: true, browser: true */
/*globals Vectr: false */

var Player = function () {
    Vectr.Shape.apply(this, arguments);

    this.speed = 100;
    this.shape = 'triangle';
    this.size = 20;
    this.lineWidth = 3;
    this.rotation = 270 * Math.PI / 180;
    this.glow = 20;
};

Player.prototype = new Vectr.Shape();

Player.prototype.update = function (delta) {
    Vectr.Shape.prototype.update.call(this, delta);

    if (this.position.x + this.size / 2 > Vectr.WIDTH) {
        this.position.x = Vectr.WIDTH - this.size / 2;
    }

    if (this.position.x - this.size / 2 < 0) {
        this.position.x = this.size / 2;
    }

    if (this.position.y + this.size / 2 > Vectr.HEIGHT) {
        this.position.y = Vectr.HEIGHT - this.size / 2;
    }

    if (this.position.y - this.size / 2 < 0) {
        this.position.y = this.size / 2;
    }
};
