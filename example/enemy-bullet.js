/*jslint sloppy: true, browser: true */
/*globals Arcadia */

var EnemyBullet = function () {
    Arcadia.Shape.apply(this, arguments);

    this.vertices = 0;
    this.size = 4;
    this.color = 'rgb(0, 255, 0)';
    this.speed = 75;
    this.lineWidth = 3;
    this.generateCache();
};

EnemyBullet.prototype = new Arcadia.Shape();