# Normalize requestAnimationFrame
if window.requestAnimationFrame == undefined
  window.requestAnimationFrame = window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame

# Normalize cancelAnimationFrame
if window.cancelAnimationFrame == undefined
  window.cancelAnimationFrame = window.mozCancelAnimationFrame || window.webkitCancelAnimationFrame || window.msCancelAnimationFrame

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

module.exports = Arcadia

###
@description Get information about the current environment
###
Arcadia.env = do ->
  agent = navigator.userAgent.toLowerCase()

  android = (agent.match(/android/i) && agent.match(/android/i).length > 0) || false
  ios = (agent.match(/ip(hone|od|ad)/i) && agent.match(/ip(hone|od|ad)/i).length) > 0 || false
  firefox = (agent.match(/firefox/i) && agent.match(/firefox/i).length > 0) || false

  # "mobile" here refers to a touchscreen - this is pretty janky
  mobile = ((agent.match(/mobile/i) && agent.match(/mobile/i).length > 0) || false) || android

  return {
    android: android
    ios: ios
    firefox: firefox
    mobile: mobile
    desktop: !mobile
    cordova: window.cordova != undefined
  }

###
@description Change the active scene being displayed
###
Arcadia.changeScene = (SceneClass) ->
  throw "Invalid scene!" if typeof SceneClass != "function"

  # Clean up previous scene
  Arcadia.instance.active.destroy()

  Arcadia.instance.active = new SceneClass()

###
@description Static method to translate mouse/touch input to coordinates the game will understand
             Takes the <canvas> offset and scale into account
###
Arcadia.getPoints = (event) ->
  if event.type.indexOf('mouse') != -1
    Arcadia.instance.points.length = 1
    Arcadia.instance.points.coordinates[0] =
      x: (event.pageX - Arcadia.OFFSET.x) / Arcadia.SCALE
      y: (event.pageY - Arcadia.OFFSET.y) / Arcadia.SCALE
  else 
    Arcadia.instance.points.length = event.touches.length
    i = 0
    while i < length
      Arcadia.instance.points.coordinates[i].x = (event.touches[i].pageX - Arcadia.OFFSET.x) / Arcadia.SCALE
      Arcadia.instance.points.coordinates[i].y = (event.touches[i].pageY - Arcadia.OFFSET.y) / Arcadia.SCALE
      i += 1

###
@description Static variables used to store music/sound effects
###
Arcadia.music = {}
Arcadia.sounds = {}
Arcadia.currentMusic = null

###/**
@description Static method to play sound effects.
             Assumes you have an instance property 'sounds' filled with Buzz sound objects.
             Otherwise you can override this method to use whatever sound library you like.
###
Arcadia.playSfx = (id) ->
  return if localStorage.getItem('playSfx') == "false"

  if Arcadia.sounds[id] != undefined && typeof Arcadia.sounds[id].play == "function"
      Arcadia.sounds[id].play()

###
 * @description Static method to play music.
 * Assumes you have an instance property 'music' filled with Buzz sound objects.
 * Otherwise you can override this method to use whatever sound library you like.
###
Arcadia.playMusic = (id) ->
  return if localStorage.getItem('playMusic') == "false"

  return if Arcadia.currentMusic == id

  if id == undefined && Arcadia.currentMusic != null
      id = Arcadia.currentMusic

  if Arcadia.currentMusic != null
      Arcadia.music[Arcadia.currentMusic]?.stop()

  Arcadia.music[id]?.play()
  Arcadia.currentMusic = id

###
@description Static method to stop music.
             Assumes you have an instance property 'music' filled with Buzz sound objects.
             Otherwise you can override this method to use whatever sound library you like.
###
Arcadia.stopMusic = ->
  return if Arcadia.currentMusic == null

  Arcadia.music[Arcadia.currentMusic]?.stop()
  Arcadia.currentMusic = null
