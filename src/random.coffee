class Random
  constructor: (@min, @max) ->
    @min ?= 0
    @max ?= 10

    @_delta = @max - @min
    @_half  = Math.ceil(@max / 2.0)
    @_str   = ["one", "two", "three", "four", "five", "six"]

  next: () ->
    Math.floor((Math.random() * @_delta) + @min)

  flip: () ->
    if @next() > @_half
      1
    else
      0

  str: (prefix) ->
    str = @_str[@flip()]
    str = "#{prefix}_#{str}" if prefix?
    str
