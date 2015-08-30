class Hud extends Fz2D.Group
  Key = Fz2D.Input.Keyboard.Key
  Button = Fz2D.Input.Mouse.Button

  constructor: (w, h, sprites, @storage, version) ->
    super(0, 0, w, h)

    font_16 = new Fz2D.Font(sprites.getTexture('font_16'), 16)
    font_32 = new Fz2D.Font(sprites.getTexture('font_32'), 32)

    text = 'Snakr'

    rect = font_32.measureText(text)

    cx  = (w - rect.w) >> 1
    cy  = (h - rect.h) >> 1
    cy -= rect.h << 1

    @title = new Fz2D.Gui.Label(text, cx, cy, font_32)
    @add(@title)

    if Fz2D.touch?
      text = 'Touch to start'
    else
      text = 'Press <Space> to start'

    rect = font_16.measureText(text)

    cx = (w - rect.w) >> 1
    cy = (h - rect.h) >> 1

    @label = new Fz2D.Gui.Label(text, cx, cy, font_16)
    @label.blink = 800
    @add(@label)

    text = "Score:"
    rect = font_16.measureText(text)

    score_label = new Fz2D.Gui.Label(text, 10, rect.h, font_16)
    @add(score_label)

    @score = new Fz2D.Gui.Label('0', rect.w + 10, rect.h, font_16)
    @add(@score)

    text = "High Score:"
    rect = font_16.measureText(text)

    high_score_label = new Fz2D.Gui.Label(text, 10, rect.h + 30, font_16)
    @add(high_score_label)

    @high_score = new Fz2D.Gui.Label(@storage.get('highscore').toString(), rect.w + 10, rect.h + 30, font_16)
    @add(@high_score)

    version_label = new Fz2D.Gui.Label('v' + version, 10, h - 30, font_16)
    @add(version_label)

  onstart: () ->
    # pass

  update: (timer, input) ->
    super

    if @title.exists and (input.keys.pressed[Key.SPACE] or input.mouse.pressed[Button.LEFT])
      @kill()
      @onstart()

  kill: () ->
    @label.kill()
    @title.kill()

  reset: () ->
    @label.reset()
    @title.reset()

    if @score.toInt() > @high_score.toInt()
      @high_score.setText(@score.text)
      @storage.set('highscore', @score.text)

    @score.setText('0')
