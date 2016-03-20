# 2.0.1

* Stop rAF in the 'pause' event listener; restart rAF in the `resume` event listener
* Fix drawing of lines & triangles on HiDPI screens
* Use boolean variable to toggle "mousemove" events

# 2.0.0

* GameObjects have an `enablePointEvents` boolean, which allows them to act on
  mouse/touch events
* Buttons no longer create/destroy their own event listeners; they use
  `enablePointEvents` to act on mouse/touch input
* Pool lists are now sorted by a `zIndex` property
* Added `overflow: scroll` to label sizing element
* Added `Arcadia.distance` method
* Removed `fixed` property from `GameObject`
* Set default camera position to be (0, 0) instead of Scene.size.width / 2, Scene.size.height / 2
* Click/touch coordinates now offset by camera position

# 1.0.0

* First release
