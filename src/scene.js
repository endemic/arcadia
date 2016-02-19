GameObject = require './gameobject.coffee'

class Scene extends GameObject
  constructor: (args = {}) ->
    super(args)

    @size = args.size
    @enablePointEvents = true

    # implement a camera view/drawing offset
    @camera =
      target: null
      viewport:
        width: @size.width
        height: @size.height
      bounds:
        top: -@size.height / 2
        bottom: @size.height / 2
        left: -@size.width / 2
        right: @size.width / 2
      position:
        x: 0
        y: 0

  ###
   * @description Update the camera if necessary
   * @param {Number} delta
  ###
  update: (delta) ->
    super delta

    return unless @camera.target

    # Follow the target, keeping it in the center of the screen...
    @camera.position.x = @camera.target.position.x
    @camera.position.y = @camera.target.position.y

    # Unless it is too close to boundaries, in which case keep the cam steady
    if @camera.position.x < @camera.bounds.left + @camera.viewport.width / 2
      @camera.position.x = @camera.bounds.left + @camera.viewport.width / 2
    else if @camera.position.x > @camera.bounds.right - @camera.viewport.width / 2
      @camera.position.x = @camera.bounds.right - @camera.viewport.width / 2

    if @camera.position.y < @camera.bounds.top + @camera.viewport.height / 2
      @camera.position.y = @camera.bounds.top + @camera.viewport.height / 2
    else if @camera.position.y > @camera.bounds.bottom - @camera.viewport.height / 2
      @camera.position.y = @camera.bounds.bottom - @camera.viewport.height / 2

  ###
   * @description Clear context, then re-draw all child objects
   * @param {CanvasRenderingContext2D} context
  ###
  draw: (context) ->
    if @color
      context.fillStyle = @color
      context.fillRect(0, 0, context.canvas.width, context.canvas.height)
    else
      context.clearRect(0, 0, context.canvas.width, context.canvas.height)

    # Draw child objects
    super(context, @camera.viewport.width / 2 - @camera.position.x, @camera.viewport.height / 2 - @camera.position.y)

  ###
  @description Getter/setter for camera target
  ###
  @property 'target',
    get: ->
      return @camera.target
    set: (shape) ->
      if !shape || !shape.position
        throw new Error('Scene camera target requires a `position` property.')
      @camera.target = shape

module.exports = Scene
