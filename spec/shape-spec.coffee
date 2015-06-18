describe 'Arcadia.Shape', ->
  beforeEach ->
    @shape = new Arcadia.Shape()

  afterEach ->
    @shape = null

  describe 'updating object properties', ->
    beforeEach ->
      @canvas = document.createElement('canvas')
      @context = @canvas.getContext('2d')

    describe 'size', ->
      it 'sets the `dirty` flag triggering a redraw', ->
        spyOn @shape, 'drawCanvasCache'
        @shape.size = { width: 10, height: 10 }
        @shape.draw(@context)
        expect(@shape.drawCanvasCache).toHaveBeenCalled()

  xit 'accepts a string for position', ->
    @shape.position = '-5px 10px'
    expect(@shape.position.x).toBe(-5)
    expect(@shape.position.y).toBe(10)

  xit 'accepts a string for size', ->
    @shape.size = '3px 10px'
    expect(@shape.size.width).toBe(3)
    expect(@shape.size.height).toBe(10)
