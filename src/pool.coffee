###
* @description Object pool One possible way to store common recyclable objects
###
class Pool
  constructor: (size = 0) ->
    @activeLength = 0
    @inactiveLength = 0
    @activeObjects = []
    @inactiveLengthObjects = []

    while size--
      @activeObjects.push null
      @inactiveLengthObjects.push null

    @tmp = 0            # Iterator
    @active = true

  ###
   * @description Getter/setter for # of active objects value
  ###
  @property 'length',
    get: -> return @activeLength

  ###
   * @description Get the next "inactive" object in the Pool
  ###
  activate: ->
    return null if @inactiveLength < 1

    @activeObjects[@activeLength] = @inactiveLengthObjects[@inactiveLength - 1]
    @inactiveLengthObjects[@inactiveLength - 1] = null
    @activeObjects[@activeLength].active = true
    @activeObjects[@activeLength].activate() if typeof @activeObjects[@activeLength].activate is 'function'
    @activeLength += 1
    @inactiveLength -= 1
    @active = true
    return @activeObjects[@activeLength - 1]

  ###
   * @description Activate all the objects in the pool
  ###
  activateAll: ->
    while @inactiveLength--
      @activeObjects[@activeLength] = @inactiveLengthObjects[@inactiveLength]
      @inactiveLengthObjects[@inactiveLength] = null
      @activeObjects[@activeLength].active = true
      @activeObjects[@activeLength].activate() if typeof @activeObjects[@activeLength].activate is 'function'
      @activeLength += 1

    @active = true

  ###
   * @description Deactivate an object (won't be drawn/updated)
  ###
  deactivate: (object) ->
    @tmp = @activeObjects.indexOf object
    return if @tmp == -1

    @activeObjects[@tmp].active = false
    @inactiveLengthObjects[@inactiveLength] = @activeObjects[@tmp]

    while @tmp < @activeLength
      @activeObjects[@tmp] = @activeObjects[@tmp + 1]
      @tmp += 1

    @activeLength -= 1
    @active = false if not @activeLength

  ###
   * @description Deactivate all objects in pool
  ###
  deactivateAll: ->
    @active = false
    while @activeLength--
      @inactiveLengthObjects[@inactiveLength] = @activeObjects[@activeLength]
      @inactiveLengthObjects[@inactiveLength].active = true
      @activeObjects[@activeLength] = null
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
      # Increase size of internal storage arrays if necessary
      if @activeLength + 1 > @activeObjects.length
        @activeObjects.push null
        @inactiveLengthObjects.push null

      @activeObjects[@activeLength] = object
      @activeLength += 1
    else
      # Increase size of internal storage arrays if necessary
      if @inactiveLength + 1 > @inactiveLengthObjects.length
        @activeObjects.push null
        @inactiveLengthObjects.push null

      @inactiveLengthObjects[@inactiveLength] = object
      @inactiveLength += 1

  @active = if @activeLength > 0 then true else false

  ###
   * @description "Passthrough" method which updates active child objects
  ###
  update: (delta) ->
    @tmp = @activeLength
    while @tmp--
      @activeObjects[@tmp].update delta

  ###
   * @description "Passthrough" method which draws active child objects
  ###
  draw: (context, offsetX, offsetY) ->
    offsetX = offsetX || 0
    offsetY = offsetY || 0

    @tmp = @activeLength
    while @tmp--
      @activeObjects[@tmp].draw context, offsetX, offsetY

module.exports = Pool
