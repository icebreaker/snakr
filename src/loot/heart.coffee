class Heart extends BaseLoot
  constructor: (@sprites, @grid) ->
    super(@sprites.getTexture('heart'), @grid)
