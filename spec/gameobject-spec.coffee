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

  it "passes `add` through to children", ->
    spyOn @gameobj.children, 'add'
    shape = new Arcadia.Shape(0, 0, 'circle', 25)
    @gameobj.add shape
    expect(@gameobj.children.add).toHaveBeenCalledWith shape

  it "passes `remove` through to children", ->
    spyOn @gameobj.children, 'remove'
    shape = new Arcadia.Shape(0, 0, 'circle', 25)
    @gameobj.add shape
    @gameobj.remove shape
    expect(@gameobj.children.remove).toHaveBeenCalledWith shape
    expect(@gameobj.children.length).toBe 0

  it "passes `activate` through to children", ->
    spyOn @gameobj.children, 'activate'
    @gameobj.children.factory = ->
      new Arcadia.Shape(0, 0, 'circle', 25)

    @gameobj.children.activate()
    expect(@gameobj.children.activate).toHaveBeenCalled

  it "passes `deactivate` through to children", ->
    spyOn @gameobj.children, 'deactivate'
    @gameobj.add new Arcadia.Shape(0, 0, 'circle', 25)

    @gameobj.children.deactivate 0
    expect(@gameobj.children.deactivate).toHaveBeenCalledWith 0