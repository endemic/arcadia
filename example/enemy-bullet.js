/*jslint sloppy: true, browser: true */
/*globals Vectr */

var EnemyBullet = function () {
    Vectr.Shape.apply(this, arguments);

    this.shape = 'circle';
    this.size = 4;
    this._color = {
        'red': 0,
        'blue': 0,
        'green': 255,
        'alpha': 1
    };
    this.speed = 75;
    this.active = false;
    this.lineWidth = 3;
};

EnemyBullet.prototype = new Vectr.Shape();