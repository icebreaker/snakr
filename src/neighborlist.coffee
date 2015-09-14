class NeighborList
  constructor: () ->
    @_items = []

    for i in [0..7]
      @_items.push(x: -1, y: -1)

    @length = 0

  add: (x, y) ->
    i = @length++

    @_items[i].x = x
    @_items[i].y = y
    @_items[i]

  each: (cb) ->
    for i in [0..@length-1]
      if cb(@_items[i]) is false
        break

    @
  
  at: (i) ->
    @_items[i]

  clear: () ->
    @length = 0
    @
