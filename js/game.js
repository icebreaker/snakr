// Generated by CoffeeScript 1.9.2
var BaseLoot, Game, Grid, GridList, Heart, Hud, Iso, IsoGroup, Man, Map, Pit, Random, Snake, Timer,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Game = (function(superClass) {
  var Key;

  extend(Game, superClass);

  function Game() {
    return Game.__super__.constructor.apply(this, arguments);
  }

  Key = Fz2D.Input.Keyboard.Key;

  Game.prototype.version = '0.0.1';

  Game.prototype.w = window.innerWidth;

  Game.prototype.h = window.innerHeight;

  Game.prototype.bg = '#D4D1A4';

  Game.prototype.fg = '#000000';

  Game.prototype.assets = {
    sprites: 'sprites.atlas',
    sounds: {
      pickup: 'pickup.ogg',
      hit: 'hit.ogg',
      death: 'death.ogg'
    }
  };

  Game.prototype.plugins = [Fz2D.Plugins.GitHub, Fz2D.Plugins.Stats, Fz2D.Plugins.Console, Fz2D.Plugins.GoogleAnalytics];

  Game.prototype.github = {
    username: 'icebreaker',
    repository: 'snakr'
  };

  Game.prototype.ga = {
    id: 'UA-3042007-2'
  };

  Game.prototype.volume = 10;

  Game.prototype.onload = function(game) {
    var assets, hud, k, map, scene, sound, sounds, sprites, storage;
    if (Fz2D.production != null) {
      game.input.mouse.hide();
    }
    assets = game.assets;
    scene = game.scene;
    storage = game.storage;
    sprites = assets.sprites;
    sounds = assets.sounds;
    for (k in sounds) {
      sound = sounds[k];
      sound.setVolume(game.volume);
    }
    hud = new Hud(scene.w, scene.h, sprites, storage, game.version);
    map = new Map(scene.w, scene.h, sprites, sounds);
    hud.onstart = function() {
      return map.reset();
    };
    map.onscore = function() {
      return hud.score.inc();
    };
    map.onend = function() {
      return hud.reset();
    };
    scene.add(map);
    return scene.add(hud);
  };

  return Game;

})(Fz2D.Game);

Game.run();

GridList = (function() {
  function GridList() {
    this.clear();
  }

  GridList.prototype.add = function(x, y) {
    return this._items.push({
      x: x,
      y: y
    });
  };

  GridList.prototype.each = function(cb) {
    var i, j, len, ref;
    ref = this._items;
    for (j = 0, len = ref.length; j < len; j++) {
      i = ref[j];
      if (cb(i) === false) {
        break;
      }
    }
    return this;
  };

  GridList.prototype.at = function(i) {
    return this._items[i];
  };

  GridList.prototype.length = function() {
    return this._items.length;
  };

  GridList.prototype.clear = function(x, y) {
    this._items = [];
    return this;
  };

  return GridList;

})();

Hud = (function(superClass) {
  var Button, Key;

  extend(Hud, superClass);

  Key = Fz2D.Input.Keyboard.Key;

  Button = Fz2D.Input.Mouse.Button;

  function Hud(w, h, sprites, storage1, version) {
    var cx, cy, font_16, font_32, high_score_label, rect, score_label, text, version_label;
    this.storage = storage1;
    Hud.__super__.constructor.call(this, 0, 0, w, h);
    font_16 = new Fz2D.Font(sprites.getTexture('font_16'), 16);
    font_32 = new Fz2D.Font(sprites.getTexture('font_32'), 32);
    text = 'Snakr';
    rect = font_32.measureText(text);
    cx = (w - rect.w) >> 1;
    cy = (h - rect.h) >> 1;
    cy -= rect.h << 1;
    this.title = new Fz2D.Gui.Label(text, cx, cy, font_32);
    this.add(this.title);
    if (Fz2D.touch != null) {
      text = 'Touch to start';
    } else {
      text = 'Press <Space> to start';
    }
    rect = font_16.measureText(text);
    cx = (w - rect.w) >> 1;
    cy = (h - rect.h) >> 1;
    this.label = new Fz2D.Gui.Label(text, cx, cy, font_16);
    this.label.blink = 800;
    this.add(this.label);
    text = "Score:";
    rect = font_16.measureText(text);
    score_label = new Fz2D.Gui.Label(text, 10, rect.h, font_16);
    this.add(score_label);
    this.score = new Fz2D.Gui.Label('0', rect.w + 10, rect.h, font_16);
    this.add(this.score);
    text = "High Score:";
    rect = font_16.measureText(text);
    high_score_label = new Fz2D.Gui.Label(text, 10, rect.h + 30, font_16);
    this.add(high_score_label);
    this.high_score = new Fz2D.Gui.Label(this.storage.get('highscore').toString(), rect.w + 10, rect.h + 30, font_16);
    this.add(this.high_score);
    version_label = new Fz2D.Gui.Label('v' + version, 10, h - 30, font_16);
    this.add(version_label);
  }

  Hud.prototype.onstart = function() {};

  Hud.prototype.update = function(timer, input) {
    Hud.__super__.update.apply(this, arguments);
    if (this.title.exists && (input.keys.pressed[Key.SPACE] || input.mouse.pressed[Button.LEFT])) {
      this.kill();
      return this.onstart();
    }
  };

  Hud.prototype.kill = function() {
    this.label.kill();
    return this.title.kill();
  };

  Hud.prototype.reset = function() {
    this.label.reset();
    this.title.reset();
    if (this.score.toInt() > this.high_score.toInt()) {
      this.high_score.setText(this.score.text);
      this.storage.set('highscore', this.score.text);
    }
    return this.score.setText('0');
  };

  return Hud;

})(Fz2D.Group);

