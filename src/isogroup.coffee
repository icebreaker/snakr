class IsoGroup extends Fz2D.Group
  update: (timer, input) ->
    super
    @sort(@_sort)

  _sort: (a, b) ->
    a.zz - b.zz
