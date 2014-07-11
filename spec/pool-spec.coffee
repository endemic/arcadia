describe 'Arcadia.Pool', ->

  beforeEach ->
    @pool = new Arcadia.Pool()

  afterEach ->
    @pool = null

  it 'has a length property', ->
    expect(@pool.length).toBe 0

  describe 'adding objects', ->
    it 'can add objects to itself', ->
      shape = new Arcadia.Shape(0, 0, 'circle', 25)
      @pool.add shape
      expect(@pool.length).toBe 1
      expect(@pool.at(0)).toBe shape

    it 'keeps inactive objects at the end of the internal array', ->
      @pool.add new Arcadia.Shape({ vertices: 3 })
      @pool.add new Arcadia.Shape({ vertices: 3 })
      @pool.deactivate 0
      @pool.deactivate 0
      expect(@pool.length).toBe 0

      @pool.add new Arcadia.Shape({ vertices: 4 })
      expect(@pool.length).toBe 1
      expect(@pool.at(0).vertices).toBe 4

      @pool.add new Arcadia.Shape({ vertices: 5 })
      expect(@pool.length).toBe 2
      expect(@pool.at(1).vertices).toBe 5

  it 'can remove objects', ->
    while @pool.length < 10
      @pool.add new Arcadia.Shape({ vertices: 3 })

    @pool.deactivate 9
    @pool.deactivate 8
    expect(@pool.length).toBe 8

    shape = @pool.at 0
    # ensure "destroy" method is called when object is removed
    shape.destroy = ->
      console.log 'pass'
    spyOn shape, 'destroy'

    expect(=> @pool.remove()).toThrow()
    expect(@pool.remove(shape)).toBe shape
    expect(shape.destroy).toHaveBeenCalled()
    expect(@pool.length).toBe 7

  it 'can access active objects', ->
    shape = new Arcadia.Shape({ vertices: 3 })
    @pool.add shape
    expect(@pool.at(0)).toBe shape
    expect(@pool.at(1)).toBe null

  describe 'activating objects when there are no inactive objects', ->
    it 'needs a factory', ->
      expect(=> @pool.activate()).toThrow()

    it 'can activate objects with a factory', ->
      @pool.factory = ->
        new Arcadia.Shape({ vertices: 7 })

      expect(=> @pool.activate()).not.toThrow()
      expect(@pool.length).toBe 1
      expect(@pool.at(0).vertices).toBe 7

  describe 'activating objects when there _are_ inactive objects', ->
    it 'can activate objects', ->
      while @pool.length < 10
        @pool.add new Arcadia.Shape({ vertices: 3 })

      @pool.deactivate 0
      expect(@pool.length).toBe 9

      expect(=> @pool.activate()).not.toThrow()
      expect(@pool.length).toBe 10

  it 'can deactivate objects', ->
    @pool.add new Arcadia.Shape({ vertices: 8 })
    @pool.add new Arcadia.Shape({ vertices: 4 })
    @pool.add new Arcadia.Shape({ vertices: 3 })
    expect(@pool.length).toBe 3

    @pool.deactivate 0

    expect(@pool.length).toBe 2
    expect(@pool.at(0).vertices).toBe 3
    expect(@pool.at(1).vertices).toBe 4
    expect(@pool.at(2)).toBe null

  it 'can deactivate all its objects at once', ->
    while @pool.length < 10
      @pool.add new Arcadia.Shape({ vertices: 10 })

    expect(@pool.at(9).vertices).toBe 10
    expect(=> @pool.deactivateAll()).not.toThrow()
    expect(@pool.at(0)).toBe null

  it 'can activate all its objects at once', ->
    while @pool.length < 10
      @pool.add new Arcadia.Shape({ vertices: 6 })

    @pool.deactivateAll()
    expect(@pool.at(0)).toBe null

    expect(=> @pool.activateAll()).not.toThrow()
    expect(@pool.at(9).vertices).toBe 6

  it 'can update its active objects', ->
    shape1 = new Arcadia.Shape()
    shape2 = new Arcadia.Shape()
    @pool.add shape1
    @pool.add shape2
    @pool.deactivate shape2
    spyOn shape1, 'update'
    spyOn shape2, 'update'

    expect(=> @pool.update(1)).not.toThrow()
    expect(shape1.update).toHaveBeenCalled()
    expect(shape2.update).not.toHaveBeenCalled()

  it 'can draw its active objects', ->
    shape1 = new Arcadia.Shape()
    shape2 = new Arcadia.Shape()
    @pool.add shape1
    @pool.add shape2
    @pool.deactivate shape1
    spyOn shape1, 'draw'
    spyOn shape2, 'draw'

    expect(=> @pool.draw(1)).not.toThrow()
    expect(shape2.draw).toHaveBeenCalled()
    expect(shape1.draw).not.toHaveBeenCalled()
