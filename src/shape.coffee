GameObject = require './gameobject.coffee'

class Shape extends GameObject
  ###
   * @description Shape constructor
   * @param {Number} x Position of shape on x-axis
   * @param {Number} y Position of shape on y-axis
   * @param {String} shape String representing what to draw
   * @param {Number} size Size of shape in pixels
  ###
  constructor: (args = {}) ->
    super args

    @vertices = args.vertices || 4
    @size = args.size || 10
    @width = @height = @size
    @anchor = { x: @width / 2, y: @height / 2 }
    @speed = args.speed || 1
    @velocity = args.velocity || { x: 0, y: 0 }
    @angularVelocity = args.angularVelocity || 0

    @_path = args.path || null # custom draw function
    @debug = args.debug || false

    @canvas = document.createElement 'canvas' # Internal shape cache
    @drawCanvasCache()

  ###
  @description Getter/setter for color
  ###
  @property 'path',
    get: -> return @_path
    set: (path) ->
      @_path = path
      @drawCanvasCache()

  ###
  @description Draw object onto internal <canvas> cache
  ###
  drawCanvasCache: ->
    return if @canvas is undefined

    # TODO: resize to handle shadow
    @canvas.setAttribute 'width', @size + @_border.width + Math.abs(@_shadow.x) + @_shadow.blur
    @canvas.setAttribute 'height', @size + @_border.width + Math.abs(@_shadow.y) + @_shadow.blur

    context = @canvas.getContext '2d'
    context.lineJoin = 'round'

    # Debug
    if @debug
      context.lineWidth = 1
      context.strokeStyle = '#f00'
      context.strokeRect 0, 0, @canvas.width, @canvas.height

    # Allow sprite objects to have custom draw functions
    if @_path?
        @_path(context)
    else
      context.beginPath()
      x = @width / 2 + @_border.width / 2
      y = @height / 2 + @_border.width / 2
      # Only move further right/down if shadow is negative
      x -= @_shadow.x if @_shadow.x < 0
      y -= @_shadow.y if @_shadow.y < 0
      # TODO: Handle shadow blur offset
      if @_shadow.blur > 0
        x += @_shadow.blur - @_shadow.x
        y += @_shadow.blur - @_shadow.y

      context.translate x, y

      i = @vertices
      slice = 2 * Math.PI / @vertices

      # Make shapes point @ 90 degrees
      switch @vertices
        when 3 then offset = -Math.PI / 2
        when 4 then offset = -Math.PI / 4
        when 5 then offset = -Math.PI / 10
        when 7 then offset = Math.PI / 14
        when 9 then offset = -Math.PI / 18
        else offset = 0

      context.moveTo(@size / 2 * Math.cos(0 + offset), @size / 2 * Math.sin(0 + offset))
      while i--
        context.lineTo(@size / 2 * Math.cos(i * slice + offset), @size / 2 * Math.sin(i * slice + offset))

      context.closePath()

      if @_shadow.x != 0 or @_shadow.y != 0 or @_shadow.blur != 0
        context.shadowOffsetX = @_shadow.x
        context.shadowOffsetY = @_shadow.y
        context.shadowBlur = @_shadow.blur
        context.shadowColor = @_shadow.color

      if @_color
        context.fillStyle = @_color
        context.fill()

      # Don't allow border to cast a shadow
      if @_shadow.x != 0 or @_shadow.y != 0 or @_shadow.blur != 0
        context.shadowOffsetX = 0
        context.shadowOffsetY = 0
        context.shadowBlur = 0

      if @_border.width && @_border.color
        context.lineWidth = @_border.width
        context.strokeStyle = @_border.color
        context.stroke()

  ###
  @description Draw object
  @param {CanvasRenderingContext2D} context
  ###
  draw: (context, offsetX = 0, offsetY = 0) ->
    offsetX = offsetY = 0 if @fixed

    # Draw child objects first, so they will be on the "bottom"
    super context, @position.x + offsetX, @position.y + offsetY

    # Set scale/rotation/alpha
    context.translate @position.x + offsetX, @position.y + offsetY
    context.scale @scale, @scale if @scale != 1
    context.rotate @rotation if @rotation != 0 && @rotation != Math.PI * 2
    context.globalAlpha = @alpha if @alpha < 1

    # Draw vector shape cache
    context.drawImage @canvas, -@anchor.x, -@anchor.y

    # Reset scale/rotation/alpha
    context.rotate -@rotation if @rotation != 0 && @rotation != Math.PI * 2
    context.translate -@position.x - offsetX, -@position.y - offsetY
    context.scale 1, 1 if @scale != 1
    context.globalAlpha = 1 if @alpha < 1

  ###
  @description Update object
  @param {Number} delta Time since last update (in seconds)
  ###
  update: (delta) ->
    super delta

    @position.x += @velocity.x * @speed * delta
    @position.y += @velocity.y * @speed * delta

    @rotation += @angularVelocity * delta

  ###
   * @description Basic collision detection
   * @param {Shape} other Shape object to test collision with
  ###
  collidesWith: (other) ->
    if @vertices == 4
      return Math.abs(@position.x - other.position.x) < @size / 2 + other.size / 2 && Math.abs(@position.y - other.position.y) < @size / 2 + other.size / 2
    else
      return Math.sqrt(Math.pow(other.position.x - @position.x, 2) + Math.pow(other.position.y - @position.y, 2)) < @size / 2 + other.size / 2

module.exports = Shape
