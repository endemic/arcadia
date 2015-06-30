class Game
  ###
   * @constructor
   * @description Main "game" object; sets up screens, input, etc.
   * @param {Object} args Config object. Allowed keys: width, height, scene, scaleToFit
  ###
  constructor: (args = {}) ->
    Arcadia = require './arcadia.coffee'
    Arcadia.WIDTH = parseInt(args.width, 10) || 320
    Arcadia.HEIGHT = parseInt(args.height, 10) || 480

    # If game is scaled up/down, clicks/touches need to be scaled
    Arcadia.SCALE = 1

    # If game element is not at (0, 0) (upper left), clicks/touches need to be offset
    Arcadia.OFFSET = { x: 0, y: 0 }

    @element = document.createElement('div')
    @element.id = 'arcadia'

    @canvas = document.createElement('canvas')
    @canvas.width = Arcadia.WIDTH
    @canvas.height = Arcadia.HEIGHT

    @element.appendChild(@canvas)
    document.body.appendChild(@element)

    @context = @canvas.getContext('2d')

    # @setPixelRatio()

    # Map of current input, used to prevent duplicate events being sent to handlers
    # ("keydown" events fire continuously while a key is held)
    @input =
      'left': false
      'up': false
      'right': false
      'down': false
      'w': false
      'a': false
      's': false
      'd': false
      'enter': false
      'escape': false
      'space': false
      'control': false
      'z': false
      'x': false

    # Stores objects representing mouse/touch input
    @points = []

    # Static reference to current game instance
    Arcadia.instance = @
    # Static reference to array of point objects
    Arcadia.points = @points
    # Static reference to DOM element the game is attached to
    Arcadia.element = @element

    # Bind event handler callbacks
    @onResize = @onResize.bind @
    @onPointStart = @onPointStart.bind @
    @onPointMove = @onPointMove.bind @
    @onPointEnd = @onPointEnd.bind @
    @onKeyDown = @onKeyDown.bind @
    @onKeyUp = @onKeyUp.bind @
    @pause = @pause.bind @
    @resume = @resume.bind @

    # Set up event listeners - mouse and touch use the same ones
    document.addEventListener 'keydown', @onKeyDown, false
    document.addEventListener 'keyup', @onKeyUp, false
    @element.addEventListener 'mousedown', @onPointStart, false
    @element.addEventListener 'mouseup', @onPointEnd, false
    @element.addEventListener 'touchstart', @onPointStart, false
    @element.addEventListener 'touchmove', @onPointMove, false
    @element.addEventListener 'touchend', @onPointEnd, false

    # Prevent the page from scrolling when touching game element
    @element.addEventListener 'touchmove', (e) -> e.preventDefault()

    # Add non-standard event listeners for "native" Cordova apps
    if window.cordova != undefined
      document.addEventListener 'pause', @pause, false
      document.addEventListener 'resume', @resume, false

    # Instantiate initial scene
    @active = new args.scene()

    # Fit <canvas> to window
    if args.scaleToFit
      @onResize()
      window.addEventListener('resize', @onResize, false)

    # Start animation request
    @start()

  ###
  @description Pause active scene if it has a pause method
  ###
  pause: ->
    @pausedMusic = @currentMusic
    Arcadia.stopMusic()

    @active.pause() if typeof @active.pause == "function"

  ###
  @description Resume active scene if it has a pause method
  ###
  resume: ->
    Arcadia.playMusic @pausedMusic

    @active.resume() if typeof @active.resume == "function"

  ###
  @description Mouse/touch event callback
  ###
  onPointStart: (event) ->
    Arcadia.getPoints event

    if event.type.indexOf('mouse') != -1
      @element.addEventListener('mousemove', @onPointMove, false)

    @active.onPointStart(@points) if typeof @active.onPointStart == "function"

  ###
  @description Mouse/touch event callback
  ###
  onPointMove: (event) ->
    Arcadia.getPoints event

    @active.onPointMove(@points) if typeof @active.onPointMove == "function"

  ###
  @description Mouse/touch event callback
  TODO: Generates garbage
  ###
  onPointEnd: (event) ->
    Arcadia.getPoints(event)

    if event.type.indexOf('mouse') != -1
      @element.removeEventListener('mousemove', @onPointMove, false)

    @active.onPointEnd(@points) if typeof @active.onPointEnd == "function"

  ###
  @description Keyboard event callback
  TODO: Generates garbage
  ###
  onKeyDown: (event) ->
    key = @getKey event.keyCode

    # Do nothing if key hasn't been released yet
    return if @input[key]

    @input[key] = true

    # Call current screen's "onKeyUp" method
    @active.onKeyDown key if typeof @active.onKeyDown == "function"

  ###
  @description Keyboard event callback
  TODO: Generates garbage
  ###
  onKeyUp: (event) ->
    key = @getKey event.keyCode

    @input[key] = false # Allow the keyDown event for this key to be sent again

    # Call current screen's "onKeyUp" method
    @active.onKeyUp key if typeof @active.onKeyUp == "function"

  ###
  @description Translate a keyboard event code into a meaningful string
  ###
  getKey: (keyCode) ->
    switch keyCode
      # TODO: Make an implemention something like this
      # when 37 then @input['left'] = true
      # when 38 then @input['up'] = true
      when 37 then return 'left'
      when 38 then return 'up'
      when 39 then return 'right'
      when 40 then return 'down'
      when 87 then return 'w'
      when 65 then return 'a'
      when 83 then return 's'
      when 68 then return 'd'
      when 13 then return 'enter'
      when 27 then return 'escape'
      when 32 then return 'space'
      when 17 then return 'control'
      when 90 then return 'z'
      when 88 then return 'x'

  ###
   * @description Start the event/animation loops
  ###
  start: ->
    @previousDelta = window.performance.now()

    Arcadia.lastUsedHeap = window.performance.memory.usedJSHeapSize if window.performance.memory?

    # Start game loop
    @updateId = window.requestAnimationFrame @update

  ###
  @description Cancel draw/update loops
  ###
  stop: ->
    window.cancelAnimationFrame @updateId

  ###
  @description Update callback
  ###
  update: (currentDelta) =>
    delta = currentDelta - @previousDelta
    @previousDelta = currentDelta
    
    Arcadia.FPS = Arcadia.FPS * 0.9 + 1000 / delta * 0.1 # delta == milliseconds

    if window.performance.memory?
      Arcadia.garbageCollected = true if window.performance.memory.usedJSHeapSize < Arcadia.lastUsedHeap
      Arcadia.lastUsedHeap = window.performance.memory.usedJSHeapSize

    @active.draw(@context)
    @active.update(delta / 1000) # call update() using seconds

    Arcadia.garbageCollected = false
    @updateId = window.requestAnimationFrame @update

  ###
  @description Change size of canvas based on pixel density
  ###
  setPixelRatio: ->
    if window.devicePixelRatio == undefined
      window.devicePixelRatio = 1

    if @context.backingStorePixelRatio == undefined
      @context.backingStorePixelRatio = @context.webkitBackingStorePixelRatio || 1

    Arcadia.PIXEL_RATIO = window.devicePixelRatio / @context.backingStorePixelRatio

    @canvas.width = Arcadia.WIDTH * Arcadia.PIXEL_RATIO
    @canvas.height = Arcadia.HEIGHT * Arcadia.PIXEL_RATIO

    @canvas.style.width = "#{Arcadia.WIDTH}px"
    @canvas.style.height = "#{Arcadia.HEIGHT}px"
    # @context.scale(Arcadia.PIXEL_RATIO, Arcadia.PIXEL_RATIO)
    # @context.setTransform(Arcadia.PIXEL_RATIO, 0, 0, Arcadia.PIXEL_RATIO, 0, 0)

  ###
  @description Handle window resize events. Scale the canvas element to max out the size of the current window, keep aspect ratio
  ###
  onResize: ->
    width = window.innerWidth
    height = window.innerHeight

    if width > height
      orientation = "landscape"
      aspectRatio = Arcadia.WIDTH / Arcadia.HEIGHT
    else
      orientation = "portrait"
      aspectRatio = Arcadia.HEIGHT / Arcadia.WIDTH

    if orientation == "landscape"
      if width / aspectRatio > height  # Too wide
        width = height * aspectRatio
        margin = '0 ' + ((window.innerWidth - width) / 2) + 'px'
      else if width / aspectRatio < height  # Too high
        height = width / aspectRatio
        margin = ((window.innerHeight - height) / 2) + 'px 0'
    else if orientation == "portrait"
      if height / aspectRatio > width   # Too high
        height = width * aspectRatio
        margin = ((window.innerHeight - height) / 2) + 'px 0'
      else if height / aspectRatio < width  # Too wide
        width = height / aspectRatio
        margin = '0 ' + ((window.innerWidth - width) / 2) + 'px'

    Arcadia.SCALE = height / Arcadia.HEIGHT
    Arcadia.OFFSET.x = (window.innerWidth - width) / 2
    Arcadia.OFFSET.y = (window.innerHeight - height) / 2

    @element.setAttribute 'style', "position: relative; width: #{width}px; height: #{height}px; margin: #{margin};"
    # @canvas.setAttribute 'style', "position: absolute; left: 0; top: 0; width: #{width}px; height: #{height}px;"
    @canvas.setAttribute 'style', "position: absolute; left: 0; top: 0; -webkit-transform: scale(#{Arcadia.SCALE}); -webkit-transform-origin: 0 0; transform: scale(#{Arcadia.SCALE}); transform-origin: 0 0;"

module.exports = Game
