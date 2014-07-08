GameObject = require './gameobject.coffee'

class Button extends GameObject
  constructor: (args = {}) ->
    super

    # Create label that goes inside button border
    @label = new Arcadia.Label args.font
    @children.add @label
    @label.shadow = @shadow

    # Default border/background
    @_backgroundColor = args.backgroundColor || '#fff'

    @height = @label.height
    @width = @label.width
    @anchor = { x: @width / 2, y: @height / 2 }
    @padding = 10
    @fixed = true

    # Attach event listeners
    # TODO: Use global event listeners to activate buttons
    @onPointEnd = @onPointEnd.bind @
    Arcadia.instance.element.addEventListener('mouseup', @onPointEnd, false)
    Arcadia.instance.element.addEventListener('touchend', @onPointEnd, false)

    @canvas = document.createElement 'canvas' # Internal shape cache
    @drawCanvasCache()

  ###
  @description Draw object
  @param {CanvasRenderingContext2D} context
  ###
  draw: (context, offsetX = 0, offsetY = 0) ->
    # Draw child objects first, so they will be on the "bottom"
    super context, @position.x + offsetX, @position.y + offsetY

    offsetX = offsetY = 0 if @fixed

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
  @description Draw object onto internal <canvas> cache
  ###
  drawCanvasCache: ->
    return if @canvas is undefined

    @canvas.width = @width + @_border.width + Math.abs(@_shadow.x) + @_shadow.blur
    @canvas.height = @height + @_border.width + Math.abs(@_shadow.y) + @_shadow.blur

    # Dynamically determine anchor point
    x = @width / 2 + @_border.width / 2
    y = @height / 2 + @_border.width / 2

    if @_shadow.blur > 0
      x += @_shadow.blur / 2
      y += @_shadow.blur / 2

    x -= @_shadow.x if @_shadow.x < 0
    y -= @_shadow.y if @_shadow.y < 0

    @anchor.x = x
    @anchor.y = y

    context = @canvas.getContext '2d'
    context.lineJoin = 'round'

    context.beginPath()
    context.translate x, y

    # Actually draw here
    context.moveTo -@width / 2 - @padding / 2, -@height / 2 - @padding / 2
    
    context.lineTo @width / 2 + @padding / 2, -@height / 2 - @padding / 2
    context.lineTo @width / 2 + @padding / 2, @height / 2 + @padding / 2
    context.lineTo -@width / 2 - @padding / 2, @height / 2 + @padding / 2
    context.lineTo -@width / 2 - @padding / 2, -@height / 2 - @padding / 2
    context.closePath()

    if @_shadow.x != 0 or @_shadow.y != 0 or @_shadow.blur != 0
      context.shadowOffsetX = @_shadow.x
      context.shadowOffsetY = @_shadow.y
      context.shadowBlur = @_shadow.blur
      context.shadowColor = @_shadow.color

    if @_color
      context.fillStyle = @_color
      context.fill()

    # Reset so border doesn't cast additional shadow
    if @_shadow.x != 0 or @_shadow.y != 0 or @_shadow.blur != 0
      context.shadowOffsetX = 0
      context.shadowOffsetY = 0
      context.shadowBlur = 0

    if @_border.width && @_border.color
      context.lineWidth = @_border.width
      context.strokeStyle = @_border.color
      context.stroke()

  ###
  @description If touch/mouse end is inside button, execute the user-supplied callback
  ###
  onPointEnd: (event) ->
    return if typeof @onUp != 'function'

    Arcadia.getPoints event

    i = Arcadia.instance.points.length
    while i--
      if @containsPoint Arcadia.instance.points.coordinates[i].x, Arcadia.instance.points.coordinates[i].y
        @onUp()
        return

  ###
  @description Helper method to determine if mouse/touch is inside button graphic
  ###
  containsPoint: (x, y) ->
    return x < @position.x + @width / 2 + @padding / 2 &&
      x > @position.x - @width / 2 - @padding / 2 &&
      y < @position.y + @height / 2 + @padding / 2 &&
      y > @position.y - @height / 2 - @padding / 2

  ###
  @description Clean up event listeners
  ###
  destroy: () ->
    Arcadia.instance.element.removeEventListener 'mouseup', @onPointEnd, false
    Arcadia.instance.element.removeEventListener 'touchend', @onPointEnd, false

  ###
  @description Getter/setter for font value
  ###
  @property 'font',
    get: ->
      return @label.font
    set: (font) ->
      @label.font = font

module.exports = Button
