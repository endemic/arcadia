GameObject = require './gameobject.coffee'

class Scene extends GameObject
  constructor: ->
    super

    @canvas = document.createElement 'canvas'
    @context = @canvas.getContext '2d'

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
  draw: ->
    if @color
      @context.fillStyle = @color
      @context.fillRect(0, 0, @canvas.width, @canvas.height)
    else
      @context.clearRect(0, 0, @canvas.width, @canvas.height)

    # Draw child objects
    super @context, @camera.viewport.width / 2 - @camera.position.x, @camera.viewport.height / 2 - @camera.position.y

  ###
  @description Move scene's <canvas> into place
  ###
  transition: ->
    @canvas.setAttribute 'width', Arcadia.WIDTH
    @canvas.setAttribute 'height', Arcadia.HEIGHT
    @resize()
    Arcadia.instance.element.appendChild @canvas
    # @canvas.style['top'] = '-100%'
    # @canvas.style['-webkit-transition'] = '-webkit-transform 0.5s ease-in-out'
    # @canvas.style['-webkit-transform'] = 'translateY(100%)'
    # @canvas.style['transition'] = 'transform 0.5s ease-in-out'
    # @canvas.style['transform'] = 'translateY(100%)'

  ###
  TODO: Handle removing event listeners, etc.?
  ###
  destroy: ->
    Arcadia.instance.element.removeChild @canvas

  ###
  @description Resize scene's <canvas>
  ###
  resize: ->
    @canvas.setAttribute "style", "position: absolute; left: 0; top: 0; -webkit-transform: scale(#{Arcadia.SCALE}); -webkit-transform-origin: 0 0; transform: scale(#{Arcadia.SCALE}); transform-origin: 0 0;"

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
