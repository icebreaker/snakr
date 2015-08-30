class Man extends Fz2D.Entity
  constructor: (@sprites, @grid) ->
    super(@sprites.getTexture('man_one'))
    @exists = false

    @addAnimation('one', @sprites.getTexture('man_one'))
    @addAnimation('two', @sprites.getTexture('man_two'))

    @timer = new Timer(300)
    @timer.ontick = =>
      @visible = !@visible
    @timer.onend = =>
      @kill()

    @random = new Random()

  onkill: () ->
    # empty

  onoutofspace: () ->
    # empty

  kill: () ->
    super
    @spawnHeart()
    @reset()

  reset: () ->
    [x, y, isox, isoy, list] = @grid.getRandomWithIso(32, 48)

    if x == -1 and y == -1 # no space to spawn :(
      @onoutofspace()
      return
    
    @grid.set(x, y, @)
    super(isox, isoy)

    @play(@random.str())
    @spawnPits(list)

  update: (timer, input) ->
    super

    @timer.update(timer)

    if !@timer.active and @group.pits.allAlive()
      @group.pits.clear()
      @onkill()
      @timer.reset(5)

  spawnHeart: () ->
    heart = @group.recycleByClass(Heart)
    heart = @group.add(new Heart(@sprites, @grid)) unless heart?
    heart.reset(@xx, @yy)

  spawnPits: (list) ->
    list.each(@spawnPit)

  spawnPit: (point) =>
    pit = @group.pits.add(new Pit(@sprites, @grid))
    pit.reset(point.x, point.y)
