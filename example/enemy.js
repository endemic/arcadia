/*jslint sloppy: true, browser: true */
/*globals Arcadia */

var Enemy = function () {
    Arcadia.Shape.apply(this, arguments);

    this.color = 'rgba(255, 0, 0, 1)';
    // this.shadow.x = this.shadow.y = 0;
    // this.shadow.blur = 20;
    // this.shadow.color = this.color;
    this.speed = 40;
    this.size = 20;
    this.vertices = 3;
    this.bulletTimer = 0;
    this.lineWidth = 3;
    this.generateCache();
};

Enemy.prototype = new Arcadia.Shape();