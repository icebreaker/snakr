class BaseLoot extends Fz2D.Entity
  constructor: (texture, @grid) ->
    super(texture)
    @exists = false

    @timer = new Timer()
    @timer.ontick = =>
      @visible = !@visible if @timer.ticks < 5
    @timer.onend = =>
      @kill()

  use: (snake) ->
    @kill()
    snake.grow()

  kill: () ->
    @timer.stop()
    @grid.unset(@xx, @yy) if @xx? and @yy?
    super

  reset: (x, y) ->
    [isox, isoy] = @grid.toIso(x, y, -2, 16)
    @grid.set(x, y, @)

    super(isox, isoy)

    @timer.reset(10)

  update: (timer, input) ->
    super
    @timer.update(timer)
