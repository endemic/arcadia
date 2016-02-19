###
@description One possible way to store common recyclable objects.
Assumes the objects you add will have an `active` property, and optionally an
`activate()` method which resets the object's state. Inspired by Programming
Linux Games (http://en.wikipedia.org/wiki/Programming_Linux_Games)
###
class Pool
  constructor: ->
    @active = []
    @inactive = []

    # Temporary variable for iteration
    @index = 0

    # Instantiate/return child objects using factory
    @factory = null

  # @description Get length of "active" objects
  @property 'length',
    get: -> @active.length

  # @description Convenience accessor
  at: (index) ->
    return @active[index]

  ###
  @description Add an object into the recycle pool
               list is z-sorted from 0 -> n, higher z-indices are drawn first
  ###
  add: (object) ->
    # Add a z-index property
    object.zIndex = @active.length + @inactive.length unless object.zIndex

    @index = 0
    while @index < @length && object.zIndex > @active[@index].zIndex
      @index += 1

    @active.splice(@index, 0, object)

    return @length

  ###
  @description Remove an object from the recycle pool
  ###
  remove: (object) ->
    if typeof object == 'number'
      index = object
      object = @active.splice(index, 1)[0]
      object.destroy() if typeof object.destroy == 'function'
      return object

    if @active.indexOf(object) != -1
      index = @active.indexOf(object)
      object = @active.splice(index, 1)[0]
      object.destroy() if typeof object.destroy == 'function'
      return object

    if @inactive.indexOf(object) != -1
      index = @inactive.indexOf(object)
      object = @inactive.splice(index, 1)[0]
      object.destroy() if typeof object.destroy == 'function'
      return object

    return undefined

  ###
  @description Get an active object by reference
  ###
  activate: (object) ->
    # Move a specific inactive object into active
    if object
      index = @inactive.indexOf(object)

      # Return undefined if object is or not found
      return undefined if index == -1

      object = @inactive.splice(index, 1)[0]
      object.reset() if typeof object.reset == 'function'

      # swap with another inactive object
      @index = @length
      while @index > 0 && @active[@index - 1].zIndex > object.zIndex
        @active[@index] = @active[@index - 1]
        @index -= 1

      @active[@index] = object

      return object

    # Move a random inactive object into active
    if !object && @inactive.length
      object = @inactive.shift()
      object.reset() if typeof object.reset == 'function'

      @index = @length
      while @index > 0 && @active[@index - 1].zIndex > object.zIndex
        @active[@index] = @active[@index - 1]
        @index -= 1

      @active[@index] = object

      return object

    # Generate a new object and add to active
    if typeof @factory != 'function'
      throw new Error('Pools need a factory function')

    @add(@factory())
    return @active[@length - 1]

  ###
  @description Deactivate an active object at a particular object/index
  ###
  deactivate: (objectOrIndex) ->
    index = if typeof objectOrIndex != 'number'
      @active.indexOf(objectOrIndex)
    else
      objectOrIndex

    # TODO: Spec this behavior
    return if index == -1

    # Save reference to deactivated object
    object = @active.splice(index, 1)[0]

    @inactive.push(object)

    return object

  ###
  @description Deactivate all child objects
  ###
  deactivateAll: ->
    @index = @length
    while @index--
      @deactivate(@index)
    return

  ###
  @description Activate all child objects
  ###
  activateAll: ->
    while @inactive.length
      @activate()
    return

  ###
  @description Passthrough method to update active child objects
  ###
  update: (delta) ->
    @index = @length
    while @index--
      @at(@index).update(delta)
    return

  ###
  @description Passthrough method to draw active child objects
  ###
  draw: ->
    @index = @length
    while @index--
      @at(@index).draw.apply(@at(@index), arguments)
    return

  ###
  @description Event handler for "start" pointer event
  @param {Array} points Array of touch/mouse coordinates
  ###
  onPointStart: (points) ->
    @index = @length
    while @index--
      @at(@index).onPointStart(points)
    return

  ###
  @description Event handler for "move" pointer event
  @param {Array} points Array of touch/mouse coordinates
  ###
  onPointMove: (points) ->
    @index = @length
    while @index--
      @at(@index).onPointMove(points)
    return

  ###
  @description Event handler for "end" pointer event
  @param {Array} points Array of touch/mouse coordinates
  ###
  onPointEnd: (points) ->
    @index = @length
    while @index--
      @at(@index).onPointEnd(points)
    return
module.exports = Pool
