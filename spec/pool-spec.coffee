describe 'Arcadia.Pool', ->

  beforeEach ->
    @pool = new Arcadia.Pool()

  afterEach ->
    @pool = null

  it 'has a length property', ->
    expect(@pool.length).toBe(0)

  it 'can have Arcadia objects added to it', ->
    shape = new Arcadia.Shape(0, 0, 'circle', 25)
    @pool.add(shape)
    expect(@pool.length).toBe(1)
    expect(@pool.at(0)).toBe(shape)

  it "can't have non-Arcadia objects added to it", ->
    obj =
      property: "fgsfds"

    expect(->
      @pool.add(obj)
    ).toThrow()

  it 'can return activated objects', ->
    shape = new Arcadia.Shape(0, 0, 'circle', 25)
    shape.active = false
    @pool.add(shape)

    expect(@pool.activate()).not.toBeNull()

  it "doesn't allow direct access of inactive objects", ->
    shape = new Arcadia.Shape(0, 0, 'circle', 25)
    shape.active = false
    @pool.add(shape)
    expect(@pool.length).toBe(0)
    expect(@pool.at(0)).toBeNull()

  it "updates its' active child objects", ->
    activeShape = new Arcadia.Shape(0, 0, 'circle', 25)
    activeShape.velocity.x = 10

    inactiveShape = new Arcadia.Shape(0, 0, 'circle', 25)
    inactiveShape.velocity.x = 10
    inactiveShape.active = false

    @pool.add(activeShape)
    @pool.add(inactiveShape)

    @pool.update(1)

    expect(activeShape.position.x).toBe(10)
    expect(inactiveShape.position.x).toBe(0)
