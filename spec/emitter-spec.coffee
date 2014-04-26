describe 'Arcadia.Emitter', ->

  beforeEach ->
    @factory = -> return new Arcadia.Shape()
    @emitter = new Arcadia.Emitter(@factory)

  afterEach ->
    @emitter = null

  it 'requires a factory function', ->
    expect(=> new Arcadia.Emitter()).toThrow()
    expect(=> new Arcadia.Emitter(@factory)).not.toThrow()

  it 'creates particles', ->
    particles = new Arcadia.Emitter @factory, 100
    expect(particles.children.children.length).toBe 100

  it 'tries to reset particles when activating', ->
    factory = ->
      shape = new Arcadia.Shape()
      shape.reset = -> @shape = 'circle'
      shape

    particles = new Arcadia.Emitter factory
    spyOn particles.children.children[0], 'reset'
    particles.startAt 0, 0

    expect(particles.children.at(0).reset).toHaveBeenCalled()

