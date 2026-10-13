// Where everything stands on the sea for a state: the chapter's number and title (on one great sail, or over a map),
// the rows of the map — each a group of sails on the water, its question over it, each sail's words under it (the
// map of a whole play, more than three rows: the sails alone, one word under each group) — and how far the morning
// mist has gone off the sea. In stage heights, as the sky elements paint. measure(text, size,
// italic, bold) → its width.
//   Sizes are shares of the frame's height, the same on every screen (a painting is drawn sharp at any size): the
// smallest words 0.05 of it — 18 px on a phone held sideways.
var clamp = anim.clamp;
var smooth = anim.ease.smooth;
var FONT = 'Georgia, "Times New Roman", serif';
var INK = "#14233f"; // dark blue: the words on the light water

// where the sea begins (the scene's "horizon") and the sun stands on it
var HORIZON = 0.22;
var sunX = function (A) {
  return A * 0.62;
};
// the mist's edge: how far down the frame it has gone off the sea for `reveal` 0…1 (stage heights) — sea.glsl and
// fleet.glsl take it from here (their uniform `front`); it ends past the frame's foot
var FRONT = [0.02, 1.15];
function front(reveal) {
  return FRONT[0] + (FRONT[1] - FRONT[0]) * smooth(clamp(reveal, 0, 1));
}

// a sail's whole height (water to the mast's top), by the weight of its row
var SAIL = { "⚑": 0.16, "~": 0.09 };
var TEXT = 0.05;
var MOST_ROWS = 6;

function font(size, italic, bold) {
  return (bold ? "bold " : "") + (italic ? "italic " : "") + Math.round(size * 1000) + "px " + FONT;
}

// words into lines no wider than w, at most `most` of them — smaller if they must be (down to `least` of the size;
// 1: never smaller) → {lines, size, fits: whether they did}; at the least, cut short with «…»
function wrap(text, w, size, italic, measure, most, least, bold) {
  var words = String(text).split(/\s+/).filter(Boolean);
  for (var k = 1; ; k -= 0.05) {
    var s = size * k;
    var lines = [];
    var line = "";
    var wide = 0;
    for (var i = 0; i < words.length; i++) {
      var next = line ? line + " " + words[i] : words[i];
      if (line && measure(next, s, italic, bold) > w) {
        lines.push(line);
        line = words[i];
      } else line = next;
    }
    if (line) lines.push(line);
    for (var l = 0; l < lines.length; l++) wide = Math.max(wide, measure(lines[l], s, italic, bold));
    if (lines.length <= most && wide <= w) return { lines: lines, size: s, fits: true };
    if (k <= least + 1e-6) {
      var fits = wide <= w && lines.length <= most;
      if (lines.length > most) {
        lines = lines.slice(0, most);
        lines[most - 1] += "…";
      }
      return { lines: lines, size: s, fits: fits };
    }
  }
}
// how tall lines of words are
var tall = function (t) {
  return t.lines.length ? t.size * (1 + 1.25 * (t.lines.length - 1)) : 0;
};

