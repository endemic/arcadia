# point vendor-specific implementations to window.requestAnimationFrame
if window.requestAnimationFrame == undefined
  window.requestAnimationFrame = window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame

if window.cancelAnimationFrame == undefined
  window.cancelAnimationFrame = window.mozCancelAnimationFrame || window.webkitCancelAnimationFrame || window.msCancelAnimationFrame

Function::property = (prop, desc) ->
  Object.defineProperty @prototype, prop, desc

Vectr =
  Game: require('./game')
  Button: require('./button')
  Emitter: require('./emitter')
  GameObject: require('./gameobject')
  Label: require('./label')
  Pool: require('./pool')
  Scene: require('./scene')
  Shape: require('./shape')

if typeof module != undefined
  module.exports = Vectr
else
  window.Vectr = Vectr

###
@description Get information about the current environment
###
Vectr.env = do ->
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
Vectr.changeScene = (SceneClass) ->
  throw "Invalid scene!" if typeof SceneClass != "function"

  # Clean up previous scene
  Vectr.instance.active.destroy()

  Vectr.instance.active = new SceneClass()

###
@description Static method to translate mouse/touch input to coordinates the game will understand
Takes the <canvas> offset and scale into account
###
Vectr.getPoints = (event) ->
  # Truncate existing "points" array
  # TODO: Hard-code 5 objects which get their x/y props overwritten (or set to null)
  Vectr.instance.points.length = 0

  if event.type.indexOf('mouse') != -1
    Vectr.instance.points.push
      'x': (event.pageX - Vectr.OFFSET.x) / Vectr.SCALE
      'y': (event.pageY - Vectr.OFFSET.y) / Vectr.SCALE
  else 
    length = event.touches.length
    i = 0
    while i < length
      Vectr.instance.points.push
        x: (event.touches[i].pageX - Vectr.OFFSET.x) / Vectr.SCALE
        y: (event.touches[i].pageY - Vectr.OFFSET.y) / Vectr.SCALE
      i += 1

###
@description Static variables used to store music/sound effects
###
Vectr.music = {}
Vectr.sounds = {}
Vectr.currentMusic = null

###/**
@description Static method to play sound effects.
             Assumes you have an instance property 'sounds' filled with Buzz sound objects.
             Otherwise you can override this method to use whatever sound library you like.
###
Vectr.playSfx = (id) ->
  return if localStorage.getItem('playSfx') == "false"

  if Vectr.sounds[id] != undefined && typeof Vectr.sounds[id].play == "function"
      Vectr.sounds[id].play()

###
 * @description Static method to play music.
 * Assumes you have an instance property 'music' filled with Buzz sound objects.
 * Otherwise you can override this method to use whatever sound library you like.
###
Vectr.playMusic = (id) ->
  return if localStorage.getItem('playMusic') == "false"

  return if Vectr.currentMusic == id

  if id == undefined && Vectr.currentMusic != null
      id = Vectr.currentMusic

  if Vectr.currentMusic != null
      Vectr.music[Vectr.currentMusic]?.stop()

  Vectr.music[id]?.play()
  Vectr.currentMusic = id

###
@description Static method to stop music.
             Assumes you have an instance property 'music' filled with Buzz sound objects.
             Otherwise you can override this method to use whatever sound library you like.
###
Vectr.stopMusic = ->
  return if Vectr.currentMusic == null

  Vectr.music[Vectr.currentMusic]?.stop()
  Vectr.currentMusic = null
