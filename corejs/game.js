var $jscomp = $jscomp || {};
$jscomp.scope = {};
$jscomp.ASSUME_ES5 = !1;
$jscomp.ASSUME_NO_NATIVE_MAP = !1;
$jscomp.ASSUME_NO_NATIVE_SET = !1;
$jscomp.defineProperty =
  $jscomp.ASSUME_ES5 || "function" == typeof Object.defineProperties
    ? Object.defineProperty
    : function (a, b, c) {
        a != Array.prototype && a != Object.prototype && (a[b] = c.value);
      };
$jscomp.getGlobal = function (a) {
  return "undefined" != typeof window && window === a
    ? a
    : "undefined" != typeof global && null != global
    ? global
    : a;
};
$jscomp.global = $jscomp.getGlobal(this);
$jscomp.polyfill = function (a, b, c, d) {
  if (b) {
    c = $jscomp.global;
    a = a.split(".");
    for (d = 0; d < a.length - 1; d++) {
      var e = a[d];
      e in c || (c[e] = {});
      c = c[e];
    }
    a = a[a.length - 1];
    d = c[a];
    b = b(d);
    b != d &&
      null != b &&
      $jscomp.defineProperty(c, a, {
        configurable: !0,
        writable: !0,
        value: b,
      });
  }
};
$jscomp.polyfill(
  "Object.is",
  function (a) {
    return a
      ? a
      : function (a, c) {
          return a === c ? 0 !== a || 1 / a === 1 / c : a !== a && c !== c;
        };
  },
  "es6",
  "es3"
);
$jscomp.polyfill(
  "Array.prototype.includes",
  function (a) {
    return a
      ? a
      : function (a, c) {
          var b = this;
          b instanceof String && (b = String(b));
          var e = b.length;
          c = c || 0;
          for (0 > c && (c = Math.max(c + e, 0)); c < e; c++) {
            var f = b[c];
            if (f === a || Object.is(f, a)) return !0;
          }
          return !1;
        };
  },
  "es7",
  "es3"
);
$jscomp.checkStringArgs = function (a, b, c) {
  if (null == a)
    throw new TypeError(
      "The 'this' value for String.prototype." +
        c +
        " must not be null or undefined"
    );
  if (b instanceof RegExp)
    throw new TypeError(
      "First argument to String.prototype." +
        c +
        " must not be a regular expression"
    );
  return a + "";
};
$jscomp.polyfill(
  "String.prototype.includes",
  function (a) {
    return a
      ? a
      : function (a, c) {
          return (
            -1 !==
            $jscomp.checkStringArgs(this, a, "includes").indexOf(a, c || 0)
          );
        };
  },
  "es6",
  "es3"
);
$jscomp.arrayIteratorImpl = function (a) {
  var b = 0;
  return function () {
    return b < a.length ? { done: !1, value: a[b++] } : { done: !0 };
  };
};
$jscomp.arrayIterator = function (a) {
  return { next: $jscomp.arrayIteratorImpl(a) };
};
$jscomp.SYMBOL_PREFIX = "jscomp_symbol_";
$jscomp.initSymbol = function () {
  $jscomp.initSymbol = function () {};
  $jscomp.global.Symbol || ($jscomp.global.Symbol = $jscomp.Symbol);
};
$jscomp.Symbol = (function () {
  var a = 0;
  return function (b) {
    return $jscomp.SYMBOL_PREFIX + (b || "") + a++;
  };
})();
$jscomp.initSymbolIterator = function () {
  $jscomp.initSymbol();
  var a = $jscomp.global.Symbol.iterator;
  a || (a = $jscomp.global.Symbol.iterator = $jscomp.global.Symbol("iterator"));
  "function" != typeof Array.prototype[a] &&
    $jscomp.defineProperty(Array.prototype, a, {
      configurable: !0,
      writable: !0,
      value: function () {
        return $jscomp.iteratorPrototype($jscomp.arrayIteratorImpl(this));
      },
    });
  $jscomp.initSymbolIterator = function () {};
};
$jscomp.initSymbolAsyncIterator = function () {
  $jscomp.initSymbol();
  var a = $jscomp.global.Symbol.asyncIterator;
  a ||
    (a = $jscomp.global.Symbol.asyncIterator = $jscomp.global.Symbol(
      "asyncIterator"
    ));
  $jscomp.initSymbolAsyncIterator = function () {};
};
$jscomp.iteratorPrototype = function (a) {
  $jscomp.initSymbolIterator();
  a = { next: a };
  a[$jscomp.global.Symbol.iterator] = function () {
    return this;
  };
  return a;
};
$jscomp.iteratorFromArray = function (a, b) {
  $jscomp.initSymbolIterator();
  a instanceof String && (a += "");
  var c = 0,
    d = {
      next: function () {
        if (c < a.length) {
          var e = c++;
          return { value: b(e, a[e]), done: !1 };
        }
        d.next = function () {
          return { done: !0, value: void 0 };
        };
        return d.next();
      },
    };
  d[Symbol.iterator] = function () {
    return d;
  };
  return d;
};
$jscomp.polyfill(
  "Array.prototype.keys",
  function (a) {
    return a
      ? a
      : function () {
          return $jscomp.iteratorFromArray(this, function (a) {
            return a;
          });
        };
  },
  "es6",
  "es3"
);
$jscomp.polyfill(
  "String.prototype.startsWith",
  function (a) {
    return a
      ? a
      : function (a, c) {
          var b = $jscomp.checkStringArgs(this, a, "startsWith");
          a += "";
          var e = b.length,
            f = a.length;
          c = Math.max(0, Math.min(c | 0, b.length));
          for (var g = 0; g < f && c < e; ) if (b[c++] != a[g++]) return !1;
          return g >= f;
        };
  },
  "es6",
  "es3"
);
var is_game = 1,
  is_server = 0,
  is_code = 0,
  is_pvp = 0,
  is_demo = 0,
  gameplay = "normal",
  inception = new Date(),
  scale = parseInt(scale),
  round_xy = !0,
  floor_xy = !1,
  round_entities_xy = !1,
  offset_walking = !0,
  antialias = !1,
  mode_nearest = !0,
  gtest = !1,
  mode = {
    dom_tests: 0,
    dom_tests_pixi: 0,
    bitmapfonts: 0,
    debug_moves: 0,
    destroy_tiles: 1,
    log_incoming: 0,
    cosmetics: 0,
    empty_borders_darker: 1,
  },
  paused = !1,
  log_flags = { timers: 1, map: 0, entities: 0, xy_corrections: 0 },
  ptimers = !0,
  mdraw_mode = "redraw",
  mdraw_border = 40,
  mdraw_tiling_sprites = !1,
  manual_stop = !1,
  manual_centering = !0,
  high_precision = !1,
  retina_mode = !1,
  text_quality = 2,
  bw_mode = !1,
  character_names = !1,
  hp_bars = !0,
  last_interaction = new Date(),
  afk_edge = 60,
  mm_afk = !1;
last_interaction.setYear(1970);
var last_drag_start = new Date(),
  last_npc_right_click = new Date(),
  block_right_clicks = !0,
  mouse_only = !0,
  the_code = "",
  code_slot = 0,
  code_change = !1,
  new_code_slot = void 0,
  server_region = "EU",
  server_identifier = "I",
  server_name = "",
  ipass = "",
  real_id = "",
  character = null,
  observing = null,
  map = null,
  resources_loaded = !1,
  socket_ready = !1,
  socket_welcomed = !1,
  game_loaded = !1,
  friends = [],
  ch_disp_x = 0,
  ch_disp_y = 0,
  head_x = 0,
  head_y = 0,
  tints = [],
  entities = {},
  future_entities = { players: {}, monsters: {} },
  pull_all_next = !1,
  clean_house = !1,
  text_layer,
  monster_layer,
  player_layer,
  chest_layer,
  map_layer,
  separate_layer,
  entity_layer,
  rip = !1,
  heartbeat = new Date(),
  slow_heartbeats = 0,
  ctarget = null,
  ctoggled = null,
  xtarget = null,
  textures = {},
  C = {},
  FC = {},
  SS = {},
  SSU = {},
  M = {},
  GEO = {},
  total_map_tiles = 0,
  tiles = null,
  dtile = null,
  wtile = null,
  map_npcs = [],
  map_doors = [],
  map_animatables = {},
  map_tiles = [],
  map_entities = [],
  map_machines = {},
  dtile_size = 32,
  dtile_width = 0,
  dtile_height = 0,
  wtile_name = null,
  wtile_width = 0,
  wtile_height = 0,
  map_animations = {},
  water_tiles = [],
  last_water_frame = -1,
  drawings = [],
  code_buttons = {},
  chests = {},
  party_list = [],
  party = {},
  tracker = {},
  merchants = {},
  tile_sprites = {},
  tile_textures = {},
  sprite_last = {},
  first_coords = !1,
  first_x = 0,
  first_y = 0,
  last_refxy = 0,
  ref_x = 0,
  ref_y = 0,
  last_light = new Date(0),
  current_map = "main",
  current_in = "main",
  draw_map = "main",
  transporting = !1,
  current_status = "",
  last_status = "",
  topleft_npc = !1,
  merchant_id = null,
  inventory = !1,
  inventory_openef_for = null,
  code = !1,
  pvp = !1,
  skillsui = !1,
  exchange_type = "",
  topright_npc = !1,
  transports = !1,
  purpose = "buying",
  next_minteraction = null,
  next_side_interaction = null,
  events = { abtesting: !1, duel: !1 },
  code_run = !1,
  code_active = !1,
  actual_code = !1,
  CC = {},
  reload_state = !1,
  reload_timer = null,
  first_entities = !1,
  blink_pressed = !1,
  last_blink_pressed = new Date(),
  arrow_up = !1,
  arrow_right = !1,
  arrow_down = !1,
  arrow_left = !1,
  force_draw_on = !1,
  use_layers = !1,
  draws = 0,
  in_draw = !1,
  keymap = {},
  skillbar = [],
  secondhands = [],
  s_page = 0,
  lostandfound = [],
  l_page = 0,
  page = { title: "Adventure Land", url: "/" },
  I = {},
  S = {},
  CLI_OUT = [],
  CLI_IN = [],
  options = {
    move_with_arrows: !0,
    code_fx: !1,
    show_names: !1,
    move_with_mouse: !1,
    always_hpn: !1,
    retain_upgrades: !1,
    friendly_fire: !1,
    bank_max: !1,
    directional_sfx: !1,
  },
  SZ = { font: "Pixel", normal: 18, large: 24, huge: 36, chat: 18 };
setInterval(function () {
  if (reload_state) {
    try {
      var a = storage_get("reload" + server_region + server_identifier);
      a &&
        ((a = JSON.parse(a)),
        (a.time = new Date(a.time)),
        new Date() < a.time &&
          ("synced" != reload_state &&
            add_log("Reload Synced", colors.serious_green),
          (reload_state = "synced")),
        "synced" == reload_state && (reload_timer = a.time));
    } catch (c) {
      console.log(c);
    }
    "start" == reload_state &&
      ((reload_state = "schedule"),
      (reload_timer = future_s(
        (window.rc_delay || 0) + 3 + parseInt(2 * Math.random())
      )),
      add_log(
        "First Echo In " + parseInt(-ssince(reload_timer)) + " Seconds",
        "gray"
      ));
    "schedule" == reload_state &&
      new Date() > reload_timer &&
      (api_call("can_reload", {
        region: server_region,
        pvp: is_pvp || "",
        name: server_identifier,
      }),
      add_log("Echo Sent", "gray"),
      (reload_timer = future_s(
        (window.rc_delay || 0) + 3 + parseInt(2 * Math.random())
      )));
    "synced" == reload_state &&
      new Date() > reload_timer &&
      ((reload_state = !1),
      is_cli
        ? CLI_OUT.push({ type: "kill" })
        : (window.location.href = page.url));
  }
  if (game_loaded) {
    a = mssince(heartbeat);
    var b = new Date();
    900 < a ? slow_heartbeats++ : 600 > a && (slow_heartbeats = 0);
    is_hidden() && !is_demo && (pull_all_next = !0);
    !is_hidden() &&
      pull_all_next &&
      socket &&
      (console.log("pull_all_next triggered"),
      (pull_all_next = !1),
      socket.emit("send_updates", {}));
    window.last_draw &&
      ((code_run || sound_sfx) && 250 < mssince(last_draw)
        ? draw(0, 1)
        : !code_run && !sound_sfx && 15e3 < mssince(last_draw) && draw(0, 1));
    force_draw_on &&
      force_draw_on < b &&
      (current_map != drawn_map && create_map(), draw(0, 1));
    mm_afk = ssince(window.last_interaction) > afk_edge / 2;
    character &&
      (!character.afk &&
        ssince(window.last_interaction) > afk_edge &&
        ((character.afk = !0), socket.emit("property", { afk: !0 })),
      character.afk &&
        ssince(window.last_interaction) <= afk_edge &&
        ((character.afk = !1), socket.emit("property", { afk: !1 })),
      mode.debug_moves &&
        socket.emit("mreport", { x: character.real_x, y: character.real_y }));
    heartbeat = new Date();
  }
}, 100);
setInterval(function () {
  arrow_movement_logic();
}, 200);
function code_button() {
  add_log("Executed");
  add_tint(".mpui", { ms: 3e3 });
}
function observe_character(a) {
  for (var b = 0; b < (X.characters || []).length; b++) {
    var c = X.characters[b];
    if (c.name == a && c.secret)
      for (var d = 0; d < X.servers.length; d++) {
        var e = X.servers[d];
        if (e.key == c.server)
          return (
            socket && observing && observing.name == c.name
              ? socket.emit("o:home")
              : ((server_addr = e.addr),
                (server_port = e.port),
                init_socket({ secret: c.secret }),
                is_comm && hide_nav()),
            !0
          );
      }
  }
  return !1;
}
function log_in(a, b, c, d) {
  if (!socket) return show_alert("Connect to a server first!");
  real_id = b;
  d || (d = storage_get("passphrase") || "");
  if (game_loaded) {
    clear_game_logs();
    add_log("Connecting ...");
    var e = no_html;
    no_html && parent && parent.character && (e = parent.character.name);
    b = {
      user: a,
      character: b,
      code_slot: get_code_slot(),
      auth: c,
      width: screen.width,
      height: screen.height,
      scale: scale,
      passphrase: d,
      no_html: e,
      no_graphics: no_graphics,
    };
    console.log("log_in: " + a + " code_slot: " + b.code_slot);
    is_electron &&
      ((b.epl = electron_data.platform),
      "mas" == b.epl && (b.receipt = electron_mas_receipt()),
      "steam" == b.epl && (b.ticket = electron_steam_ticket()));
    window.auth_sent = new Date();
    socket.emit("auth", b);
  } else ui_log("Game hasn't loaded yet");
}
function disconnect() {
  $("iframe").remove();
  $(".disconnected").show();
  observing = null;
  $("#observeui").hide();
  if (socket)
    try {
      socket.disconnect(), (socket = null);
    } catch (c) {}
  var a = "DISCONNECTED",
    b = "Disconnected";
  game_loaded = !1;
  "limits" == window.disconnect_reason
    ? ((a = "REJECTED"),
      add_log("Oops. You exceeded the limitations.", "#83BDCF"),
      add_log(
        "You can have 3 characters and one merchant online at most.",
        "#CF888A"
      ))
    : window.disconnect_reason &&
      add_log("Disconnect Reason: " + window.disconnect_reason, "gray");
  "game" == inside &&
    (!character || ("on" != auto_reload && "auto" != auto_reload)
      ? character_to_load &&
        (add_log("Retrying in 2500ms", "gray"),
        setTimeout(function () {
          is_cli
            ? CLI_OUT.push({ type: "kill" })
            : (window.location.href = page.url);
        }, 2500))
      : ((auto_reload = !0),
        (b = "Reloading"),
        add_log("Auto Reload Active", colors.serious_red),
        (reload_state = "start")),
    no_html
      ? (set_status("Disconnected"), $("#name").css("color", "red"))
      : $("body").append(
          "<div style='position: fixed; top: 0px; left: 0px; right: 0px; bottom: 0px; z-index: 999; background: rgba(0,0,0,0.6); pointer-events: none; text-align: center'><div onclick='refresh_page()' class='gamebutton clickable' style='margin-top: " +
            (round(height / 2) - 10) +
            "px; color:#FF2E46'>" +
            a +
            "</div></div>"
        ),
    character && $("title").html(b + " - " + character.name));
}
function position_map() {
  character &&
    ((map.real_x = character.real_x), (map.real_y = character.real_y));
  var a = width / 2 - map.real_x * scale,
    b = height / 2 - map.real_y * scale,
    c = !1;
  a = c_round(a);
  b = c_round(b);
  map.x != a && ((map.x = a), (c = !0));
  map.y != b && ((map.y = b), (c = !0));
  c &&
    dtile_size &&
    window.dtile &&
    ((dtile.x = round(map.real_x - width / (2 * scale))),
    (dtile.y = round(map.real_y - height / (2 * scale))),
    (dtile.x =
      ceil(dtile.x / (dtile_size / 1)) * (dtile_size / 1) - dtile_size / 1),
    (dtile.y =
      ceil(dtile.y / (dtile_size / 1)) * (dtile_size / 1) - dtile_size / 1));
  c &&
    window.wtile &&
    ((wtile.x = round(map.real_x - width / (2 * scale))),
    (wtile.y = round(map.real_y - height / (2 * scale))),
    (wtile.x =
      ceil(wtile.x / (textures[wtile_name][0].width / 1)) *
        (textures[wtile_name][0].width / 1) -
      textures[wtile_name][0].width / 1),
    (wtile.y =
      ceil(wtile.y / (textures[wtile_name][0].height / 1)) *
        (textures[wtile_name][0].height / 1) -
      textures[wtile_name][0].height / 1));
  character &&
    (manual_centering
      ? ((character.x = c_round(width / 2 + ch_disp_x)),
        (character.y = c_round(height / 2 + ch_disp_y)))
      : ((character.x = c_round(character.real_x)),
        (character.y = c_round(character.real_y))));
}
function ui_logic() {
  character &&
    "mage" == character.ctype &&
    (b_pressed && "crosshair" != map.cursor
      ? (map.cursor = "crosshair")
      : b_pressed || "crosshair" != map.cursor || (map.cursor = "default"));
}
var rendered_target = {},
  last_target_cid = null,
  last_xtarget_cid = null,
  dialogs_target = null;
function reset_topleft() {
  if (!no_html) {
    var a = ctarget;
    (ctarget = xtarget || ctarget) &&
      ctarget.dead &&
      (!ctarget.died || 3 < ssince(ctarget.died)) &&
      (ctarget = null);
    ctarget != rendered_target &&
      ((last_target_cid = null), reset_inventory(1));
    dialogs_target &&
      dialogs_target != ctarget &&
      ($("#topleftcornerdialog").html(""), (dialogs_target = null));
    ctarget &&
      topleft_npc &&
      (topleft_npc && inventory && render_inventory(),
      (topleft_npc = !1),
      reset_inventory());
    ctarget && "monster" == ctarget.type && last_target_cid != ctarget.cid
      ? render_monster(ctarget)
      : ctarget && ctarget.npc
      ? render_npc(ctarget)
      : ctarget && "character" == ctarget.type && last_target_cid != ctarget.cid
      ? render_character(ctarget)
      : ctarget ||
        null == rendered_target ||
        $("#topleftcornerui").html('<div class="gamebutton">NO TARGET</div>');
    last_target_cid = (rendered_target = ctarget) && ctarget.cid;
    ctarget = a;
  }
}
function handle_entities(a, b) {
  window.last_entities_received = a;
  if (
    "all" == a.type &&
    ((b && b.new_map) || (clean_house = !0),
    !first_entities && ((first_entities = !0), character_to_load))
  ) {
    set_status("LOADING " + character_to_load);
    try {
      log_in(user_id, character_to_load, user_auth);
    } catch (d) {
      console.log(d);
    }
    character_to_load = !1;
  }
  "all" == a.type &&
    log_flags.entities &&
    console.log("all entities " + new Date());
  character &&
    (a.xy
      ? ((last_refxy = new Date()), (ref_x = a.x), (ref_y = a.y))
      : (last_refxy = 0));
  for (b = 0; b < a.players.length; b++)
    future_entities.players[a.players[b].id] = a.players[b];
  for (b = 0; b < a.monsters.length; b++) {
    var c =
      future_entities.players[a.monsters[b].id] &&
      future_entities.players[a.monsters[b].id].events;
    future_entities.monsters[a.monsters[b].id] = a.monsters[b];
    c &&
      (future_entities.monsters[a.monsters[b].id].events =
        c + future_entities.monsters[a.monsters[b].id].events);
  }
}
function draw_entities() {
  for (entity in entities) {
    var a = entities[entity];
    if (
      (character && !within_xy_range(character, a)) ||
      (!character &&
        !within_xy_range(
          {
            map: current_map,
            in: current_map,
            vision: [700, 500],
            x: first_x,
            y: first_y,
          },
          a
        ))
    )
      call_code_function("on_disappear", a, { outside: !0 }),
        (a.dead = "vision");
    a.dead || clean_house
      ? (a.dead || (a.dead = !0),
        a.cid++,
        (a.died = new Date()),
        (a.interactive = !1),
        a.drawn && a.tpd
          ? draw_timeout(fade_away_teleport(1, a), 30, 1)
          : a.drawn
          ? draw_timeout(fade_away(1, a), 30, 1)
          : destroy_sprite(entities[entity], "just"),
        delete entities[entity])
      : (a.drawn || ((a.drawn = !0), map.addChild(a)),
        round_entities_xy
          ? ((a.x = round(a.real_x)), (a.y = round(a.real_y)))
          : ((a.x = a.real_x), (a.y = a.real_y)),
        update_sprite(a));
  }
  clean_house = !1;
}
function sync_entity(a, b) {
  adopt_soft_properties(a, b);
  a.resync &&
    ((a.real_x = b.x),
    (a.real_y = b.y),
    b.moving
      ? ((a.engaged_move = -1), (a.move_num = 0))
      : ((a.engaged_move = a.move_num = b.move_num),
        (a.angle = (void 0 === b.angle && 90) || b.angle),
        set_direction(a)),
    (a.resync = a.moving = !1));
  b.abs && !a.abs && ((a.abs = !0), (a.moving = !1));
  if (a.move_num != a.engaged_move) {
    120 < simple_distance({ x: a.real_x, y: a.real_y }, b) &&
      ((a.real_x = b.x),
      (a.real_y = b.y),
      log_flags.xy_corrections &&
        console.log("manual x,y correction for: " + (a.name || a.id)));
    var c =
      simple_distance(
        { x: a.real_x, y: a.real_y },
        { x: b.going_x, y: b.going_y }
      ) /
      (simple_distance(b, { x: b.going_x, y: b.going_y }) + EPS);
    1.25 < c &&
      log_flags.timers &&
      log_flags.xy &&
      console.log(a.id + " speedm: " + c);
    a.moving = !0;
    a.abs = !1;
    a.engaged_move = a.move_num;
    a.from_x = a.real_x;
    a.from_y = a.real_y;
    a.going_x = b.going_x;
    a.going_y = b.going_y;
    calculate_vxy(a, c);
  }
}
function process_entities() {
  for (var a in future_entities.monsters) {
    var b = future_entities.monsters[a],
      c = entities[b.id];
    if (!c) {
      if (b.dead) continue;
      if (gtest) return;
      try {
        (c = entities[b.id] = add_monster(b)), (c.drawn = !1), (c.resync = !0);
      } catch (e) {
        console.log(
          "EMAIL HELLO@ADVENTURE.LAND WITH THIS: " + JSON.stringify(b)
        ),
          is_sdk && alert(e + " " + JSON.stringify(b));
      }
    }
    b.dead
      ? (c.dead = !0)
      : (sync_entity(c, b),
        (b.events || []).forEach(function (a) {
          original_onevent.apply(socket, [{ type: 2, nsp: "/", data: a }]);
        }),
        ctarget && ctarget.id == c.id && (ctarget = c),
        xtarget && xtarget.id == c.id && (xtarget = c));
  }
  for (a in future_entities.players) {
    b = future_entities.players[a];
    c = entities[b.id];
    var d = !0;
    c && (d = c.rip);
    if (!character || character.id != b.id) {
      if (!c) {
        if (b.dead) continue;
        b.external = !0;
        b.player = !0;
        c = entities[b.id] = add_character(b);
        c.drawn = !1;
        c.resync = !0;
        500 > mssince(last_light) && start_animation(c, "light");
      }
      b.dead
        ? (c.dead = !0)
        : (sync_entity(c, b),
          !d &&
            c.rip &&
            call_code_function("trigger_event", "death", { id: c.id }),
          ctarget && ctarget.id == c.id && (ctarget = c),
          xtarget && xtarget.id == c.id && (xtarget = c));
    }
  }
}
function on_disappear(a) {
  future_entities.players[a.id] && delete future_entities.players[a.id];
  future_entities.monsters[a.id] && delete future_entities.monsters[a.id];
  entities[a.id]
    ? (a.invis && assassin_smoke(entities[a.id].real_x, entities[a.id].real_y),
      1 === a.effect && start_animation(entities[a.id], "transport"),
      (entities["DEAD" + a.id] = entities[a.id]),
      (entities[a.id].dead = a.reason || !0),
      a.teleport && (entities[a.id].tpd = !0),
      call_code_function("on_disappear", entities[a.id], a),
      delete entities[a.id])
    : character &&
      character.id == a.id &&
      (a.invis && assassin_smoke(character.real_x, character.real_y),
      call_code_function("on_disappear", character, a));
}
var asp_skip = {};
"x y vx vy moving abs going_x going_y from_x from_y width height type events angle skin events reopen"
  .split(" ")
  .forEach(function (a) {
    asp_skip[a] = !0;
  });
