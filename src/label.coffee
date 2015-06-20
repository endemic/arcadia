Shape = require './shape.coffee'

class Label extends Shape
  constructor: (args = {}) ->
    super args

    @_font = { size: 10, family: 'monospace' }
    @_text = 'text goes here'
    @_alignment = 'center'

    @fixed = true # By default, does not move with camera
    @font = args.font if args.font
    @text = args.text if args.text
    @alignment = args.alignment if args.alignment # allowed values: "left", "right", "center", "start", "end"
    @anchor = { x: @size.width / 2, y: @size.height / 2 }

  ###
  @description Draw object onto internal <canvas> cache
  ###
  drawCanvasCache: ->
    return if @canvas is undefined
    # TODO: refactor shape method to use re-usable methods
    # which can then be reused here
    Arcadia = require './arcadia.coffee'
    
    context = @canvas.getContext '2d'

    # Determine width/height of text using offscreen <div>
    element = document.getElementById 'text-dimensions'
    
    if !element
      element = document.createElement 'div'
      element['id'] = 'text-dimensions'
      element.style['position'] = 'absolute'
      element.style['top'] = '-9999px'
      document.body.appendChild element

    element.style['font'] = @font
    element.style['line-height'] = 1
    element.innerHTML = @text
    @size.width = element.offsetWidth
    @size.height = element.offsetHeight
    @anchor = { x: @size.width / 2, y: @size.height / 2 }

    @canvas.width = @size.width + @_border.width + Math.abs(@_shadow.x) + @_shadow.blur
    @canvas.height = @size.height + @_border.width + Math.abs(@_shadow.y) + @_shadow.blur

    context.font = @font
    context.textAlign = @alignment  # TODO: alignment is broken for anything not "center"
    context.textBaseline = 'middle' # top, hanging, middle, alphabetic, ideographic, bottom

    @setAnchorPoint()

    # Debug
    if @debug
      context.lineWidth = 1
      context.strokeStyle = '#f00'
      context.strokeRect 0, 0, @canvas.width, @canvas.height
      context.arc @anchor.x, @anchor.y, 3, 0, 2 * Math.PI, false
      context.stroke()

    context.translate @anchor.x, @anchor.y

    if @_shadow.x != 0 or @_shadow.y != 0 or @_shadow.blur != 0
      context.shadowOffsetX = @_shadow.x
      context.shadowOffsetY = @_shadow.y
      context.shadowBlur = @_shadow.blur
      context.shadowColor = @_shadow.color

    if @_color
      context.fillStyle = @_color
      context.fillText @text, 0, 0, Arcadia.WIDTH

    # Don't allow border to cast a shadow
    if @_shadow.x != 0 or @_shadow.y != 0 or @_shadow.blur != 0
      context.shadowOffsetX = 0
      context.shadowOffsetY = 0
      context.shadowBlur = 0

    if @_border.width && @_border.color
      context.lineWidth = @_border.width
      context.strokeStyle = @_border.color
      context.strokeText @text, 0, 0, Arcadia.WIDTH

  ###
  @description Getter/setter for font
  TODO: Handle bold text
  ###
  @property 'font',
    get: -> return "#{@_font.size} #{@_font.family}"
    set: (font) ->
      values = font.match(/^(.+) (.+)$/)

      if values.length == 3
        @_font.size = values[1]
        @_font.family = values[2]
        @dirty = true
      else
        throw new Error 'Use format "(size)px (font-family)" when setting Label font'

  @property 'text',
    get: -> return @_text
    set: (value) ->
      @_text = value
      @dirty = true

  @property 'alignment',
    get: -> return @_alignment
    set: (value) ->
      @_alignment = value
      @dirty = true

module.exports = Label
