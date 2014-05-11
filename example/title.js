/*jslint sloppy: true, plusplus: true */
/*globals Arcadia, Player, PlayerBullet, Enemy, Game */

var Title = function () {
    Arcadia.Scene.apply(this, arguments);
    this.color = 'rgba(0, 0, 0, 0.10)';

    var title = new Arcadia.Label({
        position: {
            x: Arcadia.WIDTH / 2,
            y: Arcadia.HEIGHT / 4
        },
        font: '80px sans-serif',
        shadow: '-10px 0 20px #fff',
        text: "Arcadia",
        debug: true
    });
    title.position.x = title.width / 2;
    title.position.y = title.height / 2;
    this.add(title);

    this.shape = new Arcadia.Shape({
        position: {
            x: Arcadia.WIDTH / 2,
            y: Arcadia.HEIGHT / 2
        },
        vertices: 5,
        size: 100,
        shadow: '10px 0px 20px green'
    });
    this.shape.color = 'rgb(255, 0, 0)';
    this.shape.border = '5px white';
    this.shape.debug = true;
    this.add(this.shape);

    // this.button = new Arcadia.Button(Arcadia.WIDTH / 2, Arcadia.HEIGHT / 2, "START"); // x, y, text
    // this.button.font = '20px monospace';
    // this.button.solid = false;
    // this.button.padding = 20;
    // this.button.shadow.x = 0;
    // this.button.shadow.y = 0;
    // this.button.shadow.blur = 10;
    // this.button.shadow.color = 'rgba(255, 255, 255, 0.5)';
    // this.button.onUp = function () {
    //     Arcadia.changeScene(Game);
    // };
    // this.add(this.button);

    // Add a starfield background
    this.stars = new Arcadia.Pool();
    this.stars.factory = function () {
        var star = new Arcadia.Shape({
            position: {
                x: Math.random() * Arcadia.WIDTH,
                y: Math.random() * Arcadia.HEIGHT
            },
            vertices: 4,
            size: Math.random() * 10 + 5,
            color: '#fff',
            angularVelocity: 4 * Math.random() * (Math.random() > 0.5 ? 1 : -1)
        });
        star.velocity.y = 200 / star.size;
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
};
