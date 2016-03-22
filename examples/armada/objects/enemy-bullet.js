/*jslint sloppy: true, browser: true */
/*globals Arcadia */

var EnemyBullet = function () {
    Arcadia.Shape.apply(this, arguments);

    this.vertices = 3;
    this.size = {
    	width: 10,
    	height: 10
    };
    this.color = 'rgb(0, 255, 0)';
    this.speed = 75;
    this.lineWidth = 3;
    this.angularVelocity = -1;
};

EnemyBullet.prototype = new Arcadia.Shape();
