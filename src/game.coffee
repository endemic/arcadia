class Game
  ###
   * @constructor
   * @description Main "game" object; sets up screens, input, etc.
   * @param {String} [width=640] Width of game view
   * @param {Number} [height=480] Height of game view
   * @param {Boolean} [scaleToFit=true] Full screen or not
  ###
  constructor: (width, height, SceneClass, scaleToFit) ->
    width = parseInt(width, 10) || 640
    height = parseInt(height, 10) || 480

    scaleToFit = scaleToFit || true

    Vectr.WIDTH = width
    Vectr.HEIGHT = height

    # If game is scaled up/down, clicks/touches need to be scaled
    Vectr.SCALE = 1

    # If game element is not at (0, 0), clicks/touches need to be offset
    Vectr.OFFSET =
        x: 0
        y: 0

    # Static reference to current game instance
    Vectr.instance = @

    @element = document.createElement 'div'
    @element.setAttribute 'id', 'vectr'

    @canvas = document.createElement('canvas')
    @canvas.setAttribute('width', width)
    @canvas.setAttribute('height', height)
    @context = @canvas.getContext('2d')

    @element.appendChild(@canvas)
    document.body.appendChild(@element)

    # Bind event handler callbacks
    @onResize = @onResize.bind @
    @onPointStart = @onPointStart.bind @
    @onPointMove = @onPointMove.bind @
    @onPointEnd = @onPointEnd.bind @
    @onKeyDown = @onKeyDown.bind @
    @onKeyUp = @onKeyUp.bind @
    @pause = @pause.bind @
    @resume = @resume.bind @

    # Set up event listeners Mouse and touch use the same ones
    document.addEventListener('keydown', @onKeyDown, false)
    document.addEventListener('keyup', @onKeyUp, false)
    @element.addEventListener('mousedown', @onPointStart, false)
    @element.addEventListener('mouseup', @onPointEnd, false)
    @element.addEventListener('touchstart', @onPointStart, false)
    @element.addEventListener('touchmove', @onPointMove, false)
    @element.addEventListener('touchend', @onPointEnd, false)

    # Prevent the page from scrolling when touching game element
    @element.addEventListener 'touchmove', (e) -> e.preventDefault()

    # Fit <canvas> to window
    if scaleToFit == true
        @onResize()
        window.addEventListener('resize', @onResize, false)

    if window.cordova != undefined
        document.addEventListener('pause', @pause, false)
        document.addEventListener('resume', @resume, false)

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

    # Instantiate initial scene
    @active = new SceneClass()

    # Start animation request
    @start()

  ###
  @description Pause active scene if it has a pause method
  ###
  pause: ->
    @pausedMusic = @currentMusic
    Vectr.stopMusic()

    @active.pause() if typeof @active.pause == "function"

  ###
  @description Resume active scene if it has a pause method
  ###
  resume: ->
    Vectr.playMusic @pausedMusic

    @active.resume() if typeof @active.resume == "function"

  ###
  @description Mouse/touch event callback
  ###
  onPointStart: (event) ->
    Vectr.getPoints event

    if event.type.indexOf('mouse') != -1
      @element.addEventListener 'mousemove', @onPointMove, false

    @active.onPointStart(@points) if typeof @active.onPointStart == "function"

  ###
  @description Mouse/touch event callback
  ###
  onPointMove: (event) ->
    Vectr.getPoints event

    @active.onPointMove(@points) if typeof @active.onPointMove == "function"

  ###
  @description Mouse/touch event callback
  ###
  onPointEnd: (event) ->
    Vectr.getPoints event

    if event.type.indexOf('mouse') != -1
      @element.removeEventListener('mousemove', @onPointMove, false)

    @active.onPointEnd(@points) if typeof @active.onPointEnd == "function"

  ###
  @description Keyboard event callback
  ###
  onKeyDown: (event) ->
    key = @getKey event.keyCode

    # Do nothing if key hasn't been released yet
    return if @input[key]

    @input[key] = true

    if typeof @active.onKeyDown == "function"
        @active.onKeyDown(key)

  ###
  @description Keyboard event callback
  ###
  onKeyUp: (event) ->
    key = @getKey event.keyCode

    @input[key] = false # Allow the keyDown event for this key to be sent again

    if typeof @active.onKeyUp == "function"
        @active.onKeyUp key

  ###
  @description Translate a keyboard event code into a meaningful string
  ###
  getKey: (keyCode) ->
    switch keyCode
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
    if window.performance != undefined
      previousDelta = window.performance.now()
    else
      previousDelta = Date.now()

    update = (currentDelta) =>
      delta = currentDelta - previousDelta

      previousDelta = currentDelta

      this.update(delta / 1000)

      this.updateId = window.requestAnimationFrame update

    # Start game loop
    @updateId = window.requestAnimationFrame update

  ###
  @description Cancel draw/update loops
  ###
  stop: ->
    window.cancelAnimationFrame @updateId

  ###
  @description Update callback
  ###
  update: (delta) ->
    @active.draw @context
    @active.update delta

  ###
  @description Handle window resize events. Scale the canvas element to max out the size of the current window, keep aspect ratio
  ###
  onResize: ->
    width = window.innerWidth
    height = window.innerHeight

    if width > height
      orientation = "landscape"
      aspectRatio = Vectr.WIDTH / Vectr.HEIGHT
    else
      orientation = "portrait"
      aspectRatio = Vectr.HEIGHT / Vectr.WIDTH

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

    Vectr.SCALE = height / Vectr.HEIGHT
    Vectr.OFFSET.x = (window.innerWidth - width) / 2
    Vectr.OFFSET.y = (window.innerHeight - height) / 2
    @element.setAttribute "style", "position: relative; width: #{width}px; height: #{height}px; margin: #{margin};"
    @canvas.setAttribute "style", "position: absolute; left: 0; top: 0; -webkit-transform: scale(#{Vectr.SCALE}); -webkit-transform-origin: 0 0; transform: scale(#{Vectr.SCALE}); transform-origin: 0 0;"

module.exports = Game
