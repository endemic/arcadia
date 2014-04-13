# Arcadia.js

Minimalist &lt;canvas> game framework, inspired by classic 80s arcade titles.

## Build Requirements

Requires [Node.js](http://nodejs.org/download/). 

`npm install`
`npm install -g browserify`

`browserify --standalone Arcadia -t coffeeify --extension=".coffee" src/arcadia.coffee > dist/arcadia.js`

## Documentation

Class Hierarchy

```
Game
  |
  -> View
  |
  -> View
  |
  -> View
  	   |
  	   -> Canvas
  	        |
  	        -> Shape (or other GameObjects)
```

A Arcadia game is mainly made up of _Views_ and _Shapes_. A scene is an encapsulated
part of a game, such as a title, difficulty select, or actual gameplay. A shape is a game object, such as the player, 
enemies, or projectiles. To create a game, subclass the _View_ object to create your own views. Look in 
the /example directory for ideas.

### Arcadia.Game

__Arcadia.Game(width, height, SceneClass, fitWindow)__  
Create a new game object with "native" width/height (game will be scaled to fit the 
browser viewport if `fitWindow` is true). _SceneClass_ will be the initial scene object.

__Arcadia.Game.start()__  
Start the update loop. Automatically called in constructor.

__Arcadia.Game.stop()__  
Stop the update loop.

__Arcadia.changeScene(SceneClass)__  
Static method which instantiates a new active scene.

### Arcadia.Scene
__Arcadia.Scene.add(object)__  
Adds an object to the scene's draw/update loop.

__Arcadia.Scene.clearColor__  
Color string in `rgba(rr, gg, bb, aa)` format, used to clear the scene before 
every draw step. For a "blur" effect, use an alpha value < 1. 

### Arcadia.Shape 

#### Methods

__Arcadia.Shape(x, y, shape, size)__  
Basic game object. Constructor arguments give initial Cartesian coordinates, 
shape ("triangle", "circle", "square"; used for default drawing/collision), and 
size (in pixels).

#### Properties

__Arcadia.Shape.lineWidth__  
Width of line used to draw the object. Higher == fatter.

__Arcadia.Shape.lineJoin__  
How you want the shape's joins to look. Options: miter, round (default), bevel

__Arcadia.Shape.solid__  
Whether the shape should be filled or not.

## Performance

Reverse `while()` loops are marginally faster (http://jsperf.com/loops).