function adopt_soft_properties(a, b) {
  a.me
    ? ((a.stats = {}),
      ["str", "dex", "int", "vit", "for"].forEach(function (c) {
        a.stats[c] = b[c];
      }),
      a.moving &&
        a.speed &&
        b.speed &&
        a.speed != b.speed &&
        ((a.speed = b.speed), calculate_vxy(a)),
      b.abs && (a.moving = !1),
      (a.bank = null))
    : ((a["in"] = current_in), (a.map = current_map));
  ["team"].forEach(function (c) {
    b.p || delete a[c];
  });
  if ("monster" == a.type && G.monsters[a.mtype]) {
    var c = G.monsters[a.mtype],
      d = [
        ["hp", "hp"],
        ["max_hp", "hp"],
        ["mp", "mp"],
        ["max_mp", "mp"],
      ];
    "speed xp attack frequency rage aggro armor resistance damage_type respawn range name abilities evasion reflection dreturn immune cooperative spawns special 1hp lifesteal"
      .split(" ")
      .forEach(function (a) {
        d.push([a, a]);
      });
    d.forEach(function (d) {
      void 0 === c[d[1]] ||
        (void 0 !== b[d[0]] && void 0 !== a[d[0]]) ||
        (a[d[0]] = c[d[1]]);
    });
  }
  "character" == a.type &&
    a.skin &&
    a.skin != b.skin &&
    !a.rip &&
    (XYWH[b.skin] || (b.skin = "naked"),
    (a.skin = b.skin),
    new_sprite(a, "full", "renew"),
    restore_dimensions(a));
  for (prop in b) asp_skip[prop] || (a[prop] = b[prop]);
  if (a.slots) {
    a.pzazz = 0;
    for (var e in a.slots)
      if (attire_slots.includes(e) && a.slots[e]) {
        var f = calculate_item_grade(G.items[a.slots[e].name]) + 0.5;
        12 == a.slots[e].level
          ? (a.pzazz += 12 * f)
          : 11 <= a.slots[e].level
          ? (a.pzazz += 8 * f)
          : 10 == a.slots[e].level
          ? (a.pzazz += 6 * f)
          : 9 == a.slots[e].level
          ? (a.pzazz += 2 * f)
          : 8 == a.slots[e].level && (a.pzazz += f / 2);
      }
  }
  a.me && (a.bank = a.user);
  a.last_ms = new Date();
}
function reposition_ui() {
  var a = $("#topmid").outerWidth(),
    b = $("#bottommid").outerWidth();
  !character || no_html || cached("rpui", $("html").width(), a, b);
  $("#topmid").css("right", round(($("html").width() - a) / 2));
  $("#bottommid").css("right", round(($("html").width() - b) / 2));
}
function update_tutorial_ui() {
  var a = X.tutorial.progress;
  last_rendered_step > X.tutorial.step
    ? (a = 0)
    : (last_rendered_step < X.tutorial.step
        ? ((a = 100),
          $(".tuttask").css("color", "#85C76B").css("font-size", "64px"),
          $(".tuttask").html("\u00a9"))
        : (a = X.tutorial.progress),
      X.tutorial.completed.forEach(function (a) {
        $(".tuttask" + a)
          .css("color", "#85C76B")
          .css("font-size", "64px");
        $(".tuttask" + a).html("\u00a9");
      }));
  100 == a
    ? ($(".tutcontinue").show(), $(".tutincomplete").hide())
    : ($(".tutcontinue").hide(), $(".tutincomplete").show());
  $(".tutprogress").html(a);
  $("#tutorialui").html(
    "TUTORIAL " + (X.tutorial.step + 1) + " / " + G.docs.tutorial.length
  );
  $("#tutorialslider").css(
    "width",
    (100 * (X.tutorial.step + 1)) / G.docs.tutorial.length + "%"
  );
}
function update_overlays() {
  character && send_target_logic();
  if (!mode.dom_tests && !no_html) {
    if (character) {
      cached("att", character.attack) ||
        $(".attackui").html(
          (("priest" == character.ctype && "HEAL ") || "ATT ") +
            character.attack
        );
      cached("inv", character.esize + "|" + character.isize) ||
        $(".invui").html(
          "INV " + (character.isize - character.esize) + "/" + character.isize
        );
      cached("hptop", character.hp, character.max_hp) ||
        ($("#hptext").html(character.hp + "/" + character.max_hp),
        $("#hpslider").css(
          "width",
          (100 * character.hp) / character.max_hp + "%"
        ));
      cached("mptop", character.mp, character.max_mp) ||
        ($("#mptext").html(character.mp + "/" + character.max_mp),
        $("#mpslider").css(
          "width",
          (100 * character.mp) / character.max_mp + "%"
        ));
      var a = floor((character.xp / character.max_xp) * 100);
      cached("xptop", character.level + "|" + a) ||
        ($("#xpui").html("LV" + character.level + " " + a + "%"),
        $("#xpslider").css(
          "width",
          (100 * character.xp) / character.max_xp + "%"
        ));
      cached("tutorialtop", X.tutorial.step + "|" + X.tutorial.task) ||
        update_tutorial_ui();
      inventory &&
        !cached("igold", character.gold) &&
        $(".goldnum").html(
          to_pretty_num(
            character.gold +
              (101 == new Date().getDate() && 3 == new Date().getMonth()
                ? 1014201800
                : 0)
          )
        );
      inventory &&
        !cached("icash", character.cash) &&
        $(".cashnum").html(to_pretty_num(character.cash));
      cached("coord", round(map.real_x) + "|" + round(map.real_y)) ||
        $(".coords").html(round(map.real_x) + "," + round(map.real_y));
      topleft_npc || reset_topleft(ctarget);
      "character" != topright_npc ||
        cached("chcid", character.cid) ||
        render_character_sheet();
    }
    if (events.abtesting) {
      $(".scoreA").html(events.abtesting.A);
      $(".scoreB").html(events.abtesting.B);
      a = -ssince(events.abtesting.end);
      var b = parseInt(a / 60);
      a = parseInt(a) % 60;
      0 == a ? (a = "00") : 10 > a && (a = "0" + a);
      $(".abtime").html("0" + b + ":" + a);
    }
    character &&
      character.moving &&
      options.code_fx &&
      stage.cfilter_ascii &&
      remove_code_fx();
  }
}
var last_loader = { progress: 0 };
function on_load_progress(a, b) {
  a ? (last_loader = a) : (a = last_loader);
  $("#progressui").html(round(a.progress) + "%");
  "100%" == $("#progressui").html() && $("#progressui").removeClass("loading");
}
function loader_click() {
  server_addr
    ? "100%" != $("#progressui").html()
      ? show_modal(
          "<div style='font-size: 48px'>Game resources are loading<br /><br />This may take some time<br /><br />If the game got stuck at this stage, please email hello@adventure.land</div>"
        )
      : show_modal(
          "<div style='font-size: 48px'>All game resources have been loaded<br /><br />If you can't sign in, please email hello@adventure.land</div>"
        )
    : show_modal(
        "<div style='font-size: 48px'>No servers found, 3 possible scenarios: <br /><br />(1) The game is being updated <br />(2) All existing servers overloaded <br />(3) Someone found a bug that brought down all the servers<br /><br />Best to spend this time in our Discord to figure out what happened</div>"
      );
}
function the_game(a) {
  is_cli && window.ls_emulation && (window._localStorage = window.ls_emulation);
  width = $(window).width();
  height = $(window).height();
  renderer =
    bowser.mac && bowser.firefox && !engine_mode
      ? new PIXI.CanvasRenderer(width, height, {
          antialias: antialias,
          transparent: !1,
        })
      : retina_mode && !engine_mode
      ? new PIXI.autoDetectRenderer(width, height, {
          antialias: antialias,
          transparent: !1,
          resolution: window.devicePixelRatio,
          autoResize: !0,
        })
      : "webgl" == engine_mode
      ? new PIXI.WebGLRenderer(width, height, {
          antialias: antialias,
          transparent: !1,
        })
      : "canvas" == engine_mode
      ? new PIXI.CanvasRenderer(width, height, {
          antialias: antialias,
          transparent: !1,
        })
      : new PIXI.autoDetectRenderer(width, height, {
          antialias: antialias,
          transparent: !1,
        });
  high_precision && (PIXI.PRECISION.DEFAULT = PIXI.PRECISION.HIGH);
  renderer.type == PIXI.RENDERER_TYPE.WEBGL
    ? console.log("WebGL Mode")
    : console.log("Canvas Mode");
  renderer.plugins.interaction.cursorStyles.help = "help";
  renderer.plugins.interaction.cursorStyles.crosshair = "crosshair";
  no_graphics || document.body.appendChild(renderer.view);
  $("canvas")
    .css("position", "fixed")
    .css("top", "0px")
    .css("left", "0px")
    .css("z-index", 1);
  stage =
    PIXI.display && PIXI.display.Stage
      ? new PIXI.display.Stage()
      : new PIXI.Container();
  if (bw_mode) {
    var b = new PIXI.filters.ColorMatrixFilter();
    b.desaturate();
    stage.cfilter_bw = b;
  } else delete stage.cfilter_bw;
  regather_filters(stage);
  if (PIXI.DisplayList && !no_graphics)
    window.inner_stage
      ? (inner_stage.displayList = new PIXI.DisplayList())
      : (stage.displayList = new PIXI.DisplayList()),
      (map_layer = new PIXI.DisplayGroup(0, !0)),
      (text_layer = new PIXI.DisplayGroup(3, !0)),
      (chest_layer = new PIXI.DisplayGroup(2, !0)),
      (separate_layer = new PIXI.DisplayGroup(0, !0)),
      (chest_layer = player_layer = monster_layer = new PIXI.DisplayGroup(
        1,
        function (a) {
          var b = 0;
          a.stand && (b = -3);
          a.zOrder =
            "real_y" in a
              ? -a.real_y + b + (a.y_disp || 0)
              : -a.position.y + b + (a.y_disp || 0);
        }
      ));
  else if (PIXI.display) {
    PIXI.Container.prototype.renderWebGL = function (a) {
      (this._activeParentLayer && this._activeParentLayer != a._activeLayer) ||
        (this.visible
          ? ((this.displayOrder = a.incDisplayOrder()),
            0 >= this.worldAlpha ||
              !this.renderable ||
              ((a._activeLayer = null),
              this.containerRenderWebGL(a),
              (a._activeLayer = this._activeParentLayer)))
          : (this.displayOrder = 0));
    };
    use_layers = !0;
    stage.group.enableSort = !0;
    b = function (a) {
      var b = 0;
      a.stand && (b = -3);
      a.zOrder =
        "real_y" in a
          ? -a.real_y + b + (a.y_disp || 0)
          : -a.position.y + b + (a.y_disp || 0);
    };
    var c = function (a) {
      var b = 0;
      a.parent.stand && (b = -3);
      a.zOrder =
        "real_y" in a.parent
          ? -a.parent.real_y + b + (a.parent.y_disp || 0)
          : -a.parent.position.y + b + (a.parent.y_disp || 0);
    };
    map_layer = new PIXI.display.Group(0, !0);
    stage.addChild(new PIXI.display.Layer(map_layer));
    animation_layer = new PIXI.display.Group(1, !0);
    stage.addChild(new PIXI.display.Layer(animation_layer));
    entity_layer = new PIXI.display.Group(2, c);
    stage.addChild(new PIXI.display.Layer(entity_layer));
    below_layer = new PIXI.display.Group(2.99, b);
    stage.addChild(new PIXI.display.Layer(below_layer));
    monster_layer = new PIXI.display.Group(3, b);
    stage.addChild(new PIXI.display.Layer(monster_layer));
    above_layer = new PIXI.display.Group(3.01, b);
    stage.addChild(new PIXI.display.Layer(above_layer));
    hp_layer = new PIXI.display.Group(4, c);
    stage.addChild(new PIXI.display.Layer(hp_layer));
    text_layer = new PIXI.display.Group(5, !0);
    stage.addChild(new PIXI.display.Layer(text_layer));
    weather_layer = new PIXI.display.Group(6, !0);
    stage.addChild(new PIXI.display.Layer(weather_layer));
    fog_layer = new PIXI.display.Group(7, !0);
    stage.addChild(new PIXI.display.Layer(fog_layer));
    player_layer = monster_layer;
    player_layer.sortPriority = 1;
    player_layer.useDoubleBuffer = !0;
    chest_layer = monster_layer;
  }
  frame_ms = 16;
  C = PIXI.utils.BaseTextureCache;
  FC = {};
  FM = {};
  XYWH = {};
  loader = PIXI.loader;
  loader.on("progress", on_load_progress);
  for (var d in G.animations)
    (G.animations[d].file = url_factory(G.animations[d].file)),
      loader.add(G.animations[d].file);
  for (d in G.tilesets)
    (G.tilesets[d].file = url_factory(G.tilesets[d].file)),
      loader.add(G.tilesets[d].file);
  for (d in G.sprites)
    (b = G.sprites[d]),
      b.skip || ((b.file = url_factory(b.file)), loader.add(b.file));
  for (d in G.imagesets)
    G.imagesets[d].load &&
      ((G.imagesets[d].file = url_factory(G.imagesets[d].file)),
      loader.add(G.imagesets[d].file));
  gprocess_game_data();
  mode.bitmapfonts && loader.add("/css/fonts/m5x7.xml");
  set_status("75% ->Server");
  a ? init_demo() : (load_game(), init_socket());
}
function demo_entity_logic(a) {
  if (a.demo && !(a.moving || (a.pause && 800 > mssince(a.pause)))) {
    0.1 > Math.random() && (a.pause = new Date());
    var b = [
        [1, 0],
        [0, 1],
        [-1, 0],
        [0, -1],
        [0.8, 0.8],
        [-0.8, -0.8],
        [0.8, -0.8],
        [-0.8, 0.8],
      ],
      c = 12;
    0.3 > Math.random() ? (c *= 2) : 0.3 > Math.random() && (c *= 3);
    shuffle(b);
    a.going_x = a.x + b[0][0] * c;
    a.going_y = a.y + b[0][1] * c;
    (a.boundary &&
      (a.going_x < a.boundary[0] ||
        a.going_x > a.boundary[2] ||
        a.going_y < a.boundary[1] ||
        a.going_y > a.boundary[3])) ||
      (can_move(a)
        ? ((a.u = !0),
          (a.moving = !0),
          (a.from_x = a.x),
          (a.from_y = a.y),
          calculate_vxy(a))
        : ((a.going_x = a.x), (a.going_y = a.y)));
  }
}
function init_demo() {
  is_demo = 1;
  current_map = current_in = "shellsisland";
  M = G.maps[current_map].data;
  GEO = G.geometry[current_map];
  reflect_music();
  load_game();
  G.maps[current_map].monsters.forEach(function (a) {
    future_entities.monsters[a.type] = {
      type: a.type,
      speed: 8,
      id: a.type,
      x: a.boundary[0] + (a.boundary[2] - a.boundary[0]) * Math.random(),
      y: a.boundary[1] + (a.boundary[3] - a.boundary[1]) * Math.random(),
      boundary: a.boundary,
      s: {},
      in: current_map,
      map: current_map,
      moving: !1,
      demo: !0,
    };
  });
}
function init_socket(a) {
  a || (a = {});
  if (server_addr) {
    if (window.socket) {
      if (!socket_welcomed)
        return add_log("Another server connection in progress. Please wait.");
      window.socket.destroy();
    }
    $(".disconnected").hide();
    is_sdk &&
    (Cookies.get("windows") ||
      Cookies.get("local_ip") ||
      "advanture.land" == window.location.host ||
      "x.thegame.com" == window.location.host)
      ? (server_addr = "192.168.1.125")
      : is_sdk && (server_addr = "0.0.0.0");
    a =
      (a.secret &&
        "desktop=" + ((!is_comm && 1) || "") + "&secret=" + a.secret) ||
      void 0;
    window.socket =
      "https:" == location.protocol
        ? io("wss://" + server_addr + ":" + server_port, {
            secure: !0,
            transports: ["websocket"],
            query: a,
          })
        : io(server_addr + ":" + server_port, {
            transports: ["websocket"],
            query: a,
          });
    add_log("Connecting to the server.");
    socket_welcomed = socket_ready = !1;
    observing = null;
    $("#observeui").hide();
    original_onevent = socket.onevent;
    original_emit = socket.emit;
    socket.emit = function (a) {
      var b = in_arr(arguments && arguments["0"], [
        "transport",
        "enter",
        "leave",
      ]);
      mode.log_calls &&
        console.log("CALL", JSON.stringify(arguments) + " " + new Date());
      (transporting && b && 8 > ssince(transporting)) ||
        (original_emit.apply(socket, arguments),
        b && (transporting = new Date()));
    };
    socket.onevent = function (a) {
      mode.log_incoming &&
        console.log("INCOMING", JSON.stringify(arguments) + " " + new Date());
      original_onevent.apply(socket, arguments);
    };
    socket.on("welcome", function (a) {
      a && a.character && ((observing = a.character), $("#observeui").show());
      socket_welcomed = !0;
      is_pvp = a.pvp;
      gameplay = a.gameplay;
      server_region = a.region;
      server_identifier = a.name;
      server_name = server_names[a.region] + " " + a.name;
      clear_game_logs();
      add_log("Welcome to " + server_names[a.region] + " " + a.name);
      add_update_notes();
      current_map = a.map;
      current_in = a["in"];
      first_coords = !0;
      first_x = a.x;
      first_y = a.y;
      reflect_music();
      M = G.maps[current_map].data;
      GEO = G.geometry[current_map];
      $(".servername").html(server_name);
      $(".mapname").html(G.maps[current_map].name || "Unknown");
      resources_loaded ? launch_game() : (socket_ready = !0);
      new_map_logic("welcome", a);
    });
    socket.on("new_map", function (a) {
      var b = !1;
      transporting = !1;
      current_map != a.name && ((b = !0), (topleft_npc = !1), (a.redraw = !0));
      current_map = a.name;
      current_in = a["in"];
      reflect_music();
      M = G.maps[current_map].data;
      GEO = G.geometry[current_map];
      $(".mapname").html(G.maps[current_map].name || "Unknown");
      if (character) {
        character.real_x = a.x;
        character.real_y = a.y;
        character.m = a.m;
        character.moving = !1;
        var d = character.direction;
        character.direction = a.direction || 0;
        character.map = current_map;
        character["in"] = a["in"];
        "blink" === a.effect &&
          (delete character.fading_out,
          delete character.s.blink,
          (character.real_alpha = 0.5),
          restore_dimensions(character));
        "magiport" === a.effect &&
          (delete character.fading_out,
          delete character.s.magiport,
          stop_filter(character, "bloom"),
          (character.real_alpha = 0.5),
          (character.direction = d),
          restore_dimensions(character));
        blink_pressed = !1;
        last_blink_pressed = really_old;
        a.effect && unstuck_logic(character);
        character.tp = a.effect;
      }
      b && create_map();
      character || ((map.real_x = a.x), (map.real_y = a.y));
      position_map();
      new_map_logic("map", a);
      call_code_function("trigger_event", "new_map", a);
      handle_entities(a.entities, { new_map: !0 });
    });
    socket.on("start", function (a) {
      no_html ||
        ($("#progressui").remove(),
        $("#content").html(""),
        $(
          "#topmid,#bottommid,#toprightcorner,#bottomleftcorner2,#bottomleftcorner"
        ).show(),
        $(".xpsui").css("display", "block"),
        is_sdk && $(".tutorialui").css("display", "block"),
        $("body").append(
          '<input id="chatinput" onkeypress="if(event.keyCode==13) say($(this).rfval())" type="text" autocomplete="off" name="alchatinput" placeholder=""/>'
        ));
      gtest &&
        $("body")
          .children()
          .each(function () {
            "CANVAS" != this.tagName && $(this).remove();
          });
      inside = "game";
      observing = null;
      $("#observeui").hide();
      S = a.s_info;
      var b = a.code,
        d = a.code_slot;
      delete a.code;
      delete a.code_version;
      delete a.code_slot;
      d && console.log("start: " + a.id + " code: " + d);
      var e = a.info;
      delete a.info;
      delete a.s_info;
      var f = a.entities;
      delete a.entities;
      G.base_gold = a.base_gold;
      delete a.base_gold;
      character = add_character(a, 1);
      character.ping = min(320, mssince(window.auth_sent));
      pings = [character.ping];
      a.vision || (character.vision = [700, 500]);
      friends = a.friends;
      character.acx = a.acx;
      character.xcx = a.xcx;
      G.classes[character.ctype].xcx.forEach(function (a) {
        character.xcx.includes(a) || character.xcx.push(a);
      });
      1 == character.level && show_game_guide();
      if ("merchant" == character.ctype || recording_mode)
        options.show_names = !0;
      clear_game_logs();
      add_log("Connected!");
      "hardcore" == gameplay
        ? (add_log(
            "Pro Tips: You can transport to anywhere from the Beach Cave, Water Spirits drop stat belts, 3 monsters drop 3 new unique items, 3 monsters drop 50 times the gold they usually do!",
            "#B2D5DF"
          ),
          $(".saferespawn").show())
        : add_log(
            "Note: Game dynamics and drops aren't final, they are evolving with every update",
            "gray"
          );
      $(".charactername").html(character.name);
      page.title = character.name;
      "hardcore" == gameplay && (page.title = "Fierce " + character.name);
      try {
        var g = "";
        no_html && (g += ((!g && "?") || "&") + "no_html=true");
        is_bot && (g += ((!g && "?") || "&") + "is_bot=1");
        no_graphics && (g += ((!g && "?") || "&") + "no_graphics=true");
        border_mode && (g += ((!g && "?") || "&") + "borders=true");
        explicit_slot && (g += ((!g && "?") || "&") + "code=" + explicit_slot);
        page.url =
          "/character/" +
          character.name +
          "/in/" +
          server_region +
          "/" +
          server_identifier +
          "/" +
          g;
        window.history.replaceState({}, page.title, page.url);
        $("title").html(page.title);
      } catch (h) {
        console.log(h);
      }
      reposition_ui();
      update_overlays();
      current_in = character["in"];
      character.map != current_map &&
        ((current_map = character.map),
        reflect_music(),
        (M = G.maps[current_map].data),
        (GEO = G.geometry[current_map]),
        $(".mapname").html(G.maps[current_map].name || "Unknown"),
        create_map());
      gtest ||
        (manual_centering
          ? window.inner_stage
            ? inner_stage.addChild(character)
            : stage.addChild(character)
          : map.addChild(character));
      position_map();
      rip_logic();
      new_map_logic("start", { info: e });
      new_game_logic();
      try {
        (a = storage_get("code_cache")),
          (e = ""),
          (g = !1),
          a
            ? ((a = JSON.parse(a)),
              (e =
                ((!d || a["slot_" + real_id] == d) && a["code_" + real_id]) ||
                b ||
                ""),
              (g = (explicit_slot && "1") || a["run_" + real_id]),
              (code_slot = d || a["slot_" + real_id] || real_id),
              e.length &&
                handle_information([
                  { type: "code", code: e, run: g, slot: code_slot, reset: !0 },
                ]))
            : b &&
              ((code_slot = d),
              handle_information([
                {
                  type: "code",
                  code: b,
                  run: (explicit_slot && !0) || !1,
                  slot: code_slot,
                  reset: !0,
                },
              ]));
      } catch (h) {
        console.log(h);
      }
      a = get_settings(real_id);
      a.skillbar && (skillbar = a.skillbar);
      a.keymap && (keymap = a.keymap);
      is_electron ||
        (("on" == a.music || sound_music) && sound_on(),
        ("on" == a.sfx || sound_sfx) && sfx_on());
      map_keys_and_skills();
      render_skillbar();
      character.rip || $("#name").css("color", "#1AC506");
      set_status("Connected");
      render_server();
      handle_entities(f, { new_map: !0 });
      "cx" != character.role || is_bot || insert_cx_tuners();
    });
    socket.on("correction", function (a) {
      can_move({
        map: character.map,
        x: character.real_x,
        y: character.real_y,
        going_x: a.x,
        going_y: a.y,
        base: character.base,
      }) &&
        (add_log("Location corrected", "gray"),
        console.log("Character correction"),
        (character.real_x = parseFloat(a.x)),
        (character.real_y = parseFloat(a.y)),
        (character.moving = !1),
        (character.vx = character.vy = 0));
    });
    socket.on("players", function (a) {
      load_server_list(a);
    });
    socket.on("pvp_list", function (a) {
      a.code
        ? call_code_function("trigger_event", "pvp_list", a.list)
        : load_pvp_list(a.list);
    });
    socket.on("ping_ack", function (a) {
      pingts[a.id] &&
        (a.ui && add_log("Ping: " + mssince(pingts[a.id]) + "ms", "gray"),
        push_ping(mssince(pingts[a.id])),
        delete pingts[a.id]);
    });
    socket.on("requesting_ack", function () {
      socket.emit("requested_ack", {});
    });
    socket.on("game_error", function (a) {
      draw_trigger(function () {
        is_string(a) ? ui_error(a) : ui_error(a.message);
      });
    });
    socket.on("game_log", function (a) {
      draw_trigger(function () {
        is_string(a)
          ? ui_log(a, "gray")
          : (a.sound && sfx(a.sound), ui_log(a.message, a.color));
        a.confetti &&
          get_player(a.confetti) &&
          confetti_shower(get_player(a.confetti), 1);
      });
    });
    socket.on("game_chat", function (a) {
      draw_trigger(function () {
        is_string(a)
          ? add_chat("", a, "gray")
          : (a.sound && sfx(a.sound), add_chat("", a.message, a.color));
      });
    });
    socket.on("fx", function (a) {
      draw_trigger(function () {
        "the_door" == a.name && the_door();
      });
    });
    socket.on("online", function (a) {
      draw_trigger(function () {
        no_chat_notification = !0;
        add_chat(
          "",
          a.name + " is on " + a.server,
          "white",
          "online|" + a.name
        );
        no_chat_notification = !1;
      });
    });
    socket.on("light", function (a) {
      draw_trigger(function () {
        a.affected && (is_pvp && pvp_timeout(3600), skill_timeout("invis"));
        a.affected && start_animation(b, "light");
        last_light = new Date();
        var b = get_player(a.name);
        if (b) {
          d_text("LIGHT", b, { color: "white" });
          b.me && start_animation(b, "light");
          for (var d in entities) {
            var e = entities[d];
            is_player(e) && 300 > distance(e, b) && start_animation(e, "light");
          }
        }
      });
    });
    socket.on("game_event", function (a) {
      a.name || (a = { name: a });
      "pinkgoo" == a.name &&
        add_chat(
          "",
          "The 'Love Goo' has respawned in " + G.maps[a.map].name + "!",
          "#EDB0E0"
        );
      "wabbit" == a.name &&
        add_chat(
          "",
          "Wabbit has respawned in " + G.maps[a.map].name + "!",
          "#78CFEF"
        );
      "goldenbat" == a.name &&
        add_chat(
          "",
          "The Golden Bat has spawned in " + G.maps[a.map].name + "!",
          "gold"
        );
      if ("ab_score" == a.name) {
        if (!events.abtesting) return;
        events.abtesting.A = a.A;
        events.abtesting.B = a.B;
      }
      call_code_function("on_game_event", a);
      call_code_function("trigger_event", "event", a);
    });
    socket.on("achievement_progress", function (a) {
      add_log("AP[" + a.name + "]: " + a.count + "/" + a.needed, "#6DCC9E");
    });
    socket.on("achievement_success", function (a) {
      add_log("AP[" + a.name + "]: Complete!", "#58CF40");
    });
    socket.on("game_response", function (a) {
      var b = a.response || a;
      if ("upgrade_success" == b || "upgrade_fail" == b)
        u_retain_t = options.retain_upgrades;
      draw_trigger(function () {
        if ("elixir" == b)
          ui_log("Consumed the elixir", "gray"),
            d_text("YUM", character, { color: "elixir" });
        else if ("storage_full" == b)
          ui_log("Storage is full", "gray"), reopen();
        else if ("inventory_full" == b)
          ui_log("Inventory is full", "gray"), reopen();
        else if ("invalid" == b) ui_log("Invalid", "gray");
        else if ("compound_success" == b)
          ui_log("Item combination succeeded", (a.up && "#1ABEFF") || "white"),
            resolve_deferred("compound", {
              success: !0,
              level: a.level,
              num: a.num,
            });
        else if ("compound_fail" == b)
          ui_error("Item combination failed"),
            resolve_deferred("compound", {
              failed: !0,
              success: !1,
              level: a.level,
              num: a.num,
            });
        else if ("compound_in_progress" == b)
          ui_log("Another combination in progress", "gray"),
            reject_deferred("compound", { reason: "in_progress" });
        else if ("compound_invalid_offering" == b)
          ui_log("Offering not accepted", "gray"),
            reject_deferred("compound", { reason: "offering" });
        else if ("compound_mismatch" == b)
          ui_log("Items are different", "gray"),
            reject_deferred("compound", { reason: "mismatch" });
        else if ("compound_no_item" == b)
          reject_deferred("compound", { reason: "no_item" });
        else if ("compound_cant" == b)
          ui_log("Can't be combined", "gray"),
            reject_deferred("compound", { reason: "not_combinable" });
        else if ("compound_incompatible_scroll" == b)
          set_uchance("?"),
            ui_log("Incompatible scroll", "gray"),
            reject_deferred("compound", { reason: "scroll" });
        else if ("misc_fail" == b)
          ui_log(":)", "#FF5D54"),
            a.place && reject_deferred(a.place, { reason: "misc" });
        else if ("upgrade_success" == b)
          ui_log("Item upgrade succeeded", "white"),
            resolve_deferred("upgrade", {
              success: !0,
              level: a.level,
              num: a.num,
            });
        else if ("upgrade_fail" == b)
          ui_error("Item upgrade failed"),
            resolve_deferred("upgrade", {
              failed: !0,
              success: !1,
              level: a.level,
              num: a.num,
            });
        else if ("upgrade_success_stat" == b)
          resolve_deferred("upgrade", {
            stat: !0,
            stat_type: a.stat_type,
            num: a.num,
          });
        else if ("upgrade_offerring_success" == b)
          resolve_deferred("upgrade", { offering: !0 });
        else if ("upgrade_no_item" == b)
          reject_deferred("upgrade", { reason: "no_item" });
        else if ("upgrade_in_progress" == b)
          ui_log("Another upgrade in progress", "gray"),
            reject_deferred("upgrade", { reason: "in_progress" });
        else if ("mail_sending" == b)
          ui_log("Sending mail ...", "gray"), hide_modal(!0);
        else if ("mail_failed" == b)
          show_alert("Mail failed, reason: " + a.reason);
        else if ("mail_sent" == b)
          ui_log("Mail sent to " + a.to + "!", "#C06978");
        else if ("mail_sent" == b)
          ui_log("Mail sent to " + a.to + "!", "#C06978");
        else if ("mail_take_item_failed" == b)
          ui_log(
            "Can't retrieve the item, probably you took it already",
            "#C06978"
          ),
            setTimeout(function () {
              api_call("pull_mail");
            }, 2e3),
            $(".takeitem").hide();
        else if ("mail_item_taken" == b)
          ui_log("Item retrieved!", "#6DAD47"),
            setTimeout(function () {
              api_call("pull_mail");
            }, 2e3),
            $(".takeitem").hide();
        else if ("upgrade_no_scroll" == b)
          reject_deferred("upgrade", { reason: "no_scroll" });
        else if ("upgrade_mismatch" == b)
          reject_deferred("upgrade", { reason: "mismatch" });
        else if ("upgrade_invalid_offering" == b)
          ui_log("Offering not accepted", "gray"),
            reject_deferred("upgrade", { reason: "offering" });
        else if ("upgrade_cant" == b)
          ui_log("Can't be upgraded", "gray"),
            reject_deferred("upgrade", { reason: "not_upgradeable" });
        else if ("upgrade_incompatible_scroll" == b)
          set_uchance("?"),
            ui_log("Incompatible scroll", "gray"),
            reject_deferred("upgrade", { reason: "scroll" });
        else if ("upgrade_scroll_q" == b)
          ui_log("Need " + a.q + " scrolls", "gray"),
            reject_deferred("upgrade", {
              reason: "scroll_quantity",
              need: a.q,
              have: a.h,
            });
        else if ("upgrade_chance" == b || "compound_chance" == b)
          set_uchance(a.chance),
            "upgrade_chance" == b &&
              resolve_deferred("upgrade", { calculate: !0, chance: a.chance }),
            "compound_chance" == b &&
              resolve_deferred("compound", { calculate: !0, chance: a.chance });
        else if ("max_level" == b)
          set_uchance("?"),
            a.place && reject_deferred(a.place, { reason: "max_level" }),
            ui_log("Already +" + a.level, "white");
        else if ("exception" == b)
          a.place && reject_deferred(a.place, { reason: "exception" }),
            ui_error("ERROR!");
        else if ("nothing" == b) ui_log("Nothing happens", "gray");
        else if ("not_ready" == b) d_text("NOT READY", character);
        else if ("no_mp" == b)
          ("attack" != a.place && "heal" != a.place) ||
            reject_deferred(a.place, { reason: "no_mp" }),
            d_text("NO MP", character);
        else if ("friendly" == b) {
          var c = !1,
            e = "FRIENDLY";
          G.maps[character.map].safe && ((c = !0), (e = "SAFE ZONE"));
          ("attack" != a.place && "heal" != a.place) ||
            reject_deferred(a.place, { reason: "friendly" });
          get_entity(a.id) ? d_text(e, get_entity(a.id)) : d_text(e, character);
          c && ui_log("You can't attack in a safe zone", "gray");
        } else
          "cooldown" == b
            ? (("attack" != a.place && "heal" != a.place) ||
                reject_deferred(a.place, {
                  reason: "cooldown",
                  remaining: a.ms,
                }),
              a.id && get_entity(a.id)
                ? d_text("WAIT", get_entity(a.id))
                : d_text("WAIT", character))
            : "too_far" == b
            ? (("attack" != a.place && "heal" != a.place) ||
                reject_deferred(a.place, {
                  reason: "too_far",
                  distance: a.dist,
                  origin: "server",
                }),
              a.id && get_entity(a.id)
                ? d_text("TOO FAR", get_entity(a.id))
                : d_text("TOO FAR", character))
            : "miss" == b
            ? (("attack" != a.place && "heal" != a.place) ||
                reject_deferred(a.place, { reason: "miss" }),
              get_entity(a.id)
                ? d_text("MISS", get_entity(a.id))
                : d_text("MISS", character))
            : "disabled" == b
            ? (a.place && reject_deferred(a.place, { reason: "disabled" }),
              d_text("DISABLED", character))
            : "attack_failed" == b
            ? (("attack" != a.place && "heal" != a.place) ||
                reject_deferred(a.place, { reason: "failed" }),
              get_entity(a.id)
                ? d_text("FAILED", get_entity(a.id))
                : d_text("FAILED", character),
              "level" == a.reason && ui_log("Level gap higher than 10", "gray"))
            : "skill_too_far" == b
            ? d_text("TOO FAR", character)
            : "skill_success" == b
            ? (skill_timeout(a.name),
              resolve_deferred("skill", { success: !0 }))
            : "target_alive" == b
            ? d_text("LOOKS LIVE?", character)
            : "slot_occuppied" == b
            ? ui_log("Slot occuppied", "gray")
            : "no_target" == b
            ? ctarget
              ? d_text("INVALID TARGET", character)
              : d_text("NO TARGET", character)
            : "non_friendly_target" == b
            ? d_text("NON FRIENDLY", character)
            : "challenge_sent" == b
            ? add_chat("", "Challenged " + a.name + " to duel", "white")
            : "challenge_accepted" == b
            ? add_chat("", a.name + " accepted the challenge!", "#DF231B")
            : "challenge_received" == b
            ? (add_challenge(a.name),
              call_code_function(
                "trigger_character_event",
                "challenge",
                a.name
              ))
            : "duel_started" == b
            ? (add_duel(a.challenger, a.vs, a.id),
              call_code_function("trigger_character_event", "duel", {
                challenger: a.challenger,
                vs: a.vs,
                id: a.id,
              }))
            : "no_level" == b
            ? d_text("LOW LEVEL", character)
            : "not_in_pvp" == b
            ? d_text("NO", character)
            : "skill_cant_incapacitated" == b
            ? d_text("CAN'T USE", character)
            : "skill_cant_use" == b
            ? d_text("CAN'T USE", character)
            : "skill_cant_charges" == b
            ? d_text("NO CHARGE", character)
            : "skill_cant_pve" == b
            ? d_text("CAN'T USE", character)
            : "skill_cant_wtype" == b
            ? (ui_log("Wrong weapon", "gray"), d_text("NOPE", character))
            : "skill_cant_slot" == b
            ? (ui_log("Item not equipped", "gray"), d_text("NOPE", character))
            : "skill_cant_requirements" == b
            ? (ui_log("Skill requirements not met", "gray"),
              d_text("NOPE", character))
            : "cruise" == b
            ? ui_log("Cruise speed set at " + a.speed, "gray")
            : "exchange_full" == b
            ? (d_text("NO SPACE", character),
              ui_log("Inventory is full", "gray"),
              reopen())
            : "exchange_existing" == b
            ? (d_text("WAIT", character),
              ui_log("Existing exchange in progress", "gray"),
              reopen())
            : "exchange_notenough" == b
            ? (d_text("NOT ENOUGH", character),
              ui_log("Need more", "gray"),
              reopen())
            : in_arr(
                b,
                "mistletoe_success leather_success candycane_success ornament_success seashell_success gemfragment_success".split(
                  " "
                )
              )
            ? render_interaction(b)
            : in_arr(b, ["donate_thx", "donate_gum", "donate_low"])
            ? ((a.gold = to_pretty_num(a.gold)),
              "donate_thx" == b
                ? (c = "Thanks kind sir. Thanks for helping the reserve.")
                : "donate_gum" == b
                ? (c =
                    a.gold +
                    "? " +
                    a.gold +
                    "? " +
                    a.gold +
                    "?! Here, take this!")
                : "donate_low" == b &&
                  (c =
                    "They say there's no small contribution.. BUT THEY ARE OBVIOUSLY WRONG. " +
                    a.gold +
                    "??!!! GET LOST"),
              ui_log("Donated " + to_pretty_num(a.gold) + " gold", "gray"),
              render_interaction({ auto: !0, skin: "goblin", message: c }))
            : "lostandfound_info" == b
            ? ((c =
                "Hey there! I'm in charge of taking care of our gold reserve and making sure unlooted chests are 'recycled'! "),
              (e = 3.2),
              5e8 > a.gold
                ? ((c +=
                    "Currently the gold reserves are low, so I'm taking a small something something out of every chest :] "),
                  (e = 4.8))
                : 1e9 > a.gold &&
                  ((c +=
                    "Currently the gold reserves are low, so I'm taking a small something out of every chest :] "),
                  (e = 4)),
              render_interaction({
                auto: !0,
                skin: "goblin",
                message:
                  c +
                  ("Donations are always welcome, merchants get " +
                    e +
                    " XP for every gold they donate!"),
                button: "WHAT HAVE YOU FOUND?",
                onclick: function () {
                  socket.emit("lostandfound");
                },
                button2: "DONATE",
                onclick2: function () {
                  render_donate();
                },
              }))
            : "lostandfound_donate" == b
            ? render_interaction({
                auto: !0,
                skin: "goblin",
                message:
                  "Not feeling like showing my loots to cheapskates! Sorry not sorry..",
              })
            : "bet_xshot" == b
            ? (render_interaction({
                auto: !0,
                skin: "bouncer",
                message: "Get lost critter! You can't gamble substanced here!",
              }),
              0.5 > Math.random()
                ? d_text("MOVE B****", get_npc("bouncer"), { color: "#F7A9C5" })
                : d_text("GET OUT THE WAY", get_npc("bouncer"), {
                    color: "#F7A9C5",
                  }))
            : "cant_escape" == b
            ? (d_text("CAN'T ESCAPE", character), (transporting = !1))
            : "cant_enter" == b
            ? (ui_log("Can't enter", "gray"), (transporting = !1))
            : "bank_opi" == b
            ? (ui_log("Bank connection in progress", "gray"),
              (transporting = !1))
            : "bank_opx" == b
            ? (a.name
                ? ui_log(a.name + " is in the bank", "gray")
                : "locked" == a.reason
                ? ui_log("The door is locked", "gray")
                : ui_log("Bank is busy right now", "gray"),
              (transporting = !1))
            : "only_in_bank" == b
            ? ui_log("Only works inside the bank", "gray")
            : "already_unlocked" == b
            ? ui_log("Already unlocked", "gray")
            : "door_unlocked" == b
            ? (v_shake(), ui_log("Door unlocked!", "#9D9CFF"))
            : "transport_failed" == b
            ? (transporting = !1)
            : "loot_failed" == b
            ? (close_chests(), ui_log("Can't loot", "gray"))
            : "loot_no_space" == b
            ? (close_chests(), d_text("NO SPACE", character))
            : "transport_cant_reach" == b
            ? (ui_log("Can't reach", "gray"), (transporting = !1))
            : "transport_cant_dampened" == b
            ? (ui_log("Can't transport inside a dampening field", "#A772D0"),
              (transporting = !1),
              v_shake_i2(character))
            : "transport_cant_protection" == b
            ? (ui_log("The door is protected!", "#A7282E"), (transporting = !1))
            : "transport_cant_locked" == b
            ? (ui_log("The door is locked!", "#A7282E"), (transporting = !1))
            : "not_in_this_server" == b
            ? ui_log("Not possible in this server", "#7D5B93")
            : "destroyed" == b
            ? ui_log("Destroyed " + G.items[a.name].name, "gray")
            : "get_closer" == b ||
              "buy_get_closer" == b ||
              "sell_get_closer" == b ||
              "trade_get_closer" == b ||
              "ecu_get_closer" == b
            ? (a.place && reject_deferred(a.place, { reason: "distance" }),
              ui_log("Get closer", "gray"))
            : "trade_bspace" == b
            ? ui_log("No space on buyer", "gray")
            : "bank_restrictions" == b
            ? (a.place && reject_deferred(a.place, { reason: "bank" }),
              ui_log("You can't buy, trade or upgrade in the bank.", "gray"))
            : "tavern_too_late" == b
            ? ui_log("Too late to bet!", "gray")
            : "tavern_not_yet" == b
            ? ui_log("Not taking bets yet!", "gray")
            : "tavern_too_many_bets" == b
            ? ui_log("You have too many active bets", "gray")
            : "tavern_dice_exist" == b
            ? ui_log("You already have a bet", "gray")
            : "tavern_gold_not_enough" == b
            ? ui_log("Gold reserve insufficient to cover this bet", "gray")
            : "condition" == b
            ? ((c = G.conditions[a.name]),
              (e = a.from),
              c.bad
                ? ui_log("Afflicted by " + c.name, "gray")
                : e
                ? ui_log(e + " buffed you with " + c.name, "gray")
                : ui_log("Buffed with " + c.name, "gray"))
            : "cx_sent" == b
            ? (ui_log("Cosmetics sent: " + a.cx, "#DB7AA9"),
              (character.acx = a.acx))
            : "cx_received" == b
            ? (ui_log("Cosmetics received: " + a.cx, "#A888DD"),
              (character.acx = a.acx))
            : "cx_new" == b
            ? ($("#topleftcornerdialog").length
                ? ((c =
                    "<div style='padding: 16px; border: 5px solid gray; background: black; text-align: center; min-width: 60px'>" +
                    ("<div style='margin-bottom: 8px; margin-top: 4px'>" +
                      cx_sprite(a.name) +
                      "</div>")),
                  (c +=
                    "<div class='gamebutton' onclick='$(this).parent().remove()'>OK</div></div>"),
                  $("#topleftcornerdialog").html(c))
                : ui_log("Cosmetics: " + a.name, "#DB7AA9"),
              (character.acx = a.acx))
            : "cx_not_found" == b
            ? ui_log("Cosmetics not found", "gray")
            : "ex_condition" == b
            ? (c = G.conditions[a.name])
            : "buy_success" == b
            ? ((c = { cost: a.cost, num: a.num, name: a.name, q: a.q || 1 }),
              ui_log("Spent " + to_pretty_num(a.cost) + " gold", "gray"),
              call_code_function("trigger_character_event", "buy", c),
              resolve_deferred("buy", c))
            : "buy_cant_npc" == b
            ? (ui_log("Can't buy this from an NPC", "gray"),
              reject_deferred("buy", { reason: "not_buyable" }))
            : "buy_cant_space" == b
            ? (d_text("SPACE", character),
              ui_log("No space", "gray"),
              reject_deferred("buy", { reason: "space" }))
            : "buy_cost" == b
            ? (d_text("INSUFFICIENT", character),
              ui_log("Not enough gold", "gray"),
              reject_deferred("buy", { reason: "cost" }))
            : "cant_reach" == b
            ? ui_log("Can't reach", "gray")
            : "no_item" == b
            ? ui_log("No item provided", "gray")
            : "op_unavailable" == b
            ? add_chat("", "Operation unavailable", "gray")
            : "send_no_space" == b
            ? add_chat("", "No space on receiver", "gray")
            : "send_no_item" == b
            ? add_chat("", "Nothing to send", "gray")
            : "send_no_cx" == b
            ? add_chat("", "Don't have or not enough", "gray")
            : "send_diff_owner" == b
            ? add_chat("", "This is not one of ours!", "gray")
            : "signed_up" == b
            ? ui_log("Signed Up!", "#39BB54")
            : "item_placeholder" == b
            ? ui_log("Slot is occupied", "gray")
            : "item_locked" == b
            ? (a.place && reject_deferred(a.place, "locked"),
              ui_log("Item is locked", "gray"))
            : "item_blocked" == b
            ? (a.place && reject_deferred(a.place, "blocked"),
              ui_log("Item is in use", "gray"))
            : "item_received" == b || "item_sent" == b
            ? ((c = ""),
              1 < a.q && (c = "(x" + a.q + ")"),
              "item_received" == b
                ? (add_chat(
                    "",
                    "Received " + G.items[a.item].name + c + " from " + a.name,
                    "#6AB3FF"
                  ),
                  call_code_function(
                    "trigger_character_event",
                    "item_received",
                    { name: a.item, q: a.q, num: a.num, from: a.name }
                  ))
                : (add_chat(
                    "",
                    "Sent " + G.items[a.item].name + c + " to " + a.name,
                    "#6AB3FF"
                  ),
                  call_code_function("trigger_character_event", "item_sent", {
                    name: a.item,
                    q: a.q,
                    num: a.num,
                    to: a.name,
                  })))
            : "add_item" == b
            ? ((c = ""),
              (e = "a "),
              1 < a.item.q && ((c = "(x" + a.item.q + ")"), (e = "")),
              add_log(
                "Received " + e + G.items[a.item.name].name + c,
                "#3B9358"
              ))
            : "log_gold_not_enough" == b
            ? ui_log("Not enough gold", "gray")
            : "gold_not_enough" == b
            ? add_chat("", "Not enough gold", colors.gold)
            : "gold_sent" == b
            ? (add_chat(
                "",
                "Sent " + to_pretty_num(a.gold) + " gold to " + a.name,
                colors.gold
              ),
              call_code_function("trigger_character_event", "gold_sent", {
                amount: a.gold,
                to: a.name,
              }))
            : "gold_received" != b || a.name
            ? "gold_received" == b
              ? (add_chat(
                  "",
                  "Received " + to_pretty_num(a.gold) + " gold from " + a.name,
                  colors.gold
                ),
                call_code_function("trigger_character_event", "gold_received", {
                  amount: a.gold,
                  from: a.name,
                }))
              : "friend_already" == b
              ? add_chat("", "You are already friends", "gray")
              : "friend_rleft" == b
              ? add_chat("", "Player left the server", "gray")
              : "friend_rsent" == b
              ? add_chat("", "Friend request sent", "#409BDD")
              : "friend_expired" == b
              ? add_chat("", "Request expired", "#409BDD")
              : "friend_failed" == b
              ? add_chat(
                  "",
                  "Friendship failed, reason: " + a.reason,
                  "#409BDD"
                )
              : "unfriend_failed" == b
              ? add_chat("", "Unfriend failed, reason: " + a.reason, "#409BDD")
              : "gold_use" == b
              ? ui_log("Used " + to_pretty_num(a.gold) + " gold", "gray")
              : "slots_success" == b
              ? ui_log("Machine went crazy", "#9733FF")
              : "slots_fail" == b
              ? ui_log("Machine got stuck", "gray")
              : "craft" == b
              ? ((c = G.craft[a.name]),
                c.cost &&
                  ui_log("Spent " + to_pretty_num(c.cost) + " gold", "gray"),
                ui_log("Received " + G.items[a.name].name, "white"))
              : "dismantle" == b
              ? ((c = G.dismantle[a.name]),
                a.level
                  ? ui_log(
                      "Spent " + to_pretty_num(a.cost || 1e4) + " gold",
                      "gray"
                    )
                  : ui_log("Spent " + to_pretty_num(c.cost) + " gold", "gray"),
                ui_log("Dismantled " + G.items[a.name].name, "#CF5C65"))
              : "defeated_by_a_monster" == b
              ? (ui_log("Defeated by " + G.monsters[a.monster].name, "#571F1B"),
                ui_log("Lost " + to_pretty_num(a.xp) + " experience", "gray"))
              : "dismantle_cant" == b
              ? ui_log("Can't dismantle", "gray")
              : "inv_size" == b
              ? ui_log("Need more empty space", "gray")
              : "craft_cant" == b
              ? ui_log("Can't craft", "gray")
              : "craft_cant_quantity" == b
              ? ui_log("Not enough materials", "gray")
              : "craft_atleast2" == b
              ? ui_log("You need to provide at least 2 items", "gray")
              : "target_lock" == b
              ? ui_log(
                  "Target Acquired: " + G.monsters[a.monster].name,
                  "#F00B22"
                )
              : "charm_failed" == b
              ? ui_log("Couldn't charm ...", "gray")
              : "cooldown" == b
              ? d_text("NOT READY", character)
              : "blink_failed" == b
              ? (no_no_no(),
                d_text("NO", character),
                (last_blink_pressed = inception))
              : "magiport_sent" == b
              ? ui_log("Magiportation request sent to " + a.id, "white")
              : "magiport_gone" == b
              ? (ui_log("Magiporter gone", "gray"), no_no_no(2))
              : "magiport_failed" == b
              ? (ui_log("Magiport failed", "gray"), no_no_no(2))
              : "revive_failed" == b
              ? (ui_log("Revival failed", "gray"), no_no_no(1))
              : "locksmith_cant" == b
              ? ui_log("Can't lock/unlock this item", "gray")
              : "locksmith_aunlocked" == b
              ? ui_log("Already unlocked", "gray")
              : "locksmith_alocked" == b
              ? ui_log("Already locked", "gray")
              : "locksmith_unsealed" == b
              ? (ui_log("Spent 250,000 gold", "gray"),
                ui_log("Unsealed the item", "gray"),
                ui_log("It can be unlocked in 7 days", "gray"))
              : "locksmith_unsealing" == b
              ? ui_log(
                  "It can be unlocked in " + parseInt(a.hours) + " hours",
                  "gray"
                )
              : "locksmith_unlocked" == b
              ? (ui_log("Spent 250,000 gold", "gray"),
                ui_log("Unlocked the item", "gray"))
              : "locksmith_unseal_complete" == b
              ? ui_log("Unlocked the item", "gray")
              : "locksmith_locked" == b
              ? (ui_log("Spent 250,000 gold", "gray"),
                ui_log("Locked the item", "gray"))
              : "locksmith_sealed" == b
              ? (ui_log("Spent 250,000 gold", "gray"),
                ui_log("Sealed the item", "gray"))
              : "monsterhunt_started" == b || "monsterhunt_already" == b
              ? character.s.monsterhunt &&
                (1 == character.s.monsterhunt.c
                  ? $("#merchant-item").html(
                      render_interaction(
                        {
                          auto: !0,
                          skin: "daisy",
                          message:
                            "Alrighty then! Now go defeat " +
                            G.monsters[character.s.monsterhunt.id].name +
                            " and come back here!",
                        },
                        "return_html"
                      )
                    )
                  : $("#merchant-item").html(
                      render_interaction(
                        {
                          auto: !0,
                          skin: "daisy",
                          message:
                            "Alrighty then! Now go defeat " +
                            character.s.monsterhunt.c +
                            " " +
                            G.monsters[character.s.monsterhunt.id].name +
                            "'s and come back here!",
                        },
                        "return_html"
                      )
                    ))
              : "monsterhunt_merchant" == b
              ? $("#merchant-item").html(
                  render_interaction(
                    {
                      auto: !0,
                      skin: "daisy",
                      message:
                        "Huh? A merchant? On the hunt? Hahahahahahahaha ... Go sell cake or something ...",
                    },
                    "return_html"
                  )
                )
              : console.log("Missed game_response: " + b)
            : add_log("Received " + to_pretty_num(a.gold) + " gold", "gray");
      });
    });
    socket.on("gm", function (a) {
      if (a.ids && "jump_list" == a.action) {
        var b = [];
        hide_modal();
        a.ids.forEach(function (a) {
          b.push({
            button: a,
            onclick: function () {
              socket.emit("gm", { action: "jump", id: a });
            },
          });
        });
        get_input({ no_wrap: !0, elements: b });
      } else "server_info" == a.action && show_json(a.info);
    });
    socket.on("secondhands", function (a) {
      secondhands = a;
      secondhands.reverse();
      "secondhands" != topleft_npc && (s_page = 0);
      render_secondhands();
    });
    socket.on("lostandfound", function (a) {
      lostandfound = a;
      lostandfound.reverse();
      "lostandfound" != topleft_npc && (l_page = 0);
      render_secondhands("lostandfound");
    });
    socket.on("game_chat_log", function (a) {
      draw_trigger(function () {
        is_string(a) ? add_chat("", a) : add_chat("", a.message, a.color);
      });
    });
    socket.on("chat_log", function (a) {
      draw_trigger(function () {
        var b = get_entity(a.id);
        "mainframe" == a.id
          ? (d_text(
              a.message,
              { real_x: 0, real_y: -100, height: 24 },
              { size: SZ.chat, color: "#C7EFFF" }
            ),
            sfx("chat", 0, -100))
          : b
          ? (d_text(a.message, b, { size: SZ.chat }),
            sfx("chat", b.real_x, b.real_y))
          : sfx("chat");
        add_chat(
          a.owner,
          a.message,
          a.color,
          (is_number(a.id) && a.id) || void 0
        );
        call_code_function("trigger_event", "chat", {
          from: a.owner,
          message: a.message,
        });
      });
    });
    socket.on("ui", function (a) {
      draw_trigger(function () {
        if (in_arr(a.type, ["+$", "-$"])) {
          var b = get_npc(a.id),
            d = get_player(a.name);
          "merchant" == topleft_npc &&
            merchant_id &&
            (b = get_npc(merchant_id) || b);
          "-$" == a.type
            ? (b && d_text(a.type, b, { color: colors.white_negative }),
              d && d_text("+$", d, { color: colors.white_positive }),
              call_code_function("trigger_event", "sell", {
                item: a.item,
                name: a.name,
                npc: a.id,
                num: a.num,
              }))
            : (b && d_text(a.type, b, { color: colors.white_positive }),
              d && d_text("-$", d, { color: colors.white_negative }),
              call_code_function("trigger_event", "buy", {
                item: a.item,
                name: a.name,
                npc: a.id,
                num: a.num,
              }));
        } else if ("+$p" == a.type)
          (b = get_npc("secondhands")),
            (d = get_player(a.name)),
            b && d_text("+$", b, { color: "#7E65D3" }),
            d && d_text("-$", d, { color: "#7E65D3" }),
            call_code_function("trigger_event", "sbuy", {
              item: a.item,
              name: a.name,
            });
        else if ("+$f" == a.type)
          (b = get_npc("lostandfound")),
            (d = get_player(a.name)),
            b && d_text("+$", b, { color: "#7E65D3" }),
            d && d_text("-$", d, { color: "#7E65D3" }),
            call_code_function("trigger_event", "fbuy", {
              item: a.item,
              name: a.name,
            });
        else if ("+$$" == a.type)
          (b = get_player(a.seller)),
            (d = get_player(a.buyer)),
            b && d_text(a.type, b, { color: colors.white_positive }),
            d && d_text("-$$", d, { color: colors.white_negative }),
            call_code_function("trigger_event", "trade", {
              seller: a.seller,
              buyer: a.buyer,
              item: a.item,
              num: a.num,
              slot: a.slot,
            });
        else if ("gold_sent" == a.type)
          (b = get_player(a.sender)),
            (d = get_player(a.receiver)),
            b && d && d_line(b, d, { color: "gold" }),
            call_code_function("trigger_event", "gold_sent", {
              sender: a.sender,
              receiver: a.receiver,
              gold: a.gold,
            });
        else if ("item_sent" == a.type)
          (b = get_player(a.sender)),
            (d = get_player(a.receiver)),
            b && d && d_line(b, d, { color: "item" }),
            call_code_function("trigger_event", "item_sent", {
              sender: a.sender,
              receiver: a.receiver,
              item: a.item,
              num: a.num,
              fnum: a.fnum,
            });
        else if ("cx_sent" == a.type)
          (b = get_player(a.sender)),
            (d = get_player(a.receiver)),
            b && d && d_line(b, d, { color: "cx" }),
            call_code_function("trigger_event", "cx_sent", {
              sender: a.sender,
              receiver: a.receiver,
              cx: a.cx,
            });
        else if ("magiport" == a.type) {
          if ((d = get_player(a.name)))
            d_text("M", d, { size: "huge", color: "#3E97AA" }), jump_up();
        } else if ("mlevel" == a.type)
          (b = get_entity(a.id)) &&
            d_text((-1 == a.mult && "-1") || "+1", b, {
              color: "#9C76D3",
              size: "huge",
            });
        else if ("mheal" == a.type)
          (b = get_entity(a.id)) &&
            d_text(a.heal, b, { color: colors.heal, size: "large" });
        else if ("throw" == a.type)
          (b = get_player(a.from)),
            (d = get_entity(a.to)),
            b && d && d_line(b, d, { color: "#323232" });
        else if ("energize" == a.type)
          (b = get_player(a.from)),
            (d = get_player(a.to)),
            b && d && d_line(b, d, { color: "mana" }),
            d && start_animation(d, "block");
        else if ("mluck" == a.type)
          (b = get_player(a.from)),
            (d = get_player(a.to)),
            b && d && d_line(b, d, { color: "mluck" }),
            d && start_animation(d, "mluck");
        else if ("rspeed" == a.type)
          (b = get_player(a.from)),
            (d = get_player(a.to)),
            b && d && d_line(b, d, { color: "#D4C392" }),
            d && start_animation(d, "rspeed");
        else if ("reflection" == a.type)
          (b = get_player(a.from)),
            (d = get_player(a.to)),
            b && d && d_line(b, d, { color: "#9488BF" });
        else if ("alchemy" == a.type) {
          if ((b = get_player(a.name)))
            map_animation("gold", {
              x: get_x(b),
              y: get_y(b) - 36,
              target: { x: get_x(b), y: get_y(b) - 90, height: 0, fade: !0 },
            }),
              start_animation(b, "gold_anim"),
              v_shake_i(b);
        } else if ("4fingers" == a.type)
          (b = get_player(a.from)),
            (d = get_player(a.to)),
            b && d && d_line(b, d, { color: "#6F62AE" }),
            b && mojo(b);
        else if ("mcourage" == a.type)
          (b = get_player(a.name)) &&
            d_text("OMG!", b, { size: "huge", color: "#B9A08C" });
        else if ("poison_resist" == a.type)
          (d = get_entity(a.id)) && d_text("RESIST!", d, { color: "#68B84B" });
        else if ("huntersmark" == a.type)
          (b = get_player(a.name)),
            (d = get_entity(a.id)),
            b && d && d_line(b, d, { color: "#730E0B" }),
            d && d_text("X", d, { size: "huge", color: "#730E0B" });
        else if ("agitate" == a.type) {
          var e = get_entity(a.name);
          a.ids.forEach(function (a) {
            (a = entities[a]) && start_emblem(a, "rr1", { frames: 20 });
          });
          e && start_emblem(e, "rr1", { frames: 10 });
        } else if ("stomp" == a.type)
          (e = get_entity(a.name)),
            a.ids.forEach(function (a) {
              if ((a = entities[a]))
                start_emblem(a, "br1", { frames: 30 }), v_shake_i(a);
            }),
            e && start_emblem(e, "br1", { frames: 5 }),
            e == character ? v_dive() : e && v_dive_i(e);
        else if ("scare" == a.type)
          (e = get_entity(a.name)),
            a.ids.forEach(function (a) {
              if ((a = entities[a]))
                start_emblem(a, "j1", { frames: 5 }), v_shake_i2(a);
            }),
            e && d_text("BE GONE!", e, { size: "huge", color: "#ff5817" });
        else if ("cleave" == a.type) {
          var f = [];
          e = get_entity(a.name);
          a.ids.forEach(function (a) {
            if ((a = entities[a] || entities["DEAD" + a]))
              f.push({ x: get_x(a), y: get_y(a) }),
                e &&
                  disappearing_clone(e, {
                    x: (get_x(a) + 2 * get_x(e)) / 3,
                    y: (get_y(a) + 2 * get_y(e)) / 3,
                    random: !0,
                  });
          });
          e && (f.push({ x: get_x(e), y: get_y(e) }), flurry(e));
          cpoints = convexhull.makeHull(f);
          for (b = 0; b < cpoints.length; b++)
            d_line(cpoints[b], cpoints[(b + 1) % cpoints.length], {
              color: "warrior",
            });
        } else if ("shadowstrike" == a.type)
          (f = []),
            (e = get_entity(a.name)),
            a.ids.forEach(function (a) {
              (a = entities[a] || entities["DEAD" + a]) &&
                e &&
                (disappearing_clone(e, {
                  x: (get_x(a) + 2 * get_x(e)) / 3,
                  y: (get_y(a) + 2 * get_y(e)) / 3,
                  random: !0,
                  rcolor: !0,
                }),
                disappearing_clone(e, {
                  x: get_x(a),
                  y: get_y(a),
                  random: !0,
                  rcolor: !0,
                }));
            });
        else if ("track" == a.type)
          (e = get_entity(a.name)) && start_emblem(e, "o1", { frames: 5 });
        else if ("slots" == a.type)
          map_machines.slots && (map_machines.slots.spinning = future_s(3));
        else if ("level_up" == a.type) {
          if ((d = get_entity(a.name)))
            small_success(d),
              d_text("LEVEL UP!", d, { size: "huge", color: "#724A8F" }),
              call_code_function("trigger_event", "level_up", {
                name: d.name,
                level: d.level,
              }),
              d.me &&
                (call_code_function("trigger_character_event", "level_up", {
                  level: d.level,
                }),
                sfx("level_up"));
        } else
          "dampened" == a.type &&
            (d = get_entity(a.name)) &&
            (v_shake_i2(d),
            d.me &&
              (add_log("Disrupted by a dampening field", "#A772D0"),
              delete character.fading_out,
              delete character.s.magiport,
              delete character.s.blink,
              stop_filter(character, "bloom"),
              (character.real_alpha = 1),
              restore_dimensions(character)));
      });
    });
    socket.on("tavern", function (a) {
      if ("bet" == a.event) {
        var b = get_entity(a.name);
        b && d_text("+B", b, { color: "#6E9BBE" });
        b && b.me && ((dice_bet.active = !0), on_dice_change());
      }
      "info" == a.event && render_tavern_info(a);
      if ("won" == a.event) {
        if ((b = get_entity(a.name)))
          d_text("+B", b, { color: "green" }),
            1e8 <= a.net
              ? confetti_shower(b, 2)
              : 1e7 <= a.net && confetti_shower(b, 1);
        b &&
          b.me &&
          ((dice_bet.active = !1),
          on_dice_change(),
          $(".diceb").css("border-color", "green"));
      }
      if ("lost" == a.event) {
        if ((b = get_entity(a.name)))
          d_text("-B", b, { color: "red" }),
            1e7 <= a.gold && assassin_smoke(b.real_x, b.real_y);
        b &&
          b.me &&
          ((dice_bet.active = !1),
          on_dice_change(),
          $(".diceb").css("border-color", "red"));
      }
    });
    socket.on("dice", function (a) {
      console.log(JSON.stringify(a));
      "roll" == a.state &&
        ((map_machines.dice.shuffling = !0),
        (map_machines.dice.num = void 0),
        delete map_machines.dice.lock_start,
        (map_machines.dice.locked = 0));
      "lock" == a.state &&
        ((map_machines.dice.num = a.num),
        (map_machines.dice.lock_start = new Date()));
      "bets" == a.state &&
        ((map_machines.dice.shuffling = !1),
        (map_machines.dice.seconds = 0),
        (map_machines.dice.count_start = new Date()),
        (dice_bet.active = !1),
        on_dice_change());
    });
    socket.on("upgrade", function (a) {
      draw_trigger(function () {
        "upgrade" == a.type
          ? assassin_smoke(
              G.maps.main.ref.u_mid[0],
              G.maps.main.ref.u_mid[1],
              "explode_up"
            )
          : "compound" == a.type
          ? assassin_smoke(
              G.maps.main.ref.c_mid[0],
              G.maps.main.ref.c_mid[1],
              "explode_up"
            )
          : "poof" == a.type &&
            assassin_smoke(
              G.maps.spookytown.ref.poof.x,
              G.maps.spookytown.ref.poof.y,
              "explode_up"
            );
        map_npcs.forEach(function (b) {
          "exchange" == a.type &&
            b.role == a.type &&
            start_animation(b, "exchange");
          "newupgrade" != b.role ||
            ("upgrade" != a.type && "compound" != a.type) ||
            (a.success
              ? start_animation(b, "success")
              : start_animation(b, "failure"));
          "funtokens" == b.role &&
            "funtokens" == a.type &&
            start_animation(b, "exchange");
          "pvptokens" == b.role &&
            "pvptokens" == a.type &&
            start_animation(b, "exchange");
          "monstertokens" == b.role &&
            "monstertokens" == a.type &&
            start_animation(b, "exchange");
        });
      });
    });
    socket.on("map_info", function (a) {
      I = a;
      render_map();
    });
    socket.on("server_info", function (a) {
      S = a;
      render_server();
    });
    socket.on("hardcore_info", function (a) {
      S = a.E;
      a.achiever &&
        add_chat(
          "mainframe",
          a.achiever + " ranked on the rewards list!",
          "#60B879"
        );
      render_server();
    });
    socket.on("server_message", function (a) {
      draw_trigger(function () {
        add_chat("", a.message, a.color || "orange");
        a.log && character && add_log(a.message, a.color || "orange");
        a.type &&
          a.item &&
          call_code_function("trigger_event", a.type, {
            item: a.item,
            name: a.name,
          });
      });
    });
    socket.on("notice", function (a) {
      add_chat("SERVER", a.message, a.color || "orange");
    });
    socket.on("reloaded", function (a) {
      add_chat(
        "SERVER",
        "Executed a live reload. (Optional) Refresh the game.",
        "orange"
      );
      a.change && add_chat("CHANGES", a.change, "#59CAFF");
      reload_data();
    });
    socket.on("chest_opened", function (a) {
      call_code_function("trigger_character_event", "loot", a);
      draw_trigger(function () {
        if (chests[a.id]) {
          var b = chests[a.id],
            d = b.x,
            e = b.y;
          is_hidden()
            ? (destroy_sprite(b), delete chests[a.id])
            : (b.openning ||
                ((b.openning = new Date()), set_texture(b, ++b.frame)),
              (b.to_delete = !0),
              (b.alpha = 0.8));
          sfx("coins", d, e);
        }
        try {
          var f = get_active_characters(),
            g;
          for (g in f)
            ("code" != f[g] && "active" != f[g]) ||
              character_window_eval(g, "delete chests['" + a.id + "'];");
        } catch (h) {
          console.log(h);
        }
      });
    });
    socket.on("cm", function (a) {
      try {
        call_code_function("trigger_character_event", "cm", {
          name: a.name,
          message: JSON.parse(a.message),
        });
      } catch (c) {
        console.log(c);
      }
    });
    socket.on("pm", function (a) {
      draw_trigger(function () {
        var b = get_entity(a.id);
        b
          ? (d_text(a.message, b, { size: SZ.chat, color: "#BA6B88" }),
            sfx("chat", b.real_x, b.real_y))
          : sfx("chat");
        b = "pm" + (a.to || a.owner);
        add_pmchat(a.to || a.owner, a.owner, a.message);
        in_arr(b, docked) && add_chat(a.owner, a.message, "#CD7879");
        call_code_function("trigger_character_event", "pm", {
          from: a.owner,
          message: a.message,
        });
      });
    });
    socket.on("partym", function (a) {
      draw_trigger(function () {
        var b = get_entity(a.id);
        b
          ? (d_text(a.message, b, { size: SZ.chat, color: "#5B8DB0" }),
            sfx("chat", b.real_x, b.real_y))
          : sfx("chat");
        add_partychat(a.owner, a.message);
        in_arr("party", docked) && add_chat(a.owner, a.message, "#46A0C6");
        call_code_function("trigger_character_event", "partym", {
          from: a.owner,
          message: a.message,
        });
      });
    });
    socket.on("drop", function (a) {
      draw_trigger(function () {
        chest = add_chest(a);
      });
    });
    socket.on("reopen", function (a) {
      reopen();
    });
    socket.on("code_eval", function (a) {
      no_eval ||
        ((a = a.code || a || ""),
        -1 != a.search("output=") || -1 != a.search("json_output=")
          ? code_eval_s(a)
          : code_eval(a));
    });
    socket.on("simple_eval", function (a) {
      no_eval || eval(a.code || a || "");
    });
    socket.on("eval", function (a) {
      no_eval || smart_eval(a.code || a || "", a.args);
    });
    socket.on("player", function (a) {
      var b = a.hitchhikers;
      delete a.hitchhikers;
      character && (adopt_soft_properties(character, a), rip_logic());
      b &&
        b.forEach(function (a) {
          original_onevent.apply(socket, [{ type: 2, nsp: "/", data: a }]);
        });
      a.reopen &&
        draw_trigger(function () {
          reopen();
        });
    });
    socket.on("q_data", function (a) {
      character.q = a.q;
      character.items[a.num].p = a.p;
    });
    socket.on("end", function (a) {});
    socket.on("disconnect", function () {
      socket.destroy();
      window.socket = null;
      disconnect();
    });
    socket.on("disconnect_reason", function (a) {
      window.disconnect_reason = a;
    });
    socket.on("limitdcreport", function (a) {
      window.rc_delay = 16;
      a.mcalls["!"] =
        "You've made " +
        a.climit +
        " callcosts in 4 seconds. That's tooooo much. This is most probably because you are calling a function like 'move' consecutively. Some calls are also more expensive than others. If you are experiencing issues please email hello@adventure.land or ask for help in Discord/#code_beginner. Ps. You made " +
        to_pretty_num(a.total) +
        " calls in total.";
      show_json(a.mcalls);
    });
    socket.on("action", function (a) {
      var b = get_entity(a.attacker),
        d = get_entity(a.target);
      if (b) {
        d ||
          (d = {
            x: a.x,
            y: a.y,
            map: b.map,
            in: b["in"],
            height: 0,
            width: 0,
            m: a.m,
          });
        direction_logic(b, d, "attack");
        attack_animation_logic(b, a.source);
        animate_weapon(b, d);
        var e = { actor: a.attacker },
          f;
        for (f in a) in_arr(f, ["attacker"]) || (e[f] = a[f]);
        a.heal ? (e.heal = a.heal) : a.damage && (e.damage = a.damage);
        b && b.me && ("heal" == a.source || "attack" == a.source)
          ? resolve_deferred("heal", e)
          : b && b.me && "attack" == a.source && resolve_deferred("attack", e);
        call_code_function("trigger_event", "action", e);
        d.me && call_code_function("trigger_character_event", "incoming", e);
        new_attacks
          ? (a.projectile &&
              map_animation(G.projectiles[a.projectile].animation, {
                x: get_x(b),
                y: get_y(b) - 15,
                target: d,
                m: a.m,
                id: a.pid,
                filter: b && b.wglow_filter,
              }),
            a.ray &&
              continuous_map_animation(G.projectiles[a.ray].animation, b, d))
          : void 0 !== a.heal
          ? d_line(b, d, { color: "heal" })
          : a.reflect
          ? d_line(b, d, { color: "reflect" })
          : b && "konami" == b.skin
          ? d_line(b, d, {
              color: random_one(["#63388F", "#D1B416", "#CF3327", "#2D82D2"]),
            })
          : "taunt" == a.anim
          ? d_line(b, d, { color: "taunt" })
          : "poisonarrow" == a.anim
          ? d_line(b, d, { color: colors.poison, size: 2 })
          : "mentalburst" == a.anim
          ? d_line(b, d, { color: colors.mp, size: 2 })
          : "burst" == a.anim
          ? d_line(b, d, { color: "burst" })
          : "supershot" == a.anim
          ? d_line(b, d, { color: "supershot" })
          : "curse" == a.anim
          ? d_line(b, d, { color: "curse" })
          : b.me && !a.no_lines
          ? sd_lines && d_line(b, d, { color: "my_hit" })
          : b && !a.no_lines && d_line(b, d);
      }
    });
    socket.on("hit", function (a) {
      var b = get_entity(a.id),
        d = get_entity(a.hid);
      map_animations[a.pid] && (map_animations[a.pid].to_delete = !0);
      var e = clone(a);
      delete e.id;
      delete e.hid;
      delete e.anim;
      e.actor = a.hid;
      e.target = a.id;
      a.stacked &&
        b &&
        b.me &&
        call_code_function("trigger_character_event", "stacked", {
          method: "attack",
          ids: a.stacked,
        });
      a.mobbing &&
        b &&
        b.me &&
        call_code_function("trigger_character_event", "mobbing", {
          intensity: a.mobbing,
        });
      void 0 !== a.heal && ((e.heal = abs(a.heal)), delete e.damage);
      d &&
        d.me &&
        call_code_function("trigger_character_event", "target_hit", e);
      b && b.me && call_code_function("trigger_character_event", "hit", e);
      call_code_function("trigger_event", "hit", e);
      draw_trigger(function () {
        var c = !1;
        b && a.evade && sfx("whoosh", b.real_x, b.real_y);
        b && a.reflect && sfx("reflect", b.real_x, b.real_y);
        a.reflect &&
          ((c = !0),
          d_text("REFLECT!", b, {
            color: "reflect",
            from: a.hid,
            size: "huge",
          }));
        a.evade &&
          ((c = !0),
          d_text("EVADE", b, { color: "evade", size: "huge", from: a.hid }));
        a.miss &&
          ((c = !0),
          d_text("OOPS", b, { color: "evade", size: "huge", from: a.hid }));
        if (a.avoid) {
          var e = { x: a.x, y: a.y, map: a.map, in: a["in"], height: 14 };
          b == character && (e = character);
          c = !0;
          d_text("AVOID", e, { color: "evade", size: "huge", from: a.hid });
        }
        b &&
          a.goldsteal &&
          (0 < a.goldsteal
            ? (d_text("-" + a.goldsteal, b, {
                color: "gold",
                from: a.hid,
                y: -8,
              }),
              b == character &&
                add_log(
                  "You lost " + to_pretty_num(a.goldsteal) + " gold",
                  "#5D5246"
                ))
            : (d_text("+" + -a.goldsteal, b, {
                color: "gold",
                from: a.hid,
                y: -8,
              }),
              b == character &&
                add_log(
                  "Received " + to_pretty_num(-a.goldsteal) + " gold, huh",
                  "#25B77D"
                )));
        b &&
          a.anim &&
          !c &&
          ((e =
            (G.projectiles[a.projectile || a.ray] &&
              G.projectiles[a.projectile || a.ray].hit_animation) ||
            a.anim),
          G.animations[e] && start_animation(b, e),
          sfx("monster_hit", b.real_x, b.real_y));
        b &&
          d &&
          void 0 !== a.damage &&
          !c &&
          (a.dreturn && d_text("-" + a.dreturn, d, { color: "red" }),
          "curse" == a.anim ||
            (0 === a.damage && a.reflect) ||
            d_text("-" + a.damage, b, { color: "red" }));
        b &&
          void 0 !== a.heal &&
          !c &&
          ((c = 0),
          "partyheal" == a.source &&
            (start_animation(b, "party_heal"), (c = 16)),
          d_text("+" + a.heal, b, { color: colors.heal, y: c }));
      });
    });
    socket.on("disappearing_text", function (a) {
      draw_trigger(function () {
        a.args || (a.args = {});
        a.args.sz && (a.args.size = a.args.sz);
        a.args.c && (a.args.color = a.args.c);
        var b = a.id && get_entity(a.id);
        b ? d_text(a.message, b, a.args) : d_text(a.message, a.x, a.y, a.args);
      });
    });
    socket.on("death", function (a) {
      a.place && reject_deferred(a.place, { reason: "not_found" });
      call_code_function("trigger_event", "death", a);
      a.death = !0;
      on_disappear(a);
    });
    socket.on("disappear", function (a) {
      a.place && reject_deferred(a.place, { reason: "not_found" });
      on_disappear(a);
    });
    socket.on("notthere", function (a) {
      a.place && reject_deferred(a.place, { reason: "not_found" });
      on_disappear(a);
    });
    socket.on("entities", function (a) {
      if (a["in"] != current_in)
        return console.log("Disregarded stale 'entities' response");
      "all" == a.type && (future_entities = { players: {}, monsters: {} });
      handle_entities(a);
    });
    socket.on("poke", function (a) {
      draw_trigger(function () {
        var b = get_entity(a.name);
        b &&
          (b == character && add_log(a.who + " poked you", "gray"),
          2 <= a.level && add_chat("", a.who + " poked " + a.name, "gray"),
          bump_up(b, 2 * a.level));
      });
    });
    socket.on("test", function (a) {
      console.log(a.date);
    });
    socket.on("invite", function (a) {
      draw_trigger(function () {
        add_invite(a.name);
      });
      setTimeout(function () {
        call_code_function("on_party_invite", a.name);
      }, 200);
    });
    socket.on("magiport", function (a) {
      draw_trigger(function () {
        add_magiport(a.name);
      });
      setTimeout(function () {
        call_code_function("on_magiport", a.name);
      }, 200);
    });
    socket.on("request", function (a) {
      draw_trigger(function () {
        add_request(a.name);
      });
      setTimeout(function () {
        call_code_function("on_party_request", a.name);
      }, 200);
    });
    socket.on("frequest", function (a) {
      draw_trigger(function () {
        add_frequest(a.name);
      });
      setTimeout(function () {
        call_code_function("on_friend_request", a.name);
      }, 200);
    });
    socket.on("friend", function (a) {
      draw_trigger(function () {
        "new" == a.event &&
          (add_chat("", "You are now friends with " + a.name, "#409BDD"),
          (friends = a.friends));
        "lost" == a.event &&
          (add_chat("", "Lost a friend: " + a.name, "#DB5E59"),
          (friends = a.friends));
        "request" == a.event && add_frequest(a.name);
        "update" == a.event && (friends = a.friends);
      });
    });
    socket.on("party_update", function (a) {
      draw_trigger(function () {
        a.message &&
          (a.leave
            ? add_log(a.message, "#875045")
            : add_log(a.message, "#703987"));
        0 == party_list.length &&
          (a.list || []).length &&
          !in_arr("party", cwindows) &&
          open_chat_window("party");
        party_list = a.list || [];
        party = a.party || {};
        render_party();
      });
    });
    socket.on("blocker", function (a) {
      "pvp" == a.type &&
        (a.allow
          ? (add_chat("Ace", "Be careful in there!", "#62C358"),
            draw_trigger(function () {
              var a = get_npc("pvpblocker");
              a &&
                (map_npcs.splice(map_npcs.indexOf(get_npc("pvpblocker")), 1),
                draw_timeout(fade_away(1, a), 30, 1));
            }))
          : add_chat(
              "Ace",
              "I will leave when there are 6 adventurers around.",
              "#C36348"
            ));
    });
    socket.on("tracker", function (a) {
      tracker = a;
      render_tracker();
    });
    socket.on("trade_history", function (a) {
      var b = "";
      a.forEach(function (a) {
        var c = G.items[a[2].name].name,
          d = "";
        a[2].level && (c += " +" + a[2].level);
        a[2].q && (d += "" + a[2].q + "x ");
        b =
          "buy" == a[0]
            ? b +
              ("<div>- Bought " +
                d +
                "'" +
                c +
                "' from " +
                a[1] +
                " for " +
                to_pretty_num(a[3]) +
                " gold</div>")
            : "giveaway" == a[0]
            ? b +
              ("<div>- Gave away " + d + "'" + c + "' to " + a[1] + "</div>")
            : b +
              ("<div>- Sold " +
                d +
                "'" +
                c +
                "' to " +
                a[1] +
                " for " +
                to_pretty_num(a[3]) +
                " gold</div>");
      });
      a.length ? show_modal(b) : add_log("No trade recorded yet.", "gray");
    });
    socket.on("track", function (a) {
      if (!a.length) return add_log("No echoes", "gray");
      if (1 == a.length)
        add_log("One echo", "gray"),
          add_log(parseInt(a[0].dist) + " clicks away", "gray");
      else {
        var b = "";
        add_log(a.length + " echoes", "gray");
        a.forEach(function (a) {
          b = b ? b + "," + parseInt(a.dist) : parseInt(a.dist);
        });
        add_log(b + " clicks", "gray");
      }
    });
  } else
    add_log("Welcome"),
      add_log("No live server found", "red"),
      add_log("Please check again in 2-3 minutes"),
      add_log("Spend this time in our Discord chat room", colors.code_blue),
      add_update_notes();
}
function npc_right_click(a) {
  var b = G.npcs[this.npc_id];
  sfx("npc", this.x, this.y);
  "character" == this.type && (b = G.npcs[this.npc]);
  last_npc_right_click = new Date();
  $("#topleftcornerdialog").html("");
  next_side_interaction = b.side_interaction;
  b.color || "main" != current_map || (b.color = colors.npc_white);
  if ("shrine" != this.role && "compound" != this.role) {
    var c = b.says || "Yes";
    is_array(c) && (c = c[seed1() % c.length]);
    "rbin" == c && (c = random_binary());
    d_text(c, this, { color: b.color });
  }
  "secondhands" == this.role && socket.emit("secondhands");
  "lostandfound" == this.role && socket.emit("lostandfound", "info");
  "blocker" == this.role && socket.emit("blocker", { type: "pvp" });
  "merchant" == this.role &&
    (render_merchant(this), inventory || render_inventory());
  "premium" == this.role &&
    (render_merchant(this, 1), inventory || render_inventory());
  "gold" == this.role && (render_gold_npc(), inventory || render_inventory());
  "items" == this.role && render_items_npc(this.pack);
  "exchange" == this.role && render_exchange_shrine(1);
  "mcollector" == this.role &&
    (render_recipes("mcollector"),
    $("#recipe-item").html(
      render_interaction(
        {
          auto: !0,
          skin: "proft",
          message:
            "Always looking for new materials for a grand project of mine. Bring the materials you find to me, I will exchange them for items that are more useful to you.",
        },
        "return_html"
      )
    ));
  "shrine" == this.role && render_upgrade_shrine(1);
  "newupgrade" == this.role && render_interaction("newupgrade");
  "locksmith" == this.role &&
    render_interaction({ auto: !0, dialog: "locksmith", skin: "asoldier" });
  "compound" == this.role && render_compound_shrine(1);
  "transport" == this.role && render_transports_npc();
  "lottery" == this.role && render_interaction("lottery");
  "jailer" == this.role && render_interaction("jailer");
  "guard" == this.role && render_interaction("guard");
  "seashell" == this.quest && render_interaction("seashells");
  "mistletoe" == this.quest && render_interaction("mistletoe");
  "ornament" == this.quest && render_interaction("ornaments");
  "leather" == this.quest && render_interaction("leathers");
  "lostearring" == this.quest && render_interaction("lostearring");
  "santa" == this.role && render_interaction("santa");
  "tavern" == this.role && render_interaction("tavern");
  "gemfragment" == this.quest && render_interaction("gemfragments");
  "standmerchant" == this.role && render_interaction("standmerchant");
  "craftsman" == this.role && render_interaction("crafting");
  "thesearch" == this.role &&
    "hardcore" == gameplay &&
    render_interaction("hardcoretp");
  "shells" == this.role && render_interaction("buyshells");
  "newyear_tree" == this.role &&
    socket.emit("interaction", { type: "newyear_tree" });
  "pvptokens" == this.role && render_token_exchange("pvptoken");
  "funtokens" == this.role && render_token_exchange("funtoken");
  "cx" == this.role && render_exchange_shrine("cx");
  "petkeeper" == this.role && render_pet_shrine();
  "monstertokens" == this.role &&
    (render_token_exchange("monstertoken"),
    character.s.monsterhunt
      ? character.s.monsterhunt.c
        ? $("#merchant-item").html(
            render_interaction(
              {
                auto: !0,
                skin: "daisy",
                message:
                  "Go now, go! Come back after you completed your hunt ...",
              },
              "return_html"
            )
          )
        : (socket.emit("monsterhunt"),
          $("#merchant-item").html(
            render_interaction(
              {
                auto: !0,
                skin: "daisy",
                message: "Well done, well done! A token for your service!",
              },
              "return_html"
            )
          ))
      : $("#merchant-item").html(
          render_interaction(
            {
              auto: !0,
              skin: "daisy",
              message:
                "Would you like to go on a hunt? However, I have to warn you. It's not for the faint-hearted!" +
                (("hardcore" == gameplay && " [100 TOKENS!]") || ""),
              button: "I CAN HANDLE IT!",
              onclick: function () {
                socket.emit("monsterhunt");
              },
            },
            "return_html"
          )
        ));
  "announcer" == this.role &&
    render_interaction({
      auto: !0,
      skin: "lionsuit",
      message: "Daily Events? Yes. Soon. Hopefully ... Definitely one day.",
    });
  b.interaction &&
    ((b = b.interaction),
    is_array(b) && (b = b[seed0() % b.length]),
    "rbin" == b && (b = random_binaries()),
    render_interaction({ auto: !0, skin: this.skin, message: b }));
  "full" == this.stype && direction_logic(this, character, "npc");
  try {
    a && a.stopPropagation();
  } catch (d) {}
}
function player_click(a) {
  is_npc(this) &&
    "daily_events" == this.role &&
    render_interaction("subscribe", this.party);
  is_npc(this) && "pvp" == this.npc
    ? player_right_click.apply(this, a)
    : this.npc_onclick
    ? npc_right_click.apply(this, a)
    : (topleft_npc && inventory && render_inventory(),
      (topleft_npc = !1),
      (xtarget = this));
  a.stopPropagation();
}
function player_attack(a, b) {
  ctarget = this;
  b || (xtarget = null);
  direction_logic(character, ctarget);
  a && a.stopPropagation();
  if (distance(this, character) > character.range + 5)
    return (
      draw_trigger(function () {
        d_text("TOO FAR", ctarget || character);
      }),
      rejecting_promise({
        reason: "too_far",
        distance: distance(this, character),
      })
    );
  socket.emit("attack", { id: ctarget.id });
  return push_deferred("attack");
}
function player_heal(a, b) {
  this != character && ((ctarget = this), b || (xtarget = null));
  this != character && direction_logic(character, ctarget);
  a && a.stopPropagation();
  if (distance(this, character) > character.range)
    return (
      this != character
        ? draw_trigger(function () {
            d_text("TOO FAR", ctarget || character);
          })
        : draw_trigger(function () {
            d_text("TOO FAR", character);
          }),
      rejecting_promise({
        reason: "too_far",
        distance: distance(this, character),
      })
    );
  socket.emit("heal", { id: this.id });
  return push_deferred("heal");
}
function monster_attack(a, b) {
  ctarget = this;
  b || (xtarget = null);
  direction_logic(character, ctarget);
  a && a.stopPropagation();
  if (distance(this, character) > character.range + 10)
    return (
      draw_trigger(function () {
        d_text("TOO FAR", ctarget || character);
      }),
      rejecting_promise({
        reason: "too_far",
        distance: distance(this, character),
      })
    );
  socket.emit("attack", { id: this.id });
  return push_deferred("attack");
}
function player_right_click(a) {
  if (this.npc && "pvp" == this.npc) {
    var b = this.allow
      ? "Be careful in there!"
      : "I will guard this entrance until there are 6 adventurers around.";
    add_chat("Ace", b);
    d_text(b, this, { size: SZ.chat });
  } else if (!this.npc)
    if (character.slots.mainhand && "cupid" == character.slots.mainhand.name)
      player_heal.call(this);
    else if ("priest" == character.ctype)
      if (!pvp || (character.party && this.party == character.party))
        player_heal.call(this);
      else if (pvp) player_attack.call(this);
      else return;
    else {
      if (!pvp || (character.party && this.party == character.party) || !pvp)
        return;
      player_attack.call(this);
    }
  a && a.stopPropagation();
}
function monster_click(a) {
  ctarget == this && map_click(a);
  ctarget = this;
  xtarget = null;
  last_monster_click = new Date();
  a && a.stopPropagation();
}
function map_click(a) {
  if (socket) {
    var b = 0,
      c = 0;
    if (a && a.data && a.data.global) {
      var d = a.data.global.x;
      a = a.data.global.y;
      b = d - width / 2;
      c = a - height / 2;
      manual_centering &&
        character &&
        ((b = d - character.x), (c = a - character.y));
      b /= scale;
      c /= scale;
      if (
        call_code_function(
          "on_map_click",
          character.real_x + b,
          character.real_y + c
        )
      )
        return;
      if (
        (blink_pressed || 360 > mssince(last_blink_pressed)) &&
        "mage" == character.ctype
      ) {
        socket.emit("skill", {
          name: "blink",
          x: character.real_x + b,
          y: character.real_y + c,
          direction: character.moving && character.direction,
        });
        return;
      }
    } else a.x && ((b = a.x - character.real_x), (c = a.y - character.real_y));
    character &&
      can_walk(character) &&
      ((b = calculate_move(
        character,
        character.real_x + b,
        character.real_y + c
      )),
      (character.from_x = character.real_x),
      (character.from_y = character.real_y),
      (character.going_x = b.x),
      (character.going_y = b.y),
      (character.moving = !0),
      calculate_vxy(character),
      (b = {
        x: character.real_x,
        y: character.real_y,
        going_x: character.going_x,
        going_y: character.going_y,
        m: character.m,
      }),
      next_minteraction &&
        ((b.key = next_minteraction), (next_minteraction = null)),
      socket.emit("move", b));
    if ("dice" != topleft_npc || "tavern" != current_map)
      topleft_npc && inventory && render_inventory(), (topleft_npc = !1);
  }
}
function old_move(a, b) {
  map_click({ x: a, y: b });
}
function map_click_release() {}
function update_sprite(a) {
  if (a && a.stype) {
    for (name in a.animations || {}) update_sprite(a.animations[name]);
    for (name in a.emblems || {}) update_sprite(a.emblems[name]);
    if ("static" != a.stype) {
      if ("character" == a.type || "monster" == a.type || "npc" == a.type)
        hp_bar_logic(a), border_mode && border_logic(a);
      ("character" != a.type && "npc" != a.type) || name_logic(a);
      "character" == a.type &&
        (player_rclick_logic(a), player_effects_logic(a));
      ("character" != a.type && "monster" != a.type) || effects_logic(a);
      is_demo && demo_entity_logic(a);
      if ("full" == a.stype) {
        var b = !1,
          c = 1,
          d = 0,
          e = a.i;
        "monster" == a.type && G.monsters[a.mtype].aa && (b = !0);
        a.npc && !a.moving && !0 === a.allow && (a.direction = 1);
        a.npc && !a.moving && !1 === a.allow && (a.direction = 0);
        !a.orientation || a.moving || a.target || (a.direction = a.orientation);
        (a.moving || b) && null === a.walking
          ? a.last_stop && 320 > msince(a.last_stop)
            ? (a.walking = a.last_walking)
            : (reset_ms_check(a, "walk", 350), (a.walking = 1))
          : a.moving ||
            b ||
            !a.walking ||
            ((a.last_stop = new Date()),
            (a.last_walking = a.walking || a.last_walking || 1),
            (a.walking = null));
        var f = [0, 1, 2, 1],
          g = 350;
        "wabbit" == a.mtype && ((f = [0, 1, 2]), (g = 220));
        a.walking && ms_check(a, "walk", g - (a.speed / 2 || 0)) && a.walking++;
        void 0 !== a.direction && (d = a.direction);
        !b && a.s && a.s.stunned
          ? (c = 1)
          : a.walking
          ? (c = f[a.walking % f.length])
          : a.last_stop &&
            180 > mssince(a.last_stop) &&
            (c = f[a.last_walking % f.length]);
        ("character" != a.type && !a.humanoid) ||
          (0 !== c && 2 !== c) ||
          e == c ||
          sfx("walk", a.real_x, a.real_y);
        void 0 !== a.lock_i && (c = a.lock_i);
        a.stand && !a.standed
          ? ((b = new PIXI.Sprite(textures[a.stand + "_texture"])),
            (b.y = 3),
            b.anchor.set(0.5, 1),
            (b.zy = 100),
            a.addChild(b),
            (a.standed = b),
            (a.speed = 10))
          : a.standed &&
            !a.stand &&
            (destroy_sprite(a.standed), delete a.standed);
        a.rip && !a.rtexture
          ? ((a.cskin = null),
            (a.rtexture = !0),
            (b = "gravestone"),
            !0 !== a.rip && (b = a.rip),
            textures[b] || generate_textures(b, "gravestone"),
            (a.texture = textures[b]),
            restore_dimensions(a))
          : !a.rip &&
            a.rtexture &&
            (delete a.rtexture, set_texture(a, c, d), restore_dimensions(a));
        a.rip || set_texture(a, c, d);
        a.s &&
          a.s.charging &&
          ms_check(a, "clone", 80) &&
          disappearing_clone(a);
      }
      if ("animation" == a.stype && "map" == a.atype) {
        c = get_x(a.target);
        d = get_y(a.target) - get_height(a.target) / 2;
        a.m != a.target.m && ((c = a.going_x), (d = a.going_y));
        var h = mssince(a.last_update);
        a.crotation = Math.atan2(d - a.y, c - a.x) + Math.PI / 2;
        void 0 === a.first_rotation &&
          ((a.first_rotation = a.crotation),
          a.directional && (a.rotation = a.crotation));
        a.directional &&
          50 < point_distance(c, d, a.x, a.y) &&
          (a.rotation = a.crotation);
        a.from_x = a.x;
        a.from_y = a.y;
        a.going_x = c;
        a.going_y = d;
        calculate_vxy(a);
        a.x += (a.vx * h) / 1e3;
        a.y += (a.vy * h) / 1e3;
        mssince(a.last_frame) >= a.framefps &&
          ((a.frame += 1), (a.last_frame = new Date()));
        a.to_fade && (a.alpha -= (0.025 * h) / 16.6);
        a.frame >= a.frames && (a.frame = 0);
        set_texture(a, a.frame);
        a.crotation = Math.atan2(d - a.y, c - a.x) + Math.PI / 2;
        if (
          a.to_delete ||
          16 > point_distance(c, d, a.x, a.y) ||
          abs(a.first_rotation - a.crotation) > Math.PI / 2
        ) {
          destroy_sprite(a, "children");
          delete map_animations[a.id];
          return;
        }
        a.last_update = new Date();
      } else if ("animation" == a.stype && "cmap" == a.atype) {
        h = mssince(a.last_update);
        a.ax = get_x(a.origin);
        a.ay = get_y(a.origin) - get_height(a.origin) / 2;
        a.bx = get_x(a.target);
        a.by = get_y(a.target) - get_height(a.target) / 2;
        a.x = a.ax / 2 + a.bx / 2;
        a.y = a.ay / 2 + a.by / 2;
        a.alpha -= (0.025 * h) / 16.6;
        a.height = point_distance(a.ax, a.ay, a.bx, a.by);
        a.rotation = Math.atan2(a.by - a.ay, a.bx - a.ax) + Math.PI / 2;
        if (0 >= a.alpha) {
          destroy_sprite(a, "children");
          delete map_animations[a.id];
          return;
        }
        a.last_update = new Date();
      } else if ("animation" == a.stype && "wmap" == a.atype) {
        if (
          ((h = mssince(a.last_update)),
          (a.y += 1),
          (a.x += 0.1),
          h >= a.interval &&
            ((a.texture = textures[a.skin][++a.last % textures[a.skin].length]),
            (a.last_update = new Date())),
          a.last >= textures[a.skin].length)
        ) {
          destroy_sprite(a, "children");
          delete map_animations[a.id];
          return;
        }
      } else if ("animation" == a.stype && "xmap" == a.atype)
        (h = mssince(a.last_update)),
          h >= a.interval &&
            ((a.texture = a.textures[++a.last % a.textures.length]),
            (a.last_update = new Date()));
      else if ("animation" == a.stype) {
        c = a.aspeed;
        a.speeding && (a.aspeed -= 0.003);
        ms_check(a, "anim" + a.skin, 16.5 * c) && (a.frame += 1);
        if (a.frame >= a.frames && a.continuous) a.frame = 0;
        else if (a.frame >= a.frames) {
          if ((c = a.parent))
            destroy_sprite(a, "children"), delete c.animations[a.skin];
          return;
        }
        set_texture(a, a.frame);
      }
      if ("emblem" == a.stype) {
        if (!a.frames) {
          if ((c = a.parent))
            destroy_sprite(a, "children"), delete c.emblems[a.skin];
          return;
        }
        ms_check(a, "emblem" + a.skin, 60) && --a.frames;
        a.alpha = a.frame_list[a.frames % a.frame_list.length];
      }
      "emote" == a.stype &&
        ((c = ("slow" == a.aspeed && 17) || ("slower" == a.aspeed && 40) || 10),
        "flow" == a.atype
          ? (ms_check(a, "anim", 16.5 * c) && (a.frame += 1),
            set_texture(a, [0, 1, 2, 1][a.frame % 4]))
          : (ms_check(a, "anim", 16.5 * c) &&
              "once" != a.atype &&
              (a.frame = (a.frame + 1) % 3),
            set_texture(a, a.frame)));
      if (a.mtype && !no_graphics && !paused) {
        if ("dice" == a.mtype)
          if (a.shuffling) {
            b = !1;
            a.locked ||
              (a.line && (remove_sprite(a.line), delete a.line),
              (a.line = draw_line(0, 0, 34, 0, 1, 8446584)),
              (a.line.x = -17),
              (a.line.y = -35.5),
              a.addChild(a.line));
            for (d = a.locked; 4 > d; d++)
              a.updates % (d + 1) ||
                ((c = 3 - d),
                (e = parseInt(10 * Math.random())),
                a.lock_start &&
                  d == a.locked &&
                  mssince(a.lock_start) > 300 * (a.locked + 1) &&
                  (0 == c
                    ? (e = a.num[0])
                    : 1 == c
                    ? (e = a.num[1])
                    : 2 == c
                    ? (e = a.num[3])
                    : 3 == c && (e = a.num[4]),
                  a.locked++,
                  (b = !0),
                  (a.cskin = "2"),
                  (a.texture = textures.dice[a.cskin]),
                  a.line && (remove_sprite(a.line), delete a.line),
                  (a.seconds = 7 * (4 - a.locked)),
                  (a.line = draw_line(
                    0,
                    0,
                    min(34, 1.12 * a.seconds),
                    0,
                    1,
                    8446584
                  )),
                  (a.line.x = -17),
                  (a.line.y = -35.5),
                  a.addChild(a.line),
                  a.seconds ||
                    ((a.count_start = future_s(8)),
                    (a.snum = a.num),
                    (a.shuffling = !1)),
                  (a.cskin = "5"),
                  (a.texture = textures.dice[a.cskin])),
                (a.digits[c].texture = textures.dicesub[e]));
            b && v_shake_i_minor(a);
            if (
              (!a.locked && a.shuffling && !(a.updates % 40)) ||
              ("0" != a.cskin && "1" != a.cskin)
            )
              (a.cskin = "" + ((parseInt(a.cskin) + 1) % 2)),
                (a.texture = textures.dice[a.cskin]);
          } else if (a.num != a.snum)
            for (a.snum = a.num, c = 0; 4 > c; c++)
              (e = 0),
                0 == c
                  ? (e = a.num[0])
                  : 1 == c
                  ? (e = a.num[1])
                  : 2 == c
                  ? (e = a.num[3])
                  : 3 == c && (e = a.num[4]),
                (a.digits[c].texture = textures.dicesub[parseInt(e)]);
          else
            (a.seconds = min(30, max(0, mssince(a.count_start)) / 1e3)),
              a.line && (remove_sprite(a.line), delete a.line),
              (a.line = draw_line(0, 0, 1.14 * a.seconds, 0, 1, 8446584)),
              (a.line.x = -17),
              (a.line.y = -35.5),
              a.addChild(a.line),
              "5" != a.cskin &&
                ((a.cskin = "5"), (a.texture = textures.dice[a.cskin]));
        ("slots" != a.mtype && "wheel" != a.mtype) ||
          !a.spinning ||
          (a.updates % 2 ||
            ((a.cskin = "" + ((parseInt(a.cskin) + 1) % 3)),
            (a.texture = textures[a.mtype][a.cskin])),
          a.spinning < new Date() && (a.spinning = !1));
      }
      "chest" == a.type &&
        a.openning &&
        (30 < mssince(a.openning) && 3 != a.frame
          ? ((a.openning = new Date()),
            set_texture(a, ++a.frame),
            a.to_delete && (a.alpha -= 0.1))
          : 30 < mssince(a.openning) && a.to_delete && 0.5 <= a.alpha
          ? (a.alpha -= 0.1)
          : 0.5 > a.alpha &&
            (destroy_sprite(chests[a.id]), delete chests[a.id]));
      if ("character" == a.type || a.slots || a.cx)
        a.cx || (a.cx = {}), cosmetics_logic(a);
      a.last_ms &&
        a.s &&
        ((h = mssince(a.last_ms)),
        ["s", "c", "q"].forEach(function (b) {
          if (a[b])
            for (var c in a[b])
              a[b][c].ms &&
                ((a[b][c].ms -= h), 0 >= a[b][c].ms && delete a[b][c]);
        }),
        (a.last_ms = new Date()));
      void 0 !== a.real_alpha && alpha_logic(a);
      update_filters(a);
      a.updates += 1;
    }
  }
}
function add_monster(a) {
  var b = G.monsters[a.type],
    c = new_sprite(b.skin || a.type, "full");
  c.type = "monster";
  c.mtype = a.type;
  adopt_soft_properties(c, a);
  c.parentGroup = c.displayGroup = monster_layer;
  c.walking = null;
  c.animations = {};
  c.fx = {};
  c.emblems = {};
  c.move_num = a.move_num;
  c.c = {};
  c.real_alpha = 1;
  c.x = c.real_x = round(a.x);
  c.y = c.real_y = round(a.y);
  c.vx = a.vx || 0;
  c.vy = a.vy || 0;
  b.slots && (c.slots = b.slots);
  c.level = 1;
  c.s.young && (c.real_alpha = 0.4);
  c.last_ms = new Date();
  c.anchor.set(0.5, 1);
  b.hit && (c.hit = b.hit);
  b.size &&
    ((c.height *= b.size),
    (c.width *= b.size),
    (c.mscale = 2),
    (c.hpbar_wdisp = -5));
  b.orientation && (c.orientation = b.orientation);
  c.interactive = !0;
  c.buttonMode = !0;
  set_base(c);
  c.on("mousedown", monster_click)
    .on("touchstart", monster_click)
    .on("rightdown", monster_attack);
  return c;
}
function update_filters(a) {
  if (!no_graphics) {
    if (a.pglow) {
      if (a.updates % 3) return;
      var b = [0.9, 1.2, 1.05];
      50 < a.pzazz
        ? (b = [1.7, 1.9, 1.7])
        : 40 < a.pzazz
        ? (b = [1.5, 1.6, 1.5])
        : 25 < a.pzazz
        ? (b = [1.4, 1.5, 1.42])
        : 13 < a.pzazz
        ? (b = [1.3, 1.4, 1.275])
        : 6 < a.pzazz && (b = [1.2, 1.3, 1.075]);
      var c = a.filter_pglow;
      c.b > b[1] && (c.step = -abs(c.step));
      c.b < b[0] && (c.step = abs(c.step));
      c.b += c.step;
      if (a.stand || a.s.charging) c.b = b[2];
      c.brightness(c.b);
    }
    a.appearing &&
      ((a.real_alpha += 0.05),
      1 <= a.real_alpha || 900 < mssince(a.appearing)) &&
      ((a.appearing = a.tp = !1),
      (a.real_alpha = 1),
      a.s && a.s.invis && (a.real_alpha = 0.5),
      stop_animation(a, "transport"));
    a.disappearing && 0.5 < a.real_alpha && (a.real_alpha -= 0.0025);
  }
}
function start_filter(a, b, c) {
  if (!no_graphics) {
    if ("darkgray" == b) var d = new PIXI.filters.OutlineFilter(3, 6185310);
    else
      "fingered" == b
        ? (d = new PIXI.filters.OutlineFilter(3, 9654194))
        : "stoned" == b
        ? ((d = new PIXI.filters.ColorMatrixFilter()), d.greyscale(0.2))
        : "bloom" == b
        ? (d = new PIXI.filters.BloomFilter(1, 1, 1))
        : "cv" == b
        ? (d = new PIXI.filters.ConvolutionFilter(
            [0.3, 0.02, 0.1, 0.1, 0.1, 0.02, 0.02, 0.2, 0.02],
            30,
            40
          ))
        : "cv2" == b
        ? (d = new PIXI.filters.ConvolutionFilter(
            [0.1, 0.1, 0.1, 0.1, 0, 0.1, 0.1, 0.1, 0.1],
            30,
            40
          ))
        : "rblur" == b
        ? (d = new PIXI.filters.RadialBlurFilter(
            random_one([-0.75, -0.5, 0.5, 0.75]),
            [5, 10],
            11,
            -1
          ))
        : "glow" == b
        ? (d = new PIXI.filters.GlowFilter(8, 4, 0, 5868543))
        : "alphaf" == b
        ? ((d = new PIXI.filters.AlphaFilter()), (d.alpha = c || 1))
        : "rcolor" == b
        ? ((d = new PIXI.filters.ColorMatrixFilter()), d.desaturate())
        : ((d = new PIXI.filters.ColorMatrixFilter()),
          (d.step = 0.01),
          (d.b = 1));
    "curse" == b
      ? a.s && a.s.frozen
        ? d.hue(24)
        : a.s && a.s.poisoned
        ? d.hue(-24)
        : d.hue(20)
      : "xcolor" == b
      ? (d.desaturate(2), d.sepia(0.01))
      : "darken" == b
      ? d.night()
      : "bw" == b && d.desaturate();
    a.filter_list ? a.filter_list.push(d) : (a.filter_list = [d]);
    a.filters = a.filter_list;
    a["filter_" + b] = d;
    a[b] = !0;
  }
}
function stop_filter(a, b) {
  !no_graphics &&
    a["filter_" + b] &&
    (a.filter_list.splice(a.filter_list.indexOf(a["filter_" + b]), 1),
    (a.filters = a.filter_list.length ? a.filter_list : null),
    delete a["filter_" + b],
    delete a[b]);
}
function alpha_logic(a) {
  (a.cx && a.cx.length) || (a.cxc && Object.keys(a.cxc).length)
    ? (1 != a.alpha && (a.alpha = 1),
      a.filter_alphaf
        ? 1 == a.real_alpha
          ? stop_filter(a, "alphaf")
          : a.filter_alphaf.alpha != a.real_alpha &&
            (a.filter_alphaf.alpha = a.real_alpha)
        : 1 != a.real_alpha && start_filter(a, "alphaf", a.real_alpha))
    : a.alpha != a.real_alpha && (a.alpha = a.real_alpha);
}
function player_effects_logic(a) {
  !no_graphics &&
    a.s &&
    (4 <= a.pzazz && !a.filter_pglow
      ? start_filter(a, "pglow")
      : 4 > a.pzazz && a.filter_pglow && stop_filter(a, "pglow"),
    !a.s.invis || (a.fx.invis && 0.5 == a.real_alpha)
      ? !a.s.invis && a.fx.invis && (delete a.fx.invis, (a.real_alpha = 1))
      : ((a.fx.invis = !0), (a.real_alpha = 0.5)),
    a.s.phasedout && !a.fx.phs
      ? ((a.fx.phs = !0), (a.real_alpha = 0.8), start_filter(a, "xcolor"))
      : !a.s.phasedout &&
        a.fx.phs &&
        ((a.real_alpha += 0.02),
        1 <= a.real_alpha && (delete a.fx.phs, stop_filter(a, "xcolor"))),
    a.s.darkblessing && !a.fx.db
      ? ((a.fx.db = !0), start_emblem(a, "dp1", { frames: 1200, no_dip: !1 }))
      : !a.s.darkblessing && a.fx.db && (delete a.fx.db, stop_emblem(a, "dp1")),
    a.s.warcry && !a.fx.wcry
      ? ((a.fx.wcry = !0), start_emblem(a, "r1", { frames: 1200, no_dip: !1 }))
      : !a.s.warcry && a.fx.wcry && (delete a.fx.wcry, stop_emblem(a, "r1")),
    a.s.blink &&
      !a.fading_out &&
      ((a.fading_out = new Date()),
      (a.real_alpha = 1),
      draw_timeout(fade_out_blink(0, a), 0)),
    a.c.revival && !a.fx.revival
      ? ((a.fx.revival = !0), start_animation(a, "revival"))
      : !a.c.revival &&
        a.fx.revival &&
        (delete a.fx.revival,
        stop_animation(a, "revival"),
        start_animation(a, "heal")),
    a.c.town && !a.disappearing
      ? ((a.disappearing = new Date()),
        (a.real_alpha = 1),
        start_animation(a, "transport"))
      : !a.c.town &&
        a.disappearing &&
        (delete a.disappearing,
        (a.real_alpha = 1),
        stop_animation(a, "transport")),
    a.tp &&
      !a.appearing &&
      ((a.appearing = new Date()),
      (a.real_alpha = 0.5),
      start_animation(a, "transport")),
    a.me &&
      3 <= a.targets &&
      (!a.last_targets || a.last_targets < a.targets) &&
      "warrior" != character.ctype &&
      (5 < a.targets
        ? add_log("You are petrified", "#B03736")
        : 3 < a.targets
        ? add_log("You are terrified", "#B04157")
        : 3 == a.targets && add_log("You are getting scared", "gray")),
    a.me && (a.last_targets = a.targets));
}
function effects_logic(a) {
  if (!no_graphics && a.s) {
    (a.s.cursed || a.s.poisoned || a.s.frozen) && !a.fx.cursed
      ? ((a.fx.cursed = !0), start_filter(a, "curse"))
      : a.s.cursed ||
        a.s.poisoned ||
        a.s.frozen ||
        !a.fx.cursed ||
        (delete a.fx.cursed, stop_filter(a, "curse"));
    a.s.fingered && !a.filter_fingered
      ? start_filter(a, "fingered")
      : !a.s.fingered && a.filter_fingered && stop_filter(a, "fingered");
    a.s.stoned && !a.filter_stoned
      ? start_filter(a, "stoned")
      : !a.s.stoned && a.filter_stoned && stop_filter(a, "stoned");
    !a.s.stunned || a.fx.stunned || a.s.fingered
      ? a.s.stunned ||
        !a.fx.stunned ||
        a.s.fingered ||
        (delete a.fx.stunned, stop_animation(a, "stunned"))
      : ((a.fx.stunned = !0), start_animation(a, "stunned", "stun"));
    a.s.tangled && !a.fx.tangled
      ? ((a.fx.tangled = !0), start_animation(a, "tangle"))
      : !a.s.tangled &&
        a.fx.tangled &&
        (delete a.fx.tangled, stop_animation(a, "tangle"));
    a.s.dampened && !a.fx.dampened
      ? ((a.fx.dampened = !0), start_animation(a, "dampened"))
      : !a.s.dampened &&
        a.fx.dampened &&
        (delete a.fx.dampened, stop_animation(a, "dampened"));
    if (a.s.invincible && !a.fx.invincible) {
      var b = ("gm" == a.role && "gm") || "invincible";
      a.fx.invincible = !0;
      start_animation(a, b);
      a.real_alpha = 0.9;
    } else
      !a.s.invincible &&
        a.fx.invincible &&
        ((b = ("gm" == a.role && "gm") || "invincible"),
        delete a.fx.invincible,
        stop_animation(a, b),
        (a.real_alpha = 1));
    a.s.hardshell && !a.fx.hardshell
      ? ((a.fx.hardshell = !0), start_animation(a, "hardshell"))
      : !a.s.hardshell &&
        a.fx.hardshell &&
        (delete a.fx.hardshell, stop_animation(a, "hardshell"));
    a.s.reflection && !a.fx.reflection
      ? ((a.fx.reflection = !0), start_animation(a, "reflection"))
      : !a.s.reflection &&
        a.fx.reflection &&
        (delete a.fx.reflection, stop_animation(a, "reflection"));
    a.s.magiport &&
      !a.fading_out &&
      ((a.fading_out = new Date()),
      (a.real_alpha = 1),
      draw_timeout(fade_out_magiport(0, a), 0),
      start_filter(a, "bloom"));
    "monster" != a.type ||
      Object.keys(a.fx).length ||
      !(1 > a.real_alpha) ||
      a.dead ||
      a.appearing ||
      a.disappearing ||
      a.fading_out ||
      (a.real_alpha = min(1, a.real_alpha + 0.05));
  }
}
function cosmetics_logic(a) {
  a.cxc || (a.cxc = {});
  if (!no_graphics) {
    var b = ["bg"],
      c = "full",
      d = {},
      e = [a.skin],
      f;
    for (f in a.cx) e.push(f);
    e.forEach(function (a) {
      G.cosmetics.prop[a] &&
        G.cosmetics.prop[a].forEach(function (a) {
          d[a] = !0;
        });
    });
    "armor" == T[a.skin]
      ? (c = "armor")
      : "body" == T[a.skin]
      ? (c = "body")
      : "character" == T[a.skin] && (c = "character");
    if (a.slots && a.slots.helmet && a.slots.helmet.name.startsWith("ghat")) {
      e = !1;
      for (var g in a.slots) a.slots[g] && a.slots[g].giveaway && (e = !0);
      e && (a.cx.hat = G.items[a.slots.helmet.name].hat);
    }
    if (a.rip) a.cx.hat && b.push(a.cx.hat);
    else {
      b.push(a.skin + "copy");
      "full" == c || a.cx.head || (a.cx.head = "makeup117");
      for (var h in a.cx) {
        var l = a.cx[h];
        !l ||
          ["stone"].includes(h) ||
          ("hair" == h && d.no_hair) ||
          ("full" == c && in_arr(h, ["head", "hair"])) ||
          ("character" == c && in_arr(h, ["head", "hair"])) ||
          ("upper" == h && ("full" == c || SSU[l] != SSU[a.skin])) ||
          ("armor" == c &&
            "head" == h &&
            b.push(
              {
                small:
                  (G.cosmetics.head[l] && G.cosmetics.head[l][0]) || "sskin1a",
                normal:
                  (G.cosmetics.head[l] && G.cosmetics.head[l][1]) || "mskin1a",
                tall:
                  (G.cosmetics.head[l] && G.cosmetics.head[l][1]) || "mskin1a",
                large:
                  (G.cosmetics.head[l] && G.cosmetics.head[l][2]) || "lskin1a",
              }[SS[a.skin]]
            ),
          b.push(l));
      }
      new_attacks &&
        a.slots &&
        a.slots.mainhand &&
        "weapon" == G.items[a.slots.mainhand.name].type &&
        G.positions[
          G.items[a.slots.mainhand.name].skin_c ||
            G.items[a.slots.mainhand.name].skin
        ] &&
        b.push("weapon" + a.slots.mainhand.name);
      new_attacks &&
        a.slots &&
        a.slots.offhand &&
        "weapon" == G.items[a.slots.offhand.name].type &&
        G.positions[
          G.items[a.slots.offhand.name].skin_c ||
            G.items[a.slots.offhand.name].skin
        ] &&
        b.push("weap2n" + a.slots.offhand.name);
    }
    for (l in a.cxc)
      in_arr(l, b) || (destroy_sprite(a.cxc[l]), delete a.cxc[l]);
    var k = head_x,
      p = { large: 2, tall: 1, normal: 0, small: -1, xsmall: -3, xxsmall: -4 }[
        SS[a.skin]
      ];
    c = (G.cosmetics.head[a.cx.head] && G.cosmetics.head[a.cx.head][3]) || 0;
    var q =
      (G.cosmetics.hair[a.cx.hair] && G.cosmetics.hair[a.cx.hair][0]) || 0;
    q += c;
    var m =
        (G.cosmetics.hair[a.cx.hair] && G.cosmetics.hair[a.cx.hair][1]) || 0,
      u = G.cosmetics.hat[a.cx.hat] || 0;
    u += c;
    a.texture.width % 2
      ? a.standed && (a.standed.x = 0.5)
      : (a.standed && (a.standed.x = 0), (k -= 0.5));
    a.rip &&
      ((p =
        (G.cosmetics.gravestone[a.cx.gravestone || "gravestone"] || 19) - 23),
      (q = 0));
    b.forEach(function (b) {
      var c = a.cxc[b];
      if (!a.cxc[b]) {
        if (a.rip && "hat" != T[b]) return;
        if (b == a.skin + "copy")
          (c = new PIXI.Sprite(a.texture)),
            c.anchor.set(0.5, 1),
            (c.stype = "copy"),
            (c.skin = a.skin),
            a.addChild(c),
            (a.cxc[b] = c);
        else if ("bg" == b)
          (c = new PIXI.Sprite()),
            c.anchor.set(0.5, 1),
            (c.stype = "bg"),
            a.addChild(c),
            (a.cxc[b] = c);
        else if ("hat hair head face makeup beard".split(" ").includes(T[b]))
          (c = new_sprite(b, T[b])),
            c.anchor.set(0.5, 1),
            a.addChild(c),
            (a.cxc[b] = c);
        else if ("armor" == T[b])
          (c = new_sprite(b, "upper")),
            c.anchor.set(0.5, 1),
            (c.y = -8),
            a.addChild(c),
            (a.cxc[b] = c);
        else if ("skin" == T[b])
          (c = new_sprite(b, T[b])),
            c.anchor.set(0.5, 1),
            a.addChild(c),
            (a.cxc[b] = c);
        else if ("wings" == T[b])
          (c = new_sprite(b, "wings")),
            c.anchor.set(0.5, 1),
            (c.x = -5),
            a.addChild(c),
            (a.cxc[b] = c);
        else if ("s_wings" == T[b])
          (c = new_sprite(b, "s_wings")),
            c.anchor.set(0.5, 1),
            a.addChild(c),
            (a.cxc[b] = c);
        else if ("tail" == T[b])
          (c = new_sprite(b, "tail")),
            c.anchor.set(0.5, 1),
            (c.y = 0),
            a.addChild(c),
            (a.cxc[b] = c);
        else if (b.startsWith("wea")) {
          var d = b.substr(6, 99),
            e = G.items[d].cx || {},
            f = a.slots.mainhand,
            g = !0;
          "2" == b[4] && ((f = a.slots.offhand), (g = !1));
          var h = calculate_item_grade(G.items[d]);
          c = new_sprite(d, "item");
          c.anchor.set(0.5, 1);
          c.y = -4;
          c.x = -5 + k;
          "2" == b[4] && ((c.x = 5 + k), c.scale.set(-1, 1));
          var l = 4473924,
            n = 0;
          e.lightborder && ((l = 6710886), (n = 1));
          e.border && (n = e.border);
          d = 8 + 3 * (min(f.level, 13) + [1, 1.5, 2, 2, 2][h] - 10);
          var t = 4 + 2 * (min(f.level, 13) + [1.5, 1.75, 2, 2, 2][h] - 10);
          10 <= f.level + h
            ? ((e = new PIXI.filters.GlowFilter(
                d,
                t,
                0,
                hx(e.accent || "#DBDBBF", 0.05)
              )),
              (c.filters = [e]),
              g && (a.wglow_filter = e))
            : (c.filters = [new PIXI.filters.OutlineFilter(n || 2, l)]);
          c.zy = 100;
          a.addChild(c);
          a.cxc[b] = c;
        } else {
          console.log("Invalid cosmetics: " + b);
          return;
        }
      }
      if ("copy" == c.stype)
        void 0 !== a.j && (c.texture = textures[a.skin][a.i][a.j]), (c.zy = 0);
      else if ("bg" == c.stype) c.zy = -100 * ZEPS;
      else if ("head" == c.stype)
        (e =
          G.cosmetics.prop[a.skin] &&
          G.cosmetics.prop[a.skin].includes("covers")),
          (c.y_disp = -(G.cosmetics.default_head_place + p) + head_y),
          (c.zy = ZEPS),
          (b = 0),
          0 == a.i
            ? (c.y = c.y_disp + 1)
            : 1 == a.i
            ? (c.y = c.y_disp)
            : 2 == a.i && (c.y = c.y_disp + 1),
          0 == a.j
            ? (c.x = 0 + k)
            : 1 == a.j
            ? (c.x = -b + k)
            : 2 == a.j
            ? (c.x = +b + k)
            : 3 == a.j && ((c.x = 0 + k), (c.zy = -ZEPS)),
          3 > a.j && e && (c.zy = -2 * ZEPS),
          void 0 !== a.j && set_texture(c, a.j),
          (c.moved = !1);
      else if ("hair" == c.stype)
        (c.y_disp = -(G.cosmetics.default_hair_place + p + q) + head_y),
          (b = 0),
          (c.zy = 2 * ZEPS),
          0 == a.i
            ? (c.y = c.y_disp + 1)
            : 1 == a.i
            ? (c.y = c.y_disp)
            : 2 == a.i && (c.y = c.y_disp + 1),
          0 == a.j
            ? (c.x = 0 + k)
            : 1 == a.j
            ? (c.x = -b + k)
            : 2 == a.j
            ? (c.x = +b + k)
            : 3 == a.j && (c.x = 0 + k),
          void 0 !== a.j && set_texture(c, a.j),
          (c.moved = !1);
      else if ("hat" == c.stype)
        (c.y_disp = -(G.cosmetics.default_hat_place + p + m + u) + head_y),
          (b = 0),
          (c.zy = 3 * ZEPS),
          0 == a.i
            ? (c.y = c.y_disp + 1)
            : 1 == a.i
            ? (c.y = c.y_disp)
            : 2 == a.i && (c.y = c.y_disp + 1),
          0 == a.j
            ? (c.x = 0 + k)
            : 1 == a.j
            ? (c.x = -b + k)
            : 2 == a.j
            ? (c.x = +b + k)
            : 3 == a.j && (c.x = 0 + k),
          void 0 !== a.j && set_texture(c, a.j),
          (c.moved = !1);
      else if ("face" == c.stype)
        (c.y_disp =
          -(
            G.cosmetics.default_head_place +
            p +
            G.cosmetics.default_face_position
          ) + head_y),
          (c.y = c.y_disp),
          (b = 0),
          (c.zy = 2.5 * ZEPS),
          0 == a.i
            ? (c.y = c.y_disp + 1)
            : 1 == a.i
            ? (c.y = c.y_disp)
            : 2 == a.i && (c.y = c.y_disp + 1),
          0 == a.j
            ? (c.x = 0 + k)
            : 1 == a.j
            ? (c.x = -b + k)
            : 2 == a.j
            ? (c.x = +b + k)
            : 3 == a.j && (c.x = 0 + k),
          void 0 !== a.j && set_texture(c, a.j),
          (c.moved = !1);
      else if ("beard" == c.stype || "makeup" == c.stype)
        (c.y_disp =
          -(
            G.cosmetics.default_head_place +
            p +
            G.cosmetics.default_beard_position
          ) + head_y),
          (c.y = c.y_disp),
          (b = 0),
          (c.zy = 3.5 * ZEPS),
          0 == a.i
            ? (c.y = c.y_disp + 1)
            : 1 == a.i
            ? (c.y = c.y_disp)
            : 2 == a.i && (c.y = c.y_disp + 1),
          0 == a.j
            ? (c.x = 0 + k)
            : 1 == a.j
            ? (c.x = -b + k)
            : 2 == a.j
            ? (c.x = +b + k)
            : 3 == a.j && (c.x = 0 + k),
          void 0 !== a.j && set_texture(c, a.j),
          (c.moved = !1);
      else if ("skin" == c.stype)
        0 == a.j
          ? (c.zy = -ZEPS)
          : 1 == a.j
          ? (c.zy = -ZEPS)
          : 2 == a.j
          ? (c.zy = -ZEPS)
          : 3 == a.j && (c.zy = -ZEPS),
          void 0 !== a.j && set_texture(c, a.i, a.j);
      else if ("armor" == c.stype)
        c.texture.frame.p ||
          ((c.texture.frame.p = !0),
          (c.texture.frame.height -= 8),
          c.texture._updateUvs(),
          (c.y = -8)),
          0 == a.j
            ? (c.zy = 2 * ZEPS)
            : 1 == a.j
            ? (c.zy = 2 * ZEPS)
            : 2 == a.j
            ? (c.zy = 2 * ZEPS)
            : 3 == a.j && (c.zy = 2 * ZEPS),
          void 0 !== a.j && set_texture(c, a.i, a.j);
      else if ("upper" == c.stype)
        0 == a.j
          ? (c.zy = 2 * ZEPS)
          : 1 == a.j
          ? (c.zy = 2 * ZEPS)
          : 2 == a.j
          ? (c.zy = 2 * ZEPS)
          : 3 == a.j && (c.zy = 2 * ZEPS),
          void 0 !== a.j && set_texture(c, a.i, a.j);
      else if ("wings" == c.stype)
        0 == a.j
          ? ((c.zy = -6 * ZEPS), (c.x = -2.5 + k))
          : 1 == a.j
          ? ((c.zy = -6 * ZEPS), (c.x = 5 + k))
          : 2 == a.j
          ? ((c.zy = -6 * ZEPS), (c.x = -9 + k))
          : 3 == a.j && ((c.zy = 6 * ZEPS), (c.x = -5 + k)),
          void 0 !== a.j && set_texture(c, a.i, a.j);
      else if ("s_wings" == c.stype)
        (c.y_disp = 0),
          0 == a.i
            ? ((c.y = c.y_disp + 1), (c.x = k - 1))
            : 1 == a.i
            ? ((c.y = c.y_disp), (c.x = k))
            : 2 == a.i && ((c.y = c.y_disp + 1), (c.x = k + 1)),
          0 == a.j
            ? (c.zy = -6 * ZEPS)
            : 1 == a.j
            ? ((c.zy = -6 * ZEPS), (c.x += 3))
            : 2 == a.j
            ? ((c.zy = -6 * ZEPS), (c.x -= 3))
            : 3 == a.j && (c.zy = 6 * ZEPS),
          void 0 !== a.j && set_texture(c, a.j),
          (c.moved = !1);
      else if ("tail" == c.stype)
        (c.x = k),
          (c.y = 0),
          0 == a.j
            ? (c.zy = -6 * ZEPS)
            : 1 == a.j
            ? (c.zy = -6 * ZEPS)
            : 2 == a.j
            ? (c.zy = -6 * ZEPS)
            : 3 == a.j && (c.zy = 6 * ZEPS),
          void 0 !== a.j && set_texture(c, (a.walking || 0) % 4, a.j),
          (c.moved = !1);
      else if (b.startsWith("wea")) {
        d = b.substr(6, 99);
        e = G.items[d].cx || {};
        var r = G.items[d];
        g = 1;
        h = f = n = t = !1;
        l = 0;
        in_arr(r.wtype, ["wblade", "staff"])
          ? (f = !0)
          : in_arr(r.wtype, ["bow"]) || (n = !0);
        e.extension && (t = !0);
        e.scale && (g = G.items[d].cx.scale);
        r = ("o" == b[4] && 1) || -1;
        d = b = 0;
        0 == a.i
          ? (d = b = -0.5)
          : 1 == a.i
          ? (d = b = 0)
          : 2 == a.i && (d = b = 0.5);
        0 == a.j
          ? ((c.zy = -(1e3 + r) * ZEPS),
            -1 == r && (h = !0),
            t &&
              ((b += -3 * r),
              (d += 1),
              (l = 0.5 * r * Math.PI),
              e.small && (b += -5 * r)),
            (d -= 2),
            e.small && (d -= 5))
          : 1 == a.j
          ? ((c.zy = -(1e3 + r) * ZEPS),
            (h = !0),
            (b *= 1 * r),
            (d *= 1 * r),
            (d = t ? d + round(1 / g) : d - 2),
            n
              ? t
                ? (l = 0.5 * Math.PI)
                : (b += 2)
              : ((l = -0.25 * Math.PI), (b += 8), (d -= 3)),
            e.large && (b += 2),
            e.small && (d -= 5))
          : 2 == a.j
          ? ((c.zy = -(1e3 + r) * ZEPS),
            (h = !1),
            (b *= -1 * r),
            (d *= -1 * r),
            (d = t ? d + round(1 / g) : d - 2),
            n
              ? t
                ? (l = -0.5 * Math.PI)
                : (b += -2)
              : ((l = 0.25 * Math.PI), (b += -8), (d -= 3)),
            e.large && (b -= 2),
            e.small && (d -= 5))
          : 3 == a.j &&
            ((c.zy = (1e3 + r) * ZEPS),
            1 == r && (h = !0),
            (d = 0),
            t &&
              ((b += -3 * r),
              (d += 1),
              (l = 0.5 * r * Math.PI),
              e.small && (b += -5 * r)),
            e.small && (d -= 5));
        a.fx &&
          a.fx.attack &&
          ((e = 15),
          (t = 40),
          (c.zy *= -1),
          n
            ? ((e = 10), (t = 20))
            : ((n = 8),
              f && ((n = 16), (d += 3)),
              (d += 5),
              [1, 2].includes(a.j) && (b += (0 < b ? -1 : 1) * n),
              1 == a.j && ((l = 0), (h = !1)),
              2 == a.j && ((l = 0), (h = !0))),
          mssince(a.fx.attack[0]) > e &&
            ((a.fx.attack[0] = new Date()), a.fx.attack[1]++),
          (l =
            0 < l || 2 == a.j
              ? l + (a.fx.attack[1] * Math.PI) / t
              : l - (a.fx.attack[1] * Math.PI) / t),
          textures["item" + c.skin][0] != textures["item" + c.skin][1] &&
            (c.texture =
              2 < a.fx.attack[1] && 8 >= a.fx.attack[1]
                ? textures["item" + c.skin][1]
                : textures["item" + c.skin][0]),
          5 > a.fx.attack[1]
            ? ((b += (0 < b ? -1 : 1) * [1, 2, 3, 4, 6][a.fx.attack[1]]),
              (d -= [0.5, 1, 1.25, 1.5, 2][a.fx.attack[1]]))
            : 10 > a.fx.attack[1]
            ? ((b += (0 < b ? -1 : 1) * [5, 4, 3, 2, 1][a.fx.attack[1] - 5]),
              (d -= [2, 1.5, 1.25, 1, 0.5][a.fx.attack[1] - 5]))
            : (a.fx.attack = null));
        0.5 >= g ? (d -= 6) : 0.75 >= g && (d -= 3);
        c.rotation = l;
        c.scale.set(((h && -1) || 1) * g, g);
        c.x = b + k;
        c.y = -4 + d;
      }
      (!last_cx_d[0] && !last_cx_d[1]) ||
        c.moved ||
        c.skin != last_cx_name ||
        ((c.moved = !0), (c.x += last_cx_d[0]), (c.y += last_cx_d[1]));
    });
    a.children.sort(function (a, b) {
      void 0 === a.zy && (a.zy = -CINF);
      void 0 === b.zy && (b.zy = -CINF);
      return a.zy - b.zy;
    });
  }
}
function add_character(a, b) {
  log_flags.entities && console.log("add character " + a.id);
  var c = (b && manual_centering && 2) || 1;
  XYWH[a.skin] || (a.skin = "naked");
  var d = new_sprite(a.skin, "full");
  1 != c && (d.scale = new PIXI.Point(c, c));
  d.cscale = c;
  adopt_soft_properties(d, a);
  cosmetics_logic(d);
  d.name = d.id;
  d.parentGroup = d.displayGroup = player_layer;
  d.walking = null;
  d.animations = {};
  d.fx = {};
  d.emblems = {};
  d.real_alpha = 1;
  d.x = round(a.x);
  d.real_x = parseFloat(a.x);
  d.y = round(a.y);
  d.real_y = parseFloat(a.y);
  d.last_ms = new Date();
  d.anchor.set(0.5, 1);
  d.type = "character";
  d.me = b;
  d.base = { h: 8, v: 7, vn: 2 };
  a.npc &&
    G.npcs[a.npc] &&
    ("citizen" == G.npcs[a.npc].role || G.npcs[a.npc].moving) &&
    ((d.citizen = !0), (d.npc_onclick = !0), (d.role = G.npcs[a.npc].role));
  d.awidth = d.width / c;
  d.aheight = d.height / c;
  (b && manual_centering) ||
    ((d.interactive = !0),
    d.on("mousedown", player_click).on("touchstart", player_click),
    !b && pvp && (d.cursor = "crosshair"));
  return d;
}
function add_chest(a) {
  var b = new_sprite(a.chest, "v_animation");
  b.parentGroup = b.displayGroup = chest_layer;
  b.x = round(a.x);
  b.y = round(a.y) - 1;
  b.items = a.items;
  b.anchor.set(0.5, 1);
  b.type = "chest";
  b.interactive = !0;
  b.buttonMode = !0;
  b.cursor = "help";
  b.map = a.map;
  b.id = a.id;
  var c = function () {
    open_chest(a.id);
  };
  b.on("mousedown", c).on("touchstart", c).on("rightdown", c);
  chests[a.id] = b;
  b.map == current_map && map.addChild(b);
}
function get_npc(a) {
  var b = null;
  map_npcs.forEach(function (c) {
    c.npc_id == a && (b = c);
  });
  return b;
}
function add_npc(a, b, c, d) {
  c =
    "static" == a.type
      ? new_sprite(a.skin, "static")
      : "fullstatic" == a.type
      ? new_sprite(a.skin, "full")
      : new_sprite(a.skin, "emote");
  c.npc_id = d;
  c.parentGroup = c.displayGroup = player_layer;
  c.interactive = !0;
  c.buttonMode = !0;
  c.real_x = c.x = round(b[0]);
  c.real_y = c.y = round(b[1]);
  "fullstatic" == a.type && 3 == b.length && (a.direction = b[2]);
  "citizen" == a.role && (c.citizen = !0);
  c.anchor.set(0.5, 1);
  c.type = "npc";
  c.npc = !0;
  c.animations = {};
  c.fx = {};
  c.emblems = {};
  adopt_soft_properties(c, a);
  a.stand &&
    ((b = new PIXI.Sprite(textures[a.stand])),
    (b.y = 7),
    b.anchor.set(0.5, 1),
    c.addChild(b));
  "emote" == c.stype &&
    ((b = [26, 35]),
    (d = c.anchor),
    "newyear_tree" == c.role && (b = [32, 60]),
    (c.hitArea = new PIXI.Rectangle(
      -b[0] * d.x - 2,
      -b[1] * d.y - 2,
      b[0] + 4,
      b[1] + 4
    )),
    (c.awidth = b[0]),
    (c.aheight = b[1]),
    a.atype && ((c.atype = a.atype), (c.frame = c.stopframe || c.frame)));
  c.on("mousedown", npc_right_click)
    .on("touchstart", npc_right_click)
    .on("rightdown", npc_right_click);
  c.onrclick = npc_right_click;
  return c;
}
function add_machine(a) {
  function b(b) {
    "dice" == a.type && render_dice();
    "wheel" == a.type && add_log("The hostess isn't around", "gray");
    "slots" == a.type &&
      render_interaction({
        auto: !0,
        skin: character.skin,
        message:
          "Hmm. This machine seems broken. Still give it a try? [1,000,000 gold]",
        button: "YES!",
        onclick: function () {
          socket.emit("bet", { type: "slots" });
        },
      });
    try {
      b && b.stopPropagation();
    } catch (f) {}
  }
  var c = new_sprite(a, "machine");
  c.parentGroup = c.displayGroup = player_layer;
  c.interactive = !0;
  c.buttonMode = !0;
  c.x = round(a.x);
  c.y = round(a.y);
  c.type = "machine";
  c.mtype = a.type;
  c.updates = 0;
  c.anchor.set(0.5, 1);
  if ("dice" == a.type) {
    c.digits = e_array(4);
    for (var d = 0; 4 > d; d++)
      (c.digits[d] = new PIXI.Sprite(textures.dicesub[8])),
        c.digits[d].anchor.set(0.5, 1),
        (c.digits[d].x = -11 + 7 * d),
        1 < d && (c.digits[d].x += 1),
        (c.digits[d].y = -17),
        c.addChild(c.digits[d]);
    c.dot = new PIXI.Sprite(textures.dicesub[10]);
    c.dot.anchor.set(0.5, 1);
    c.dot.x = 0;
    c.dot.y = -21;
    c.addChild(c.dot);
    c.seconds = 0;
    c.count_start = new Date();
    c.shuffle_speed = 100;
  }
  c.on("mousedown", b).on("touchstart", b).on("rightdown", b);
  c.onrclick = b;
  return c;
}
function add_door(a) {
  function b() {
    if (is_electron && "mas" == electron_data.platform && "tavern" == a[4])
      return show_alert("You can't enter the Tavern from Mac App Store :|");
    is_door_close(character.map, a, character.real_x, character.real_y) &&
    can_use_door(character.map, a, character.real_x, character.real_y)
      ? socket.emit("transport", { to: a[4], s: a[5] })
      : add_log("Get closer", "gray");
  }
  var c = new PIXI.Sprite();
  c.parentGroup = c.displayGroup = player_layer;
  c.interactive = !0;
  c.buttonMode = !0;
  c.x = round(a[0]);
  c.y = round(a[1]);
  c.anchor.set(0.5, 1);
  c.hitArea = new PIXI.Rectangle(
    -round(0.5 * a[2]),
    -round(1 * a[3]),
    round(a[2]),
    round(a[3])
  );
  c.type = "door";
  if (is_mobile) c.on("mousedown", b).on("touchstart", b);
  c.on("rightdown", b);
  c.onrclick = b;
  return c;
}
function add_quirk(a) {
  function b(b) {
    "sign" == a[4]
      ? add_log('Sign reads: "' + a[5] + '"', "gray")
      : "note" == a[4]
      ? add_log('Note reads: "' + a[5] + '"', "gray")
      : "tavern_info" == a[4]
      ? socket.emit("tavern", { event: "info" })
      : "mainframe" == a[4]
      ? render_mainframe()
      : "the_lever" == a[4]
      ? the_lever()
      : "log" == a[4]
      ? add_log(a[5], "gray")
      : "upgrade" == a[4]
      ? render_upgrade_shrine(1)
      : "compound" == a[4]
      ? render_compound_shrine(1)
      : "list_pvp" == a[4]
      ? socket.emit("list_pvp")
      : "invisible_statue" == a[4] &&
        (render_none_shrine(), add_log("An invisible statue!", "gray"));
    try {
      b && b.stopPropagation();
    } catch (e) {}
  }
  var c = new PIXI.Sprite();
  c.parentGroup = c.displayGroup = player_layer;
  c.interactive = !0;
  c.buttonMode = !0;
  "upgrade" != a[4] && "compound" != a[4] && (c.cursor = "help");
  c.x = round(a[0]);
  c.y = round(a[1]);
  c.anchor.set(0.5, 1);
  c.hitArea = new PIXI.Rectangle(
    -round(0.5 * a[2]),
    -round(1 * a[3]),
    round(a[2]),
    round(a[3])
  );
  c.type = "quirk";
  if (is_mobile || in_arr(a[4], ["upgrade", "compound", "invisible_statue"]))
    c.on("mousedown", b).on("touchstart", b);
  c.on("rightdown", b);
  c.on("mousedown", b).on("touchstart", b);
  return c;
}
function add_animatable(a, b) {
  a = new_sprite(b.position, "animatable");
  a.x = b.x;
  a.y = b.y;
  a.anchor.set(0.5, 1);
  a.type = "animatable";
  return a;
}
function create_map() {
  pvp = G.maps[current_map].pvp || is_pvp;
  if (!paused) {
    drawn_map = current_map;
    if (window.map) {
      window.inner_stage
        ? inner_stage.removeChild(window.map)
        : stage.removeChild(window.map);
      for (var a in chests) {
        var b = chests[a];
        b.map == current_map && map.removeChild(b);
      }
      !cached_map &&
        map_tiles.length &&
        map.children &&
        map.removeChildren(
          map.children.indexOf(map_tiles[0]),
          map.children.indexOf(map_tiles[map_tiles.length - 1])
        );
      free_children(map);
      map.destroy();
      for (a in map_animations) destroy_sprite(map_animations[a], "children");
      map_entities.forEach(function (a) {
        a.destroy({ children: !0 });
      });
      wtile && (wtile.destroy(), (wtile = null));
      dtile && (dtile.destroy(), (dtile = null));
      tiles && (tiles.destroy(), (tiles = null));
      (window.rtextures || []).forEach(function (a) {
        a && a.destroy(!0);
      });
      (window.dtextures || []).forEach(function (a) {
        a && a.destroy(!0);
      });
    }
    map_npcs = [];
    map_doors = [];
    map_tiles = [];
    map_entities = [];
    map_animations = {};
    map_machines = {};
    water_tiles = [];
    entities = {};
    (dtile_size = GEO["default"] && GEO.tiles[GEO["default"]][3]) &&
      is_array(dtile_size) &&
      (dtile_size = dtile_size[0]);
    wtile_name = G.maps[current_map].weather;
    map = new PIXI.Container();
    map.real_x = 0;
    map.real_y = 0;
    first_coords &&
      ((first_coords = !1), (map.real_x = first_x), (map.real_y = first_y));
    map.speed = 80;
    map.hitArea = new PIXI.Rectangle(-2e4, -2e4, 4e4, 4e4);
    scale && (map.scale = new PIXI.Point(scale, scale));
    map.interactive = !0;
    map
      .on("mousedown", map_click)
      .on("mouseup", map_click_release)
      .on("mouseupoutside", map_click_release)
      .on("touchstart", map_click)
      .on("touchend", map_click_release)
      .on("touchendoutside", map_click_release);
    window.inner_stage ? inner_stage.addChild(map) : stage.addChild(map);
    "halloween" != G.maps[current_map].filter || no_graphics
      ? delete stage.cfilter_halloween
      : ((b = new PIXI.filters.ColorMatrixFilter()),
        b.saturate(-0.1),
        (stage.cfilter_halloween = b));
    regather_filters(stage);
    tile_sprites[current_map] ||
      ((tile_sprites[current_map] = []),
      (tile_textures[current_map] = []),
      (sprite_last[current_map] = []));
    for (b = 0; b < GEO.tiles.length; b++)
      if (
        ((element = GEO.tiles[b]),
        (sprite_last[current_map][b] = 0),
        !tile_sprites[current_map][b] &&
          ((tile_sprites[current_map][b] = []),
          (tile_textures[current_map][b] = []),
          element))
      ) {
        element[4] = nunv(element[4], element[3]);
        var c = new PIXI.Rectangle(
          element[1],
          element[2],
          element[3],
          element[4]
        );
        c = new PIXI.Texture(C[G.tilesets[element[0]].file], c);
        tile_textures[current_map][b][0] = c;
        var d = G.tilesets[element[0]].frames || 1,
          e = G.tilesets[element[0]].frame_width;
        element[5] && ((d = element[5]), (e = element[3]));
        for (var f = 1; f < d; f++)
          (c = new PIXI.Rectangle(
            element[1] + f * e,
            element[2],
            element[3],
            element[4]
          )),
            (c = new PIXI.Texture(C[G.tilesets[element[0]].file], c)),
            (tile_textures[current_map][b][f] = c);
        cached_map ||
          (tile_sprites[current_map][b][
            sprite_last[current_map][b]
          ] = new_map_tile(tile_textures[current_map][b]));
      }
    if (cached_map) {
      window.rtextures = [0, 0, 0];
      window.dtextures = [0, 0, 0];
      window.wtextures = [0, 0, 0];
      dtile_size && recreate_dtextures();
      wtile_name && recreate_wtextures();
      for (
        var g = [
            new PIXI.Container(),
            new PIXI.Container(),
            new PIXI.Container(),
          ],
          h = 0,
          l = 0,
          k = 0;
        3 > k;
        k++
      ) {
        rtextures[k] = PIXI.RenderTexture.create(
          GEO.max_x - GEO.min_x,
          GEO.max_y - GEO.min_y,
          PIXI.SCALE_MODES.NEAREST,
          1
        );
        for (b = 0; b < GEO.placements.length; b++)
          if (((d = GEO.placements[b]), void 0 === d[3] || null === d[3]))
            (f = GEO.tiles[d[0]]),
              (e = f[3]),
              (f = f[4]),
              sprite_last[current_map][d[0]] >=
                tile_sprites[current_map][d[0]].length &&
                (tile_sprites[current_map][d[0]][
                  sprite_last[current_map][d[0]]
                ] = new_map_tile(tile_textures[current_map][d[0]])),
              (c =
                tile_sprites[current_map][d[0]][
                  sprite_last[current_map][d[0]]++
                ]),
              c.textures && (c.texture = c.textures[k]),
              (c.x = d[1] - GEO.min_x),
              (c.y = d[2] - GEO.min_y),
              g[k].addChild(c);
          else if (
            ((f = GEO.tiles[d[0]]),
            (e = f[3]),
            (f = f[4]),
            20 <= abs(((d[3] - d[1]) / e + 1) * ((d[4] - d[2]) / f + 1)))
          )
            (c = tile_textures[current_map][d[0]][0]),
              1 < tile_textures[current_map][d[0]].length &&
                (c =
                  tile_textures[current_map][d[0]][
                    k % tile_textures[current_map][d[0]].length
                  ]),
              (c = new PIXI.extras.TilingSprite(
                c,
                d[3] - d[1] + e,
                d[4] - d[2] + f
              )),
              (c.x = d[1] - GEO.min_x),
              (c.y = d[2] - GEO.min_y),
              g[k].addChild(c),
              h++;
          else {
            l++;
            for (var p = d[1]; p <= d[3]; p += e)
              for (var q = d[2]; q <= d[4]; q += f)
                sprite_last[current_map][d[0]] >=
                  tile_sprites[current_map][d[0]].length &&
                  (tile_sprites[current_map][d[0]][
                    sprite_last[current_map][d[0]]
                  ] = new_map_tile(tile_textures[current_map][d[0]])),
                  (c =
                    tile_sprites[current_map][d[0]][
                      sprite_last[current_map][d[0]]++
                    ]),
                  c.textures && (c.texture = c.textures[k]),
                  (c.x = p - GEO.min_x),
                  (c.y = q - GEO.min_y),
                  g[k].addChild(c);
          }
        g[k].x = 0;
        g[k].y = 0;
        renderer.render(g[k], rtextures[k]);
        mode.destroy_tiles || g[k].destroy();
      }
      dtile_size &&
        ((window.dtile = new PIXI.Sprite(dtextures[1])),
        (dtile.x = -500),
        (dtile.y = -500));
      wtile_name &&
        ((window.wtile = new PIXI.Sprite(wtextures[0])),
        (wtile.x = -500),
        (wtile.y = -500),
        (wtile.parentGroup = sprite.displayGroup = weather_layer));
      window.tiles = new PIXI.Sprite(rtextures[0]);
      tiles.x = GEO.min_x;
      tiles.y = GEO.min_y;
      dtile_size && map.addChild(dtile);
      map.addChild(tiles);
      wtile_name && map.addChild(wtile);
      if (mode.destroy_tiles) {
        for (b = 0; 3 > b; b++) g[b].destroy();
        for (b = 0; b < GEO.tiles.length; b++) {
          for (d = 0; d < tile_sprites[current_map][b].length; d++)
            tile_sprites[current_map][b][d].destroy();
          tile_sprites[current_map][b] = [];
        }
      }
    }
    if (GEO.animations)
      for (g = 0; g < GEO.animations.length; g++)
        for (
          d = GEO.animations[g],
            e = GEO.tiles[d[0]][3],
            f = GEO.tiles[d[0]][4],
            p = d[1];
          p <= nunv(d[3], d[1]);
          p += e
        )
          for (q = d[2]; q <= nunv(d[4], d[2]); q += f)
            (c = new PIXI.Sprite(tile_textures[current_map][d[0]][0])),
              (c.textures = tile_textures[current_map][d[0]]),
              (c.real_x = c.x = p),
              (c.y = q),
              (c.real_y = nunv(d[4], d[2]) + f),
              (c.stype = "animation"),
              (c.atype = "xmap"),
              (c.last = 0),
              (c.last_update = future_ms(parseInt(d[6]) || 0)),
              (c.interval = d[5]),
              (c.id = "xmap" + g + "|" + p + "|" + q),
              (c.parentGroup = c.displayGroup = player_layer),
              (c.y_disp = -parseFloat(d[7]) || 0),
              map.addChild(c),
              (map_animations[c.id] = c);
    if (GEO.groups)
      for (g = 0; g < GEO.groups.length; g++)
        if (GEO.groups[g].length) {
          h = new PIXI.Container();
          h.type = "group";
          l = 999999999;
          k = 99999999;
          var m = -999999999;
          for (b = 0; b < GEO.groups[g].length; b++)
            (d = GEO.groups[g][b]),
              (f = GEO.tiles[d[0]]),
              d[1] < k && (k = d[1]),
              d[2] < l && (l = d[2]),
              nunv(d[4], d[2]) + f[4] > m && (m = nunv(d[4], d[2]) + f[4]);
          for (b = 0; b < GEO.groups[g].length; b++)
            for (
              d = GEO.groups[g][b],
                e = GEO.tiles[d[0]][3],
                f = GEO.tiles[d[0]][4],
                p = d[1];
              p <= nunv(d[3], d[1]);
              p += e
            )
              for (q = d[2]; q <= nunv(d[4], d[2]); q += f)
                (c = new PIXI.Sprite(tile_textures[current_map][d[0]][0])),
                  (c.x = p - k),
                  (c.y = q - l),
                  h.addChild(c);
          GEO.groups[g][0] &&
            GEO.groups[g][0][5] &&
            (h.y_disp = -parseFloat(GEO.groups[g][0][5]) || 0);
          h.x = k;
          h.y = l;
          h.real_x = k;
          h.real_y = m;
          h.parentGroup = h.displayGroup = player_layer;
          map.addChild(h);
          map_entities.push(h);
        }
    map_info = G.maps[current_map];
    npcs = map_info.npcs;
    for (b = 0; b < npcs.length; b++)
      (d = npcs[b]),
        (f = G.npcs[d.id]),
        "full" != f.type &&
          "citizen" != f.role &&
          (log_flags.map && console.log("NPC: " + d.id),
          (d = add_npc(f, d.position, d.name, d.id)),
          map.addChild(d),
          map_npcs.push(d),
          map_entities.push(d));
    doors = map_info.doors || [];
    for (b = 0; b < doors.length; b++)
      (e = doors[b]),
        (d = add_door(e)),
        log_flags.map && console.log("Door: " + e),
        map.addChild(d),
        map_doors.push(d),
        map_entities.push(d),
        border_mode && border_logic(d);
    machines = map_info.machines || [];
    for (b = 0; b < machines.length; b++)
      (e = machines[b]),
        (d = add_machine(e)),
        log_flags.map && console.log("Machine: " + e.type),
        map.addChild(d),
        map_npcs.push(d),
        map_entities.push(d),
        (map_machines[d.mtype] = d),
        border_mode && border_logic(d);
    quirks = map_info.quirks || [];
    for (b = 0; b < quirks.length; b++)
      (e = quirks[b]),
        (d = add_quirk(e)),
        log_flags.map && console.log("Quirk: " + e),
        map.addChild(d),
        map_entities.push(d),
        border_mode && border_logic(d);
    log_flags.map && console.log("Map created: " + current_map);
    animatables = {};
    for (a in map_info.animatables || {})
      (animatables[a] = add_animatable(a, map_info.animatables[a])),
        map.addChild(animatables[a]),
        map_entities.push(animatables[a]),
        border_mode && border_logic(animatables[a]);
    for (a in chests) (b = chests[a]), b.map == current_map && map.addChild(b);
    border_mode &&
      (G.maps[current_map].spawns.forEach(function (a) {
        a = draw_circle(a[0], a[1], 10, 16609672);
        map.addChild(a);
      }),
      (G.maps[current_map].monsters || []).forEach(function (a) {
        if (a.boundary) {
          var b = empty_rect(
            a.boundary[0],
            a.boundary[1],
            a.boundary[2] - a.boundary[0],
            a.boundary[3] - a.boundary[1],
            2,
            16539449
          );
          map.addChild(b);
        }
        a.rage &&
          ((b = empty_rect(
            a.rage[0] - 3,
            a.rage[1] - 3,
            a.rage[2] - a.rage[0] + 6,
            a.rage[3] - a.rage[1] + 6,
            2,
            9530301
          )),
          map.addChild(b));
        (a.boundaries || []).forEach(function (a) {
          a[0] == current_map &&
            ((a = empty_rect(
              a[1] + 2,
              a[2] + 2,
              a[3] - a[1],
              a[4] - a[2],
              2,
              5412095
            )),
            map.addChild(a));
        });
      }),
      M.x_lines.forEach(function (a) {
        a = draw_line(a[0], a[1], a[0], a[2], 2);
        map.addChild(a);
      }),
      M.y_lines.forEach(function (a) {
        a = draw_line(a[1], a[0], a[2], a[0], 2);
        map.addChild(a);
      }));
    log_flags.map && console.log("Map created: " + current_map);
  }
}
function retile_the_map() {
  if (cached_map)
    dtile_size &&
      (dtile_width < width || dtile_height < height) &&
      recreate_dtextures(),
      wtile &&
        (wtile_width < width || wtile_height < height) &&
        recreate_wtextures(),
      last_water_frame != water_frame() &&
        ((last_water_frame = water_frame()),
        (tiles.texture = rtextures[last_water_frame]),
        dtile_size && (dtile.texture = dtextures[last_water_frame])),
      wtile &&
        window.last_weather_frame != weather_frame() &&
        ((window.last_weather_frame = weather_frame()),
        (wtile.texture = wtextures[last_weather_frame]));
  else {
    var a = mdraw_border * scale,
      b = [],
      c = {},
      d = new Date(),
      e = 0,
      f = 0,
      g = map.real_x,
      h = map.real_y,
      l = g - width / scale / 2 - a,
      k = g + width / scale / 2 + a,
      p = h - height / scale / 2 - a,
      q = h + height / scale / 2 + a;
    if (
      void 0 == map.last_max_y ||
      abs(map.last_max_y - q) >= a ||
      abs(map.last_max_x - k) >= a
    ) {
      map.last_max_y = q;
      map.last_max_x = k;
      for (n = 0; n < map_tiles.length; n++)
        (a = map_tiles[n]),
          "redraw" == mdraw_mode ||
          a.x > k ||
          a.y > q ||
          a.x + a.width < l ||
          a.y + a.height < p
            ? ((a.to_delete = !0), e++)
            : (b.push(a), (c[a.tid] = !0));
      map_tiles.length &&
        map.removeChildren(
          map.children.indexOf(map_tiles[0]),
          map.children.indexOf(map_tiles[map_tiles.length - 1])
        );
      for (n = 0; n < GEO.tiles.length; n++) sprite_last[current_map][n] = 0;
      map_tiles = b;
      water_tiles = [];
      last_water_frame = water_frame();
      if (GEO["default"] && !mdraw_tiling_sprites)
        for (b = GEO.tiles[GEO["default"]], g = l; g <= k + 10; g += b[3])
          for (h = p; h <= q + 10; h += b[4]) {
            n = floor(g / b[3]);
            var m = floor(h / b[4]),
              u = "d" + n + "-" + m;
            c[u] ||
              (sprite_last[current_map][GEO["default"]] >=
                tile_sprites[current_map][GEO["default"]].length &&
                ((tile_sprites[current_map][GEO["default"]][
                  sprite_last[current_map][GEO["default"]]
                ] = new_map_tile(tile_textures[current_map][GEO["default"]])),
                f++),
              (a =
                tile_sprites[current_map][GEO["default"]][
                  sprite_last[current_map][GEO["default"]]++
                ]),
              a.textures &&
                ((a.texture = a.textures[last_water_frame]),
                water_tiles.push(a)),
              (a.x = n * b[3]),
              (a.y = m * b[4]),
              "redraw" != mdraw_mode &&
                ((a.parentGroup = a.displayGroup = map_layer), (a.zOrder = 0)),
              (a.tid = u),
              map.addChild(a),
              map_tiles.push(a));
          }
      else
        GEO["default"] &&
          ((b = GEO.tiles[GEO["default"]]),
          window.default_tiling ||
            (default_tiling = new PIXI.extras.TilingSprite(
              tile_textures[current_map][GEO["default"]][0],
              32 * floor((k - l) / 32) + 32,
              32 * floor((q - p) / 32) + 32
            )),
          (default_tiling.x = floor(l / b[3]) * b[3]),
          (default_tiling.y = floor(p / b[4]) * b[4]),
          (default_tiling.textures =
            tile_textures[current_map][GEO["default"]]),
          map.addChild(default_tiling),
          map_tiles.push(default_tiling));
      for (n = 0; n < GEO.placements.length; n++)
        if (((m = GEO.placements[n]), is_nun(m[3])))
          c["p" + n] ||
            ((b = GEO.tiles[m[0]]),
            (u = b[3]),
            (b = b[4]),
            m[1] > k ||
              m[2] > q ||
              m[1] + u < l ||
              m[2] + b < p ||
              (sprite_last[current_map][m[0]] >=
                tile_sprites[current_map][m[0]].length &&
                ((tile_sprites[current_map][m[0]][
                  sprite_last[current_map][m[0]]
                ] = new_map_tile(tile_textures[current_map][m[0]])),
                f++),
              (a =
                tile_sprites[current_map][m[0]][
                  sprite_last[current_map][m[0]]++
                ]),
              a.textures &&
                ((a.texture = a.textures[last_water_frame]),
                water_tiles.push(a)),
              (a.x = m[1]),
              (a.y = m[2]),
              "redraw" != mdraw_mode &&
                ((a.parentGroup = a.displayGroup = map_layer),
                (a.zOrder = -(n + 1))),
              (a.tid = "p" + n),
              map.addChild(a),
              map_tiles.push(a)));
        else if (
          ((b = GEO.tiles[m[0]]),
          (u = b[3]),
          (b = b[4]),
          !mdraw_tiling_sprites ||
            (mdraw_tiling_sprites &&
              8 > abs(((m[3] - m[1]) / u + 1) * ((m[4] - m[2]) / b + 1))))
        )
          for (g = m[1]; g <= m[3]; g += u) {
            if (!(g > k || g + u < l))
              for (h = m[2]; h <= m[4]; h += b)
                h > q ||
                  h + b < p ||
                  (sprite_last[current_map][m[0]] >=
                    tile_sprites[current_map][m[0]].length &&
                    ((tile_sprites[current_map][m[0]][
                      sprite_last[current_map][m[0]]
                    ] = new_map_tile(tile_textures[current_map][m[0]])),
                    f++),
                  (a =
                    tile_sprites[current_map][m[0]][
                      sprite_last[current_map][m[0]]++
                    ]),
                  a.textures &&
                    ((a.texture = a.textures[last_water_frame]),
                    water_tiles.push(a)),
                  (a.x = g),
                  (a.y = h),
                  (a.tid = "p" + n + "-" + g + "-" + h),
                  map.addChild(a),
                  map_tiles.push(a));
          }
        else
          window["defP" + current_map + n] ||
            (window["defP" + current_map + n] = new PIXI.extras.TilingSprite(
              tile_textures[current_map][m[0]][0],
              m[3] - m[1] + u,
              m[4] - m[2] + b
            )),
            (a = window["defP" + current_map + n]),
            (a.x = m[1]),
            (a.y = m[2]),
            (a.tid = "pt" + n),
            map.addChild(a),
            map_tiles.push(a);
      drawings.forEach(function (a) {
        try {
          var b = a && a.parent;
          b && (b.removeChild(a), b.addChild(a));
        } catch (v) {
          console.log("User drawing exception: " + v);
        }
      });
      console.log(
        "retile_map ms: " +
          mssince(d) +
          " min_x: " +
          l +
          " max_x: " +
          k +
          " entities: " +
          map_tiles.length +
          " removed: " +
          e +
          " new: " +
          f
      );
    } else if (last_water_frame != water_frame()) {
      last_water_frame = water_frame();
      for (var n = 0; n < water_tiles.length; n++)
        water_tiles[n].texture =
          water_tiles[n].textures[
            last_water_frame % water_tiles[n].textures.length
          ];
      mdraw_tiling_sprites &&
        (default_tiling.texture =
          default_tiling.textures[
            last_water_frame % default_tiling.textures.length
          ]);
    }
  }
}
var fps_counter = null,
  frames = 0,
  last_count = null,
  last_frame,
  fps = 0;
