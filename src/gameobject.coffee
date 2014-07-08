Pool = require './pool.coffee'

class GameObject
  constructor: (args = {}) ->
    @position = args.position || { x: 0, y: 0 }
    @fixed = args.fixed || false     # static positioning for UI elements
    @scale = args.scale ||  1
    @rotation = args.rotation || 0
    @alpha = args.alpha || 1
    @_color = args.color || '#fff'

    @_border = { width: 0, color: '#f00' }
    if typeof args.border is 'object'
      @_border.width = args.border.width
      @_border.color = args.border.color
    else if typeof args.border is 'string'
      @border = args.border

    @_shadow = { x: 0, y: 0, blur: 0, color: null }
    if typeof args.shadow is 'object'
      @_shadow.x = args.shadow.x
      @_shadow.y = args.shadow.y
      @_shadow.blur = args.shadow.blur
      @_shadow.color = args.shadow.color
    else if typeof args.shadow is 'string'
      @shadow = args.shadow

    @children = new Pool()
    @tmp = 0

  ###
  @description Getter/setter for color
  ###
  @property 'color',
    get: -> return @_color
    set: (color) ->
      @_color = color
      @drawCanvasCache() if @canvas

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
        @drawCanvasCache() if @canvas
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
        @_shadow.color = values[4]
        @drawCanvasCache() if @canvas
      else
        throw new Error 'Use format "(x)px (y)px (blur)px (color)" when setting shadows'

  ###
  @description Overridden in child objects
  ###
  drawCanvasCache: ->
    null

  ###
  @description Draw child objects
  @param {CanvasRenderingContext2D} context
  ###
  draw: (context, offsetX = 0, offsetY = 0) ->
    @children.draw context, offsetX, offsetY

  ###
  @description Update child objects
  @param {Number} delta Time since last update (in seconds)
  ###
  update: (delta) ->
    @children.update delta

  ###
  @description Add child object
  @param {Object} object Object to be added
  ###
  add: (object) ->
    @children.add object

  ###
  @description Remove child object
  @param {Object} objectOrIndex Object or index of object to be removed
  ###
  remove: (objectOrIndex) ->
    @children.remove objectOrIndex

  ###
  @description Activate child object
  @param {Object} objectOrIndex Object or index of object to be activated
  ###
  activate: (objectOrIndex) ->
    @children.activate objectOrIndex

  ###
  @description Deactivate child object
  @param {Object} objectOrIndex Object or index of object to be deactivated
  ###
  deactivate: (objectOrIndex) ->
    @children.deactivate objectOrIndex

module.exports = GameObject
