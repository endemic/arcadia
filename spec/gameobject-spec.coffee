describe 'Arcadia.GameObject', ->
  beforeEach ->
    @gameobj = new Arcadia.GameObject()

  afterEach ->
    @gameobj = null

  it "passes `draw` through to children", ->
    spyOn @gameobj.children, 'draw'
    @gameobj.draw null, 1, 2
    expect(@gameobj.children.draw).toHaveBeenCalledWith null, 1, 2

  it "passes `update` through to children", ->
    spyOn @gameobj.children, 'update'
    @gameobj.update 1
    expect(@gameobj.children.update).toHaveBeenCalledWith 1
