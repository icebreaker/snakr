class Grid
  constructor: (@x, @y, @w, @h, @cx, @cy) ->
    @_reserve(@w * @h)
    @_random = new Random(1, @w-1)
    @_max_random_tries = 5000
    @_list = new NeighborList()

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

  getNeighbors: (x, y) ->
    @_list.clear()

    ww = @w - 2
    hh = @h - 2

    xr = x + 1
    xl = x - 1
    
    yt = y - 1
    yb = y + 1

    # upper left
    if x > 1 and y > 1 and not @get(xl, yt)?
      @_list.add(xl, yt)

    # up
    if y > 1 and not @get(x, yt)?
      @_list.add(x, yt)
    
    # upper right
    if x < @w - 2 and y > 1 and not @get(xr, yt)?
      @_list.add(xr, yt)

    # left
    if x > 1 and not @get(xl, y)?
      @_list.add(xl, y)

    # right
    if x < @w - 2 and not @get(xr, y)?
      @_list.add(xr, y)

    # bottom left
    if x > 1 and y < @h - 2 and not @get(xl, yb)?
      @_list.add(xl, yb)

    # bottom
    if y < @h - 2 and not @get(x, yb)?
      @_list.add(x, yb)

    # bottom right
    if x < @w - 2 and y < @h - 2 and not @get(xr, yb)?
      @_list.add(xr, yb)

    @_list

  isOverlapping: (x, y) ->
    ww = @w - 2
    hh = @h - 2

    xr = x + 1
    xl = x - 1
    
    yt = y - 1
    yb = y + 1

    # upper left
    if x > 1 and y > 1 and @get(xl, yt)?
      return true

    # up
    if y > 1 and @get(x, yt)?
      return true
    
    # left
    if x > 1 and @get(xl, y)?
      return true

    false

  toIso: (x, y, ox, oy) ->
    [isox, isoy] = Iso.to((x * @x) - ox, (y * @y) - oy)
    [isox + @cx, isoy + @cy]

  getRandomWithIso: (ox, oy, n) ->
    [x, y, list] = @random(n)
    [isox, isoy] = @toIso(x, y, ox, oy)
    [x, y, isox, isoy, list]

  getDebugWithIso: (x, y, ox, oy) ->
    [isox, isoy] = @toIso(x, y, ox, oy)
    [x, y, isox, isoy, @getNeighbors(x, y)]

  random: (n) ->
    n ?= 5
    i  = 0
    x  = -1
    y  = -1
    list = null

    loop
      x = @_random.next()
      y = @_random.next()
      
      continue if @get(x, y)?

      list = @getNeighbors(x, y)
      if list.length > n
        break

      i += 1
      return [-1, -1, null] if i == @_max_random_tries

    [x, y, list]

  clear: () ->
    for i in [0..@_items.length-1]
      @_items[i] = null
    @

  _reserve: (n) ->
    @_items = []

    for i in [0..n-1]
      @_items[i] = null

    @_items
