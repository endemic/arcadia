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
    
    @duration = 1
    @fade = false
    @speed = 200
    @active = false
    count = count || 25

    while count--
      particle = new Shape(0, 0, shape || 'square', size || 5)
      particle.active = false
      particle.solid = true
      @children.add(particle)

  ###
   * @description Activate a particle emitter
   * @param {number} x Position of emitter on x-axis
   * @param {number} y Position of emitter on y-axis
  ###
  start: (x, y) ->
    @children.activateAll()

    @i = @children.length
    while @i--
      @particle = @children.at @i

      @particle.position.x = x
      @particle.position.y = y

      # Set random velocity/speed
      direction = Math.random() * 2 * Math.PI
      @particle.velocity.x = Math.cos direction
      @particle.velocity.y = Math.sin direction
      @particle.speed = Math.random() * @speed
      @particle.color = @color

    @active = true
    @timer = 0
    @position.x = x
    @position.y = y

  draw: (context, offsetX, offsetY) ->
    return if not @active

    offsetX = offsetX || 0
    offsetY = offsetY || 0

    @children.draw context, offsetX, offsetY

  update: (delta) ->
    return if not @active or not @children.active

    @children.update delta
    @timer += delta

    @i = @children.length
    while @i--
      @particle = @children.at @i
      @particle.colors.alpha -= delta / @duration if @fade
      @children.deactivate @i if @timer >= @duration

    return  # CoffeeScript idiosincracy; don't return the results of the while loop

module.exports = Emitter