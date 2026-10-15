// Where everything stands on the strip of film for a state: the chapter's title in one big frame; or the map — the
// heading at the top and the rows of the map as frames on one, two or three strips (a row — a frame cut into parts by
// its options; its question over it); the whole play — three strips 4 + 3 + 3. In stage heights, as the sky elements
// paint. measure(text, size, italic, bold) → its width. Sizes are shares of the frame's height, the same on every
// screen; the smallest words 0.045 of it.
var clamp = anim.clamp;
var FONT = '"Cormorant Garamond", "Cormorant", Georgia, "Times New Roman", serif';
var TEXT = 0.045; // the smallest words
var GAP = 0.035; // between frames on a strip
var ASPECT = 4 / 3; // a frame of film
var WIDEST = 2.4; // a frame drawn wider where its strip has room (the words of its parts need it)
var BIGH = { "⚑": 0.3, "~": 0.2 }; // a frame's height at its full size, by the weight of its row
var PAD = 0.016; // words inside a frame's part keep off its edges

function font(size, italic, bold) {
  return (bold ? "bold " : "") + (italic ? "italic " : "") + Math.round(size * 1000) + "px " + FONT;
}
// the stage's middle 4:3 — all that matters is within it (a little in from its edges)
function band(A) {
  return { XL: A / 2 - 2 / 3 + 0.03, XR: A / 2 + 2 / 3 - 0.03 };
}
// the projector's lamp: low right in the middle 4:3
function lampAt(A) {
  return { x: A / 2 + 2 / 3 - 0.16, y: 0.86 };
}

// words into lines no wider than w, at most `most` of them, at `size` (never smaller) → {lines, size, fits}
function wrap(text, w, size, italic, measure, most, bold) {
  var words = String(text || "").split(/\s+/).filter(Boolean);
  var lines = [];
  var line = "";
  var fits = true;
  for (var i = 0; i < words.length; i++) {
    var next = line ? line + " " + words[i] : words[i];
    if (line && measure(next, size, italic, bold) > w) {
      lines.push(line);
      line = words[i];
    } else line = next;
  }
  if (line) lines.push(line);
  for (var l = 0; l < lines.length; l++) if (measure(lines[l], size, italic, bold) > w + 1e-6) fits = false;
  if (lines.length > most) {
    fits = false;
    lines = lines.slice(0, most);
    lines[most - 1] += "…";
  }
  return { lines: lines, size: size, fits: fits };
}
var tall = function (t) {
  return t.lines.length ? t.size * (1 + 1.2 * (t.lines.length - 1)) : 0;
};

// the rows of a map cut into strips: up to five — one strip, else two; more than five (a whole play) — three
function arrangements(n) {
  if (n > 5) {
    var a = Math.ceil(n / 3);
    var b = Math.ceil((n - a) / 2);
    return [[a, b, n - a - b]];
  }
  var out = [[n]];
  if (n >= 3) out.push([Math.ceil(n / 2), Math.floor(n / 2)]);
  return out;
}

// A frame's parts: each option its share of the width, its words inside it — or, if the words of a part don't fit it
// at the smallest size, the frame shows the chosen option alone over most of it (its words across the whole frame) and
// the others as a dark band along its foot (collapsed) → {parts: [{x0, x1, y0, y1, state, label}], collapsed}
function partsOf(row, x, y, w, h, measure) {
  var opts = Array.isArray(row.options) ? row.options : [];
  var m = Math.max(1, opts.length);
  var state = function (o) {
    return o && (o.state === "chosen" || o.state === "open") ? o.state : "unseen";
  };
  var most = function (hh) {
    return Math.max(1, Math.floor((hh - 2 * PAD + 0.2 * TEXT) / (TEXT * 1.2)));
  };
  var none = { lines: [], size: TEXT, fits: true };
  var even = [];
  var ok = true;
  for (var i = 0; i < m; i++) {
    var o = opts[i] || {};
    var x0 = x + (w * i) / m;
    var x1 = x + (w * (i + 1)) / m;
    var st = state(o);
    var label = st === "unseen" ? none : wrap(o.label, x1 - x0 - 2 * PAD, TEXT, true, measure, most(h), st === "chosen");
    if (!label.fits) ok = false;
    even.push({ x0: x0, x1: x1, y0: y, y1: y + h, state: st, label: label });
  }
  if (ok || m < 2) return { parts: even, collapsed: false };
  var chosen = -1;
  for (var j = 0; j < m; j++) if (state(opts[j]) === "chosen") chosen = j;
  if (chosen < 0) {
    // nothing chosen in the row (its step skipped): the parts bare
    for (var k = 0; k < even.length; k++) even[k].label = none;
    return { parts: even, collapsed: true };
  }
  var top = h * 0.76;
  var parts = [{ x0: x, x1: x + w, y0: y, y1: y + top, state: "chosen", label: wrap(opts[chosen].label, w - 2 * PAD, TEXT, true, measure, most(top), true) }];
  var rest = [];
  for (var q = 0; q < m; q++) if (q !== chosen) rest.push(state(opts[q]));
  for (var r = 0; r < rest.length; r++) {
    parts.push({ x0: x + (w * r) / rest.length, x1: x + (w * (r + 1)) / rest.length, y0: y + top, y1: y + h, state: rest[r], label: none });
  }
  return { parts: parts, collapsed: true };
}

