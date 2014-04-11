class Recycle
  constructor: ->
    @children = []
    @length = 0
    @tmp = null

    # Instantiate/return child objects using factory
    @factory = null

  at: (index) ->
    throw "No child at index #{index}" if index >= @length
    @children[index]

  add: (object) ->
    @children.push object

    if object.active
      # Swap with inactive object
      @tmp = @children[@children.length - 1]
      @children[@children.length - 1] = @children[@length]
      @children[@length] = @tmp
      @length += 1

    @length

  activate: ->
    if @length < @children.length
      @tmp = @children[@length]
      @tmp.activate() if typeof @tmp.activate == 'function'
    else
      throw 'A Recycle Pool needs a factory defined!' if typeof @factory != 'function'
      @tmp = @factory()
      @children.push @tmp

    @length += 1
    @tmp

module.exports = Recycle
