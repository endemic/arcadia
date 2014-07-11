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
    shape = new Arcadia.Shape()
    spyOn @gameobj.children, 'add'
    @gameobj.add shape
    expect(@gameobj.children.add).toHaveBeenCalledWith shape

  it "passes `activate` through to children", ->
    @gameobj.children.factory = ->
      return new Arcadia.Shape()

    spyOn @gameobj.children, 'activate'
    @gameobj.activate()
    expect(@gameobj.children.activate).toHaveBeenCalled()

  it "passes `deactivate` through to children", ->
    spyOn @gameobj.children, 'deactivate'
    @gameobj.deactivate 1
    expect(@gameobj.children.deactivate).toHaveBeenCalledWith 1