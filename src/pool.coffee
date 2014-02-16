###
* @description Object pool One possible way to store common recyclable objects
###
class Pool
  constructor: ->
    @length = 0
    @children = []       # Active objects
    @inactive = []     # Deadpool
    @i = 0             # in-memory iterator/object storage

  ###
   * @description Get the next "inactive" object in the Pool
  ###
  activate: ->
    return null if @inactive.length is 0

    @i = @inactive.pop()
    @i.active = true
    @i.activate() if typeof @i.activate == 'function'
    @children.push(@i)
    @length += 1

    return @i

  ###
   * @description Activate all the objects in the pool
  ###
  activateAll: ->
    while @inactive.length
      @i = @inactive.pop()
      @i.active = true
      if typeof @i.activate == 'function'
        @i.activate()

      @children.push(@i)
      @length += 1

  ###
   * @description Move object to the deadpool
  ###
  deactivate: (index) ->
      return if @children[index] is undefined

      @children[index].active = false
      @inactive.push(@children[index])

      # Shift array contents downward
      @i = index
      while @i < @children.length - 1
        @children[@i] = @children[@i + 1]
        @i += 1

      @children.length -= 1
      @length -= 1

      if @length == 0
        @active = false

  ###
   * @description Move object to the deadpool
  ###
  deactivateAll: ->
    while @children.length
      @i = @children.pop()
      @i.active = false
      @inactive.push(@i)
      @length -= 1

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

    if object.active
      @children.push(object)
      @length += 1
    else
      @inactive.push(object)

  ###
   * @description "Passthrough" method which updates active child objects
  ###
  update: (delta) ->
    @i = @children.length

    while @i--
      @children[@i].update(delta)

      # If a child object is marked as "inactive," move it to the dead pool
      @deactivate(@i) if not @children[@i].active

  ###
   * @description "Passthrough" method which draws active child objects
  ###
  draw: (context, offsetX, offsetY) ->
    @i = @children.length

    offsetX = offsetX || 0
    offsetY = offsetY || 0

    while @i--
      @children[@i].draw(context, offsetX, offsetY)

module.exports = Pool