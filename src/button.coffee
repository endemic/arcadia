GameObject = require './gameobject.coffee'

class Button extends GameObject
  constructor: (x, y, text) ->
    super

    # Create label that goes inside button border
    @label = new Arcadia.Label x, y, text
    @children.add @label
    @label.shadow = @shadow

    # Default border/background
    @backgroundColor = 'rgba(255, 255, 255, 1)'

    @height = parseInt @label.font, 10
    @solid = true
    @padding = 10
    @fixed = true

    # Attach event listeners
    # TODO: Use global event listeners to activate buttons
    @onPointEnd = @onPointEnd.bind(this)
    Arcadia.instance.element.addEventListener('mouseup', @onPointEnd, false)
    Arcadia.instance.element.addEventListener('touchend', @onPointEnd, false)

  ###
  @description Draw object
  @param {CanvasRenderingContext2D} context
  ###
  draw: (context, offsetX, offsetY) ->
    # Draw label
    super context, @position.x + offsetX, @position.y + offsetY

    offsetX = offsetY = 0 if @fixed

    @width = @label.width context

    # Draw button background/border
    context.save()
    context.translate @position.x + offsetX, @position.y + offsetY

    if @shadow.x != null and @shadow.y != null and @shadow.blur != null and @shadow.color != null
      context.shadowOffsetX = @shadow.x
      context.shadowOffsetY = @shadow.y
      context.shadowBlur = @shadow.blur
      context.shadowColor = @shadow.color

    if @solid == true
      context.fillStyle = @backgroundColor
      context.fillRect -@width / 2 - @padding / 2, -@height / 2 - @padding / 2, @width + @padding, @height + @padding
    else
      context.strokeStyle = @backgroundColor
      context.strokeRect -@width / 2 - @padding / 2, -@height / 2 - @padding / 2, @width + @padding, @height + @padding

    context.restore()

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
