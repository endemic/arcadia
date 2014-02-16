GameObject = require './gameobject'

class Shape extends GameObject
  ###
   * @description Shape constructor
   * @param {Number} x Position of shape on x-axis
   * @param {Number} y Position of shape on y-axis
   * @param {String} shape String representing what to draw
   * @param {Number} size Size of shape in pixels
  ###
  constructor: (x, y, shape, size) ->
    super x, y

    @shape = shape || 'square'
    @size = size || 10
    @lineWidth = 1
    @lineJoin = 'round'            # miter, round, bevel
    @speed = 1
    @velocity =
      x: 0
      y: 0
    @solid = false

  ###
   * @description Draw object
   * @param {CanvasRenderingContext2D} context
  ###
  draw: (context, offsetX, offsetY) ->
    return if not @active

    offsetX = offsetY = 0 if @fixed

    # Draw child objects first, so they will be on the "bottom"
    super context, @position.x + offsetX, @position.y + offsetY

    context.save()
    context.translate(@position.x + offsetX, @position.y + offsetY)

    if @scale != 1
      context.scale(@scale, @scale)

    if @rotation != 0 && @rotation != Math.PI * 2
      context.rotate(@rotation)

    if @glow > 0
      context.shadowOffsetX = 0
      context.shadowOffsetY = 0
      context.shadowBlur = @glow
      context.shadowColor = @color

    context.lineWidth = @lineWidth
    context.lineJoin = @lineJoin

    # Allow sprite objects to have custom draw functions
    if typeof @path == "function"
        @path(context)
    else
      context.beginPath()

      switch @shape
        when 'triangle'
          context.moveTo(@size / 2 * Math.cos(0), @size / 2 * Math.sin(0))
          context.lineTo(@size / 2 * Math.cos(120 * Math.PI / 180), @size / 2 * Math.sin(120 * Math.PI / 180))
          context.lineTo(@size / 2 * Math.cos(240 * Math.PI / 180), @size / 2 * Math.sin(240 * Math.PI / 180))
          context.lineTo(@size / 2 * Math.cos(0), @size / 2 * Math.sin(0))
        when 'circle'
          context.arc(0, 0, @size / 2, Math.PI * 2, false)
        when 'square'
          context.moveTo(@size / 2, @size / 2)
          context.lineTo(@size / 2, -@size / 2)
          context.lineTo(-@size / 2, -@size / 2)
          context.lineTo(-@size / 2, @size / 2)
          context.lineTo(@size / 2, @size / 2)

      context.closePath()

      if @solid
        context.fillStyle = @color
        context.fill()
      else
        context.strokeStyle = @color
        context.stroke()

    context.restore()

  ###
   * @description Update object
   * @param {Number} delta Time since last update (in seconds)
  ###
  update: (delta) ->
    return if not @active

    @position.x += @velocity.x * @speed * delta
    @position.y += @velocity.y * @speed * delta

    # Update child objects
    super delta

  ###
   * @description Basic collision detection
   * @param {Shape} other Shape object to test collision with
  ###
  collidesWith: (other) ->
    if @shape == 'square'
      return Math.abs(@position.x - other.position.x) < @size / 2 + other.size / 2 && Math.abs(@position.y - other.position.y) < @size / 2 + other.size / 2
    else
      return Math.sqrt(Math.pow(other.position.x - @position.x, 2) + Math.pow(other.position.y - @position.y, 2)) < @size / 2 + other.size / 2

module.exports = Shape