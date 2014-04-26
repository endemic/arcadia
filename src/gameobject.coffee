Pool = require './pool.coffee'

class GameObject
  constructor: (x = 0, y = 0) ->
    @position = 
      x: x
      y: y
    @children = new Pool()
    @fixed = false     # static positioning for UI elements
    @scale = 1
    @rotation = 0
    @color = 'rgb(255, 255, 255)'
    @alpha = 1
    @shadow =
      x: null
      y: null
      blur: null
      color: null
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

module.exports = GameObject
