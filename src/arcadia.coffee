# Normalize requestAnimationFrame
if window.requestAnimationFrame == undefined
  window.requestAnimationFrame = window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame

# Normalize cancelAnimationFrame
if window.cancelAnimationFrame == undefined
  window.cancelAnimationFrame = window.mozCancelAnimationFrame || window.webkitCancelAnimationFrame || window.msCancelAnimationFrame

# Normalize window.performance
if window.performance == undefined
  nowOffset = Date.now();
  window.performance =
    now: ->
      Date.now() - nowOffset;

Function::property = (prop, desc) ->
  Object.defineProperty @prototype, prop, desc

Arcadia =
  Game: require('./game.coffee')
  Button: require('./button.coffee')
  Emitter: require('./emitter.coffee')
  GameObject: require('./gameobject.coffee')
  Label: require('./label.coffee')
  Pool: require('./pool.coffee')
  Scene: require('./scene.coffee')
  Shape: require('./shape.coffee')
  Sprite: require('./sprite.coffee')

Sona = require('sona')

# Static variables tracking performance
Arcadia.FPS = 60
Arcadia.garbageCollected = false
Arcadia.lastUsedHeap = 0

###
@description Get information about the current environment
###
Arcadia.ENV = do ->
  agent = navigator.userAgent.toLowerCase()

  android = !!(agent.match(/android/i) && agent.match(/android/i).length > 0)
  ios = !!(agent.match(/ip(hone|od|ad)/i) && agent.match(/ip(hone|od|ad)/i).length > 0)
  firefox = !!(agent.match(/firefox/i) && agent.match(/firefox/i).length > 0)

  # "mobile" here refers to a touchscreen - this is pretty janky
  mobile = !!(agent.match(/mobile/i) && agent.match(/mobile/i).length > 0) || android

  return Object.freeze
    android: android
    ios: ios
    firefox: firefox
    mobile: mobile
    desktop: !mobile
    cordova: window.cordova != undefined

###
@description Change the active scene being displayed
###
Arcadia.changeScene = (SceneClass, options = {}) ->
  Arcadia.instance.active.destroy() # Clean up previous scene
  Arcadia.instance.active = new SceneClass(options)

###
@description Static method to translate mouse/touch input to coordinates the game will understand
             Takes the <canvas> offset and scale into account
###
Arcadia.getPoints = (event, touchEnd = false) ->
  # http://jsperf.com/empty-javascript-array
  while Arcadia.points.length > 0
    Arcadia.points.pop()

  if event.type.indexOf('mouse') != -1
    Arcadia.points.unshift
      x: (event.pageX - Arcadia.OFFSET.x) / Arcadia.SCALE
      y: (event.pageY - Arcadia.OFFSET.y) / Arcadia.SCALE
  else
    source = if touchEnd then 'changedTouches' else 'touches'

    i = event[source].length
    while i--
      Arcadia.points.unshift
        x: (event[source][i].pageX - Arcadia.OFFSET.x) / Arcadia.SCALE
        y: (event[source][i].pageY - Arcadia.OFFSET.y) / Arcadia.SCALE

###
@description Static variable used to identify currently playing music track
###
Arcadia.currentMusic = null

###
@description Instantiate a Sona object and load it's assets
###
Arcadia.loadSfx = (assets, callback) ->
  Arcadia.sona = new Sona(assets)
  Arcadia.sona.load(callback)

###
@description Static method to play sound effects.
Assumes you have a static property which is a Sona object
Otherwise you can override this method to use whatever sound library you like.
###
Arcadia.playSfx = (id) ->
  return if localStorage.getItem('playSfx') == 'false'
  Arcadia.sona.play(id)

###
@description Static method to play music.
Assumes you have a static property which is a Sona object
Otherwise you can override this method to use whatever sound library you like.
###
Arcadia.playMusic = (id) ->
  return if localStorage.getItem('playMusic') == 'false'
  return if Arcadia.currentMusic == id

  if id == undefined && Arcadia.currentMusic != null
      id = Arcadia.currentMusic

  if Arcadia.currentMusic != null
      Arcadia.sona.stop(Arcadia.currentMusic)

  Arcadia.sona.loop(id)
  Arcadia.currentMusic = id

###
@description Static method to stop music.
Assumes you have a static property which is a Sona object
Otherwise you can override this method to use whatever sound library you like.
###
Arcadia.stopMusic = ->
  return if Arcadia.currentMusic == null

  Arcadia.sona.stop(Arcadia.currentMusic)
  Arcadia.currentMusic = null

module.exports = global.Arcadia = Arcadia
