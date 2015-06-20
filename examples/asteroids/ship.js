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
    this.size = { width: 20, height: 25 };
    this.border = '2px #fff';
    this.color = null;
    this.shadow = '0 0 10px #fff';
    this.MAX_VELOCITY = 0.50;

    this.path = function (context) {
        context.moveTo(0, -this.size.height / 2);
        context.lineTo(this.size.width / 2, this.size.height);
        context.moveTo(0, -this.size.height / 2);
        context.lineTo(-this.size.width / 2, this.size.height);
        context.moveTo(-this.size.width / 3, this.size.height / 2);
        context.lineTo(this.size.width / 3, this.size.height / 2);
    };

    this.jet = new Arcadia.Shape({
        vertices: 3,
        border: '1px #fff',
        rotation: Math.PI,
        size: { width: 8, height: 8 },
        position: { x: 0, y: 22 }
    });
    this.jet.color = null;
    this.add(this.jet);
    this.deactivate(this.jet);
};

Ship.prototype = new Arcadia.Shape();

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

    // Automatically have ship wrap around the screen
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

Ship.prototype.move = function () {
    this.thrust = 1;
    this.activate(this.jet);
};

Ship.prototype.stop = function () {
    this.thrust = 0;
    this.deactivate(this.jet);
};
