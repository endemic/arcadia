Pool = require './pool.coffee'

class GameObject
  constructor: (x = 0, y = 0) ->
    @position = { x: x, y: y }
    @children = new Pool()
    @fixed = false     # static positioning for UI elements
    @scale = 1
    @rotation = 0
    @color = 'rgba(255, 255, 255, 1)'
    @shadow =
      x: 0
      y: 0
      blur: 0
      color: 'rgba(255, 255, 255, 1)'
    @tmp = 0

  ###
  @description Draw child objects
  @param {CanvasRenderingContext2D} context
  ###
  draw: (context, offsetX = 0, offsetY = 0) ->
    @children.draw context, offsetX, offsetY

  ###
  @description Update child objects
  @param {Number} delta Time since last update (in seconds)
  ###
  update: (delta) ->
    @children.update delta

  ###
  @description Add an object to the draw/update loop
  @param {Shape} object
  ###
  add: (object) ->
    @children.add object
    console.log @children.length
    object.parent = this

  ###
  @description Permanently remove an object from the draw/update loop
  @param {Shape} object
  ###
  remove: (objectOrIndex) ->
    @children.remove objectOrIndex

  ###
  @description Passthrough to @children Pool
  @param {Number|Object} index Object/index to activate
  ###
  activate: (index) ->
    @children.activate index

  ###
  @description Passthrough to @children Pool
  ###
  deactivate: (index) ->
    @children.deactivate index

module.exports = GameObject
