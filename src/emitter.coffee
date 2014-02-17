GameObject = require './gameobject'
Pool = require './pool'
Shape = require './shape'

class Emitter extends GameObject
  ###
   * @constructor
   * @description Basic particle emitter
   * @param {string} [shape='square'] Shape of the particles. Accepts strings that are valid for Shapes (e.g. "circle", "triangle")
   * @param {number} [size=10] Size of the particles
   * @param {number} [count=25] The number of particles created for the system
  ###
  constructor: (shape, size, count) ->
    super
    
    @particles = new Pool()
    @duration = 1
    @fade = false
    @speed = 200
    @active = false
    count = count || 25

    while count--
      particle = new Shape(0, 0, shape || 'square', size || 5)
      particle.active = false
      particle.solid = true
      @particles.add(particle)

  ###
   * @description Activate a particle emitter
   * @param {number} x Position of emitter on x-axis
   * @param {number} y Position of emitter on y-axis
  ###
  start: (x, y) ->
    @particles.activateAll()
    @active = true
    
    @position.x = x
    @position.y = y

    @i = @particles.length
    while @i--
      @particle = @particles.at @i

      @particle.position.x = x
      @particle.position.y = y

      # Set random velocity/speed
      direction = Math.random() * 2 * Math.PI
      @particle.velocity.x = Math.cos(direction)
      @particle.velocity.y = Math.sin(direction)
      @particle.speed = Math.random() * @speed
      @particle.color = @color

    @timer = 0

  draw: (context, offsetX, offsetY) ->
    return if not @active

    offsetX = offsetX || 0
    offsetY = offsetY || 0

    @particles.draw context, offsetX, offsetY

  update: (delta) ->
    return if not @active

    @i = @particles.length
    if @i == 0
      @active = false
      return

    @particles.update delta
    @timer += delta

    while @i--
      @particle = @particles.at @i
      @particle.colors.alpha -= delta / @duration if @fade
      @particles.deactivate @i if @timer >= @duration

    return true

module.exports = Emitter