Iso = (function() {
  function Iso() {}

  Iso.to = function(x, y) {
    return [x - y, (x + y) >> 1];
  };

  Iso.from = function(x, y) {
    return [((y << 1) + x) >> 1, ((y << 1) - x) >> 1];
  };

  return Iso;

})();

IsoGroup = (function(superClass) {
  extend(IsoGroup, superClass);

  function IsoGroup() {
    return IsoGroup.__super__.constructor.apply(this, arguments);
  }

  IsoGroup.prototype.update = function(timer, input) {
    IsoGroup.__super__.update.apply(this, arguments);
    return this.sort(this._sort);
  };

  IsoGroup.prototype._sort = function(a, b) {
    return a.zz - b.zz;
  };

  return IsoGroup;

})(Fz2D.Group);

BaseLoot = (function(superClass) {
  extend(BaseLoot, superClass);

  function BaseLoot(texture, grid) {
    this.grid = grid;
    BaseLoot.__super__.constructor.call(this, texture);
    this.exists = false;
    this.timer = new Timer();
    this.timer.ontick = (function(_this) {
      return function() {
        if (_this.timer.ticks < 5) {
          return _this.visible = !_this.visible;
        }
      };
    })(this);
    this.timer.onend = (function(_this) {
      return function() {
        return _this.kill();
      };
    })(this);
  }

  BaseLoot.prototype.use = function(snake) {
    this.kill();
    return snake.grow();
  };

  BaseLoot.prototype.kill = function() {
    this.timer.stop();
    if ((this.xx != null) && (this.yy != null)) {
      this.grid.unset(this.xx, this.yy);
    }
    return BaseLoot.__super__.kill.apply(this, arguments);
  };

  BaseLoot.prototype.reset = function(x, y) {
    var isox, isoy, ref;
    ref = this.grid.toIso(x, y, -2, 16), isox = ref[0], isoy = ref[1];
    this.grid.set(x, y, this);
    BaseLoot.__super__.reset.call(this, isox, isoy);
    return this.timer.reset(10);
  };

  BaseLoot.prototype.update = function(timer, input) {
    BaseLoot.__super__.update.apply(this, arguments);
    return this.timer.update(timer);
  };

  return BaseLoot;

})(Fz2D.Entity);

Heart = (function(superClass) {
  extend(Heart, superClass);

  function Heart(sprites1, grid) {
    this.sprites = sprites1;
    this.grid = grid;
    Heart.__super__.constructor.call(this, this.sprites.getTexture('heart'), this.grid);
  }

  return Heart;

})(BaseLoot);

