# TODO

[ ] Add another data structure which is basically a static array that keeps track of 
	  its' size (pointer to index of last object), and allocates more memory 
	  (i.e. doubles in size) when necessary. 
[ ] Create a new "Particle" object
[ ] Rename Pool to "RecyclePool" or something
[ ] Rename Emitter to "Particles" or something
[ ] Add glow to buttons - get glow to pass through button down to its' child label
[ ] Update particle emitter to emit particles infinitely; can turn on/off
[X] Allow any shape to have children; recurively draw children using the parent's current position
      as an offset (i.e. create "GameObject" class)
[ ] Allow 'rectangle' shapes
[ ] Cull drawing of objects outwide viewport
[ ] Rename "Arcadia.js"
[ ] Rename "Scene" class to "Screen"
[ ] Give GameObjects a BitmapData property which gets copied to the main canvas
[ ] Give Screens their own <canvas> - this would allow for 3D CSS transforms for transitions
[ ] Handle Hi-DPI screens