GameObject = require('./gameobject')

class Label extends GameObject
  constructor: (x, y, text) ->
    super

    @text = text
    @fixed = true

    # Default font
    @fonts =
      size: '10px',
      family: 'monospace'

    #@alignment = ["left", "right", "center", "start", "end"].indexOf(alignment) !== -1 ? alignment : "center"
    @alignment = 'center'
    @solid = true

  ###
   * @description Draw object
   * @param {CanvasRenderingContext2D} context
  ###
  draw: (context, offsetX, offsetY) ->
    return if not @active

    # Draw child objects first, so they will be on the "bottom"
    super context, @position.x + offsetX, @position.y + offsetY

    offsetX = offsetY = 0 if @fixed

    context.save()

    context.font = @font
    context.textAlign = @alignment

    context.translate(@position.x + offsetX, @position.y + parseInt(@fonts.size, 10) / 3 + offsetY)

    if @scale != 1
      context.scale(@scale, @scale)

    if @rotation != 0 && @rotation != Math.PI * 2
      context.rotate(@rotation)

    if @glow > 0
      context.shadowOffsetX = 0
      context.shadowOffsetY = 0
      context.shadowBlur = @glow
      context.shadowColor = @color

    if @solid
      context.fillStyle = @color
      context.fillText(@text, 0, 0, Arcadia.WIDTH)
    else
      context.strokeStyle = @color
      context.strokeText(@text, 0, 0, Arcadia.WIDTH)

    context.restore()

  ###
   * @description Update object
   * @param {Number} delta Time since last update (in seconds)
  ###
  update: (delta) ->
    return if not @active

    # Update child objects
    super delta

  ###
   * @description Utility function to determine the width of the label
   * @param {CanvasRenderingContext2D} context
  ###
  width: (context) ->
    context.save()
    context.font = @fonts.size + ' ' + @fonts.family
    context.textAlign = @alignment
    metrics = context.measureText(@text)
    context.restore()

    return metrics.width

  ###
   * @description Getter/setter for font value
  ###
  @property 'font',
    get: ->
      return "#{@fonts.size} #{@fonts.family}"
    set: (font) ->
      tmp = font.split(' ') # e.g. context.font = "20pt Arial"
      if tmp.length == 2
        @fonts.size = tmp[0]
        @fonts.family = tmp[1]

module.exports = Label