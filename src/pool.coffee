###
* @description Object pool One possible way to store common recyclable objects
###
class Pool
  constructor: (size) ->
    @active = true
    @length = 0
    @inactive = 0
    @activeObjects = []
    @inactiveObjects = []

    size = size || 0
    while size--
      @activeObjects.push null
      @inactiveObjects.push null

    @tmp = 0            # Iterator

  ###
   * @description Get the next "inactive" object in the Pool
  ###
  activate: ->
    return null if @inactive < 1

    @activeObjects[@length] = @inactiveObjects[@inactive - 1]
    @inactiveObjects[@inactive - 1] = null
    @activeObjects[@length].active = true
    @activeObjects[@length].activate() if typeof @activeObjects[@length].activate is 'function'
    @length += 1
    @inactive -= 1
    @active = true if not @active
    return @activeObjects[@length - 1]

  ###
   * @description Activate all the objects in the pool
  ###
  activateAll: ->
    @active = true
    while @inactive--
      @activeObjects[@length] = @inactiveObjects[@inactive]
      @inactiveObjects[@inactive] = null
      @activeObjects[@length].active = true
      @activeObjects[@length].activate() if typeof @activeObjects[@length].activate is 'function'
      @length += 1

  ###
   * @description Deactivate an object (won't be drawn/updated)
  ###
  deactivate: (object) ->
    @tmp = @activeObjects.indexOf object
    return if @tmp == -1

    @activeObjects[@tmp].active = false
    @inactiveObjects[@inactive] = @activeObjects[@tmp]

    while @tmp < @length
      @activeObjects[@tmp] = @activeObjects[@tmp + 1]
      @tmp += 1

    @length -= 1
    @active = false if not @length

  ###
   * @description Deactivate all objects in pool
  ###
  deactivateAll: ->
    @active = false
    while @length--
      @inactiveObjects[@inactive] = @activeObjects[@length]
      @inactiveObjects[@inactive].active = true
      @activeObjects[@length] = null
      @inactive += 1

  ###
   * @description Convenience method to access a particular child index
  ###
  at: (index) ->
    return @activeObjects[index] || null

  ###
   * @description Add object to one of the lists
  ###
  add: (object) ->
    throw "Pool objects need an 'active' property." if object.active is undefined

    if object.active
      if @length + 1 > @activeObjects.length
        @activeObjects.push null
        @inactiveObjects.push null

      @activeObjects[@length] = object
      @length += 1
      @active = true
    else
      if @inactive + 1 > @inactiveObjects.length
        @activeObjects.push null
        @inactiveObjects.push null

      @inactiveObjects[@inactive] = object
      @inactive += 1

  ###
   * @description "Passthrough" method which updates active child objects
  ###
  update: (delta) ->
    @tmp = @length
    while @tmp--
      @activeObjects[@tmp].update delta
      @deactivate @tmp if not @activeObjects[@tmp].active

  ###
   * @description "Passthrough" method which draws active child objects
  ###
  draw: (context, offsetX, offsetY) ->
    offsetX = offsetX || 0
    offsetY = offsetY || 0

    @tmp = @length
    while @tmp--
      @activeObjects[@tmp].draw context, offsetX, offsetY

module.exports = Pool
