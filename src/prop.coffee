class Prop extends Fz2D.Entity
  constructor: (name, @ox, @oy, @sprites, @grid) ->
    super(@sprites.getTexture(name))
    @addAnimation('alpha', @sprites.getTexture("#{name}_alpha"))

  reset: () ->
    [x, y, isox, isoy] = @grid.getRandomWithIso(@ox, @oy, 7)
    @grid.set(x, y, @)
    super(isox, isoy)

  update: (timer, input) ->
    super

    if @grid.isOverlapping(@xx, @yy)
      @play('alpha')
    else
      @play('_default')