Map = (function(superClass) {
  extend(Map, superClass);

  function Map(w, h, sprites1, sounds1) {
    this.sprites = sprites1;
    this.sounds = sounds1;
    Map.__super__.constructor.call(this, 0, 0, w, h);
    this.exists = false;
    this.units = 12;
    this.isow = this.units;
    this.isoh = this.units;
    this.isox = 34;
    this.isoy = 34;
    this.cx = (w - (this.isow * 6)) >> 1;
    this.cy = (h - (this.isoh * this.isoy)) >> 1;
    this.isoww = this.isow - 1;
    this.isohh = this.isoh - 1;
    this.random = new Random(0, this.units - 1);
    this.grid = new Grid(this.isox, this.isoy, this.isow, this.isoh, this.cx, this.cy);
    this.createGround();
    this.createEntities();
  }

  Map.prototype.reset = function() {
    var i, j, l;
    Map.__super__.reset.apply(this, arguments);
    this.grid.clear();
    this.entities.clear();
    this.entities.pits.clear();
    for (i = j = 0; j <= 3; i = ++j) {
      this.spawn('tree', 74, 74);
    }
    for (i = l = 0; l <= 1; i = ++l) {
      this.spawn('stone', 34, 34);
    }
    this.spawnMan();
    return this.spawnSnake();
  };

  Map.prototype.createGround = function() {
    var isox, isoy, j, l, ref, ref1, ref2, stone_texture, texture, water_texture, x, xx, y, yy;
    stone_texture = this.sprites.getTexture('stone_one');
    water_texture = this.sprites.getTexture('water');
    for (y = j = 0, ref = this.isohh; 0 <= ref ? j <= ref : j >= ref; y = 0 <= ref ? ++j : --j) {
      for (x = l = 0, ref1 = this.isoww; 0 <= ref1 ? l <= ref1 : l >= ref1; x = 0 <= ref1 ? ++l : --l) {
        xx = x * this.isox;
        yy = y * this.isoy;
        if (x === 0 || y === 0 || x === this.isoww || y === this.isohh) {
          texture = water_texture;
        } else {
          texture = stone_texture;
        }
        ref2 = Iso.to(xx, yy), isox = ref2[0], isoy = ref2[1];
        this.add(new Fz2D.Entity(texture, this.cx + isox, this.cy + isoy));
      }
    }
    return null;
  };

  Map.prototype.createEntities = function() {
    var pits;
    pits = this.add(new Fz2D.Group(0, 0, this.w, this.h));
    this.entities = this.add(new IsoGroup(0, 0, this.w, this.h));
    this.entities.pits = pits;
    return this.entities;
  };

  Map.prototype.spawn = function(name, ox, oy) {
    var isox, isoy, ref, texture, x, y;
    texture = this.sprites.getTexture(this.random.str(name));
    ref = this.grid.getRandomWithIso(ox, oy), x = ref[0], y = ref[1], isox = ref[2], isoy = ref[3];
    return this.entities.add(this.grid.set(x, y, new Fz2D.Entity(texture, isox, isoy)));
  };

  Map.prototype.spawnMan = function() {
    this.man = this.entities.add(new Man(this.sprites, this.grid));
    this.man.onkill = (function(_this) {
      return function() {
        return _this.sounds.hit.play();
      };
    })(this);
    this.man.onoutofspace = (function(_this) {
      return function() {
        return _this.snake.kill();
      };
    })(this);
    return this.man.reset();
  };

  Map.prototype.spawnSnake = function() {
    this.snake = this.entities.add(new Snake(this.sprites, this.grid));
    this.snake.onkill = (function(_this) {
      return function() {
        if (_this.snake.alive) {
          return _this.sounds.death.play();
        } else {
          _this.kill();
          return _this.onend();
        }
      };
    })(this);
    return this.snake.ongrow = (function(_this) {
      return function() {
        _this.onscore();
        return _this.sounds.pickup.play();
      };
    })(this);
  };

  Map.prototype.onscore = function() {};

  Map.prototype.onend = function() {};

  return Map;

})(Fz2D.Group);

Random = (function() {
  function Random(min, max) {
    this.min = min;
    this.max = max;
    if (this.min == null) {
      this.min = 0;
    }
    if (this.max == null) {
      this.max = 10;
    }
    this._delta = this.max - this.min;
    this._half = Math.ceil(this.max / 2.0);
    this._str = ["one", "two", "three", "four", "five", "six"];
  }

  Random.prototype.next = function() {
    return Math.floor((Math.random() * this._delta) + this.min);
  };

  Random.prototype.flip = function() {
    if (this.next() > this._half) {
      return 1;
    } else {
      return 0;
    }
  };

  Random.prototype.str = function(prefix) {
    var str;
    str = this._str[this.flip()];
    if (prefix != null) {
      str = prefix + "_" + str;
    }
    return str;
  };

  return Random;

})();

