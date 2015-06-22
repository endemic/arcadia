# Arcadia.js

A minimalist &lt;canvas> game framework.

## Overview

A Arcadia game is mainly made up of _Scenes_ and _Shapes_. A scene is an
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
reference the width and height of the scene, which we will set up shortly. After
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
