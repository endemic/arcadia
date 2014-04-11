describe 'Arcadia.Pool', ->

  beforeEach ->
    @pool = new Arcadia.Pool()

  afterEach ->
    @pool = null

  it 'has a length property', ->
    expect(@pool.length).toBe 0

  it 'can add objects to itself', ->
    shape = new Arcadia.Shape(0, 0, 'circle', 25)
    @pool.add shape
    expect(@pool.length).toBe 1

  it 'can access active objects', ->
    shape = new Arcadia.Shape(0, 0, 'circle', 25)
    @pool.add shape
    expect(@pool.at(0)).toBe shape
    expect(@pool.at(1)).toBe null

  describe 'activating objects when there are no inactive objects', ->
    it 'needs a factory', ->
      expect(=> @pool.activate()).toThrow()

    it 'can activate objects with a factory', ->
      @pool.factory = ->
        new Arcadia.Shape(0, 0, 'circle', 25)

      expect(=> @pool.activate()).not.toThrow()
      expect(@pool.length).toBe 1
      expect(@pool.at(0).shape).toBe 'circle'

  describe 'activating objects when there _are_ inactive objects', ->
    it 'can activate objects', ->
      @pool.add new Arcadia.Shape(0, 0, 'circle', 25)

      shape = new Arcadia.Shape(0, 0, 'square', 25)
      shape.active = false
      @pool.add shape

      expect(=> @pool.activate()).not.toThrow()
      expect(@pool.length).toBe 2
      expect(@pool.at(1).shape).toBe 'square'

  it 'can deactivate objects', ->
    @pool.add new Arcadia.Shape(0, 0, 'circle', 25)
    @pool.add new Arcadia.Shape(0, 0, 'square', 25)
    @pool.add new Arcadia.Shape(0, 0, 'triangle', 25)
    expect(@pool.length).toBe 3

    @pool.deactivate 0
    expect(@pool.length).toBe 2
    expect(@pool.at(0).shape).toBe 'triangle'
    expect(@pool.at(1).shape).toBe 'square'
    expect(@pool.at(2)).toBe null

  it 'can deactivate all its objects at once', ->
    i = 10
    while i--
      @pool.add new Arcadia.Shape(0, 0, 'circle', 25)

    expect(@pool.at(9).shape).toBe 'circle'
    expect(=> @pool.deactivateAll()).not.toThrow()
    expect(@pool.at(0)).toBe null

  it 'can activate all its objects at once', ->
    i = 10
    while i--
      @pool.add new Arcadia.Shape(0, 0, 'circle', 25)

    @pool.deactivateAll()
    expect(@pool.at(0)).toBe null

    expect(=> @pool.activateAll()).not.toThrow()
    expect(@pool.at(9).shape).toBe 'circle'

  it 'can update its active objects', ->
    shape1 = new Arcadia.Shape(0, 0, 'circle', 25)
    shape2 = new Arcadia.Shape(0, 0, 'circle', 25)
    shape2.active = false
    @pool.add shape1
    @pool.add shape2
    spyOn shape1, 'update'
    spyOn shape2, 'update'

    expect(=> @pool.update(1)).not.toThrow()
    expect(shape1.update).toHaveBeenCalled()
    expect(shape2.update).not.toHaveBeenCalled()

  it 'can draw its active objects', ->
    shape1 = new Arcadia.Shape(0, 0, 'circle', 25)
    shape2 = new Arcadia.Shape(0, 0, 'circle', 25)
    shape1.active = false
    @pool.add shape1
    @pool.add shape2
    spyOn shape1, 'draw'
    spyOn shape2, 'draw'

    expect(=> @pool.draw(1)).not.toThrow()
    expect(shape2.draw).toHaveBeenCalled()
    expect(shape1.draw).not.toHaveBeenCalled()
