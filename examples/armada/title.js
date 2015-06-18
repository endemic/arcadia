/*jslint sloppy: true, plusplus: true */
/*globals Arcadia, Player, PlayerBullet, Enemy, Game */

var Title = function () {
    Arcadia.Scene.apply(this, arguments);

    // this.color = 'rgba(0, 0, 0, 0.10)';
    this.color = '#000';

    this.label = new Arcadia.Label({
        position: { x: Arcadia.WIDTH / 2, y: Arcadia.HEIGHT / 2 },
        color: '#f0f',
        font: '40px serif',
        text: 'hello world!',
        border: '1px yellow',
        shadow: '0 10px 5px #0ff',
        // angularVelocity: 1
        // debug: true
    });
    this.add(this.label);
    
    this.shape = new Arcadia.Shape({
        position: { x: Arcadia.WIDTH / 2, y: Arcadia.HEIGHT / 2 },
        color: '#f00',
        size: { width: 100, height: 100 },
        angularVelocity: 1,
        border: '2px white'
    });
    this.add(this.shape);

    var title = new Arcadia.Label({
        position: {
            x: Arcadia.WIDTH / 2,
            y: Arcadia.HEIGHT / 4
        },
        color: 'rgba(255, 255, 255, 0.8)',
        font: '70px monospace',
        shadow: '0 0 10px #fff',
        text: "ARMADA"
    });
    this.add(title);

    /*
    ideas for button API
    -> two states, "off" and "on"
    -> Pass in label as its' own arg?
    */

    this.button = new Arcadia.Button({
        position: {
            x: Arcadia.WIDTH / 2,
            y: 50
        },
        border: '1px #fff',
        shadow: '0 0 20px #fff',
        color: 'red',
        padding: 15,
        label: new Arcadia.Label({
            color: '#fff',
            text: 'START',
            font: '20px monospace',
            shadow: '0 0 10px #fff'
        })
    });
    this.button.onUp = function () {
        Arcadia.changeScene(Game);
    };
    this.add(this.button);

    // Add a starfield background
    this.stars = new Arcadia.Pool();

    this.stars.factory = function () {
        var star = new Arcadia.Shape({
            position: {
                x: Math.random() * Arcadia.WIDTH,
                y: Math.random() * Arcadia.HEIGHT
            },
            // vertices: 4,
            size: {
                width: Math.random() * 5 + 5,
                height: Math.random() * 5 + 5
            },
            color: '#fff',
            angularVelocity: 4 * Math.random() * (Math.random() > 0.5 ? 1 : -1)
        });
        star.velocity.y = 200 / star.size.width;
        star.update = function (delta) {
            Arcadia.Shape.prototype.update.call(this, delta);   // "super"

            // Reset star position if it goes off the bottom of the screen
            if (this.position.y > Arcadia.HEIGHT) {
                this.position.y = 0;
            }
        };

        return star;
    };
    this.add(this.stars);

    // Create 50 star objects
    while (this.stars.length < 50) {
        this.stars.activate();
    }
};

Title.prototype = new Arcadia.Scene();

Title.prototype.update = function (delta) {
    Arcadia.Scene.prototype.update.call(this, delta);

    this.label.text = Math.round(Arcadia.FPS)
};

Title.prototype.onPointStart = function (points) {
    this.shape.position.x = points[0].x;
    this.shape.position.y = points[0].y;
}

Title.prototype.onPointMove = function (points) {
    this.shape.position.x = points[0].x;
    this.shape.position.y = points[0].y;
};
