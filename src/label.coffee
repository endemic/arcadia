GameObject = require './gameobject.coffee'

class Label extends GameObject
  constructor: (args = {}) ->
    super args

    @text = args.text || 'text goes here'
    @fixed = args.fixed || true # By default, does not move with camera
    @_font = args.font || { size: 10, family: 'monospace' }
    @alignment = args.alignment || 'center' # allowed values: "left", "right", "center", "start", "end"
    @debug = args.debug || false

    @canvas = document.createElement 'canvas' # Internal shape cache
    @drawCanvasCache()

  ###
  @description Draw object onto internal <canvas> cache
  ###  
  drawCanvasCache: ->
    context = @canvas.getContext '2d'
    context.font = @font
    context.textAlign = @alignment
    # TODO: investigate textBaseline
    # context.textBaseline = 'top' # middle, alphabetic, bottom

    @width = context.measureText(@text).width
    @height = @_font.size

    # TODO: Account for shadow blur
    @canvas.width = @width + @_border.width + @_shadow.x
    @canvas.height = @height + @_border.width + @_shadow.y

    # Changing canvas size resets the font apparently
    context.font = @font

    if @_shadow.x != 0 or @_shadow.y != 0 or @_shadow.blur != 0
      context.shadowOffsetX = @_shadow.x
      context.shadowOffsetY = @_shadow.y
      context.shadowBlur = @_shadow.blur
      context.shadowColor = @_shadow.color

    # Debug
    if @debug
      context.lineWidth = 1
      context.strokeStyle = '#f00'
      context.strokeRect 0, 0, @canvas.width, @canvas.height

    # TODO: Handle shadow offset
    # context.translate @position.x + offsetX, @position.y + parseInt(@font, 10) / 3 + offsetY
    context.translate @_border.width / 2, @height / 1.5 + @_border.width / 2 # Move to center of canvas

    if @_color
      context.fillStyle = @_color
      context.fillText @text, 0, 0, Arcadia.WIDTH

    if @_border.width && @_border.color
      context.lineWidth = @_border.width
      context.strokeStyle = @_border.color
      context.strokeText @text, 0, 0, Arcadia.WIDTH

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
    context.drawImage @canvas, -@width / 2, -@height / 2

    # Reset scale/rotation/alpha
    context.rotate -@rotation if @rotation != 0 && @rotation != Math.PI * 2
    context.translate -@position.x - offsetX, -@position.y - offsetY
    context.scale 1, 1 if @scale != 1
    context.globalAlpha = 1 if @alpha < 1

  ###
  @description Getter/setter for font
  ###
  @property 'font',
    get: -> return "#{@_font.size}px #{@_font.family}"
    set: (font) ->
      values = font.match(/^(\d+px) (.+)$/)

      if values.length == 3
        @_font.size = parseInt values[1], 10
        @_font.family = values[2]
        @drawCanvasCache()

module.exports = Label
