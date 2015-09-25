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
    return @children[index]

  ###
  @description Add an object into the recycle pool
               list is z-sorted from 0 -> n, higher z-indices are drawn first
  ###
  add: (object) ->
    object.zIndex = @length unless object.zIndex

    @tmp = @length
    while @tmp > 0 && @children[@tmp - 1].zIndex > object.zIndex
      @children[@tmp] = @children[@tmp - 1]
      @tmp -= 1

    @children[@tmp] = object
    @length += 1

    return @length

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
  @description Get an active object by reference
  ###
  activate: (object) ->
    # Move a specific inactive object into active
    if object != undefined
      index = @children.indexOf(object)

      # Return undefined if object is already active (or not found)
      return undefined if 0 <= index < @length

      object = @children[index]
      object.reset() if typeof object.reset == 'function'

      # swap with another inactive object
      @tmp = @length
      while @tmp > 0 && @children[@tmp - 1].zIndex > object.zIndex
        @children[@tmp] = @children[@tmp - 1]
        @tmp -= 1

      @children[@tmp] = object
      @length += 1

      return object

    # Move a random inactive object into active
    if object == undefined && @length < @children.length
      object = @children[@length]
      object.reset() if typeof object.reset == 'function'

      @tmp = @length
      while @tmp > 0 && @children[@tmp - 1].zIndex > object.zIndex
        @children[@tmp] = @children[@tmp - 1]
        @tmp -= 1

      @children[@tmp] = object
      @length += 1

      return object

    # Generate a new object and add to active
    if typeof @factory != 'function'
      throw new Error('Pools need a factory function')

    @add(@factory())
    return @children[@length - 1]

  ###
  @description Deactivate an active object at a particular object/index
  ###
  deactivate: (objectOrIndex) ->
    index = if typeof objectOrIndex != 'number' then @children.indexOf(objectOrIndex) else objectOrIndex

    # TODO: Spec this behavior
    return undefined unless 0 <= index < @length

    # Save reference to deactivated object
    object = @children[index]

    # shift the rest of the contents downwards
    @tmp = index
    while @tmp < @length
      @children[@tmp] = @children[@tmp + 1]
      @tmp += 1

    # Place deactivated object at the end
    @children[@length - 1] = object
    @length -= 1
    
    return object

  ###
  @description Deactivate all child objects
  ###
  deactivateAll: ->
    @length = 0

  ###
  @description Activate all child objects
  ###
  activateAll: ->
    @length = @tmp = @children.length
    while @tmp--
      @children[@tmp].reset() if typeof @children[@tmp].reset == 'function'

    # ensure sort order
    @children.sort (a, b) ->
      a.zIndex - b.zIndex
    return

  ###
  @description Destroy all child objects
  ###
  destroyAll: ->
    @length = @children.length
    while @length--
      @children[@length].destroy() if typeof @children[@length].destroy == 'function'
    return

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
  ###
  draw: ->
    @tmp = @length
    while @tmp--
      @children[@tmp].draw.apply(@children[@tmp], arguments)
    return

module.exports = Pool
