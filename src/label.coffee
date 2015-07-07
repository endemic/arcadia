Shape = require './shape.coffee'

class Label extends Shape
  constructor: (args = {}) ->
    @_font = { size: 10, family: 'monospace' }
    @_text = 'text goes here'
    @_alignment = 'center'
    @fixed = true # Does not move with camera/parent objects
    
    super(args)

    @fixed = args.fixed if args.hasOwnProperty('fixed')
    @font = args.font if args.hasOwnProperty('font')
    @text = args.text if args.hasOwnProperty('text')
    @alignment = args.alignment if args.hasOwnProperty('alignment') # allowed values: "left", "right", "center", "start", "end"
    @anchor = { x: @size.width / 2, y: @size.height / 2 }

  ###
  @description Draw object onto internal <canvas> cache
  ###
  drawCanvasCache: ->
    return if @canvas is undefined
    # TODO: refactor shape method to use re-usable methods
    # which can then be reused here
    Arcadia = require './arcadia.coffee'
    
    context = @canvas.getContext('2d')

    lineCount = 1
    newlines = @text.match(/\n/g)
    lineCount = newlines.length + 1 if newlines

    # Determine width/height of text using offscreen <div>
    element = document.getElementById('text-dimensions')
    
    if !element
      element = document.createElement('div')
      element['id'] = 'text-dimensions'
      element.style['position'] = 'absolute'
      element.style['top'] = '-9999px'
      document.body.appendChild(element)

    element.style['font'] = @font
    element.style['line-height'] = 1
    element.innerHTML = @text.replace(/\n/g, '<br>').replace(/\s/g, '&nbsp;')
    @size.width = element.offsetWidth
    @size.height = element.offsetHeight
    lineHeight = @size.height / lineCount
    @anchor = { x: @size.width / 2, y: @size.height / 2 }

    @canvas.width = @size.width + @_border.width + Math.abs(@_shadow.x) + @_shadow.blur
    @canvas.height = @size.height + @_border.width + Math.abs(@_shadow.y) + @_shadow.blur

    if Arcadia.PIXEL_RATIO > 1
      @canvas.width *= Arcadia.PIXEL_RATIO
      @canvas.height *= Arcadia.PIXEL_RATIO

    context.font = "#{@_font.size * Arcadia.PIXEL_RATIO}px #{@_font.family}"
    context.textAlign = @alignment  # left, right, center, start, end
    context.textBaseline = 'middle' # top, hanging, middle, alphabetic, ideographic, bottom

    @setAnchorPoint()

    if @debug
      context.lineWidth = 1
      context.strokeStyle = '#f00'
      context.strokeRect 0, 0, @canvas.width, @canvas.height
      context.arc @anchor.x, @anchor.y, 3, 0, 2 * Math.PI, false
      context.stroke()

    context.translate(@anchor.x, @anchor.y)

    if @_shadow.x != 0 or @_shadow.y != 0 or @_shadow.blur != 0
      context.shadowOffsetX = @_shadow.x * Arcadia.PIXEL_RATIO
      context.shadowOffsetY = @_shadow.y * Arcadia.PIXEL_RATIO
      context.shadowBlur = @_shadow.blur * Arcadia.PIXEL_RATIO
      context.shadowColor = @_shadow.color

    # Handle x coord of text for alignment
    x = if @alignment == 'start' || @alignment == 'left'
          -@size.width / 2
        else if @alignment == 'end' || @alignment == 'right'
          @size.width / 2
        else
          0

    if @_color
      context.fillStyle = @_color
      if lineCount > 1
        @text.split('\n').forEach (text, index) =>
          context.fillText(text, x, (-@size.height / 2) + (lineHeight / 2) + (lineHeight * index))
      else
        context.fillText(@text, x, 0)

    # Don't allow border to cast a shadow
    if @_shadow.x != 0 or @_shadow.y != 0 or @_shadow.blur != 0
      context.shadowOffsetX = 0
      context.shadowOffsetY = 0
      context.shadowBlur = 0

    if @_border.width && @_border.color
      context.lineWidth = @_border.width * Arcadia.PIXEL_RATIO
      context.strokeStyle = @_border.color
      if lineCount > 1
        @text.split('\n').forEach (text, index) =>
          context.strokeText(text, x, (-@size.height / 2) + (lineHeight / 2) + (lineHeight * index))
      else
        context.strokeText(@text, x, 0)

    @dirty = false

  ###
  @description Getter/setter for font
  TODO: Handle bold text
  ###
  @property 'font',
    get: -> return "#{@_font.size}px #{@_font.family}"
    set: (font) ->
      values = font.match(/^(\d+)(?:px)? (.+)$/)

      if values.length == 3
        @_font.size = values[1]
        @_font.family = values[2]
        @dirty = true
      else
        throw new Error 'Use format "(size)px (font-family)" when setting Label font'

  @property 'text',
    get: -> return @_text
    set: (value) ->
      @_text = String(value)
      @dirty = true

  @property 'alignment',
    get: -> return @_alignment
    set: (value) ->
      @_alignment = value
      @dirty = true

module.exports = Label
