Vectr
=====

Minimal &lt;canvas> game framework

## Documentation

A Vectr game is mainly made up of _Scenes_ and _Shapes_. A scene is a discrete view in a game, such as the title, difficulty select, etc. 
A shape is an object to be drawn to the screen, such as the player, enemies, or projectiles. To create a game, subclass the _Scene_ 
object to create your own scenes. Look in the /example directory for ideas.

### Vectr.Game

__Vectr.Game(width, height, SceneClass)__  
Create a new game object with "native" width/height (game will be scaled to fit the 
browser viewport). _SceneClass_ will be the initial scene object.

__Vectr.Game.start()__  
Start the update loop.

__Vectr.Game.stop()__  
Stop the update loop.

__Vectr.changeScene(SceneClass)__  
Static method which instantiates a new active scene.

### Vectr.Scene
__Vectr.Scene.add(object)__  
Adds an object to the scene's draw/update loop.

__Vectr.Scene.remove(object)__  
Removes an object from the scene's draw/update loop.

_More to come&hellip;_