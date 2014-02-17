/*jslint sloppy: true, browser: true */
/*globals Arcadia */

var EnemyBullet = function () {
    Arcadia.Shape.apply(this, arguments);

    this.shape = 'circle';
    this.size = 4;
    this.colors = {
        'red': 0,
        'blue': 0,
        'green': 255,
        'alpha': 1
    };
    this.speed = 75;
    this.active = false;
    this.lineWidth = 3;
};

EnemyBullet.prototype = new Arcadia.Shape();