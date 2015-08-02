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

module.exports = global.Arcadia = Arcadia
