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
    expect(particles.children.inactive.length).toBe 100

  it 'tries to reset particles when activating', ->
    factory = ->
      shape = new Arcadia.Shape()
      shape.reset = -> @shape = 'circle'
      shape

    particles = new Arcadia.Emitter factory
    particle = particles.children.inactive[0]
    spyOn(particle, 'reset')
    particles.startAt 0, 0

    expect(particle.reset).toHaveBeenCalled()

