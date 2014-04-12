describe 'Arcadia.GameObject', ->
  beforeEach ->
    @gameobj = new Arcadia.GameObject()

  afterEach ->
    @gameobj = null

  it 'can set/get a color value', ->
    @gameobj.color = 'rgba(0, 0, 0, 1)'
    expect(@gameobj.color).toBe('rgba(0, 0, 0, 1)')

  it 'can have objects added to it', ->
    @gameobj.add new Arcadia.Shape(0, 0, 'circle', 25)
    expect(@gameobj.children.length).toBe 1

  it "updates its' active child objects", ->
    activeShape = new Arcadia.Shape(0, 0, 'circle', 25)
    activeShape.velocity.x = 10

    inactiveShape = new Arcadia.Shape(0, 0, 'circle', 25)
    inactiveShape.velocity.x = 10

    @gameobj.add activeShape
    @gameobj.add inactiveShape
    @gameobj.children.deactivate inactiveShape

    expect(@gameobj.children.length).toBe 1

    @gameobj.update(1)
    spyOn activeShape, 'update'
    spyOn inactiveShape, 'update'

    expect(=> @gameobj.update(1)).not.toThrow()
    expect(activeShape.update).toHaveBeenCalled()
    expect(inactiveShape.update).not.toHaveBeenCalled()
