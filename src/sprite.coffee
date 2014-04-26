GameObject = require './gameobject.coffee'

class Sprite extends GameObject
  ###
  @description Sprite constructor
  @param {Object} options Possible keys: x, y, size, imgsrc
  ###
  constructor: (options = {}) ->
    super options.x, options.y

    @size = options.size
    @speed = 1
    @velocity =
      x: 0
      y: 0

    @img = new Image()
    @img.src = options.imgsrc

  ###
  @description Draw object
  @param {CanvasRenderingContext2D} context
  ###
  draw: (context, offsetX = 0, offsetY = 0) ->
    offsetX = offsetY = 0 if @fixed

    # Draw child objects first, so they will be on the "bottom"
    super context, @position.x + offsetX, @position.y + offsetY

    context.save()

    context.translate @position.x + offsetX, @position.y + offsetY
    context.scale @scale, @scale if @scale != 1
    context.rotate @rotation if @rotation != 0 && @rotation != Math.PI * 2

    context.drawImage @img, 0, 0

    context.restore()

  ###
  @description Update object
  @param {Number} delta Time since last update (in seconds)
  ###
  update: (delta) ->
    super delta

    @position.x += @velocity.x * @speed * delta
    @position.y += @velocity.y * @speed * delta

  ###
  @description Basic collision detection
  @param {Sprite} other Sprite object to test collision with
  ###
  collidesWith: (other) ->
    if @vertices == 4
      return Math.abs(@position.x - other.position.x) < @size / 2 + other.size / 2 && Math.abs(@position.y - other.position.y) < @size / 2 + other.size / 2
    else
      return Math.sqrt(Math.pow(other.position.x - @position.x, 2) + Math.pow(other.position.y - @position.y, 2)) < @size / 2 + other.size / 2

module.exports = Sprite
