Shape = require './shape.coffee'

class Button extends Shape
  constructor: (args = {}) ->
    Label = require './label.coffee'

    @padding = args.padding || 0
    @label = args.label || new Label(text: args.text, font: args.font)
    @label.drawCanvasCache() # Draw cache to determine size of text

    super(args)

    unless args.hasOwnProperty('size')
      height = if @vertices == 0
          @label.size.width
        else
          @label.size.height

      @size =
        width: @label.size.width + @padding
        height: height + @padding

    @add(@label)

    @action = args.action if args.hasOwnProperty('action')
    @disabled = false # Quick prop to allow "turning off" button action
    @enablePointEvents = true

    # Bind context for "press" callback
    #@onPointEnd = @onPointEnd.bind(@)

  ###
  @description If touch/mouse end is inside button, execute the user-supplied callback
  this method will get fired for each different button object on the screen
  ###
  onPointEnd: (points) ->
    super(points)

    return if typeof @action != 'function' || @disabled

    i = points.length
    while i--
      return @action() if @containsPoint(points[i])

  ###
  @description Helper method to determine if mouse/touch is inside button graphic
  ###
  containsPoint: (point) ->
    return point.x < @position.x + @size.width / 2 + @padding / 2 &&
      point.x > @position.x - @size.width / 2 - @padding / 2 &&
      point.y < @position.y + @size.height / 2 + @padding / 2 &&
      point.y > @position.y - @size.height / 2 - @padding / 2

  ###
  @description Getter/setter for text value
  ###
  @property 'text',
    get: -> @label.text
    set: (text) -> @label.text = text

  ###
  @description Getter/setter for font value
  ###
  @property 'font',
    get: -> @label.font
    set: (font) -> @label.font = font

module.exports = Button
