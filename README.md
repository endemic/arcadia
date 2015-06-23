# Arcadia.js

A minimalist &lt;canvas> game framework.

## Overview

An Arcadia game is mainly made up of _Scenes_ and _Shapes_. A scene is an
encapsulated part of a game, such as a title, difficulty select, or actual
gameplay. A shape is a game object, such as the player, enemies, or
projectiles. To create a game, subclass the _Scene_ object to create your own
views.

## Tutorial

For a basic example game, we'll walk through creating an `Asteroids` clone
(don't sue me!). The full source is in `examples/asteroids`. If you're
impatient, [take a look at the finished game](http://ganbarugames.com/asteroids/).

The first thing we'll do is create a title scene that displays the name of the
game, with a button to start playing. In Javascript, we do this by creating a
new object and setting its prototype to be `Arcadia.Scene`. Copy the following
code, and save it in a file named `title-scene.js`.

```
var AsteroidsTitleScene = function () {
    Arcadia.Scene.apply(this, arguments);

    // Background color
    this.color = '#000';
};

AsteroidsTitleScene.prototype = new Arcadia.Scene();
```

If you were to load up this scene as-is, it would simply display a black box.
That's pretty boring, so let's add some objects to the scene. The first thing
we'll add is the game title. In order to do that, we use an `Arcadia.Label`
object. Add the following right after setting the background color.

```
// Basic text label
var title = new Arcadia.Label({
    position: {
        x: Arcadia.WIDTH / 2,
        y: Arcadia.HEIGHT / 4
    },
    color: '#fff',
    font: '70px monospace',
    shadow: '0 0 20px #fff',
    text: "'Roids"
});
this.add(title);
```

Pretty self-explanatory, right? We're using the `new` keyword to create a new
instance of `Arcadia.Label`, and passing in a single object as an argument.
The object's keys are all what you'd expect a label to require. One thing you
might notice is the `Arcadia.WIDTH` and `Arcadia.HEIGHT` variables. Those
reference the width and height of the scene, which we will set up momentarily. After
instantiating the new label, we `add` it to the scene's list of child objects
that it displays. Now we'll do basically the same thing to create a button which
will start the game.

```
// "Start game" button
var button = new Arcadia.Button({
    position: {
        x: Arcadia.WIDTH / 2,
        y: Arcadia.HEIGHT - 100
    },
    color: '#000',
    border: '2px #fff',
    padding: 15,
    text: 'START',
    font: '20px monospace',
    action: function () {
        Arcadia.changeScene(AsteroidsGameScene);
    }
});
this.add(button);
```

The button takes similar arguments as the label. We set the position, the color,
and the displayed text. A few differences: buttons can be made bigger by giving
them a larger `padding` value. Also, we need to define what happens when a
player clicks or taps on the button. This is done by passing the `action`
key, which references a function. In this case, all we do when this button is
activated is change to a new gameplay scene (which we will create shortly).

This title scene is complete enough to try out. In order to load it up in a
browser, we need an HTML page that embeds the code.

```
<html>
<head>
	<title>Asteroids</title>

	<!-- Engine -->
	<script src="arcadia.js"></script>

	<!-- Scene -->
	<script src="title-scene.js"></script>

	<script type="text/javascript">
		/* Instantiate game object */
		window.onload = function () {
			var game = new Arcadia.Game({
				width: 640,
				height: 480,
				scene: AsteroidsTitleScene,
				fitWindow: true
			});
		};
	</script>
</head>
<body></body>
</html>
```

This'll be pretty familiar to anyone who's done Javascript development before.
Simply reference your code with `<script>` tags, then write a `window.onload`
handler to start the game. `Arcadia.Game` is the main game object; you can see
that here is where we set the width/height of the game, as well as specify which
scene to initially load. The last option, `fitWindow`, tells the game to scale
to fit the browser window (while keeping its aspect ratio, of course). Load up
that HTML file in your browser, and you should be greeted with a black screen,
with the game title and button appearing. Off to a great start! Next we'll work
on the actual game.

Create a new Javascript file named `game-scene.js`, and add a `<script>` tag
referencing it in the HTML file you just created. Now let's start populating the
game with some content. First off we need to set up the game scene with
`Arcadia.Scene` as its prototype.

```
var AsteroidsGameScene = function () {
    Arcadia.Scene.apply(this, arguments);

    this.color = 'rgba(0, 0, 0, 0.25)';
};

AsteroidsGameScene.prototype = new Arcadia.Scene();
```

I'm making the clear color slightly translucent, so that we can get a cool blur
effect going on. Try playing with this value later to get an effect that you
like.

The first object we'll add to this scene is the player ship. After setting the
background color in the constructor, add the following:

```
this.ship = new Ship();
this.add(this.ship);
```

Of course, `Ship` isn't some magical built-in object in Javascript -- we need to
create it. Make a new source file, `ship.js` (remember to add a `<script>` tag
referencing it in your HTML), and start it with some code which will create a
new `Arcadia.Shape` object.

```
var Ship = function () {
    Arcadia.Shape.apply(this, arguments);

    // Standard `Shape` properties
    this.speed = 5;
    this.size = { width: 20, height: 25 };
    this.border = '2px #fff';
    this.color = null;
    this.shadow = '0 0 10px #fff';

    // Custom properties
    this.thrust = 0;
    this.MAX_VELOCITY = 0.50;
};

Ship.prototype = new Arcadia.Shape();
```

All these properties are kinda what you would expect a spaceship to have. Don't
worry about the custom properties for now; we'll get back to them later when
we start writing code to actually move the ship around.

Arcadia is purposefully limited to drawing simple polygons. The built-in shapes
include triangles, circles, and squares. However, if you want to do something
a little different, you can define a custom drawing function for a `Shape`
object. Add the following right after setting `MAX_VELOCITY` in the
ship constructor.

```
this.path = function (context) {
    context.moveTo(0, -this.size.height / 2);
    context.lineTo(this.size.width / 2, this.size.height);
    context.moveTo(0, -this.size.height / 2);
    context.lineTo(-this.size.width / 2, this.size.height);
    context.moveTo(-this.size.width / 3, this.size.height / 2);
    context.lineTo(this.size.width / 3, this.size.height / 2);
};
```

If a shape has a `path` function defined, the path will be used to draw the
shape, instead of the built-in drawing code. The `path` function is passed a 2D
canvas context, and you can use the
[canvas drawing API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Basic_usage)
to draw whatever you want. In this case, we're drawing on a square that has
coordinates (0, 0) in the center, and is `size.width` wide and `size.height`
tall. The path we just defined draws an "A" shape, similar to the classic
Asteroids ship.

I also want to add a little "jet flame" effect, that appears whenever the ship
is moving. To do that we'll create another shape (a triangle this time) and
add it to the ship's child objects.

```
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
```

This new triangle is immediately deactivated after it is created. Only "active"
objects get drawn to the screen, so deactivating an object keeps it in memory,
but hidden.

Reload the HTML file, and when you click into the game scene, you should see the
ship in the center of the screen. Progress! Next, let's get the ship moving.
Each Arcadia object has an `update` method that is called each time the screen
is drawn. The built-in `update` method for each object just updates the object's
position, based on its velocity, so in many cases you'd want to have more
complex logic. 

```
Ship.prototype.update = function (delta) {
    // Rotate the ship based on `angularVelocity`
    this.rotation += this.angularVelocity * delta;

    // Set acceleration based on the angle the ship is pointing
    this.acceleration.x = Math.cos(this.rotation - Math.PI / 2) * this.thrust * delta;
    this.acceleration.y = Math.sin(this.rotation - Math.PI / 2) * this.thrust * delta;

    // Transfer acceleration to velocity
    this.velocity.x += this.acceleration.x;
    this.velocity.y += this.acceleration.y;

    var velocityVector = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);

    // Set a limit on how fast the ship can go
    if (velocityVector > this.MAX_VELOCITY) {
        this.velocity.x += (this.velocity.x / velocityVector) * (this.MAX_VELOCITY - velocityVector);
        this.velocity.y += (this.velocity.y / velocityVector) * (this.MAX_VELOCITY - velocityVector);
    }

    // Finally, update the ship's position
    this.position.x += this.velocity.x * this.speed;
    this.position.y += this.velocity.y * this.speed;
};
```

If you remember high school math, this code to update the ship's position
shouldn't be too unfamiliar.

#### To be continued...
