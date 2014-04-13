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
    @length += 1

    # Swap with inactive object
    # TODO: test this condition
    if @length < @children.length
      @tmp = @children[@children.length - 1]
      @children[@children.length - 1] = @children[@length]
      @children[@length] = @tmp

    @length

  ###
  @description Remove an object from the recycle pool
  ###
  remove: (objectOrIndex) ->
    throw 'Must specify an object/index to remove' if objectOrIndex is undefined

    index = if objectOrIndex != 'number' then @children.indexOf objectOrIndex else objectOrIndex
    return if index is -1

    object = @children[index]
    object.destroy() if typeof object.destroy is 'function'

    @children.splice index, 1
    @length -= 1 if index < @length
    object

  ###
  @description Get an active object
  ###
  activate: (object = null) ->
    if object != null
      index = @children.indexOf(object)
      return unless @length > index > 0

      @tmp = @children[@length]
      @children[@length] = @children[index]
      @children[index] = @tmp
      @length += 1
      return @children[@length]

    if object == null && @length < @children.length
      @tmp = @children[@length]
      @tmp.reset() if typeof @tmp.reset == 'function'
      @length += 1
      return @tmp

    throw 'A Recycle Pool needs a factory defined!' if typeof @factory != 'function'
    @tmp = @factory()
    @children.push @tmp
    @length += 1
    return @tmp

  ###
  @description Deactivate an active object at a particular object/index
  ###
  deactivate: (index) ->
    index = @children.indexOf(index) if typeof index == 'object'

    return null if index >= @length || index < 0

    # Move inactive object to end
    @tmp = @children[index]
    @children[index] = @children[@children.length - 1]
    @children[@length - 1] = @tmp

    @length -= 1
    @tmp

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
  @description Passthrough method to update active child objects
  ###
  update: (delta) ->
    @tmp = @length
    while @tmp--
      @children[@tmp].update delta

  ###
  @description Passthrough method to draw active child objects
  ###
  draw: (context, offsetX = 0, offsetY = 0) ->
    @tmp = @length
    while @tmp--
      @children[@tmp].draw context, offsetX, offsetY

module.exports = Pool
