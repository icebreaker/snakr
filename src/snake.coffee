class Snake extends Fz2D.Entity
  Key = Fz2D.Input.Keyboard.Key

  constructor: (@sprites, @grid) ->
    [x, y, isox, isoy] = @grid.getRandomWithIso(-2, 16)
    @grid.set(x, y, @)

    super(@sprites.getTexture('snake_side'), isox, isoy)

    @addAnimation('side', @sprites.getTexture('snake_side'))
    @addAnimation('back', @sprites.getTexture('snake_back'))
    @addAnimation('body', @sprites.getTexture('snake_body'))

    @random = new Random()

    if @random.flip() == 1
      @_dx = 1
      @_dy = 0
    else
      @_dx = 0
      @_dy = 1

    @_play()

    @_dt = 0

    @parts = [@]

    @can_turn = true

    @timer = new Timer(500)
    @timer.onstart = =>
      @kill()
    @timer.ontick = =>
      for i in [0..@parts.length-1]
        body = @parts[i]
        body.visible = !body.visible
    @timer.onend = =>
      @kill()

  kill: () ->
    super if @timer.ended
    @onkill()

  ongrow: () ->
    # pass

  onshrink: () ->
    # pass

  onkill: () ->
    # pass
  
  turn: (dx, dy) ->
    return unless @can_turn

    if dx == 0 and dy == 0
      return

    if (dx < 0 and @_dx > 0) or (dx > 0 and @_dx < 0) or (dy < 0 and @_dy > 0) or (dy > 0 and @_dy < 0)
       return

    @_dx = dx
    @_dy = dy

    @can_turn = false
    null

  grow: () ->
    body = new Fz2D.Entity(@sprites.getTexture('snake_body'))

    last_body = @parts[@parts.length - 1]
    @group.add(@grid.set(last_body.xx, last_body.yy, body))

    @parts.push(body)

    @ongrow(body)

    body

  shrink: () ->
    @onshrink()
    null

  move: (dt) ->
    @_dt += dt

    if @_dt < 400
      return
 
    @_dt = 0

    @_play()

    x = @xx
    y = @yy

    if x == 0 or y == 0 or x == 11 or y == 11
      @timer.reset(5)
      return
    
    entity = @grid.get(x + @_dx, y + @_dy)
    if entity?
      if entity instanceof BaseLoot
        entity.use(@)
      else
        @timer.reset(5)
        return

    @can_turn = true

    x += @_dx
    y += @_dy

    for i in [0..@parts.length-1]
      @group.pits.each (pit) =>
        if pit.exists and pit.isOver(x, y)
          pit.reset()
          return false

      body = @parts[i]

      [isox, isoy] = @grid.toIso(x, y, -2, 16)

      body.x = isox
      body.y = isoy

      xx = body.xx
      yy = body.yy

      @grid.set(x, y, body)

      x = xx
      y = yy

    @grid.unset(x, y)

  update: (timer, input) ->
    super

    @timer.update(timer)
    return if @timer.active

    @move(timer.dt)

    #dx = input.keys.pressed[Key.DOWN] - input.keys.pressed[Key.UP]
    #dy = input.keys.pressed[Key.LEFT] - input.keys.pressed[Key.RIGHT]

    dx = input.keys.pressed[Key.DOWN] - input.keys.pressed[Key.UP]
    dy = input.keys.pressed[Key.RIGHT] - input.keys.pressed[Key.LEFT]

    @turn(dy, dx)

  _play: () ->
    if @_dx > 0
      @play('back')
    else if @_dx < 0
      @play('body')
    else if @_dy < 0
      @play('body')
    else if @_dy > 0
      @play('side')
