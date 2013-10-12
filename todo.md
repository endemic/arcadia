# TODO

* [ ] More JSDoc comments
* [ ] Re-write some Pool methods to use fewer variables (use ivar for iterators)
* [ ] Add a "high perf" flag that removes drop shadows when on mobile
* [ ] Add shadows to buttons/labels
* [ ] Add "shadow" integer to shapes which controls size (0 == off). Color is inherited. 
* [ ] Allow any shape to have children; recurively draw children using the parent's current position
      as an offset
* [ ] Allow 'rectangle' shapes
* [ ] Test mouse offset for buttons in Firefox
* [ ] Test <canvas> scaling in Firefox
* [ ] Write setter/getter for Shape color
* [ ] Cull drawing of objects outwide viewport
* [X] Change <canvas> scaling method to use CSS3 scale() instead of modifying width/height
* [X] Test out implemeting custom label
* [X] Re-lint source
* [X] Concatenate source files, or figure out a better way to organize code (grunt)
* [X] Make Vectr objects' arg order consistent, e.g. (x, y, size, color, shadow)
