Shape = require './shape.coffee'

class Button extends Shape
  constructor: (args = {}) ->
    Arcadia = require './arcadia.coffee'
    Label = require './label.coffee'

    @padding = args.padding || 10
    @label = args.label || new Label()
    @label.drawCanvasCache() # Draw cache to determine size of text

    unless args.size
      args.size =
        width: @label.size.width + @padding
        height: @label.size.height + @padding

    super(args)

    #@label.position = { x: 0, y: 0 }
    @label.fixed = false
    @add(@label)

    @fixed = true
    @action = args.action

    # Attach event listeners
    @onPointEnd = @onPointEnd.bind(@)
    Arcadia.element.addEventListener('mouseup', @onPointEnd, false)
    Arcadia.element.addEventListener('touchend', @onPointEnd, false)

  ###
  @description If touch/mouse end is inside button, execute the user-supplied callback
  ###
  onPointEnd: (event) ->
    return if typeof @action != 'function'

    i = Arcadia.points.length
    while i--
      return @action() if @containsPoint(Arcadia.points[i])

  ###
  @description Helper method to determine if mouse/touch is inside button graphic
  ###
  containsPoint: (point) ->
    return point.x < @position.x + @size.width / 2 + @padding / 2 &&
      point.x > @position.x - @size.width / 2 - @padding / 2 &&
      point.y < @position.y + @size.height / 2 + @padding / 2 &&
      point.y > @position.y - @size.height / 2 - @padding / 2

  ###
  @description Clean up event listeners
  ###
  destroy: () ->
    Arcadia.element.removeEventListener 'mouseup', @onPointEnd, false
    Arcadia.element.removeEventListener 'touchend', @onPointEnd, false

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
