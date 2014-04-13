describe 'Arcadia.Label', ->

  beforeEach ->
    @canvas = document.createElement 'canvas'
    @context = @canvas.getContext '2d'
    @label = new Arcadia.Label 0, 0, 'Hey you guys!'

  afterEach ->
    @label = null

  it 'can draw itself', ->
    expect(=> @label.draw(@context)).not.toThrow()

  it 'can get its width', ->
    expect(@label.width(@context)).toBe 78 # implementation dependent?
