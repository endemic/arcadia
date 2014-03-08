GameObject = require './gameobject.coffee'

class Scene extends GameObject
  constructor: ->
    super
    # implement a camera view/drawing offset
    @camera =
      target: null
      viewport:
        width: Arcadia.WIDTH
        height: Arcadia.HEIGHT
      bounds:
        top: 0
        bottom: Arcadia.HEIGHT
        left: 0
        right: Arcadia.WIDTH
      position:
        x: Arcadia.WIDTH / 2
        y: Arcadia.HEIGHT / 2

  ###
   * @description Update the camera if necessary
   * @param {Number} delta
  ###
  update: (delta) ->
    super delta

    if @camera.target != null
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
      if typeof @clearColor == "string"
        # Clear w/ clear color
        context.save()
        context.fillStyle = @clearColor
        context.fillRect(0, 0, context.canvas.width, context.canvas.height)
        context.restore()
      else
        # Just erase
        context.clearRect(0, 0, context.canvas.width, context.canvas.height)

      # Draw child objects
      super context, @camera.viewport.width / 2 - @camera.position.x, @camera.viewport.height / 2 - @camera.position.y

  ###
   * Getter/setter for camera target
  ###
  @property 'target',
      get: ->
        return @camera.target
      set: (shape) ->
        return if not shape?.position

        @camera.target = shape
        @camera.position.x = shape.position.x
        @camera.position.y = shape.position.y

module.exports = Scene