// The state → L:
//   L.big — no map and a title: the one great sail {mast, right, top, foot, base} the title shows through, with the
//     number (L.numberY, L.numberSize) and the title's lines (L.title, L.titleY) centred on L.textX;
//   L.map — a map: the heading on one line below the site's header (L.number, L.heading; L.headY; L.numberX, L.titleX,
//     their left edges), and L.rows
//     [{x, title (wrapped; its first line's middle at L.rows[i].ty), weight, seen, options: [{x, base (the water
//     line), h (the sail's height; 0 for a sail not seen), state, label (wrapped; its first line's middle at ly)}]}];
//     more than three rows (a whole play): no question over a row and no words under a sail — the title is the first
//     word of the row's own (the chapter's number, «Финал»), under the group;
//   L.fits — whether everything stood as wanted (rows too many for the sea, words too wide for their place: false).
// Nothing at all (no number, no title, no map): the sea and the yacht alone.
function layout(A, st, measure) {
  var rows = Array.isArray(st.map) && st.map.length ? st.map.slice(0, MOST_ROWS) : null;
  var number = String(st.chapter_number || "");
  var title = String(st.chapter_title || "");
  var cx = A / 2;
  var L = { map: !!rows, big: null, rows: [], fits: true, number: number, textX: cx };
  if (!rows) {
    if (!number && !title) return L;
    var half = 0.25;
    L.big = { mast: cx - half, right: cx + half, top: 0.17, foot: 0.7, base: 0.76 };
    L.numberSize = 0.07;
    L.title = wrap(title, 2 * half - 0.14, 0.085, true, measure, 3, 1);
    L.fits = L.title.fits;
    L.textX = cx + 0.01; // the belly of the cloth carries the middle a little to the right
    var gap = number && title ? 0.03 : 0;
    var block = (number ? L.numberSize : 0) + gap + tall(L.title);
    var top = (L.big.top + L.big.foot) / 2 - block / 2;
    L.numberY = top + L.numberSize / 2;
    L.titleY = top + (number ? L.numberSize + gap : 0) + L.title.size / 2;
    return L;
  }
  // the heading: the number beside the title, on one line
  L.numberSize = 0.06;
  L.titleSize = 0.075;
  L.headY = 0.11;
  var nw = measure(number, L.numberSize, false, false);
  var tw = measure(title, L.titleSize, true, false);
  var side = (nw + (nw && tw ? 0.03 : 0) + tw) / 2;
  L.heading = title;
  L.numberX = cx - side;
  L.titleX = cx + side - tw;
  // the stage is 16:9; the narrowest screen (4:3, a phone held upright) sees only its middle
  var XL = (A - 4 / 3) / 2 + 0.03;
  var XR = A - XL;
  var HEAD = HORIZON + 0.03; // the rows begin on the water below the horizon
  var FLOOR = 0.83; // and end above the yacht
  var PAD = 0.012;
  // the rows into lines of the sea: up to three go one to a line; more, two to a line, each its share of the width by
  // the number of its sails — and bare: the sails with one word under the group, or they would not fit
  var bare = rows.length > 3;
  var cols = bare ? 2 : 1;
  var lines = [];
  for (var k = 0; k < rows.length; k++) {
    var row = rows[k] || {};
    if (k % cols === 0) lines.push([]);
    lines[lines.length - 1].push({ row: row, opts: Array.isArray(row.options) ? row.options : [] });
  }
  // the lines at a size (s: of the sails' full one) → each line's rows, their words measured, and its height
  var lay = function (s) {
    var out = [];
    for (var li = 0; li < lines.length; li++) {
      var line = lines[li];
      var sails = 0;
      for (var si = 0; si < line.length; si++) sails += Math.max(1, line[si].opts.length);
      var x0 = XL;
      var ln = { rows: [], q: 0, h: 0, words: 0 };
      for (var ci = 0; ci < line.length; ci++) {
        var src = line[ci];
        var m = Math.max(1, src.opts.length);
        var width = ((XR - XL) * m) / sails;
        var cell = Math.min((width - 0.04) / m, 0.6);
        var weight = src.row.weight === "⚑" ? "⚑" : "~";
        var R = {
          x: x0 + width / 2,
          title: bare
            ? wrap(String(src.row.title || "").split(/\s+/)[0].replace(/[.:,]+$/, ""), width - 0.04, TEXT, true, measure, 1, 1)
            : wrap(src.row.title || "", width - 0.04, TEXT, true, measure, 2, 1),
          weight: weight,
          seen: src.opts.some(function (o) {
            return o && o.state !== "unseen";
          }),
          options: [],
        };
        for (var j = 0; j < src.opts.length; j++) {
          var o = src.opts[j] || {};
          var state = o.state === "chosen" || o.state === "open" ? o.state : "unseen";
          var O = {
            x: R.x + (j - (m - 1) / 2) * cell,
            h: state === "unseen" ? 0 : SAIL[weight] * s,
            state: state,
            label: bare || state === "unseen" ? { lines: [], size: TEXT, fits: true } : wrap(o.label || "", cell - 0.02, TEXT, true, measure, 2, 1, state === "chosen"),
          };
          R.options.push(O);
          ln.words = Math.max(ln.words, tall(O.label));
        }
        if (bare) ln.words = Math.max(ln.words, tall(R.title));
        else ln.q = Math.max(ln.q, tall(R.title));
        ln.h = Math.max(ln.h, SAIL[weight] * s);
        ln.rows.push(R);
        x0 += width;
      }
      ln.height = ln.q + (ln.q ? 0.012 : 0) + ln.h + 0.014 + ln.words;
      out.push(ln);
    }
    return out;
  };
  var out;
  var need;
  for (var s = 1; ; s -= 0.05) {
    out = lay(s);
    need = PAD * (lines.length - 1);
    for (var q = 0; q < out.length; q++) need += out[q].height;
    if (need <= FLOOR - HEAD || s <= 0.3 + 1e-6) break;
  }
  if (need > FLOOR - HEAD) L.fits = false;
  // room to spare: the lines further apart (not too far), the whole a little high of the middle
  var spare = Math.max(0, FLOOR - HEAD - need);
  var more = Math.min(0.05, spare / (lines.length + 1));
  var y = HEAD + Math.max(0, spare - more * (lines.length - 1)) * 0.3;
  for (var li2 = 0; li2 < out.length; li2++) {
    var ln2 = out[li2];
    var base = y + ln2.q + (ln2.q ? 0.012 : 0) + ln2.h;
    for (var ri = 0; ri < ln2.rows.length; ri++) {
      var R2 = ln2.rows[ri];
      R2.ty = bare ? base + 0.014 + R2.title.size / 2 : y + R2.title.size / 2;
      if (!R2.title.fits) L.fits = false;
      for (var oi = 0; oi < R2.options.length; oi++) {
        var O2 = R2.options[oi];
        O2.base = base;
        O2.ly = base + 0.014 + O2.label.size / 2;
        if (!O2.label.fits) L.fits = false;
      }
      L.rows.push(R2);
    }
    y += ln2.height + PAD + more;
  }
  return L;
}

return { layout: layout, font: font, front: front, sunX: sunX, HORIZON: HORIZON, INK: INK };
