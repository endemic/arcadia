Pool = require './pool.coffee'

class GameObject
  constructor: (args = {}) ->
    @fixed = args.fixed       || false     # static positioning for UI elements
    @scale = args.scale       || 1
    @rotation = args.rotation || 0         # In radians
    @alpha = args.alpha       || 1

    # coords = args.position.match(/^(\d+px) (\d+px)$/)
    # if coords && coords.length > 0
    #   @position = { x: coords[1], y: coords[2] }
    # else 
    if typeof args.position == 'object' && args.position.x && args.position.y
      @position = { x: args.position.x, y: args.position.y }
    else
      @position = { x: 0, y: 0 }

    @children = new Pool()

  ###
  @description Overridden in child objects
  ###
  drawCanvasCache: ->
    null

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
  @description Add child object
  @param {Object} object Object to be added
  ###
  add: (object) ->
    @children.add object

  ###
  @description Remove child object
  @param {Object} objectOrIndex Object or index of object to be removed
  ###
  remove: (objectOrIndex) ->
    @children.remove objectOrIndex

  ###
  @description Activate child object
  @param {Object} objectOrIndex Object or index of object to be activated
  ###
  activate: (objectOrIndex) ->
    @children.activate objectOrIndex

  ###
  @description Deactivate child object
  @param {Object} objectOrIndex Object or index of object to be deactivated
  ###
  deactivate: (objectOrIndex) ->
    @children.deactivate objectOrIndex

module.exports = GameObject