Timer = (function() {
  function Timer(interval) {
    this.interval = interval;
    if (this.interval == null) {
      this.interval = 1000;
    }
    this.stop();
  }

  Timer.prototype.stop = function() {
    this._dt = 0;
    this.ticks = 0;
    this.active = false;
    this.ended = false;
    return this.onstop();
  };

  Timer.prototype.reset = function(ticks) {
    this._dt = 0;
    this.ticks = ticks || 0;
    this.active = true;
    this.ended = false;
    return this.onstart();
  };

  Timer.prototype.update = function(timer) {
    if (!this.active) {
      return;
    }
    this._dt += timer.dt;
    if (this._dt < this.interval) {
      return;
    }
    this._dt = 0;
    this.ontick();
    if (this.ticks > 0 && --this.ticks === 0) {
      this.active = false;
      this.ended = true;
      return this.onend();
    }
  };

  Timer.prototype.onstart = function() {};

  Timer.prototype.onstop = function() {};

  Timer.prototype.ontick = function() {};

  Timer.prototype.onend = function() {};

  return Timer;

})();

Man = (function(superClass) {
  extend(Man, superClass);

  function Man(sprites1, grid) {
    this.sprites = sprites1;
    this.grid = grid;
    this.spawnPit = bind(this.spawnPit, this);
    Man.__super__.constructor.call(this, this.sprites.getTexture('man_one'));
    this.exists = false;
    this.addAnimation('one', this.sprites.getTexture('man_one'));
    this.addAnimation('two', this.sprites.getTexture('man_two'));
    this.timer = new Timer(300);
    this.timer.ontick = (function(_this) {
      return function() {
        return _this.visible = !_this.visible;
      };
    })(this);
    this.timer.onend = (function(_this) {
      return function() {
        return _this.kill();
      };
    })(this);
    this.random = new Random();
  }

  Man.prototype.onkill = function() {};

  Man.prototype.onoutofspace = function() {};

  Man.prototype.kill = function() {
    Man.__super__.kill.apply(this, arguments);
    this.spawnHeart();
    return this.reset();
  };

  Man.prototype.reset = function() {
    var isox, isoy, list, ref, x, y;
    ref = this.grid.getRandomWithIso(32, 48), x = ref[0], y = ref[1], isox = ref[2], isoy = ref[3], list = ref[4];
    if (x === -1 && y === -1) {
      this.onoutofspace();
      return;
    }
    this.grid.set(x, y, this);
    Man.__super__.reset.call(this, isox, isoy);
    this.play(this.random.str());
    return this.spawnPits(list);
  };

  Man.prototype.update = function(timer, input) {
    Man.__super__.update.apply(this, arguments);
    this.timer.update(timer);
    if (!this.timer.active && this.group.pits.allAlive()) {
      this.group.pits.clear();
      this.onkill();
      return this.timer.reset(5);
    }
  };

  Man.prototype.spawnHeart = function() {
    var heart;
    heart = this.group.recycleByClass(Heart);
    if (heart == null) {
      heart = this.group.add(new Heart(this.sprites, this.grid));
    }
    return heart.reset(this.xx, this.yy);
  };

  Man.prototype.spawnPits = function(list) {
    return list.each(this.spawnPit);
  };

  Man.prototype.spawnPit = function(point) {
    var pit;
    pit = this.group.pits.add(new Pit(this.sprites, this.grid));
    return pit.reset(point.x, point.y);
  };

  return Man;

})(Fz2D.Entity);

