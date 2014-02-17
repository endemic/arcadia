###
* @description Object pool One possible way to store common recyclable objects
###
class Pool
  constructor: ->
    @children = []    # Active objects
    @i = 0            # Iterator
    @active = 0       # Current number of active objects in the pool
    @length = 0       # Shortcut for @children.length

  ###
   * @description Get the next "inactive" object in the Pool
  ###
  activate: ->
    @i = @length
    while @i--
      if not @children[@i].active
        @active += 1
        @children[@i].active = true
        @children[@i].activate() if typeof @children[@i].activate is 'function'
        return @children[@i]
    return null

  ###
   * @description Activate all the objects in the pool
  ###
  activateAll: ->
    @i = @length
    while @i--
      if not @children[@i].active
        @active += 1
        @children[@i].active = true
        @children[@i].activate() if typeof @children[@i].activate is 'function'

  ###
   * @description Deactivate an object (won't be drawn/updated)
  ###
  deactivate: (index) ->
    return if @children[index] is undefined

    @children[index].active = false
    @active -= 1

  ###
   * @description Deactivate all objects in pool
  ###
  deactivateAll: ->
    @i = @length
    while @i--
      if @children[@i].active
        @active -= 1
        @children[@i].active = false

  ###
   * @description Convenience method to access a particular child index
  ###
  at: (index) ->
    return @children[index] || null

  ###
   * @description Add object to one of the lists
  ###
  add: (object) ->
    throw "Pool objects need an 'active' property." if object.active is undefined

    @children.push(object)
    @length++
    @active++ if object.active

  ###
   * @description "Passthrough" method which updates active child objects
  ###
  update: (delta) ->
    @i = @length
    while @i--
      @children[@i].update delta
      @deactivate @i if not @children[@i].active

  ###
   * @description "Passthrough" method which draws active child objects
  ###
  draw: (context, offsetX, offsetY) ->
    @i = @length

    offsetX = offsetX || 0
    offsetY = offsetY || 0

    while @i--
      @children[@i].draw context, offsetX, offsetY

module.exports = Pool