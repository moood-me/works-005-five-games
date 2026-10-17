// The strip of film in the dark, lit from behind by the projector's lamp. No map: the chapter's title in one big frame
// in the middle. A map: the chapter's heading at the top and the rows as frames — each cut into parts by its options:
// the chosen one glowing warm (the lamp through the film), its words dark on it; the one passed over dark, its words
// barely seen; the one never reached black, without a word. ⚑ big frames, ~ small. Painted whole, once a map (it does
// not read `reveal`): the base — nothing (the lit parts of the frames are light: film.wgsl); layer 1 — the strips
// themselves, every frame unexposed; 2 — what the frames show and the words; 3 — when each frame comes up (grey: its
// order 0…1; never shown). How the strip slides into the light and the frames come up — the shader (film.wgsl).
var A = e.aspect;
var st = e.state;
var lib = e.lib;
var measure = function (s, size, italic, bold) {
  g.font = lib.font(size, italic, bold);
  return g.measureText(s).width / 1000;
};
var L = lib.layout(A, { map: st.map, chapter_number: st.chapter_number, chapter_title: st.chapter_title }, measure);
if (!L.fits) e.warn("Плёнка: words wider than their place, or a frame shows only its chosen option (too narrow for all)");

var INK_DARK = "#24170c"; // words on the lit film
var INK_PALE = "#efe8da"; // words in the dark: the white of old film
function carve(c, lines, x, y, size, color, alpha, italic, bold, align) {
  if (alpha <= 0.01 || !lines.length) return;
  c.save();
  c.translate(x, y);
  c.scale(0.001, 0.001);
  c.font = lib.font(size, italic, bold);
  c.textAlign = align;
  c.textBaseline = "middle";
  c.fillStyle = color;
  c.globalAlpha = alpha;
  for (var i = 0; i < lines.length; i++) c.fillText(lines[i], 0, i * size * 1200);
  c.restore();
}
// a part of a frame lit from behind: warm in its middle, deeper at its edges
function lit(c, x0, y0, w, h) {
  var gr = c.createRadialGradient(x0 + w / 2, y0 + h / 2, 0, x0 + w / 2, y0 + h / 2, Math.max(w, h) * 0.75);
  gr.addColorStop(0, "#fbe6b8");
  gr.addColorStop(0.6, "#efc684");
  gr.addColorStop(1, "#c98e48");
  c.fillStyle = gr;
  c.fillRect(x0, y0, w, h);
}

// 1 — the strips: the film's base running past both edges, its perforation lit by the lamp behind, frames unexposed
e.layer("strips", {}, function (c) {
  for (var i = 0; i < L.strips.length; i++) {
    var S = L.strips[i];
    var fh = S.h;
    var band = fh * 1.24;
    var y0 = S.y - band / 2;
    c.fillStyle = "#1d150e";
    c.fillRect(-0.4, y0, A + 0.8, band);
    // the perforation: small rounded holes along both edges, the lamp's light through them
    var step = fh * 0.12;
    c.fillStyle = "#6b5236";
    for (var x = -0.4; x < A + 0.4; x += step) {
      c.fillRect(x, y0 + fh * 0.025, step * 0.5, fh * 0.06);
      c.fillRect(x, y0 + band - fh * 0.085, step * 0.5, fh * 0.06);
    }
    // the unexposed frames: where the frames of the map stand, and on past them both ways, spaced alike
    var on = L.big ? [L.big] : L.frames.filter(function (F) { return Math.abs(F.y + F.h / 2 - S.y) < 0.01; });
    if (!on.length) continue;
    var first = on[0], last = on[on.length - 1];
    c.fillStyle = "#120d09";
    for (var fx = first.x - first.w - 0.035; fx > -0.4 - first.w; fx -= first.w + 0.035) c.fillRect(fx, S.y - fh / 2, first.w, fh);
    for (var gx = last.x + last.w + 0.035; gx < A + 0.4; gx += last.w + 0.035) c.fillRect(gx, S.y - fh / 2, last.w, fh);
  }
  if (L.big) {
    c.fillStyle = "#120d09";
    c.fillRect(L.big.x, L.big.y, L.big.w, L.big.h);
  }
  for (var f = 0; f < L.frames.length; f++) {
    var F = L.frames[f];
    c.fillStyle = "#120d09";
    c.fillRect(F.x, F.y, F.w, F.h);
  }
});