// The state → L:
//   L.big — no map and a title: the one big frame {x, y, w, h} (its middle at the stage's), the number (L.numberY,
//     L.numberSize) and the title's lines (L.title, L.titleY) over its middle;
//   L.map — the heading (L.number, L.heading, L.headY, L.numberX, L.titleX, their left edges; none for a whole play
//     without a number), L.strips [{y (the frames' middle), h}] and L.frames [{x, y, w, h, weight, question (wrapped;
//     its first line's middle at qy), parts, collapsed, order (0…1: when it develops)}];
//   L.fits — whether everything stood as wanted.
// Nothing at all: the lamp alone.
function layout(A, st, measure) {
  var rows = Array.isArray(st.map) && st.map.length ? st.map : null;
  var number = String(st.chapter_number || "");
  var title = String(st.chapter_title || "");
  var cx = A / 2;
  var B = band(A);
  var L = { map: !!rows, big: null, frames: [], strips: [], fits: true, number: number };
  if (!rows) {
    if (!number && !title) return L;
    var bh = 0.46;
    var bw = bh * ASPECT;
    L.big = { x: cx - bw / 2, y: 0.45 - bh / 2, w: bw, h: bh, order: 0 };
    L.strips.push({ y: 0.45, h: bh });
    L.numberSize = 0.07;
    L.title = wrap(title, bw - 0.12, 0.085, true, measure, 3);
    if (!L.title.fits) L.title = wrap(title, bw - 0.12, 0.06, true, measure, 3);
    L.fits = L.title.fits;
    var gap = number && title ? 0.025 : 0;
    var block = (number ? L.numberSize : 0) + gap + tall(L.title);
    var top = 0.45 - block / 2;
    L.numberY = top + L.numberSize / 2;
    L.titleY = top + (number ? L.numberSize + gap : 0) + L.title.size / 2;
    return L;
  }
  // the heading: the number beside the title, one line under the site's header
  var whole = rows.length > 5;
  L.numberSize = 0.055;
  L.titleSize = 0.065;
  L.headY = 0.095;
  var nw = number ? measure(number, L.numberSize, false, false) : 0;
  var tw = title ? measure(title, L.titleSize, true, false) : 0;
  var side = (nw + (nw && tw ? 0.025 : 0) + tw) / 2;
  L.heading = title;
  L.numberX = cx - side;
  L.titleX = cx + side - tw;
  var TOP = 0.16;
  var FLOOR = whole ? 0.93 : 0.8; // a chapter's map stays clear of the lamp; the whole play goes lower (its last
  // strip is shorter and leaves the lamp's corner free)
  var best = null;
  var arr = arrangements(rows.length);
  for (var ai = 0; ai < arr.length; ai++) {
    var sizes = arr[ai];
    // the largest scale (of BIGH) at which the strips fit the width and the height
    var s = 1;
    var built;
    for (; s > 0.2; s -= 0.025) {
      built = build(sizes, s);
      if (built.width <= B.XR - B.XL + 1e-6 && built.height <= FLOOR - TOP + 1e-6) break;
    }
    built.scale = s;
    var collapsed = 0;
    for (var fi = 0; fi < built.frames.length; fi++) if (built.frames[fi].collapsed) collapsed++;
    built.collapsed = collapsed;
    if (!best || collapsed < best.collapsed || (collapsed === best.collapsed && s > best.scale + 1e-6)) best = built;
  }
  // build the strips of the given sizes at scale s (frames laid out, words measured) → {frames, strips, width, height}:
  // a frame is as tall as its weight says at s and as wide as 4:3 — wider (up to WIDEST) where its strip has room
  function build(sizes, s) {
    var frames = [];
    var strips = [];
    var width = 0;
    var height = 0;
    var k = 0;
    var lines = [];
    for (var li = 0; li < sizes.length; li++) {
      var ln = { rows: [], w: 0, h: 0, q: 0 };
      for (var j = 0; j < sizes[li]; j++, k++) {
        var row = rows[k] || {};
        var weight = row.weight === "~" ? "~" : "⚑";
        var h = BIGH[weight] * s;
        ln.rows.push({ row: row, weight: weight, w: h * ASPECT, h: h });
        ln.w += h * ASPECT + (j ? GAP : 0);
        ln.h = Math.max(ln.h, h);
      }
      // room to spare on the strip: the frames wider, alike, up to WIDEST (a whole play's last strip stops short of
      // the lamp's corner)
      ln.last = whole && li === sizes.length - 1;
      ln.room = ln.last ? lampAt(A).x - 0.17 - B.XL : B.XR - B.XL;
      var spare = ln.room - ln.w;
      if (spare > 0) {
        var base = 0;
        for (var r0 = 0; r0 < ln.rows.length; r0++) base += ln.rows[r0].w;
        var grow = Math.min(1 + spare / base, WIDEST / ASPECT);
        ln.w = 0;
        for (var r1 = 0; r1 < ln.rows.length; r1++) {
          ln.rows[r1].w *= grow;
          ln.w += ln.rows[r1].w + (r1 ? GAP : 0);
        }
      }
      for (var r = 0; r < ln.rows.length; r++) {
        var R = ln.rows[r];
        // a whole play: over each frame only its chapter's number (the first word of the row's title)
        var q = whole ? String(R.row.title || "").split(/\s+/)[0].replace(/[.:,]+$/, "") : R.row.title;
        R.question = wrap(q, R.w, TEXT, true, measure, whole ? 1 : 2);
        ln.q = Math.max(ln.q, tall(R.question));
      }
      ln.height = ln.q + 0.014 + ln.h;
      width = Math.max(width, ln.w + (ln.last ? B.XR - B.XL - ln.room : 0));
      height += ln.height + (li ? 0.03 : 0);
      lines.push(ln);
    }
    var y = TOP + Math.max(0, (FLOOR - TOP - height) * (whole ? 0.2 : 0.42));
    var n = rows.length;
    var idx = 0;
    for (var l2 = 0; l2 < lines.length; l2++) {
      var L2 = lines[l2];
      var mid = y + L2.q + 0.014 + L2.h / 2;
      strips.push({ y: mid, h: L2.h });
      var x = L2.last ? B.XL + (L2.room - L2.w) / 2 : cx - L2.w / 2;
      for (var r2 = 0; r2 < L2.rows.length; r2++, idx++) {
        var R2 = L2.rows[r2];
        var fy = mid - R2.h / 2;
        var P = partsOf(R2.row, x, fy, R2.w, R2.h, measure);
        frames.push({
          x: x, y: fy, w: R2.w, h: R2.h, weight: R2.weight, question: R2.question,
          qy: fy - 0.014 - tall(R2.question) + R2.question.size / 2,
          parts: P.parts, collapsed: P.collapsed, order: n > 1 ? (0.85 * idx) / (n - 1) : 0,
        });
        x += R2.w + GAP;
      }
      y += L2.height + 0.03;
    }
    return { frames: frames, strips: strips, width: width, height: height };
  }
  L.frames = best.frames;
  L.strips = best.strips;
  L.collapsed = best.collapsed;
  for (var f = 0; f < L.frames.length; f++) {
    if (!L.frames[f].question.fits) L.fits = false;
    for (var pi = 0; pi < L.frames[f].parts.length; pi++) if (!L.frames[f].parts[pi].label.fits) L.fits = false;
  }
  return L;
}

// how far the strip has come into the light and how far its frames have developed, for `reveal` 0…1 — the film's
// shader takes them as its uniforms: the first 0.3 of it the strip slides in from the right, the rest the frames come
// up one by one in their order
function slide(reveal) {
  return 1 - anim.ease.smooth(clamp(reveal / 0.3, 0, 1));
}
function develop(reveal) {
  return clamp((reveal - 0.3) / 0.7, 0, 1);
}

return { layout: layout, font: font, band: band, lampAt: lampAt, slide: slide, develop: develop, TEXT: TEXT };
