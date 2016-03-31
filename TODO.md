# TODO

[ ] Change objects `rotation` to use degrees instead of radians (wtf)
[ ] Change `tween` object to use a Pool
[ ] Maybe change Scene's `color` prop to `clearColor`
[x] Handle making canvas cache large enough for shadow/blur
[ ] Shadow isn't drawn if shape is transparent
[ ] Allow strings to be passed for border, font, shadow, etc. instead of objects - use setter methods
[ ] Ensure correct anchor point for shapes when using large shadows
[ ] Canvas scaling when pinned to screen in Android is strange
[ ] Add SAT collision detection
[ ] Cull drawing of objects outwide viewport
[ ] Rename Emitter to "Particles" or something
[ ] Update particle emitter to emit particles infinitely; can turn on/off
[ ] Add additional effects to particles: rotate, fade, scale, etc.

// TODO: allow these to be set via options arg
/*
particle emitter wishlist:
1. Fade particles over duration
2. scale particles over duration
3. Speed range (minSpeed/maxSpeed)
4. direction range (i.e. over unit circle)

var rotationRange = {begin: 0, end: 360};
var speedRange = {begin: 20, end: 100};
var scaleRange = {begin: 0.8, end: 1.2};

if this.duration === null then "infinite" -- when particle is destroyed, it gets re-created

particles.activate();   // starts
particles.deactivate(); // cancels

allow tweens to be applied to individual particles?
perhaps see how it affects performance...

What features can be simulated by simply having a "reset" method
which preps the particle for deployment?

In my example, I want to dynamically change the angle range which
particles can be emitted at...
*/
