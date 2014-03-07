GameObject = require './gameobject.coffee'

class Button extends GameObject
  constructor: (x, y, text) ->
    super

    # Create label that goes inside button border
    @label = new Arcadia.Label(x, y, text)
    @add(@label)

    # Default border/background
    @backgroundColors =
      'red': 255
      'green': 255
      'blue': 255
      'alpha': 1

    @height = parseInt(@label.fonts.size, 10)
    @solid = true
    @padding = 10
    @fixed = true

    # Attach event listeners
    @onPointEnd = @onPointEnd.bind(this)
    Arcadia.instance.element.addEventListener('mouseup', @onPointEnd, false)
    Arcadia.instance.element.addEventListener('touchend', @onPointEnd, false)

  ###
   * @description Draw object
   * @param {CanvasRenderingContext2D} context
  ###
  draw: (context, offsetX, offsetY) ->
    return if not @active

    # Draw label
    super context, @position.x + offsetX, @position.y + offsetY

    offsetX = offsetY = 0 if @fixed

    @width = @label.width(context)

    # Draw button background/border
    context.save()
    context.translate(@position.x + offsetX, @position.y + offsetY)

    if @glow > 0
      context.shadowOffsetX = 0;
      context.shadowOffsetY = 0;
      context.shadowBlur = @glow;
      context.shadowColor = @color;

    if @solid == true
      context.fillStyle =  @backgroundColor;
      context.fillRect(-@width / 2 - @padding / 2, -@height / 2 - @padding / 2, @width + @padding, @height + @padding)
    else
      context.strokeStyle = @backgroundColor;
      context.strokeRect(-@width / 2 - @padding / 2, -@height / 2 - @padding / 2, @width + @padding, @height + @padding)

    context.restore()

  ###
   * @description If touch/mouse end is inside button, execute the user-supplied callback
  ###
  onPointEnd: (event) ->
    return if not @active or typeof @onUp != 'function'

    Arcadia.getPoints event

    i = Arcadia.instance.points.length
    while i--
      if @containsPoint Arcadia.instance.points.coordinates[i].x, Arcadia.instance.points.coordinates[i].y
        @onUp()
        return

  ###
   * @description Helper method to determine if mouse/touch is inside button graphic
  ###
  containsPoint: (x, y) ->
    return x < @position.x + @width / 2 + @padding / 2 &&
      x > @position.x - @width / 2 - @padding / 2 &&
      y < @position.y + @height / 2 + @padding / 2 &&
      y > @position.y - @height / 2 - @padding / 2

  ###
   * @description Clean up event listeners
  ###
  destroy: () ->
    Arcadia.instance.element.removeEventListener 'mouseup', @onPointEnd, false
    Arcadia.instance.element.removeEventListener 'touchend', @onPointEnd, false

  ###
   * @description Getter/setter for background color value
  ###
  @property 'backgroundColor',
    get: ->
      return "rgba(#{@backgroundColors.red}, #{@backgroundColors.green}, #{@backgroundColors.blue}, #{@backgroundColors.alpha})"
    set: (color) ->
      tmp = color.match /^rgba\((\d+),\s?(\d+),\s?(\d+),\s?(\d?\.?\d*)\)$/

      if tmp.length == 5
        @backgroundColors.red = parseInt tmp[1], 10
        @backgroundColors.green = parseInt tmp[2], 10
        @backgroundColors.blue = parseInt tmp[3], 10
        @backgroundColors.alpha = parseFloat tmp[4], 10

  ###
   * @description Getter/setter for font value
  ###
  @property 'font',
    get: ->
      return @label.font
    set: (font) ->
      @label.font = font

module.exports = Button
