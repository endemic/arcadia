Shape = require './shape.coffee'

class Button extends Shape
  constructor: (args = {}) ->
    Label = require './label.coffee'
    Arcadia = require './arcadia.coffee'

    # Create label that goes inside button border
    @label = new Label(args)
    @label.position = { x: 0, y: 0 }
    @label.fixed = false

    @padding = args.padding || 10

    args.size =
      width: @label.size.width + @padding
      height: @label.size.height + @padding

    super args

    @add(@label)

    @fixed = true
    @iterator = 0

    # Attach event listeners
    @onPointEnd = @onPointEnd.bind(@)
    Arcadia.instance.element.addEventListener('mouseup', @onPointEnd, false)
    Arcadia.instance.element.addEventListener('touchend', @onPointEnd, false)

  ###
  @description If touch/mouse end is inside button, execute the user-supplied callback
  ###
  onPointEnd: (event) ->
    return if typeof @onUp != 'function'

    Arcadia.getPoints(event)

    @iterator = Arcadia.instance.points.length
    while @iterator--
      if @containsPoint(Arcadia.instance.points.coordinates[@iterator].x,
                        Arcadia.instance.points.coordinates[@iterator].y)
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
      @label.dirty = true

module.exports = Button
