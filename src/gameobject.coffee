Pool = require './pool.coffee'

class GameObject
  constructor: (args = {}) ->
    @position = args.position || { x: 0, y: 0 }
    @fixed = args.fixed || false     # static positioning for UI elements
    @scale = args.scale ||  1
    @rotation = args.rotation || 0
    @color = args.color || 'rgb(255, 255, 255)'
    @alpha = args.alpha || 1
    @shadow =
      x: null
      y: null
      blur: null
      color: null

    @children = new Pool()
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

  add: (object) ->
    @children.add object

  remove: (objectOrIndex) ->
    @children.remove objectOrIndex

  activate: (objectOrIndex) ->
    @children.activate objectOrIndex

  deactivate: (objectOrIndex) ->
    @children.deactivate objectOrIndex

module.exports = GameObject
