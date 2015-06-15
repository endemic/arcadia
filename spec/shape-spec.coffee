describe 'Arcadia.Shape', ->
  beforeEach ->
    @shape = new Arcadia.Shape()

  afterEach ->
    @shape = null

  describe 'updating object properties', ->
    describe 'width', ->
      it 're-draws internal cache', ->
        spyOn @shape, 'drawCanvasCache'
        @shape.width = 100
        expect(@shape.drawCanvasCache).toHaveBeenCalled()

  it 'accepts a string for position', ->
    @shape = new Arcadia.Shape({
      position: '-5px 10px'
    })
    expect(@shape.position.x).toBe(-5)
    expect(@shape.position.y).toBe(10)

  xit 'accepts a string for size', ->
    @shape.size = '3px 10px'
    expect(@shape.size.width).toBe(3)
    expect(@shape.size.height).toBe(10)
