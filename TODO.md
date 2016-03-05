# TODO

Order in which source files should be referenced:
* Pool
* Game
* GameObject
* Scene
* Easie
* Shape
* Emitter
* Label
* Button
* Arcadia (rename to "extensions" or "helpers" or something)

* What the hell, made major changes to which objects get returned in Pool and no tests broke,
  write extra tests which assert the object that is returned/rearranged when activated/deactivated
* [x] Determine cause of slow button presses on iPhone
* [x] Alpha isn't passed down to children
* [x] Make setters for size & vertices
* [x] Get `Sona` embedded
* [x] Allow buttons to be disabled
* [x] Allow access to `Arcadia.points` instead of `Arcadia.instance.points`
* [x] RGBA colors don't work for shadows
* [x] Button "onPointEnd" event listener not getting touch coords on mobile
* [x] Make getters/setters for size & vertices
* [x] Give objects a width and height
* [x] Re-use same <canvas> for each scene
* [x] Handle Hi-DPI screens - 2x backing store
* [x] Add "Tween" class to GameObjects
* [x] Refactor offset/child drawing? (perhaps a recursive strategy)
* [x] Children don't inherit scale/rotation of their parents
* [x] Move `Arcadia.getPoints` to the `Game` object
* [x] Setting scene camera to point to (0, 0) breaks mouse/touch interaction,
	  because object coordinates no longer line up w/ pointer coords. Need
	  to offset clicks/touches by the position of the current camera.
* [ ] Change `tween` object to use a Pool
* [ ] Inset borders so they don't make shapes actually larger
* [ ] Maybe change Scene's `color` prop to `clearColor`
* [x] Maybe make an `Arcadia.random(min,max)` helper method
* [ ] Figure out a way to pause the update loop when tab/window isn't focused
* [ ] Handle making canvas cache large enough for shadow/blur
* [ ] Shadow isn't drawn if shape is transparent
* [ ] Allow strings to be passed for border, font, shadow, etc. instead of objects - use setter methods
* [ ] Ensure correct anchor point for shapes when using large shadows
* [ ] Canvas scaling when pinned to screen in Android is strange
* [ ] Add SAT collision detection
* [ ] Cull drawing of objects outwide viewport
* [ ] Rename Emitter to "Particles" or something
* [ ] Update particle emitter to emit particles infinitely; can turn on/off
* [ ] Add additional effects to particles: rotate, fade, scale, etc.