Grid = (function() {
  function Grid(x1, y1, w1, h1, cx1, cy1) {
    this.x = x1;
    this.y = y1;
    this.w = w1;
    this.h = h1;
    this.cx = cx1;
    this.cy = cy1;
    this._reserve(this.w * this.h);
    this._random = new Random(1, this.w - 1);
    this._max_random_tries = 5000;
  }

  Grid.prototype.get = function(x, y) {
    return this._items[x + (y * this.w)];
  };

  Grid.prototype.unset = function(x, y) {
    return this._items[x + (y * this.w)] = null;
  };

  Grid.prototype.set = function(x, y, item) {
    item.grid = this;
    item.xx = x;
    item.yy = y;
    item.zz = x + y;
    return this._items[x + (y * this.w)] = item;
  };

  Grid.prototype.getNeighbours = function(x, y) {
    var hh, list, ww, xl, xr, yb, yt;
    list = new GridList();
    ww = this.w - 2;
    hh = this.h - 2;
    xr = x + 1;
    xl = x - 1;
    yt = y - 1;
    yb = y + 1;
    if (x > 1 && y > 1 && (this.get(xl, yt) == null)) {
      list.add(xl, yt);
    }
    if (y > 1 && (this.get(x, yt) == null)) {
      list.add(x, yt);
    }
    if (x < this.w - 2 && y > 1 && (this.get(xr, yt) == null)) {
      list.add(xr, yt);
    }
    if (x > 1 && (this.get(xl, y) == null)) {
      list.add(xl, y);
    }
    if (x < this.w - 2 && (this.get(xr, y) == null)) {
      list.add(xr, y);
    }
    if (x > 1 && y < this.h - 2 && (this.get(xl, yb) == null)) {
      list.add(xl, yb);
    }
    if (y < this.h - 2 && (this.get(x, yb) == null)) {
      list.add(x, yb);
    }
    if (x < this.w - 2 && y < this.h - 2 && (this.get(xr, yb) == null)) {
      list.add(xr, yb);
    }
    return list;
  };

  Grid.prototype.toIso = function(x, y, ox, oy) {
    var isox, isoy, ref;
    ref = Iso.to((x * this.x) - ox, (y * this.y) - oy), isox = ref[0], isoy = ref[1];
    return [isox + this.cx, isoy + this.cy];
  };

  Grid.prototype.getRandomWithIso = function(ox, oy) {
    var isox, isoy, list, ref, ref1, x, y;
    ref = this.random(), x = ref[0], y = ref[1], list = ref[2];
    ref1 = this.toIso(x, y, ox, oy), isox = ref1[0], isoy = ref1[1];
    return [x, y, isox, isoy, list];
  };

  Grid.prototype.getDebugWithIso = function(x, y, ox, oy) {
    var isox, isoy, ref;
    ref = this.toIso(x, y, ox, oy), isox = ref[0], isoy = ref[1];
    return [x, y, isox, isoy, this.getNeighbours(x, y)];
  };

  Grid.prototype.random = function() {
    var i, list, x, y;
    i = 0;
    x = -1;
    y = -1;
    list = null;
    while (true) {
      x = this._random.next();
      y = this._random.next();
      if (this.get(x, y) != null) {
        continue;
      }
      list = this.getNeighbours(x, y);
      if (list.length() > 5) {
        break;
      }
      i += 1;
      if (i === this._max_random_tries) {
        return [-1, -1, null];
      }
    }
    return [x, y, list];
  };

  Grid.prototype.clear = function() {
    var i, j, ref;
    for (i = j = 0, ref = this._items.length - 1; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
      this._items[i] = null;
    }
    return null;
  };

  Grid.prototype._reserve = function(n) {
    var i, j, ref;
    this._items = [];
    for (i = j = 0, ref = n - 1; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
      this._items[i] = null;
    }
    return this._items;
  };

  return Grid;

})();

