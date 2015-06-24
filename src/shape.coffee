GameObject = require('./gameobject.coffee')
Easie = require('../vendor/easie.coffee')

class Shape extends GameObject
  ###
  @description Shape constructor
  @param {Object} args Object representing shape options
  ###
  constructor: (args = {}) ->
    super(args)

    # Internal drawing cache
    @canvas = document.createElement('canvas')

    # Default graphical options; changing these requires using setters/getters,
    # since the cache would need to be redrawn
    @_color    = '#fff';
    @_border   = { width: 0, color: '#fff' }
    @_shadow   = { x: 0, y: 0, blur: 0, color: '#fff' }
    @_vertices = 4
    @_size     = { width: 10, height: 10 }

    # Trigger initial cache draw
    @dirty = true

    @velocity = args.velocity || { x: 0, y: 0 }
    @acceleration = args.acceleration || { x: 0, y: 0 }
    @speed = args.speed       || 1
    @debug = args.debug       || false
    @fixed = args.fixed       || false # By default, moves with camera
    @angularVelocity = args.angularVelocity || 0

    @color    = args.color  if args.color
    @border   = args.border if args.border
    @shadow   = args.shadow if args.shadow
    @vertices = args.vertices if args.vertices
    @size     = args.size if args.size

    @path     = args.path   if args.path  # Custom drawing function
    @anchor   = { x: @size.width / 2, y: @size.height / 2 }
    @tweens   = []

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
      values = border.match(/^(\d+px) (.+)$/)

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
      values = shadow.match(/^(.+) (.+) (.+) (.+)$/)

      if values?.length == 5
        @_shadow.x = parseInt values[1], 10
        @_shadow.y = parseInt values[2], 10
        @_shadow.blur = parseInt values[3], 10
        @_shadow.color = values[4] # TODO: rgba(x, x, x, x) doesn't work
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

    @setAnchorPoint()

    context = @canvas.getContext('2d')
    context.lineJoin = 'miter'

    context.beginPath()

    # Draw anchor point and border in red
    if @debug
      context.lineWidth = 1
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
          context.moveTo(-@size.width / 2, -@size.height / 2)
          context.lineTo(@size.width / 2, -@size.height / 2)
          context.lineTo(@size.width / 2, @size.height / 2)
          context.lineTo(-@size.width / 2, @size.height / 2)
          context.lineTo(-@size.width / 2, -@size.height / 2)
        else
          context.arc(0, 0, @size.width / 2, 0, 2 * Math.PI) # x, y, radius, startAngle, endAngle

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
    @anchor.x = x
    @anchor.y = y

  ###
  @description Draw object
  @param {CanvasRenderingContext2D} context
  ###
  draw: (context, offsetX = 0, offsetY = 0, offsetRotation = 0) ->
    offsetX = offsetY = 0 if @fixed

    context.save()

    context.translate(offsetX, offsetY)
    context.rotate(offsetRotation) if offsetRotation != 0

    context.translate(@position.x, @position.y)
    context.rotate(@rotation) if @rotation != 0

    context.scale(@scale, @scale) if @scale != 1
    context.globalAlpha = @alpha if @alpha < 1

    # Update internal <canvas> cache if necessary
    @drawCanvasCache() if @dirty

    # Draw from cache
    context.drawImage(@canvas, -@anchor.x, -@anchor.y)

    # Reset scale/rotation/alpha
    context.restore()
    # context.rotate(-@rotation) if @rotation != 0 && @rotation != Math.PI * 2
    # context.translate(-@position.x - offsetX, -@position.y - offsetY)
    # context.scale(1, 1) if @scale != 1
    # context.globalAlpha = 1 if @alpha < 1

    # Draw child objects last, so they will be on the "top"
    super(context, @position.x + offsetX, @position.y + offsetY, @rotation + offsetRotation)

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
      @tweens.splice(i, 1) if tween.time == tween.duration

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
    Math.abs(@position.x - other.position.x) < @size.width / 2 + other.size.width / 2 && Math.abs(@position.y - other.position.y) < @size.height / 2 + other.size.height / 2

  tween: (property, target, duration = 500, easing = 'linearNone') ->
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

module.exports = Shape
