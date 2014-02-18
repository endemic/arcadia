###
* @description Object pool One possible way to store common recyclable objects
###
class Pool
  constructor: (size) ->
    @length = 0
    @inactiveLength = 0
    @activeObjects = []
    @inactiveObjects = []

    while size--
      @activeObjects.push null
      @inactiveObjects.push null

    @tmp = 0            # Iterator

  ###
   * @description Get the next "inactive" object in the Pool
  ###
  activate: ->
    if @inactiveLength > 0 && @inactiveObjects[@inactiveLength - 1] != null
      @activeObjects[@length] = @inactiveObjects[@inactiveLength - 1]
      @inactiveObjects[@inactiveLength - 1] = null
      @activeObjects[@length].active = true
      @activeObjects[@length].activate() if typeof @activeObjects[@length].activate is 'function'
      @length += 1
      @inactiveLength -= 1

  ###
   * @description Activate all the objects in the pool
  ###
  activateAll: ->
    while @inactiveLength--
      @activeObjects[@length] = @inactiveObjects[@inactiveLength]
      @inactiveObjects[@inactiveLength] = null
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
    @inactiveObjects[@inactiveLength] = @activeObjects[@tmp]

    while @tmp < @length
      @activeObjects[@tmp] = @activeObjects[@tmp + 1]
      @tmp += 1

    @length -= 1

  ###
   * @description Deactivate all objects in pool
  ###
  deactivateAll: ->
    while @length--
      @inactiveObjects[@inactiveLength] = @activeObjects[@length]
      @inactiveObjects[@inactiveLength].active = true
      @activeObjects[@length] = null
      @inactiveLength += 1

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
    else
      if @inactiveLength + 1 > @inactiveObjects.length
        @activeObjects.push null
        @inactiveObjects.push null

      @inactiveObjects[@inactiveLength] = object
      @inactiveLength += 1

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
