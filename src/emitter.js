GameObject  = require './gameobject.coffee'
Pool        = require './pool.coffee'
Shape       = require './shape.coffee'

class Emitter extends GameObject
  ###
   * @constructor
   * @description Basic particle emitter
   * @param {string} [shape='square'] Shape of the particles. Accepts strings that are valid for Shapes (e.g. "circle", "triangle")
   * @param {number} [size=10] Size of the particles
   * @param {number} [count=25] The number of particles created for the system
  ###
  constructor: (factory, count = 25) ->
    throw new Error('Emitter requires a factory function') if typeof factory != 'function'

    super

    @duration = 1
    @fade = false
    @scale = 1.0
    @speed = 200
    @i = @particle = null

    while count--
      @children.add factory()

    @children.deactivateAll()

  ###
   * @description Activate a particle emitter
   * @param {number} x Position of emitter on x-axis
   * @param {number} y Position of emitter on y-axis
  ###
  startAt: (x, y) ->
    @children.activateAll()
    @reset()

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

    @timer = 0
    @position.x = x
    @position.y = y

  update: (delta) ->
    super delta

    @timer += delta

    @i = @children.length
    while @i--
      @particle = @children.at @i
      @children.deactivate @i if @timer >= @duration
      #@particle.colors.alpha -= delta / @duration if @fade
      @particle.scale += @scale * delta / @duration if @scale != 1.0

    return # CoffeeScript idiosyncrasy; don't return the results of the while loop

  reset: ->
    @i = @children.length
    while @i--
      @particle = @children.at @i
      @particle.reset() if typeof @particle.reset == 'function'

module.exports = Emitter
