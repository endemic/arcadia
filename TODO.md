# TODO

* What the hell, made major changes to which objects get returned in Pool and no tests broke,
  write extra tests which assert the object that is returned/rearranged when activated/deactivated
* [x] Determine cause of slow button presses on iPhone
* [ ] Change `tween` object to use a Pool  
* [ ] Alpha isn't passed down to children
* [x] Make setters for size & vertices
* [ ] Inset borders so they don't make shapes actually larger
* [x] Get `Sona` embedded
* [x] Allow buttons to be disabled
* [ ] Maybe change Scene's `color` prop to `clearColor`
* [x] Allow access to `Arcadia.points` instead of `Arcadia.instance.points`
* [ ] Maybe make an `Arcadia.random(min,max)` helper method
* [ ] Figure out a way to pause the update loop when tab/window isn't focused
* [ ] Handle making canvas cache large enough for shadow/blur
* [ ] Shadow isn't drawn if shape is transparent
* [ ] Allow strings to be passed for border, font, shadow, etc. instead of objects - use setter methods
* [ ] Ensure correct anchor point for shapes when using large shadows
* [ ] Inset borders so they don't make shapes actually larger
* [x] RGBA colors don't work for shadows
* [x] Button "onPointEnd" event listener not getting touch coords on mobile
* [ ] Canvas scaling when pinned to screen in Android is strange
* [x] Make getters/setters for size & vertices
* [ ] Rename Emitter to "Particles" or something
* [ ] Update particle emitter to emit particles infinitely; can turn on/off
* [ ] Add additional effects to particles: rotate, fade, scale, etc.
* [x] Give objects a width and height
* [ ] Cull drawing of objects outwide viewport
* [x] Re-use same <canvas> for each scene
* [ ] Handle Hi-DPI screens - 2x backing store
* [ ] Add SAT collision detection
* [ ] Add "Tween" class to GameObjects
* [ ] Global effects - flash, shake, etc.
* [x] Refactor offset/child drawing? (perhaps a recursive strategy)
* [x] Children don't inherit scale/rotation of their parents

# For nonograms
* [x] Get clues actually displayed
* [ ] Fix sound effects firing too quickly  
