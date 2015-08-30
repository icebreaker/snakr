class Game extends Fz2D.Game
  Key = Fz2D.Input.Keyboard.Key

  version: '0.0.1'

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
    Fz2D.Plugins.Console,
    Fz2D.Plugins.GoogleAnalytics
  ]

  github:
    username: 'icebreaker'
    repository: 'snakr'
  
  ga:
    id: 'UA-3042007-2'

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

    hud.onstart = ->
      map.reset()

    map.onscore = ->
      hud.score.inc()

    map.onend = ->
      hud.reset()

    scene.add(map)
    scene.add(hud)

Game.run()
