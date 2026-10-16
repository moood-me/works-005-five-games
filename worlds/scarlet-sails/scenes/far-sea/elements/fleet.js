// the chapter on the sea and the fleet of its choices. No map: the title shows through one great sail in the middle of
// the sea, like through cloth. A map: the chapter's heading in the sky and the rows on the water — a group of sails to
// a row, a sail to an option: the chosen one filled with wind, scarlet and glowing; the missed one a white outline,
// slack; the one never reached a barely seen speck, without its words. The question of a row over its group, the
// words of a sail under it, dark blue on the light water (a whole play, more than three rows: the sails alone, one
// word under each group — lib.js). Painted whole, once a map (it does not read `reveal`):
// the base — the glow round what shines (its shader's emission); layer 1 — the sails and their hulls; 2 — the
// words; 3 — the weave of the cloth over them. How far the mist has gone off (`reveal`) is its shader's (fleet.glsl).
var A = e.aspect;
var st = e.state;
var lib = e.lib;
var N = e.kit.sky;
var INK = lib.INK;
var measure = function (s, size, italic, bold) {
  g.font = lib.font(size, italic, bold);
  return g.measureText(s).width / 1000;
};
var L = lib.layout(A, { map: st.map, chapter_number: st.chapter_number, chapter_title: st.chapter_title }, measure);
if (!L.fits) e.warn("the fleet does not stand as it should: too many rows for the sea, or words too wide for their place");

// words in dark blue with a pale halo, so they read on the water and on the cloth
function carve(c, lines, x, y, size, alpha, italic, bold, align) {
  if (alpha <= 0.01 || !lines.length) return;
  c.save();
  c.translate(x, y);
  c.scale(0.001, 0.001);
  c.font = lib.font(size, italic, bold);
  c.textAlign = align;
  c.textBaseline = "middle";
  c.fillStyle = INK;
  c.globalAlpha = alpha;
  c.shadowColor = "rgba(244, 247, 252, 0.85)";
  c.shadowBlur = Math.max(0.002, size * 0.22); // (a painting's units: stage heights)
  for (var i = 0; i < lines.length; i++) c.fillText(lines[i], 0, i * size * 1250);
  c.restore();
}
// the hull of a boat of height h standing at x on the water line `base`, bow to the left; a ripple under it
function hull(c, x, base, h) {
  c.fillStyle = N.rgba("#ffffff", 0.4);
  c.beginPath();
  c.ellipse(x, base + 0.002 + 0.01 * h, 0.5 * h, 0.03 * h + 0.001, 0, 0, 6.283);
  c.fill();
  c.beginPath();
  c.moveTo(x - 0.35 * h, base - 0.14 * h);
  c.lineTo(x + 0.35 * h, base - 0.15 * h);
  c.quadraticCurveTo(x + 0.26 * h, base, x - 0.2 * h, base);
  c.closePath();
  c.fillStyle = "#f4f1ea";
  c.fill();
  c.strokeStyle = N.rgba(INK, 0.55);
  c.lineWidth = Math.max(0.0012, 0.012 * h);
  c.stroke();
}
function mast(c, mx, base, h) {
  c.beginPath();
  c.moveTo(mx, base - 0.14 * h);
  c.lineTo(mx, base - h);
  c.strokeStyle = N.rgba(INK, 0.6);
  c.lineWidth = Math.max(0.0012, 0.01 * h);
  c.stroke();
}
// the mainsail and the jib of a boat of height h whose mast stands at mx: full of wind, or hanging slack
function mainPath(c, mx, base, h, slack) {
  c.beginPath();
  c.moveTo(mx, base - 0.94 * h);
  c.quadraticCurveTo(mx + (slack ? 0.1 : 0.52) * h, base - 0.62 * h, mx + 0.36 * h, base - 0.22 * h);
  c.quadraticCurveTo(mx + 0.18 * h, base - (slack ? 0.12 : 0.14) * h, mx, base - 0.2 * h);
  c.closePath();
}
function jibPath(c, mx, base, h, slack) {
  c.beginPath();
  c.moveTo(mx - 0.02 * h, base - 0.88 * h);
  c.lineTo(mx - 0.02 * h, base - 0.22 * h);
  c.quadraticCurveTo(mx - 0.18 * h, base - 0.15 * h, mx - 0.3 * h, base - 0.17 * h);
  c.quadraticCurveTo(mx - (slack ? 0.1 : 0.26) * h, base - 0.62 * h, mx - 0.02 * h, base - 0.88 * h);
  c.closePath();
}
// the great sail's outline
function bigPath(c, B) {
  var mid = (B.top + B.foot) / 2;
  c.beginPath();
  c.moveTo(B.mast, B.top);
  c.quadraticCurveTo((B.mast + B.right) / 2, B.top - 0.02, B.right, B.top + 0.012);
  c.quadraticCurveTo(B.right + 0.06, mid, B.right - 0.01, B.foot);
  c.quadraticCurveTo((B.mast + B.right) / 2, B.foot + 0.045, B.mast, B.foot - 0.005);
  c.closePath();
}
// curved seams across what the clip holds, from x0 to x1, n of them between y0 and y1
function seams(c, x0, x1, y0, y1, n, sag, color, width) {
  c.strokeStyle = color;
  c.lineWidth = width;
  for (var i = 1; i <= n; i++) {
    var y = y0 + ((y1 - y0) * i) / (n + 1);
    c.beginPath();
    c.moveTo(x0, y);
    c.quadraticCurveTo((x0 + x1) / 2, y + sag, x1, y);
    c.stroke();
  }
}

