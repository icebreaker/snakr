class Game extends Fz2D.Game
  Key = Fz2D.Input.Keyboard.Key

  version: '0.0.2'

  w: window.innerWidth
  h: window.innerHeight
  bg: '#D4D1A4'
  fg: '#000000'

  assets:
    sprites: 'sprites.atlas'
    sounds:
      pickup: 'pickup.ogg'
      hit   : 'hit.ogg'
      death : 'death.ogg'
  
  plugins: [
    Fz2D.Plugins.GitHub,
    Fz2D.Plugins.Stats,
    Fz2D.Plugins.Console
  ]

  github:
    username: 'icebreaker'
    repository: 'snakr'
  
  volume: 10

  onload: (game) ->
    game.input.mouse.hide() if Fz2D.production?

    assets = game.assets
    scene = game.scene
    storage = game.storage

    sprites = assets.sprites
    sounds = assets.sounds

    for k, sound of sounds
      sound.setVolume(game.volume)

    hud = new Hud(scene.w, scene.h, sprites, storage, game.version)
    map = new Map(scene.w, scene.h, sprites, sounds)

    hud.onprestart = ->
      map.reset()
      map.snake.alive = false
      map.snake.control_scheme = hud.getControlScheme()

    hud.onstart = ->
      map.snake.alive = true

    map.onscore = ->
      hud.score.inc()

    map.onend = ->
      hud.reset()

    scene.add(map)
    scene.add(hud)

Game.run()
