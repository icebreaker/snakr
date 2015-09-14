class Hud extends Fz2D.Group
  Key = Fz2D.Input.Keyboard.Key
  Key.ONE = '1'.charCodeAt(0)
  Key.TWO = '2'.charCodeAt(0)

  Button = Fz2D.Input.Mouse.Button

  constructor: (w, h, sprites, @storage, version) ->
    super(0, 0, w, h)

    @font_16 = new Fz2D.Font(sprites.getTexture('font_16'), 16)
    @font_32 = new Fz2D.Font(sprites.getTexture('font_32'), 32)

    text = 'Snakr'

    rect = @font_32.measureText(text)

    cx  = (w - rect.w) >> 1
    cy  = (h - rect.h) >> 1
    cy -= rect.h << 1

    @title = new Fz2D.Gui.Label(text, cx, cy, @font_32)
    @add(@title)

    text = 'Press <Space> to start'
    rect = @font_16.measureText(text)

    cx = (w - rect.w) >> 1
    cy = (h - rect.h) >> 1

    @label = new Fz2D.Gui.Label(text, cx, cy, @font_16)
    @label.blink = 800
    @add(@label)

    @label_2 = @add(new Fz2D.Gui.Label('', 0, 0, @font_16))
    @setControlScheme(@getControlScheme())

    text = "Score:"
    rect = @font_16.measureText(text)

    score_label = new Fz2D.Gui.Label(text, 10, rect.h, @font_16)
    @add(score_label)

    @score = new Fz2D.Gui.Label('0', rect.w + 10, rect.h, @font_16)
    @add(@score)

    text = "High Score:"
    rect = @font_16.measureText(text)

    high_score_label = new Fz2D.Gui.Label(text, 10, rect.h + 30, @font_16)
    @add(high_score_label)

    @high_score = new Fz2D.Gui.Label(@storage.get('highscore').toString(), rect.w + 10, rect.h + 30, @font_16)
    @add(@high_score)

    version_label = new Fz2D.Gui.Label('v' + version, 10, h - 30, @font_16)
    @add(version_label)

    rect = @font_32.measureText('3')

    cx  = (w - rect.w) >> 1
    cy  = (h - rect.h) >> 1
    cy -= rect.h << 1

    @countdown = @add(new Fz2D.Gui.Countdown(3, cx, cy, @font_32))
    @countdown.onend = =>
      @countdown.kill()
      @onstart()
    @countdown.exists = false

  onprestart: () ->
    # pass

  onstart: () ->
    # pass

  update: (timer, input) ->
    super
    return unless @title.exists

    if input.keys.pressed[Key.SPACE]
      @kill()
      @onprestart()
      @countdown.reset()
    else if input.keys.pressed[Key.ONE]
      @setControlScheme(1)
    else if input.keys.pressed[Key.TWO]
      @setControlScheme(2)

  kill: () ->
    @label.kill()
    @label_2.kill()
    @title.kill()

  reset: () ->
    @label.reset()
    @label_2.reset()
    @title.reset()

    if @score.toInt() > @high_score.toInt()
      @high_score.setText(@score.text)
      @storage.set('highscore', @score.text)

    @score.setText('0')

  setControlScheme: (value) ->
    @storage.set('controlscheme', value)
    
    if value == 1
      text = 'Control Scheme: (1) 2'
    else
      text = 'Control Scheme: 1 (2)'

    rect = @font_16.measureText(text)

    @label_2.x = (@w - rect.w) >> 1
    @label_2.y = ((@h - rect.h) >> 1) + (rect.h << 2)
    @label_2.setText(text)

  getControlScheme: () ->
    @storage.get('controlscheme', 1)
