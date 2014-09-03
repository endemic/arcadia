# TODO

* What the hell, made major changes to which objects get returned in Pool and no tests broke,
  write extra tests which assert the object that is returned/rearranged when activated/deactivated
* [ ] Make setters for size & vertices
* [ ] Handle making canvas cache large enough for shadow/blur
* [ ] Allow strings to be passed for border, font, shadow, etc. instead of objects - use setter methods
* [ ] Ensure correct anchor point for shapes when using large shadows
* [ ] Rename Emitter to "Particles" or something
* [ ] Update particle emitter to emit particles infinitely; can turn on/off
* [ ] Add additional effects to particles: rotate, fade, scale, etc.
* [ ] Allow 'rectangle' shapes
* [ ] Cull drawing of objects outwide viewport
* [ ] Give views their own <canvas> DOM element
* [ ] 3D CSS transitions when changing views
* [ ] Handle Hi-DPI screens - 2x backing store
* [ ] Add SAT collision detection
* [ ] Add "Tween" class to GameObjects
* [ ] Global effects - flash, shake, etc.
* [ ] Refactor offset/child drawing? (perhaps a recursive strategy)