Snake = (function(superClass) {
  var Key;

  extend(Snake, superClass);

  Key = Fz2D.Input.Keyboard.Key;

  function Snake(sprites1, grid) {
    var isox, isoy, ref, x, y;
    this.sprites = sprites1;
    this.grid = grid;
    ref = this.grid.getRandomWithIso(-2, 16), x = ref[0], y = ref[1], isox = ref[2], isoy = ref[3];
    this.grid.set(x, y, this);
    Snake.__super__.constructor.call(this, this.sprites.getTexture('snake_side'), isox, isoy);
    this.addAnimation('side', this.sprites.getTexture('snake_side'));
    this.addAnimation('back', this.sprites.getTexture('snake_back'));
    this.addAnimation('body', this.sprites.getTexture('snake_body'));
    this.random = new Random();
    if (this.random.flip() === 1) {
      this._dx = 1;
      this._dy = 0;
    } else {
      this._dx = 0;
      this._dy = 1;
    }
    this._play();
    this._dt = 0;
    this.parts = [this];
    this.can_turn = true;
    this.timer = new Timer(500);
    this.timer.onstart = (function(_this) {
      return function() {
        return _this.kill();
      };
    })(this);
    this.timer.ontick = (function(_this) {
      return function() {
        var body, i, j, ref1, results;
        results = [];
        for (i = j = 0, ref1 = _this.parts.length - 1; 0 <= ref1 ? j <= ref1 : j >= ref1; i = 0 <= ref1 ? ++j : --j) {
          body = _this.parts[i];
          results.push(body.visible = !body.visible);
        }
        return results;
      };
    })(this);
    this.timer.onend = (function(_this) {
      return function() {
        return _this.kill();
      };
    })(this);
  }

  Snake.prototype.kill = function() {
    if (this.timer.ended) {
      Snake.__super__.kill.apply(this, arguments);
    }
    return this.onkill();
  };

  Snake.prototype.ongrow = function() {};

  Snake.prototype.onshrink = function() {};

  Snake.prototype.onkill = function() {};

  Snake.prototype.turn = function(dx, dy) {
    if (!this.can_turn) {
      return;
    }
    if (dx === 0 && dy === 0) {
      return;
    }
    if ((dx < 0 && this._dx > 0) || (dx > 0 && this._dx < 0) || (dy < 0 && this._dy > 0) || (dy > 0 && this._dy < 0)) {
      return;
    }
    this._dx = dx;
    this._dy = dy;
    this.can_turn = false;
    return null;
  };

  Snake.prototype.grow = function() {
    var body, last_body;
    body = new Fz2D.Entity(this.sprites.getTexture('snake_body'));
    last_body = this.parts[this.parts.length - 1];
    this.group.add(this.grid.set(last_body.xx, last_body.yy, body));
    this.parts.push(body);
    this.ongrow(body);
    return body;
  };

  Snake.prototype.shrink = function() {
    this.onshrink();
    return null;
  };

  Snake.prototype.move = function(dt) {
    var body, entity, i, isox, isoy, j, ref, ref1, x, xx, y, yy;
    this._dt += dt;
    if (this._dt < 400) {
      return;
    }
    this._dt = 0;
    this._play();
    x = this.xx;
    y = this.yy;
    if (x === 0 || y === 0 || x === 11 || y === 11) {
      this.timer.reset(5);
      return;
    }
    entity = this.grid.get(x + this._dx, y + this._dy);
    if (entity != null) {
      if (entity instanceof BaseLoot) {
        entity.use(this);
      } else {
        this.timer.reset(5);
        return;
      }
    }
    this.can_turn = true;
    x += this._dx;
    y += this._dy;
    for (i = j = 0, ref = this.parts.length - 1; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
      this.group.pits.each((function(_this) {
        return function(pit) {
          if (pit.exists && pit.isOver(x, y)) {
            pit.reset();
            return false;
          }
        };
      })(this));
      body = this.parts[i];
      ref1 = this.grid.toIso(x, y, -2, 16), isox = ref1[0], isoy = ref1[1];
      body.x = isox;
      body.y = isoy;
      xx = body.xx;
      yy = body.yy;
      this.grid.set(x, y, body);
      x = xx;
      y = yy;
    }
    return this.grid.unset(x, y);
  };

  Snake.prototype.update = function(timer, input) {
    var dx, dy;
    Snake.__super__.update.apply(this, arguments);
    this.timer.update(timer);
    if (this.timer.active) {
      return;
    }
    this.move(timer.dt);
    dx = input.keys.pressed[Key.DOWN] - input.keys.pressed[Key.UP];
    dy = input.keys.pressed[Key.LEFT] - input.keys.pressed[Key.RIGHT];
    return this.turn(dx, dy);
  };

  Snake.prototype._play = function() {
    if (this._dx > 0) {
      return this.play('back');
    } else if (this._dx < 0) {
      return this.play('body');
    } else if (this._dy < 0) {
      return this.play('body');
    } else if (this._dy > 0) {
      return this.play('side');
    }
  };

  return Snake;

})(Fz2D.Entity);

Pit = (function(superClass) {
  extend(Pit, superClass);

  function Pit(sprites1, grid) {
    var anim;
    this.sprites = sprites1;
    this.grid = grid;
    Pit.__super__.constructor.call(this, this.sprites.getTexture('pit'));
    anim = this.addAnimation('cycle', this.sprites.getTexture('pit_cycle'), 8, 800);
    anim.onend = (function(_this) {
      return function() {
        return _this.kill();
      };
    })(this);
  }

  Pit.prototype.isOver = function(x, y) {
    return this.xx === x && this.yy === y;
  };

  Pit.prototype.reset = function(x, y) {
    var isox, isoy, ref;
    if ((x != null) && (y != null)) {
      this.xx = x;
      this.yy = y;
      ref = this.grid.toIso(x, y, -17, 0), isox = ref[0], isoy = ref[1];
      Pit.__super__.reset.call(this, isox, isoy);
      this.visible = false;
      this.alive = false;
    } else {
      Pit.__super__.reset.apply(this, arguments);
      this.play('cycle');
    }
    return this;
  };

  return Pit;

})(Fz2D.Entity);