var BIG = L.big;
var CHOSEN = [];
var OPEN = [];
var UNSEEN = [];
for (var ri = 0; ri < L.rows.length; ri++) {
  for (var oi = 0; oi < L.rows[ri].options.length; oi++) {
    var O = L.rows[ri].options[oi];
    (O.state === "chosen" ? CHOSEN : O.state === "open" ? OPEN : UNSEEN).push(O);
  }
}

// 1 — the sails and their hulls
e.layer("sails", {}, function (c) {
  if (BIG) {
    var cloth = c.createLinearGradient(BIG.mast, 0, BIG.right, 0);
    cloth.addColorStop(0, "#e9e0cf");
    cloth.addColorStop(0.5, "#fbf6ea");
    cloth.addColorStop(1, "#efe6d4");
    bigPath(c, BIG);
    c.fillStyle = cloth;
    c.fill();
    c.strokeStyle = N.rgba(INK, 0.35);
    c.lineWidth = 0.003;
    c.stroke();
    c.fillStyle = "#5d5a55";
    c.fillRect(BIG.mast - 0.004, BIG.top - 0.02, 0.008, BIG.base - BIG.top + 0.02);
    hull(c, L.textX - 0.01, BIG.base, 0.6);
  }
  for (var i = 0; i < OPEN.length; i++) {
    var P = OPEN[i];
    var mx = P.x - 0.02 * P.h;
    var lw = Math.max(0.002, 0.016 * P.h);
    hull(c, P.x, P.base, P.h);
    mast(c, mx, P.base, P.h);
    for (var s = 0; s < 2; s++) {
      (s ? jibPath : mainPath)(c, mx, P.base, P.h, true);
      c.fillStyle = "rgba(255, 255, 255, 0.16)";
      c.fill();
      c.lineJoin = "round";
      c.strokeStyle = N.rgba(INK, 0.35);
      c.lineWidth = 1.6 * lw;
      c.stroke();
      c.strokeStyle = "rgba(255, 255, 255, 0.95)";
      c.lineWidth = lw;
      c.stroke();
    }
  }
  for (var j = 0; j < CHOSEN.length; j++) {
    var C = CHOSEN[j];
    var cx = C.x - 0.02 * C.h;
    var body = c.createLinearGradient(cx - 0.3 * C.h, 0, cx + 0.5 * C.h, 0);
    body.addColorStop(0, N.SCARLET_DEEP);
    body.addColorStop(0.45, N.SCARLET);
    body.addColorStop(0.9, N.SCARLET_LIGHT);
    hull(c, C.x, C.base, C.h);
    mast(c, cx, C.base, C.h);
    for (var t = 0; t < 2; t++) {
      (t ? jibPath : mainPath)(c, cx, C.base, C.h, false);
      c.fillStyle = body;
      c.fill();
      c.strokeStyle = N.rgba(N.SCARLET_DEEP, 0.8);
      c.lineWidth = Math.max(0.0012, 0.008 * C.h);
      c.stroke();
    }
  }
  // what was never reached: a speck on the water
  for (var u = 0; u < UNSEEN.length; u++) {
    var Q = UNSEEN[u];
    c.beginPath();
    c.arc(Q.x, Q.base, 0.0045, 0, 6.283);
    c.fillStyle = "rgba(255, 255, 255, 0.55)";
    c.fill();
    c.strokeStyle = N.rgba(INK, 0.25);
    c.lineWidth = 0.0012;
    c.stroke();
  }
});

