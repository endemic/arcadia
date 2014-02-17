###
* @description Object pool One possible way to store common recyclable objects
###
class Pool
  constructor: ->
    @pool = []        # Pool objects
    @i = 0            # Iterator
    @active = false   # Whether pool has any active objects
    @activeCount = 0  # Number of active objects
    @length = 0       # Shortcut for @pool.length

  ###
   * @description Get the next "inactive" object in the Pool
  ###
  activate: ->
    @i = @length
    while @i--
      if not @pool[@i].active
        @active = true
        @activeCount += 1
        @pool[@i].active = true
        @pool[@i].activate() if typeof @pool[@i].activate is 'function'
        return @pool[@i]
    return null

  ###
   * @description Activate all the objects in the pool
  ###
  activateAll: ->
    @active = true
    @i = @length
    while @i--
      if not @pool[@i].active
        @activeCount += 1
        @pool[@i].active = true
        @pool[@i].activate() if typeof @pool[@i].activate is 'function'

  ###
   * @description Deactivate an object (won't be drawn/updated)
  ###
  deactivate: (index) ->
    return if @pool[index] is undefined

    @pool[index].active = false
    @activeCount -= 1
    @active = false if @activeCount == 0

  ###
   * @description Deactivate all objects in pool
  ###
  deactivateAll: ->
    @active = false
    @i = @length
    while @i--
      if @pool[@i].active
        @active -= 1
        @pool[@i].active = false

  ###
   * @description Convenience method to access a particular child index
  ###
  at: (index) ->
    return @pool[index] || null

  ###
   * @description Add object to one of the lists
  ###
  add: (object) ->
    throw "Pool objects need an 'active' property." if object.active is undefined

    @pool.push(object)
    @length += 1

    if object.active
      @activeCount += 1
      @active = true

  ###
   * @description "Passthrough" method which updates active child objects
  ###
  update: (delta) ->
    @i = @length
    while @i--
      @pool[@i].update delta
      @deactivate @i if not @pool[@i].active

  ###
   * @description "Passthrough" method which draws active child objects
  ###
  draw: (context, offsetX, offsetY) ->
    offsetX = offsetX || 0
    offsetY = offsetY || 0

    @i = @length
    while @i--
      @pool[@i].draw context, offsetX, offsetY

module.exports = Pool