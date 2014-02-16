# TODO

* [ ] More JSDoc comments
* [X] Re-write some Pool methods to use fewer variables (use ivar for iterators)
* [ ] Add another data structure which is basically a static array that keeps track of 
	  its' size (pointer to index of last object), and allocates more memory 
	  (i.e. doubles in size) when necessary. 
* [X] Rename Pool::children to Pool::active
* [ ] Create a new "Particle" object
* [ ] Rename Pool to "RecyclePool" or something
* [ ] Rename Emitter to "Particles" or something
* [ ] Add a "high perf" flag that removes drop shadows (glow) when on mobile
* [ ] Add glow to buttons - get glow to pass through button down to its' child label
* [ ] Update particle emitter to have infinite particles; can turn on/off
* [X] Allow any shape to have children; recurively draw children using the parent's current position
      as an offset (i.e. create "GameObject" class)
* [ ] Allow 'rectangle' shapes
* [ ] Cull drawing of objects outwide viewport
* [ ] Add "camera" object to scenes
* [X] Add "shadow" integer to shapes which controls size (0 == off). Color is inherited.
* [X] Test mouse offset for buttons in Firefox
* [X] Test <canvas> scaling in Firefox
* [X] Write setter/getter for Shape color
* [X] Change <canvas> scaling method to use CSS3 scale() instead of modifying width/height
* [X] Test out implemeting custom label
* [X] Re-lint source
* [X] Concatenate source files, or figure out a better way to organize code (grunt)
* [X] Make Vectr objects' arg order consistent, e.g. (x, y, size, color, shadow)
* [ ] Rename "Arcadia.js"