// 2 — the words
e.layer("words", {}, function (c) {
  if (BIG) {
    if (L.number) carve(c, [L.number], L.textX, L.numberY, L.numberSize, 0.9, false, false, "center");
    carve(c, L.title.lines, L.textX, L.titleY, L.title.size, 0.92, true, false, "center");
  }
  if (L.map) {
    if (L.number) carve(c, [L.number], L.numberX, L.headY, L.numberSize, 0.9, false, false, "left");
    if (L.heading) carve(c, [L.heading], L.titleX, L.headY, L.titleSize, 1, true, false, "left");
  }
  for (var i = 0; i < L.rows.length; i++) {
    var R = L.rows[i];
    carve(c, R.title.lines, R.x, R.ty, R.title.size, R.seen ? (R.weight === "⚑" ? 1 : 0.8) : 0.45, true, false, "center");
    for (var j = 0; j < R.options.length; j++) {
      var P = R.options[j];
      if (P.state === "chosen") carve(c, P.label.lines, P.x, P.ly, P.label.size, 1, true, true, "center");
      else if (P.state === "open") carve(c, P.label.lines, P.x, P.ly, P.label.size, 0.85, true, false, "center");
    }
  }
});

// 3 — the weave of the cloth over the words: the seams of the scarlet sails, and over the great sail a pale veil the
// title shows through
e.layer("weave", {}, function (c) {
  for (var j = 0; j < CHOSEN.length; j++) {
    var C = CHOSEN[j];
    var cx = C.x - 0.02 * C.h;
    c.save();
    mainPath(c, cx, C.base, C.h, false);
    c.clip();
    seams(c, cx, cx + 0.6 * C.h, C.base - 0.94 * C.h, C.base - 0.2 * C.h, 3, 0.03 * C.h, N.rgba(N.SCARLET_DEEP, 0.4), Math.max(0.001, 0.006 * C.h));
    c.restore();
  }
  if (BIG) {
    c.save();
    bigPath(c, BIG);
    c.clip();
    c.fillStyle = "rgba(255, 248, 235, 0.22)";
    c.fillRect(BIG.mast, BIG.top - 0.03, BIG.right - BIG.mast + 0.07, BIG.foot - BIG.top + 0.08);
    seams(c, BIG.mast, BIG.right + 0.05, BIG.top, BIG.foot, 7, 0.012, N.rgba(INK, 0.1), 0.0015);
    c.restore();
  }
});

// the base: the glow round the sails that shine
for (var k = 0; k < CHOSEN.length; k++) N.glow(g, CHOSEN[k].x + 0.2 * CHOSEN[k].h, CHOSEN[k].base - 0.55 * CHOSEN[k].h, CHOSEN[k].h, 1, "#ff7a55", 0.4);
if (BIG) N.glow(g, L.textX, (BIG.top + BIG.foot) / 2, 0.5, 1.1, "#ffe9c4", 0.35);
