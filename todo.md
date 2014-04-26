# TODO

* Pool keeps returning the same object
* What the hell, made major changes to which objects get returned in Pool and no tests broke,
  write extra tests which assert the object that is returned/rearranged when activated/deactivated
* Work on emitter
* [ ] Rename Emitter to "Particles" or something
* [ ] Update particle emitter to emit particles infinitely; can turn on/off
* [ ] Review CoffeeScript source to ensure no random object/array creation
* [ ] Refactor shadows to just set/get standard CSS string, not be limited to a "glow" effect
* [ ] Add additional effects to particles: rotate, fade, scale, etc.
* [ ] Allow 'rectangle' shapes
* [ ] Cull drawing of objects outwide viewport
* [ ] Give views their own <canvas> DOM element
* [ ] 3D CSS transitions when changing views
* [ ] Handle Hi-DPI screens - 2x backing store
* [ ] Add SAT collision detection
* [ ] Add "Tween" class to GameObjects
* [ ] Remove separate event handler attach/detatch for buttons
* [ ] Global effects - flash, shake, etc.
* [ ] Refactor offset/child drawing? (perhaps a recursive strategy)
