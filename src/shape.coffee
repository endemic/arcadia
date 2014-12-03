GameObject = require './gameobject.coffee'

class Shape extends GameObject
  ###
   * @description Shape constructor
   * @param {Number} x Position of shape on x-axis
   * @param {Number} y Position of shape on y-axis
   * @param {String} shape String representing what to draw
   * @param {Number} size Size of shape in pixels
  ###
  constructor: (args = {}) ->
    super args

    @_border = { width: 0, color: '#000' }
    @_shadow = { x: 0, y: 0, blur: 0, color: '#000' }

    @vertices = args.vertices || 4
    @color = args.color       || '#fff'
    @border = args.border     || '0px #000'
    @shadow = args.shadow     || '0px 0px 0px #000'
    @size = args.size         || { width: 10, height: 10 }
    @velocity = args.velocity || { x: 0, y: 0 }
    @angularVelocity = args.angularVelocity || 0
    @speed = args.speed       || 1
    @debug = args.debug       || false
    @fixed = args.fixed       || false # By default, moves with camera

    @path = args.path if args.path  # Custom drawing function
    @anchor = { x: @size.width / 2, y: @size.height / 2 }
    @canvas = document.createElement 'canvas' # Internal drawing cache
    @dirty = true   # Trigger initial cache draw

  ###
  @description Getter/setter for color
  ###
  @property 'color',
    get: -> return @_color
    set: (color) ->
      @_color = color
      @dirty = true

  ###
  @description Getter/setter for border
  ###
  @property 'border',
    get: -> return "#{@_border.width}px #{@_border.color}"
    set: (border) ->
      values = border.match(/^(\d+px) (.+)$/)

      if values?.length == 3
        @_border.width = parseInt values[1], 10
        @_border.color = values[2]
        @dirty = true
      else
        throw new Error 'Use format "(width)px (color)" when setting borders'

  ###
  @description Getter/setter for shadow
  ###
  @property 'shadow',
    get: -> return "#{@_shadow.x}px #{@_shadow.y}px #{@_shadow.blur}px #{@_shadow.color}"
    set: (shadow) ->
      values = shadow.match(/^(.+) (.+) (.+) (.+)$/)

      if values?.length == 5
        @_shadow.x = parseInt values[1], 10
        @_shadow.y = parseInt values[2], 10
        @_shadow.blur = parseInt values[3], 10
        @_shadow.color = values[4] # TODO: rgba(x, x, x, x) doesn't work
        @dirty = true
      else
        throw new Error 'Use format "(x)px (y)px (blur)px (color)" when setting shadows'

  ###
  @description Getter/setter for path
  ###
  @property 'path',
    get: -> return @_path
    set: (path) ->
      @_path = path
      @dirty = true

  ###
  @description Draw object onto internal <canvas> cache
  ###
  drawCanvasCache: ->
    return if @canvas is undefined

    # Canvas cache needs to be large enough to handle 
    # shape size, border, and shadow
    @canvas.width = @size.width + @_border.width + Math.abs(@_shadow.x) + @_shadow.blur
    @canvas.height = @size.height + @_border.width + Math.abs(@_shadow.y) + @_shadow.blur

    context = @canvas.getContext '2d'
    context.lineJoin = 'round'

    context.beginPath()
    # TODO: ensure correctness of this
    x = @size.width / 2 + @_border.width / 2
    y = @size.height / 2 + @_border.width / 2

    if @_shadow.blur > 0
      x += @_shadow.blur / 2
      y += @_shadow.blur / 2

    # Move anchor negatively if shadow is also negative
    x -= @_shadow.x if @_shadow.x < 0
    y -= @_shadow.y if @_shadow.y < 0

    # Set anchor point (midpoint of shape)
    @anchor.x = x
    @anchor.y = y

    # Draw anchor point and border in red
    if @debug
      context.lineWidth = 1
      context.strokeStyle = '#f00'
      context.strokeRect 0, 0, @canvas.width, @canvas.height
      context.arc x, y, 3, 0, 2 * Math.PI, false
      context.stroke()

    context.translate x, y

    if @path
      @_path context
    else
      switch @vertices
        when 1
          context.arc(0, 0, @size.width / 2, 0, 2 * Math.PI) # x, y, radius, startAngle, endAngle
        when 2
          context.moveTo(-@size.width / 2, -@size.height / 2)
          context.lineTo(@size.width / 2, @size.height / 2)
        when 3
          context.moveTo(0, -@size.height / 2)
          context.lineTo(@size.width / 2, @size.height / 2)
          context.lineTo(-@size.width / 2, @size.height / 2)
          context.lineTo(0, -@size.height / 2)
        when 4
          context.moveTo(-@size.width / 2, -@size.height / 2)
          context.lineTo(@size.width / 2, -@size.height / 2)
          context.lineTo(@size.width / 2, @size.height / 2)
          context.lineTo(-@size.width / 2, @size.height / 2)
          context.lineTo(-@size.width / 2, -@size.height / 2)

    context.closePath()

    # Draw shadow
    if @_shadow.x != 0 or @_shadow.y != 0 or @_shadow.blur != 0
      context.shadowOffsetX = @_shadow.x
      context.shadowOffsetY = @_shadow.y
      context.shadowBlur = @_shadow.blur
      context.shadowColor = @_shadow.color

    # Fill with color
    if @_color
      context.fillStyle = @_color
      context.fill()

    # Don't allow border to cast a shadow
    if @_shadow.x != 0 or @_shadow.y != 0 or @_shadow.blur != 0
      context.shadowOffsetX = 0
      context.shadowOffsetY = 0
      context.shadowBlur = 0

    # Draw border
    if @_border.width && @_border.color
      context.lineWidth = @_border.width
      context.strokeStyle = @_border.color
      context.stroke()

    @dirty = false

  ###
  @description Draw object
  @param {CanvasRenderingContext2D} context
  ###
  draw: (context, offsetX = 0, offsetY = 0) ->
    offsetX = offsetY = 0 if @fixed

    # Set scale/rotation/alpha
    context.translate @position.x + offsetX, @position.y + offsetY
    context.scale @scale, @scale if @scale != 1
    context.rotate @rotation if @rotation != 0 && @rotation != Math.PI * 2
    context.globalAlpha = @alpha if @alpha < 1

    # Update internal <canvas> cache if necessary
    @drawCanvasCache() if @dirty

    # Draw cache
    context.drawImage @canvas, -@anchor.x, -@anchor.y

    # Reset scale/rotation/alpha
    context.rotate -@rotation if @rotation != 0 && @rotation != Math.PI * 2
    context.translate -@position.x - offsetX, -@position.y - offsetY
    context.scale 1, 1 if @scale != 1
    context.globalAlpha = 1 if @alpha < 1

    # Draw child objects last, so they will be on the "top"
    super context, @position.x + offsetX, @position.y + offsetY

  ###
  @description Update object
  @param {Number} delta Time since last update (in seconds)
  ###
  update: (delta) ->
    super delta

    @position.x += @velocity.x * @speed * delta
    @position.y += @velocity.y * @speed * delta

    @rotation += @angularVelocity * delta

  ###
   * @description Basic collision detection
   * @param {Shape} other Shape object to test collision with
  ###
  collidesWith: (other) ->
    if @vertices == 4
      return Math.abs(@position.x - other.position.x) < @size / 2 + other.size / 2 && Math.abs(@position.y - other.position.y) < @size / 2 + other.size / 2
    else
      return Math.sqrt(Math.pow(other.position.x - @position.x, 2) + Math.pow(other.position.y - @position.y, 2)) < @size / 2 + other.size / 2

module.exports = Shape