// 2 — what the frames show, and the words
e.layer("frames", {}, function (c) {
  if (L.big) {
    var B = L.big;
    lit(c, B.x, B.y, B.w, B.h);
    if (L.number) carve(c, [L.number], A / 2, L.numberY, L.numberSize, INK_DARK, 0.85, false, false, "center");
    carve(c, L.title.lines, A / 2, L.titleY, L.title.size, INK_DARK, 0.95, true, false, "center");
  }
  if (L.map) {
    if (L.number) carve(c, [L.number], L.numberX, L.headY, L.numberSize, INK_PALE, 0.85, false, false, "left");
    if (L.heading) carve(c, [L.heading], L.titleX, L.headY, L.titleSize, INK_PALE, 1, true, false, "left");
  }
  for (var f = 0; f < L.frames.length; f++) {
    var F = L.frames[f];
    var seen = F.parts.some(function (p) { return p.state !== "unseen"; });
    carve(c, F.question.lines, F.x + F.w / 2, F.qy, F.question.size, INK_PALE, seen ? (F.weight === "⚑" ? 0.9 : 0.72) : 0.4, true, false, "center");
    for (var p = 0; p < F.parts.length; p++) {
      var P = F.parts[p];
      var w = P.x1 - P.x0;
      var h = P.y1 - P.y0;
      if (P.state === "chosen") lit(c, P.x0, P.y0, w, h);
      else {
        c.fillStyle = P.state === "open" ? "#2c241c" : "#0b0907";
        c.fillRect(P.x0, P.y0, w, h);
      }
      var mid = P.y0 + h / 2 - ((P.label.lines.length - 1) * P.label.size * 1.2) / 2;
      if (P.state === "chosen") carve(c, P.label.lines, (P.x0 + P.x1) / 2, mid, P.label.size, INK_DARK, 1, true, true, "center");
      else if (P.state === "open") carve(c, P.label.lines, (P.x0 + P.x1) / 2, mid, P.label.size, "#cdb995", 0.42, true, false, "center");
      // the cut between the parts: beside the one before, or over the band along the foot
      c.fillStyle = "#070504";
      if (p && P.y0 > F.y + 1e-6) c.fillRect(P.x0, P.y0 - 0.002, w, 0.004);
      if (p && P.x0 > F.x + 1e-6) c.fillRect(P.x0 - 0.002, P.y0, 0.004, h);
    }
    // the frame's own edge
    c.strokeStyle = "rgba(10,7,5,0.9)";
    c.lineWidth = 0.004;
    c.strokeRect(F.x, F.y, F.w, F.h);
  }
});

// 3 — when each frame comes up: its order as grey (over its question too); the big frame and the heading first
e.layer("order", {}, function (c) {
  var grey = function (o) {
    var v = Math.round(clampU(o) * 255);
    return "rgb(" + v + "," + v + "," + v + ")";
  };
  if (L.big) {
    c.fillStyle = grey(0);
    c.fillRect(L.big.x - 0.02, L.big.y - 0.02, L.big.w + 0.04, L.big.h + 0.04);
  }
  for (var f = 0; f < L.frames.length; f++) {
    var F = L.frames[f];
    // (its own question and its own frame only: the next strip's questions are not uncovered by it)
    var top = Math.min(F.y, F.qy - F.question.size * 0.65);
    c.fillStyle = grey(F.order);
    c.fillRect(F.x - 0.017, top, F.w + 0.034, F.y + F.h - top + 0.004);
  }
});
function clampU(v) {
  return Math.max(0, Math.min(1, v));
}

// the base: nothing — what shines is the lit film itself (film.wgsl: the frames' warm parts as light)
