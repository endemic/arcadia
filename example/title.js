/*jslint sloppy: true, plusplus: true */
/*globals Arcadia, Player, PlayerBullet, Enemy, Game */

var Title = function () {
    Arcadia.Scene.apply(this, arguments);
    this.clearColor = 'rgba(0, 0, 0, 0.10)';

    // var title = new Arcadia.Label(Arcadia.WIDTH / 2, Arcadia.HEIGHT / 4, "ARMADA");
    // title.font = '40px monospace';
    // title.color = 'rgba(255, 255, 255, 0.8)';
    // title.shadow.x = 0;
    // title.shadow.y = 0;
    // title.shadow.blur = 10;
    // title.shadow.color = 'rgba(255, 255, 255, 0.5)';
    // this.children.add(title);

    // this.fps = new Arcadia.Label(50, 10, Arcadia.fps);
    // this.fps.font = '20px monospace';
    // this.fps.color = 'rgba(255, 255, 255, 0.8)';
    // this.fps.shadow.x = 0;
    // this.fps.shadow.y = 0;
    // this.fps.shadow.blur = 10;
    // this.fps.shadow.color = 'rgba(255, 255, 255, 0.5)';
    // this.children.add(this.fps);

    console.log("last one");
    this.children.add(new Arcadia.Shape({ position: { x: Arcadia.WIDTH / 2, y: Arcadia.HEIGHT / 2 }, vertices: 3, size: 100 }));

    // this.flash = new Arcadia.Shape(Arcadia.WIDTH / 2, Arcadia.HEIGHT / 2, 4, Arcadia.HEIGHT);
    // this.flash.solid = true;
    // this.flash.generateCache();
    // this.children.add(this.flash);
    // this.children.deactivate(this.flash);

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
    // this.children.add(this.button);

    // Add a starfield background
    // this.stars = new Arcadia.Pool();
    // this.stars.factory = function () {
    //     var star = new Arcadia.Shape(Math.random() * Arcadia.WIDTH, Math.random() * Arcadia.HEIGHT, 0, Math.random() * 4 + 1);
    //     star.solid = true;
    //     star.velocity.y = 60 / star.size;
    //     star.generateCache();
    //     star.update = function (delta) {
    //         Arcadia.Shape.prototype.update.call(this, delta);   // "super"

    //         // Reset star position if it goes off the bottom of the screen
    //         if (this.position.y > Arcadia.HEIGHT) {
    //             this.position.y = 0;
    //         }
    //     };

    //     return star;
    // };

    // this.children.add(this.stars);

    // // Create 50 star objects
    // while (this.stars.length < 50) {
    //     this.stars.activate();
    // }
};

Title.prototype = new Arcadia.Scene();

Title.prototype.update = function (delta) {
    Arcadia.Scene.prototype.update.call(this, delta);
    // this.fps.text = "FPS: " + parseInt(Arcadia.fps, 10);

    if (Arcadia.garbageCollected) {
        // this.children.activate(this.flash);
    } else {
        // this.children.deactivate(this.flash);
    }
};
