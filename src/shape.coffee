GameObject = require('./gameobject.coffee')
Easie = require('../vendor/easie.coffee')

class Shape extends GameObject
  ###
  @description Shape constructor
  @param {Object} options Object representing shape options
  ###
  constructor: (options = {}) ->
    super(options)

    # Internal drawing cache
    @canvas = document.createElement('canvas')

    # Trigger initial cache draw
    @dirty = true

    # Data structure to hold animations
    @tweens = []

    # Default graphical options; changing these requires using setters/getters,
    # since the cache would need to be redrawn
    @_color = '#fff';
    @_border = { width: 0, color: '#fff' }
    @_shadow = { x: 0, y: 0, blur: 0, color: '#fff' }
    @_vertices = 4
    @_size = { width: 10, height: 10 }
    @speed = 1
    @velocity = { x: 0, y: 0 }
    @angularVelocity = 0
    @acceleration = { x: 0, y: 0 }
    @fixed = false # By default, moves with camera
    @debug = false

    # Pass through any property of the options object
    for property of options
      @[property] = options[property] if options.hasOwnProperty(property)

    @anchor = { x: @size.width / 2, y: @size.height / 2 }

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
    get: -> "#{@_border.width}px #{@_border.color}"
    set: (border) ->
      values = border.match(/^(\d+)(?:px)? (.+)$/)

      if values?.length == 3
        @_border.width = parseInt values[1], 10
        @_border.color = values[2]
        @dirty = true
      else
        console.warn('Use format "(width)px (color)" when setting borders')

  ###
  @description Getter/setter for shadow
  ###
  @property 'shadow',
    get: -> "#{@_shadow.x}px #{@_shadow.y}px #{@_shadow.blur}px #{@_shadow.color}"
    set: (shadow) ->
      values = shadow.match(/^(\d+)(?:px)? (\d+)(?:px)? (\d+)(?:px)? (.+)$/)

      if values?.length == 5
        @_shadow.x = parseInt values[1], 10
        @_shadow.y = parseInt values[2], 10
        @_shadow.blur = parseInt values[3], 10
        @_shadow.color = values[4]
        @dirty = true
      else
        console.warn('Use format "(x)px (y)px (blur)px (color)" when setting shadows')

  @property 'vertices',
    get: -> @_vertices
    set: (verticies) ->
      @_vertices = verticies
      @dirty = true

  @property 'size',
    get: -> @_size
    set: (size) ->
      @_size = { width: size.width, height: size.height }
      @dirty = true

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

    # Canvas cache needs to be large enough to handle shape size, border, and shadow
    @canvas.width = @size.width + @_border.width + Math.abs(@_shadow.x) + @_shadow.blur
    @canvas.height = @size.height + @_border.width + Math.abs(@_shadow.y) + @_shadow.blur

    if Arcadia.PIXEL_RATIO > 1
      @canvas.width *= Arcadia.PIXEL_RATIO
      @canvas.height *= Arcadia.PIXEL_RATIO

    @setAnchorPoint()

    context = @canvas.getContext('2d')
    context.lineJoin = 'miter'

    context.beginPath()

    # Draw anchor point and border in red
    if @debug
      context.lineWidth = 1 * Arcadia.PIXEL_RATIO
      context.strokeStyle = '#f00'
      context.strokeRect(0, 0, @canvas.width, @canvas.height)
      context.arc(@anchor.x, @anchor.y, 3, 0, 2 * Math.PI, false)
      context.stroke()

    context.translate(@anchor.x, @anchor.y)

    if @path
      @_path(context)
    else
      switch @vertices
        when 2
          context.moveTo(-@size.width / 2, -@size.height / 2)
          context.lineTo(@size.width / 2, @size.height / 2)
        when 3
          context.moveTo(0, -@size.height / 2)
          context.lineTo(@size.width / 2, @size.height / 2)
          context.lineTo(-@size.width / 2, @size.height / 2)
          context.lineTo(0, -@size.height / 2)
        when 4
          context.moveTo(-@size.width / 2 * Arcadia.PIXEL_RATIO, -@size.height / 2 * Arcadia.PIXEL_RATIO)
          context.lineTo(@size.width / 2 * Arcadia.PIXEL_RATIO, -@size.height / 2 * Arcadia.PIXEL_RATIO)
          context.lineTo(@size.width / 2 * Arcadia.PIXEL_RATIO, @size.height / 2 * Arcadia.PIXEL_RATIO)
          context.lineTo(-@size.width / 2 * Arcadia.PIXEL_RATIO, @size.height / 2 * Arcadia.PIXEL_RATIO)
          context.lineTo(-@size.width / 2 * Arcadia.PIXEL_RATIO, -@size.height / 2 * Arcadia.PIXEL_RATIO)
        else
          context.arc(0, 0, @size.width / 2 * Arcadia.PIXEL_RATIO, 0, 2 * Math.PI) # x, y, radius, startAngle, endAngle

    context.closePath()

    # Draw shadow
    if @_shadow.x != 0 or @_shadow.y != 0 or @_shadow.blur != 0
      context.shadowOffsetX = @_shadow.x * Arcadia.PIXEL_RATIO
      context.shadowOffsetY = @_shadow.y * Arcadia.PIXEL_RATIO
      context.shadowBlur = @_shadow.blur * Arcadia.PIXEL_RATIO
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
      context.lineWidth = @_border.width * Arcadia.PIXEL_RATIO
      context.strokeStyle = @_border.color
      context.stroke()

    @dirty = false

  ###
  @description Find the midpoint of the shape
  ###
  setAnchorPoint: ->
    # TODO: ensure correctness of this
    x = @size.width / 2 + @_border.width / 2
    y = @size.height / 2 + @_border.width / 2

    if @_shadow.blur > 0
      x += @_shadow.blur / 2
      y += @_shadow.blur / 2

    # Move negatively if shadow is also negative
    x -= @_shadow.x if @_shadow.x < 0
    y -= @_shadow.y if @_shadow.y < 0

    # Set anchor point (midpoint of shape)
    @anchor.x = x * Arcadia.PIXEL_RATIO
    @anchor.y = y * Arcadia.PIXEL_RATIO

  ###
  @description Draw object
  @param {CanvasRenderingContext2D} context
  ###
  draw: (context, offsetX = 0, offsetY = 0, offsetRotation = 0, offsetScale = 1) ->
    offsetX = offsetY = 0 if @fixed

    context.save()

    context.translate(offsetX * Arcadia.PIXEL_RATIO, offsetY * Arcadia.PIXEL_RATIO)
    context.rotate(offsetRotation) if offsetRotation != 0

    context.translate(@position.x * Arcadia.PIXEL_RATIO, @position.y * Arcadia.PIXEL_RATIO)
    context.rotate(@rotation) if @rotation != 0

    context.scale(@scale * offsetScale, @scale * offsetScale) if @scale * offsetScale != 1
    context.globalAlpha = @alpha if @alpha < 1

    # Update internal <canvas> cache if necessary
    @drawCanvasCache() if @dirty

    # Draw from cache
    context.drawImage(@canvas, -@anchor.x, -@anchor.y)

    # Reset scale/rotation/alpha
    context.restore()

    # Draw child objects last, so they will be on the "top"
    super(context, @position.x + offsetX, @position.y + offsetY, @rotation + offsetRotation, @scale * offsetScale)

  ###
  @description Update object
  @param {Number} delta Time since last update (in seconds)
  ###
  update: (delta) ->
    super(delta)

    i = @tweens.length
    while (i--)
      tween = @tweens[i]
      tween.time += delta * 1000 # (delta is in seconds)
      tween.time = tween.duration if tween.time > tween.duration
      @[tween.property] = tween.easingFunc(tween.time, tween.start, tween.change, tween.duration) # time,begin,change,duration
      if tween.time == tween.duration
        @tweens.splice(i, 1)
        tween.callback() if typeof tween.callback == 'function'

    @velocity.x += @acceleration.x
    @velocity.y += @acceleration.y

    @position.x += @velocity.x * @speed * delta
    @position.y += @velocity.y * @speed * delta

    @rotation += @angularVelocity * delta

  ###
   * @description Basic AABB collision detection
   * @param {Shape} other Shape object to test collision with
  ###
  collidesWith: (other) ->
    return false if @ == other
    Math.abs(@position.x - other.position.x) < @size.width / 2 + other.size.width / 2 && Math.abs(@position.y - other.position.y) < @size.height / 2 + other.size.height / 2

  tween: (property, target, duration = 500, easing = 'linearNone', callback) ->
    # TODO: How to handle compound properties, such as @position?
    # context = @
    # if property.indexOf('.') != -1
    #   # This is a compound value
    #   property.split('.').forEach (segment) ->
    #     context = context[segment]
    # else
    #   context = context[property]

    @tweens.push
      time: 0
      property: property
      start: @[property]
      change: target - @[property]
      duration: duration
      easingFunc: Easie[easing]
      callback: callback

module.exports = Shape
