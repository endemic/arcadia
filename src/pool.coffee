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

  ###
  @description Get an active object
  ###
  activate: (object = null) ->
    # TODO: conditional based on whether you want to activate a specific object
    if @length < @children.length
      @tmp = @children[@length]
      @tmp.activate() if typeof @tmp.activate == 'function'
    else
      throw 'A Recycle Pool needs a factory defined!' if typeof @factory != 'function'
      @tmp = @factory()
      @children.push @tmp

    @length += 1
    @tmp

  ###
  @description Deactivate an active object at a particular object/index
  ###
  deactivate: (index) ->
    index = @children.indexOf(index) if typeof index == 'object'

    return false if index >= @length || index < 0

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
      @tmp.activate() if typeof @tmp.activate == 'function'
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
