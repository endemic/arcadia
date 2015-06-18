/*jslint sloppy: true, browser: true */
/*globals Arcadia: false */

/**
 * @constructor Set up shape, color, etc.
 */
var Ship = function () {
    Arcadia.Shape.apply(this, arguments);

    this.speed = 5;
    this.thrust = 0;
    this.vertices = 3;
    this.size = { width: 20, height: 20 };
    this.color = '#fff';
    this.shadow = '0 0 10px ' + this.color;
    this.MAX_VELOCITY = 0.50;
};

Ship.prototype = new Arcadia.Shape();

/**
 * Automatically have ship wrap around the screen
 */
Ship.prototype.update = function (delta) {
    this.rotation += this.angularVelocity * delta;

    this.acceleration.x = Math.cos(this.rotation - Math.PI / 2) * this.thrust * delta;
    this.acceleration.y = Math.sin(this.rotation - Math.PI / 2) * this.thrust * delta;

    this.velocity.x += this.acceleration.x;
    this.velocity.y += this.acceleration.y;

    var velocityVector = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);

    if (velocityVector > this.MAX_VELOCITY) {
        this.velocity.x += (this.velocity.x / velocityVector) * (this.MAX_VELOCITY - velocityVector);
        this.velocity.y += (this.velocity.y / velocityVector) * (this.MAX_VELOCITY - velocityVector);
    }

    this.position.x += this.velocity.x * this.speed;
    this.position.y += this.velocity.y * this.speed;

    if (this.position.x + this.size.width / 2 > Arcadia.WIDTH) {
        this.position.x = this.size.width / 2;
    }

    if (this.position.x - this.size.width / 2 < 0) {
        this.position.x = Arcadia.WIDTH - this.size.width / 2;
    }

    if (this.position.y + this.size.height / 2 > Arcadia.HEIGHT) {
        this.position.y = this.size.height / 2;
    }

    if (this.position.y - this.size.height / 2 < 0) {
        this.position.y = Arcadia.HEIGHT - this.size.height / 2;
    }
};
