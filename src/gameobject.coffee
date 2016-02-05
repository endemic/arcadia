Pool = require './pool.coffee'

class GameObject
  constructor: (args = {}) ->
    @scale = args.scale || 1
    @rotation = args.rotation || 0 # radians
    @alpha = args.alpha || 1
    @enablePointEvents = args.enablePointEvents || false

    # coords = args.position.match(/^(\d+px) (\d+px)$/)
    # if coords && coords.length > 0
    #   @position = { x: coords[1], y: coords[2] }
    # else
    if typeof args.position == 'object'
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
  draw: ->
    @children.draw.apply(@children, arguments)
    
  ###
  @description Update child objects
  @param {Number} delta Time since last update (in seconds)
  ###
  update: (delta) ->
    @children.update(delta)

  ###
  @description Add child object
  @param {Object} object Object to be added
  ###
  add: (object) ->
    @children.add(object)

  ###
  @description Remove child object
  @param {Object} objectOrIndex Object or index of object to be removed
  ###
  remove: (objectOrIndex) ->
    @children.remove(objectOrIndex)

  ###
  @description Activate child object
  @param {Object} objectOrIndex Object or index of object to be activated
  ###
  activate: (objectOrIndex) ->
    @children.activate(objectOrIndex)

  ###
  @description Deactivate child object
  @param {Object} objectOrIndex Object or index of object to be deactivated
  ###
  deactivate: (objectOrIndex) ->
    @children.deactivate(objectOrIndex)

  ###
  @description Event handler for "start" pointer event
  @param {Array} points Array of touch/mouse coordinates
  ###
  onPointStart: (points) ->
    return unless @enablePointEvents
    @children.onPointStart(points)

  ###
  @description Event handler for "move" pointer event
  @param {Array} points Array of touch/mouse coordinates
  ###
  onPointMove: (points) ->
    return unless @enablePointEvents
    @children.onPointMove(points)

  ###
  @description Event handler for "end" pointer event
  @param {Array} points Array of touch/mouse coordinates
  ###
  onPointEnd: (points) ->
    return unless @enablePointEvents
    @children.onPointEnd(points)

module.exports = GameObject
