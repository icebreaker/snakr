class GridList
  constructor: () ->
    @clear()

  add: (x, y) ->
    @_items.push(x: x, y: y)

  each: (cb) ->
    for i in @_items
      if cb(i) is false
        break

    @
  
  at: (i) ->
    @_items[i]

  length: () ->
    @_items.length

  clear: (x, y) ->
    @_items = []
    @
