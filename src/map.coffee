class Map extends Fz2D.Group
  constructor: (w, h, @sprites, @sounds) ->
    super(0, 0, w, h)
    @exists = false

    @units  = 12

    @isow   = @units
    @isoh   = @units

    @isox = 34
    @isoy = 34

    @cx = (w - (@isow * 6 )) >> 1
    @cy = (h - (@isoh * @isoy)) >> 1

    @isoww = @isow - 1
    @isohh = @isoh - 1

    @random = new Random(0, @units-1)
    @grid = new Grid(@isox, @isoy, @isow, @isoh, @cx, @cy)

    @createGround()
    @createEntities()

  reset: () ->
    super
    
    @grid.clear()
    @entities.clear()
    @entities.pits.clear()

    for i in [0..3]
      @spawn('tree', 74, 74)

    for i in [0..1]
      @spawn('stone', 34, 34)

    @spawnMan()
    @spawnSnake()

  createGround: () ->
    stone_texture = @sprites.getTexture('stone_one')
    water_texture = @sprites.getTexture('water')

    for y in [0..@isohh]
      for x in [0..@isoww]
        xx = x * @isox
        yy = y * @isoy

        if x == 0 or y == 0 or x == @isoww or y == @isohh
          texture = water_texture
        else
          texture = stone_texture
 
        [isox, isoy] = Iso.to(xx, yy)
        @add(new Fz2D.Entity(texture, @cx + isox, @cy + isoy))

    null

  createEntities: () ->
    pits = @add(new Fz2D.Group(0, 0, @w, @h))

    @entities = @add(new IsoGroup(0, 0, @w, @h))
    @entities.pits = pits
    @entities

  spawn: (name, ox, oy) ->
    texture = @sprites.getTexture(@random.str(name))
    [x, y, isox, isoy] = @grid.getRandomWithIso(ox, oy)
    @entities.add(@grid.set(x, y, new Fz2D.Entity(texture, isox, isoy)))

  spawnMan: () ->
    @man = @entities.add(new Man(@sprites, @grid))
    @man.onkill = =>
      @sounds.hit.play()
    @man.onoutofspace = =>
      @snake.kill()
    @man.reset()
    
  spawnSnake: () ->
    @snake = @entities.add(new Snake(@sprites, @grid))
    @snake.onkill = =>
      if @snake.alive
        @sounds.death.play()
      else
        @kill()
        @onend()
    @snake.ongrow = =>
      @onscore()
      @sounds.pickup.play()

  onscore: () ->
    # pass

  onend: () ->
    # pass
