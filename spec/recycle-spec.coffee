describe 'Arcadia.Recycle', ->

  beforeEach ->
    @recycle = new Arcadia.Recycle()

  afterEach ->
    @recycle = null

  it 'has a length property', ->
    expect(@recycle.length).toBe 0

  it 'can add objects to itself', ->
    shape = new Arcadia.Shape(0, 0, 'circle', 25)
    @recycle.add shape
    expect(@recycle.length).toBe 1

  it 'can access active objects', ->
    shape = new Arcadia.Shape(0, 0, 'circle', 25)
    @recycle.add shape
    expect(@recycle.at(0)).toBe shape
    expect(=> @recycle.at(1)).toThrow()

  describe 'activating objects when there are no inactive objects', ->
    it 'needs a factory', ->
      expect(=> @recycle.activate()).toThrow()

    it 'can activate objects with a factory', ->
      @recycle.factory = ->
        new Arcadia.Shape(0, 0, 'circle', 25)

      expect(=> @recycle.activate()).not.toThrow()
      expect(@recycle.length).toBe 1
      expect(@recycle.at(0).shape).toBe 'circle'

  describe 'activating objects when there _are_ inactive objects', ->
    it 'can activate objects', ->
      @recycle.add new Arcadia.Shape(0, 0, 'circle', 25)

      shape = new Arcadia.Shape(0, 0, 'square', 25)
      shape.active = false
      @recycle.add shape

      expect(=> @recycle.activate()).not.toThrow()
      expect(@recycle.length).toBe 2
      expect(@recycle.at(1).shape).toBe 'square'
