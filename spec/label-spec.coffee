describe 'Arcadia.Label', ->

  beforeEach ->
    @canvas = document.createElement 'canvas'
    @context = @canvas.getContext '2d'
    @label = new Arcadia.Label
      position:
        x: 0
        y: 0
      text: 'Hey you guys!'

  afterEach ->
    @label = null

  it 'can draw itself', ->
    expect(=> @label.draw(@context)).not.toThrow()

  it 'can get its height/width', ->
    expect(@label.width).toBe 94
    expect(@label.height).toBe 16
