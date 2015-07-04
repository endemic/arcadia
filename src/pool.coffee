###
@description One possible way to store common recyclable objects.
Assumes the objects you add will have an `active` property, and optionally an
`activate()` method which resets the object's state. Inspired by Programming
Linux Games (http://en.wikipedia.org/wiki/Programming_Linux_Games)
###
class Pool
  constructor: ->
    @children = []
    @length = 0
    @tmp = null

    # Instantiate/return child objects using factory
    @factory = null

  at: (index) ->
    return null if index >= @length
    @children[index]

  ###
  @description Push an object into the recycle pool
  ###
  add: (object) ->
    @children.push object

    # Swap with inactive object
    if @length < @children.length
      @tmp = @children[@children.length - 1]
      @children[@children.length - 1] = @children[@length]
      @children[@length] = @tmp

    @length += 1
    @length

  ###
  @description Remove an object from the recycle pool
  ###
  remove: (objectOrIndex) ->
    throw new Error('Must specify an object/index to remove') if objectOrIndex is undefined

    index = if typeof objectOrIndex != 'number' then @children.indexOf objectOrIndex else objectOrIndex
    return if index is -1

    object = @children.splice(index, 1)[0]
    object.destroy() if typeof object.destroy is 'function'

    @length -= 1 if index < @length
    object

  ###
  @description Get an active object by either reference or index
  ###
  activate: (objectOrIndex) ->
    if objectOrIndex != undefined
      index = if typeof objectOrIndex != 'number' then @children.indexOf(objectOrIndex) else objectOrIndex

      # TODO: Spec this behavior
      return null unless @children.length > index >= @length

      @tmp = @children[@length]
      @children[@length] = @children[index]
      @children[index] = @tmp
      @tmp = null
      @length += 1
      return @children[@length - 1]

    if objectOrIndex == undefined && @length < @children.length
      @length += 1
      @children[@length - 1].reset() if typeof @children[@length - 1].reset == 'function'
      return @children[@length - 1]

    throw new Error('Pools need a factory function') if typeof @factory != 'function'

    @children.push @factory()
    @length += 1
    return @children[@length - 1]

  ###
  @description Deactivate an active object at a particular object/index
  ###
  deactivate: (objectOrIndex) ->
    index = if typeof objectOrIndex != 'number' then @children.indexOf(objectOrIndex) else objectOrIndex

    # TODO: Spec this behavior
    return null if index >= @length || index < 0

    # Move inactive object to end
    @tmp = @children[index]
    @children[index] = @children[@length - 1]
    @children[@length - 1] = @tmp
    @tmp = null

    @length -= 1
    @children[@length]

  ###
  @description Deactivate all child objects
  ###
  deactivateAll: ->
    @length = 0

  ###
  @description Activate all child objects
  ###
  activateAll: ->
    @length = @children.length
    while @length--
      @tmp = @children[@length]
      @tmp.reset() if typeof @tmp.reset == 'function'
    @length = @children.length

  ###
  @description Destroy all child objects
  ###
  destroyAll: ->
    @length = @children.length
    while @length--
      @tmp = @children[@length]
      @tmp.destroy() if typeof @tmp.destroy == 'function'
    @length = 0

  ###
  @description Passthrough method to update active child objects
  ###
  update: (delta) ->
    @tmp = @length
    while @tmp--
      @children[@tmp].update(delta)
    return

  ###
  @description Passthrough method to draw active child objects
  TODO: perhaps change `draw` call to `draw.apply(@, arguments)`
  ###
  draw: (context, offsetX, offsetY, offsetRotation, offsetScale) ->
    @tmp = @length
    while @tmp--
      @children[@tmp].draw(context, offsetX, offsetY, offsetRotation, offsetScale)
    return

module.exports = Pool
