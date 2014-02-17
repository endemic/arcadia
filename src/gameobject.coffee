class GameObject
  constructor: (x, y) ->
    @position =
        'x': x || 0
        'y': y || 0

    @active = true
    @fixed = false     # static positioning for UI elements
    @scale = 1
    @rotation = 0
    @glow = 0
    @colors =
        'red': 255
        'green': 255
        'blue': 255
        'alpha': 1
    @children = []
    @i = 0

  ###
   * @description Draw child objects
   * @param {CanvasRenderingContext2D} context
  ###
  draw: (context, offsetX, offsetY) ->
    return if not @active

    offsetX = offsetX || 0
    offsetY = offsetY || 0

    @i = 0
    while @i < @children.length
      @children[@i].draw(context, offsetX, offsetY)
      @i++

  ###
   * @description Update all child objects
   * @param {Number} delta Time since last update (in seconds)
  ###
  update: (delta) ->
    return if not @active

    @i = 0
    while @i < @children.length
      @children[@i].update delta
      @i++

  ###
   * @description Add an object to the draw/update loop
   * @param {Shape} object
  ###
  add: (object) ->
    @children.push(object)
    object.parent = this

  ###
   * @description Remove a Shape object from the GameObject
   * @param {Shape} object Shape to be removed consider setting shape.active = false instead to re-use the shape later
  ###
  remove: (object) ->
    @i = @children.indexOf(object)

    if @i != -1
      delete object.parent
      @children.splice(@i, 1)

  ###
   * @description Clean up all child objects
  ###
  destroy: ->
    @i = @children.length
    while @i--
      if typeof @children[@i].destroy == "function"
        @children[@i].destroy()

  ###
   * @description Getter/setter for color value
  ###
  @property 'color',
    get: ->
      return "rgba(#{@colors.red}, #{@colors.green}, #{@colors.blue}, #{@colors.alpha})"
    set: (color) ->
      tmp = color.match /^rgba\((\d+),\s?(\d+),\s?(\d+),\s?(\d?\.?\d*)\)$/

      if tmp.length == 5
        @colors.red = parseInt tmp[1], 10
        @colors.green = parseInt tmp[2], 10
        @colors.blue = parseInt tmp[3], 10
        @colors.alpha = parseFloat tmp[4], 10

module.exports = GameObject