class Pit extends Fz2D.Entity
  constructor: (@sprites, @grid) ->
    super(@sprites.getTexture('pit'))

    anim = @addAnimation('cycle', @sprites.getTexture('pit_cycle'), 8, 800)
    anim.onend = =>
      @kill()

  isOver: (x, y) ->
    @xx == x and @yy == y

  reset: (x, y) ->
    if x? and y?
      @xx = x
      @yy = y

      [isox, isoy] = @grid.toIso(x, y, -17, 0)
      super(isox, isoy)

      @visible = false
      @alive = false
    else
      super
      @play('cycle')

    @
