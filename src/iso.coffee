class Iso
  @to: (x, y) ->
    [x - y, ((x + y) >> 1)]

  @from: (x, y) ->
    [(((y << 1) + x) >> 1), (((y << 1) - x) >> 1)]
