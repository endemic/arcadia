# TODO

* [ ] More JSDoc comments
* [ ] Re-write some Pool methods to use fewer variables (use ivar for iterators)
* [ ] Allow Pool to expand if necessary - i.e. don't splice its' internal arrays, allow them to grow 
	  to contain more objects, but keep pointers to the last object for both "active" and "inactive" arrays
* [ ] Rename Pool::children to Pool::active
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
