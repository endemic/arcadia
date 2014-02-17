GameObject = require './gameobject'

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
    
    @particles = new Arcadia.Pool()
    @duration = 1
    @fade = false
    @speed = 200
    count = count || 25

    while count--
      particle = new Arcadia.Shape(0, 0, shape || 'square', size || 5)
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

    i = @particles.length
    while i--
      @particles.at(i).position.x = x
      @particles.at(i).position.y = y

      # Set random velocity/speed
      direction = Math.random() * 2 * Math.PI
      @particles.at(i).velocity.x = Math.cos(direction)
      @particles.at(i).velocity.y = Math.sin(direction)
      @particles.at(i).speed = Math.random() * @speed
      @particles.at(i).color = @color

    @timer = 0

  draw: (context, offsetX, offsetY) ->
    return if not @active

    offsetX = offsetX || 0
    offsetY = offsetY || 0

    @particles.draw(context, offsetX, offsetY)

  update: (delta) ->
    return if not @active

    i = @particles.length

    if i == 0
      @active = false

    @particles.update(delta)

    @timer += delta

    while i--
      if @fade
        @particles.at(i).colors.alpha -= delta / @duration

      if @timer >= @duration
        @particles.deactivate(i)

module.exports = Emitter