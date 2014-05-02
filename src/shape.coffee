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
    @lineWidth = args.lineWidth || 1
    @lineJoin = args.lineJoin || 'round'        # miter, round, bevel
    @speed = args.speed || 1
    @velocity = args.velocity || { x: 0, y: 0 }
    @solid = args.solid || false
    @color = args.color || '#fff'
    @path = args.path || null # custom draw function

    @canvas = document.createElement 'canvas' # Internal shape cache
    @generateCache()

  ###
  @description Draw object onto internal <canvas> cache
  ###  
  generateCache: ->
    # TODO: resize to handle shadow
    @canvas.setAttribute 'width', @size + @lineWidth + @shadow.x
    @canvas.setAttribute 'height', @size + @lineWidth + @shadow.y

    context = @canvas.getContext '2d'
    context.lineWidth = @lineWidth
    context.lineJoin = @lineJoin

    if @shadow.x != null and @shadow.y != null and @shadow.blur != null and @shadow.color != null
      context.shadowOffsetX = @shadow.x
      context.shadowOffsetY = @shadow.y
      context.shadowBlur = @shadow.blur
      context.shadowColor = @shadow.color

    # Allow sprite objects to have custom draw functions
    if @path != null
        @path(context)
    else
      context.beginPath()
      # TODO: Handle shadow offset
      context.translate @size / 2 + @lineWidth / 2, @size / 2 + @lineWidth / 2 # Move to center of canvas

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

      if @solid
        context.fillStyle = @color
        context.fill()
      else
        context.strokeStyle = @color
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
    context.drawImage @canvas, -@size / 2, -@size / 2

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
