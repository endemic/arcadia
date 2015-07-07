Shape = require './shape.coffee'

class Button extends Shape
  constructor: (args = {}) ->
    Arcadia = require './arcadia.coffee'
    Label = require './label.coffee'

    @padding = args.padding || 10
    @label = args.label || new Label(text: args.text, font: args.font)
    @label.drawCanvasCache() # Draw cache to determine size of text

    unless args.size
      args.size =
        width: @label.size.width + @padding
        height: @label.size.height + @padding

    super(args)

    @label.fixed = false
    @add(@label)

    @fixed = true
    @action = args.action

    # Attach event listeners
    @onPointEnd = @onPointEnd.bind(@)

    if Arcadia.ENV.mobile
      Arcadia.element.addEventListener('touchend', @onPointEnd, false)
    else
      Arcadia.element.addEventListener('mouseup', @onPointEnd, false)

  ###
  @description If touch/mouse end is inside button, execute the user-supplied callback
  this method will get fired for each different button object on the screen
  ###
  onPointEnd: (event) ->
    return if typeof @action != 'function'

    i = Arcadia.points.length
    while i--
      if @containsPoint(Arcadia.points[i])
        return @action()

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
  destroy: ->
    if Arcadia.ENV.mobile
      Arcadia.element.removeEventListener('touchend', @onPointEnd, false)
    else
      Arcadia.element.removeEventListener('mouseup', @onPointEnd, false)

  ###
  @description Getter/setter for text value
  ###
  @property 'text',
    get: ->
      @label.text
    set: (text) ->
      @label.text = text

  ###
  @description Getter/setter for font value
  ###
  @property 'font',
    get: ->
      @label.font
    set: (font) ->
      @label.font = font

module.exports = Button
