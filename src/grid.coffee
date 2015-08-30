class Grid
  constructor: (@x, @y, @w, @h, @cx, @cy) ->
    @_reserve(@w * @h)
    @_random = new Random(1, @w-1)
    @_max_random_tries = 5000

  get: (x, y) ->
    @_items[x + (y * @w)]

  unset: (x, y) ->
    @_items[x + (y * @w)] = null

  set: (x, y, item) ->
    item.grid = @
    item.xx = x
    item.yy = y
    item.zz = x + y

    @_items[x + (y * @w)] = item

  getNeighbours: (x, y) ->
    list = new GridList()

    ww = @w - 2
    hh = @h - 2

    xr = x + 1
    xl = x - 1
    
    yt = y - 1
    yb = y + 1

    # upper left
    if x > 1 and y > 1 and not @get(xl, yt)?
      list.add(xl, yt)

    # up
    if y > 1 and not @get(x, yt)?
      list.add(x, yt)
    
    # upper right
    if x < @w - 2 and y > 1 and not @get(xr, yt)?
      list.add(xr, yt)

    # left
    if x > 1 and not @get(xl, y)?
      list.add(xl, y)

    # right
    if x < @w - 2 and not @get(xr, y)?
      list.add(xr, y)

    # bottom left
    if x > 1 and y < @h - 2 and not @get(xl, yb)?
      list.add(xl, yb)

    # bottom
    if y < @h - 2 and not @get(x, yb)?
      list.add(x, yb)

    # bottom right
    if x < @w - 2 and y < @h - 2 and not @get(xr, yb)?
      list.add(xr, yb)

    list

  toIso: (x, y, ox, oy) ->
    [isox, isoy] = Iso.to((x * @x) - ox, (y * @y) - oy)
    [isox + @cx, isoy + @cy]

  getRandomWithIso: (ox, oy) ->
    [x, y, list] = @random()
    [isox, isoy] = @toIso(x, y, ox, oy)
    [x, y, isox, isoy, list]

  getDebugWithIso: (x, y, ox, oy) ->
    [isox, isoy] = @toIso(x, y, ox, oy)
    [x, y, isox, isoy, @getNeighbours(x, y)]

  random: () ->
    i = 0
    x = -1
    y = -1
    list = null

    loop
      x = @_random.next()
      y = @_random.next()
      
      continue if @get(x, y)?

      list = @getNeighbours(x, y)
      if list.length() > 5
        break

      i += 1
      return [-1, -1, null] if i == @_max_random_tries

    [x, y, list]

  clear: () ->
    for i in [0..@_items.length-1]
      @_items[i] = null

    null

  _reserve: (n) ->
    @_items = []

    for i in [0..n-1]
      @_items[i] = null

    @_items