function calculate_fps() {
  fps_counter &&
    !mode.dom_tests_pixi &&
    "payments" != inside &&
    ((frames += 1),
    last_count ||
      ((last_count = new Date()), (last_frame = frames), (frequency = 500)),
    mssince(last_count) >= frequency &&
      ((last_count = new Date()),
      (fps = (1e3 / frequency) * (frames - last_frame)),
      (last_frame = frames)),
    (fps_counter.text = "" + round(fps)),
    fps_counter.position.set(
      width - (("com" == inside && 5) || 335),
      height - (("com" == inside && 5) || 0)
    ));
}
function load_game(a) {
  loader.load(function (a, c) {
    if (mode_nearest)
      for (file in PIXI.utils.BaseTextureCache)
        PIXI.utils.BaseTextureCache[file].scaleMode = PIXI.SCALE_MODES.NEAREST;
    for (k in G.sprites)
      if (((a = G.sprites[k]), !a.skip)) {
        c = 4;
        var b = 3;
        in_arr(a.type, ["animation"]) && (c = 1);
        in_arr(a.type, ["tail"]) && (b = 4);
        in_arr(
          a.type,
          "v_animation head hair hat s_wings face makeup beard".split(" ")
        ) && (b = 1);
        in_arr(a.type, ["wings", "body", "armor", "skin", "character"]);
        in_arr(a.type, ["emblem", "gravestone"]) && (b = c = 1);
        var e = a.matrix;
        no_graphics && (C[a.file] = { width: 20, height: 20 });
        for (
          var f = C[a.file].width / (a.columns * b),
            g = C[a.file].height / (a.rows * c),
            h = 0;
          h < e.length;
          h++
        )
          for (var l = 0; l < e[h].length; l++)
            if (e[h][l]) {
              var k = e[h][l];
              SSU[k] = SS[k] = a.size || "normal";
              FC[k] = a.file;
              FM[k] = [h, l];
              XYWH[k] = [l * b * f, h * c * g, f, g];
              G.cosmetics.prop[k] &&
                G.cosmetics.prop[k].includes("slender") &&
                (SSU[k] += "slender");
            }
      }
    G.positions.textures.forEach(function (a) {
      var b = G.positions[a];
      textures[a] = new PIXI.Texture(
        PIXI.utils.BaseTextureCache[G.tilesets[b[0]].file],
        new PIXI.Rectangle(b[1], b[2], b[3], b[4])
      );
    });
    for (k in G.animations) generate_textures(k, "animation");
    set_status("Resources Loaded");
    resources_loaded = !0;
    is_demo
      ? (create_map(), (map.real_y = -105), draw())
      : window.socket_ready && launch_game();
  });
  no_graphics && loader.load_function();
}
function launch_game() {
  create_map();
  draws || draw();
  mode.dom_tests_pixi ||
    "payments" == inside ||
    window.fps_counter ||
    ((fps_counter = new PIXI.Text("0", {
      fontFamily: "Pixel",
      fontSize: 40,
      fill: "green",
    })),
    fps_counter.position.set(10, 10),
    fps_counter.anchor.set(1, 1),
    (fps_counter.parentGroup = fps_counter.displayGroup = chest_layer),
    (fps_counter.zOrder = -999999999),
    window.inner_stage
      ? inner_stage.addChild(fps_counter)
      : stage.addChild(fps_counter));
  game_loaded = !0;
  socket.emit("loaded", {
    success: 1,
    width: screen.width,
    height: screen.height,
    scale: scale,
  });
}
function on_resize() {
  width = $(window).width();
  height = $(window).height();
  window.renderer &&
    (renderer.resize(width, height),
    (renderer.antialias = antialias),
    window.map && (map.last_max_y = void 0));
  $("#pagewrapped").css(
    "margin-top",
    Math.floor(($(window).height() - $("#pagewrapped").outerHeight()) / 2) +
      "px"
  );
  reposition_ui();
  position_modals();
  force_draw_on = future_s(1);
}
function resize() {
  on_resize();
}
function pause() {
  paused
    ? ((paused = !1),
      current_map != drawn_map && create_map(),
      $("#pausedui").hide())
    : ((paused = !0), $("#pausedui").show());
}
function draw(a, b) {
  if (!manual_stop) {
    draws++;
    in_draw = !0;
    window.last_draw && (frame_ms = mssince(last_draw));
    last_draw = new Date();
    start_timer("draw");
    draw_timeouts_logic(2);
    stop_timer("draw", "timeouts");
    calculate_fps();
    var c = (a = frame_ms);
    clean_house && (draw_entities(), (c = 0));
    process_entities();
    future_entities = { players: {}, monsters: {} };
    stop_timer("draw", "entities");
    gtest && character && ((map.real_x -= 0.1), (map.real_y -= 0.001));
    for (
      a > ((is_sdk && 200) || 1e4) && console.log("cframe_ms is " + a);
      0 < a;

    )
      character &&
        character.moving &&
        ((d = !0),
        character.vx && (character.real_x += (character.vx * min(a, 50)) / 1e3),
        character.vy && (character.real_y += (character.vy * min(a, 50)) / 1e3),
        set_direction(character),
        stop_logic(character)),
        (a -= 50);
    for (; 0 < c; ) {
      var d = !1,
        e;
      for (e in entities)
        (entity = entities[e]) &&
          !entity.dead &&
          entity.moving &&
          ((d = !0),
          (entity.real_x += (entity.vx * min(c, 50)) / 1e3),
          (entity.real_y += (entity.vy * min(c, 50)) / 1e3),
          set_direction(entity),
          stop_logic(entity));
      c -= 50;
      if (!d) break;
    }
    window.ftile &&
      character &&
      ((ftile.x = character.real_x),
      (ftile2.y = ftile3.y = ftile.y = character.real_y),
      (ftile2.x = ftile.x - 500),
      (ftile3.x = ftile.x + 500));
    stop_timer("draw", "movements");
    position_map();
    ui_logic();
    call_code_function("on_draw");
    retile_the_map();
    stop_timer("draw", "retile");
    update_overlays();
    character &&
      character.q.exchange &&
      "exchange" == topleft_npc &&
      exchange_animation_logic();
    character && character.q.compound && compound_animation_logic();
    character && character.q.upgrade && upgrade_animation_logic();
    stop_timer("draw", "uis");
    tint_logic();
    draw_timeouts_logic();
    stop_timer("draw", "timeouts");
    draw_entities();
    stop_timer("draw", "draw_entities");
    character && update_sprite(character);
    map_npcs.forEach(function (a) {
      update_sprite(a);
    });
    for (var f in chests) chests[f].openning && update_sprite(chests[f]);
    for (f in map_animations) update_sprite(map_animations[f]);
    stop_timer("draw", "sprites");
    stop_timer("draw", "before_render");
    if (force_draw_on || (!b && !is_hidden() && !paused))
      renderer.render(stage), (force_draw_on = !1);
    current_status != last_status &&
      ($("#status").html(current_status), (last_status = current_status));
    stop_timer("draw", "after_render");
    if (!(b || (no_html && "bot" != no_html))) {
      no_graphics ? setTimeout(draw, 16) : requestAnimationFrame(draw);
      try {
        var g = get_active_characters(),
          h;
        for (h in g)
          "self" != g[h] &&
            "loading" != g[h] &&
            character_window_eval(h, "draw()");
      } catch (l) {
        console.log(l);
      }
    }
    in_draw = !1;
  }
}
