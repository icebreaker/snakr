class Timer
  constructor: (@interval) ->
    @interval ?= 1000
    @stop()

  stop: () ->
    @_dt    = 0
    @ticks  = 0
    @active = false
    @ended  = false
    @onstop()

  reset: (ticks) ->
    @_dt    = 0
    @ticks  = ticks || 0
    @active = true
    @ended  = false

    @onstart()

  update: (timer) ->
    return unless @active

    @_dt += timer.dt

    return if @_dt < @interval
    
    @_dt = 0

    @ontick()

    if @ticks > 0 and --@ticks == 0
      @active = false
      @ended = true
      @onend()
   
  onstart: () ->
    # empty

  onstop: () ->
    # empty

  ontick: () ->
    # empty

  onend: () ->
    # empty
