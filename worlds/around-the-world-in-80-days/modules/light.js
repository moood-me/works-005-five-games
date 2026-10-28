// The world's colours and London's hour, one for every scene: colours mixed and written, a soft glow, London's
// hour (the colours of its fog, its gas) and the gas lamp of its streets — so the Pall Mall seen from the club's windows
// and Saville Row are the same London at the same hour. Things are painted once, in their daylight colours: the hour is the
// scene's light (its looks on the hour's key). What the light can't make — the fog of a sky (a sky is not lit) — takes
// the hour's colours from london() in an animate, as uniforms of its shader (lin); the gas lamps' light follows the hour
// by e.glow (gas).

const hex = c => [1, 3, 5].map(i => parseInt(c.slice(i, i + 2), 16));
const mixc = (a, b, u) => {
  const p = Array.isArray(a) ? a : hex(a);
  const q = Array.isArray(b) ? b : hex(b);
  const k = anim.clamp(u, 0, 1);
  return p.map((v, i) => Math.round(v + (q[i] - v) * k));
};
// a colour as "#rrggbb" (what e.light, lights and looks take)
const css = c => (Array.isArray(c) ? `#${c.map(v => v.toString(16).padStart(2, '0')).join('')}` : c);
const rgba = (c, a = 1) => {
  const v = Array.isArray(c) ? c : hex(c);
  return `rgba(${v[0]},${v[1]},${v[2]},${a})`;
};

// A soft glow painted: a radial gradient from colour c (alpha a) to nothing, squeezed sy times vertically — fog lit low
// over a street, a warm wash on a painted sky. (A lamp's own glow and its halo in the air are the engine's: e.light,
// the scene's light.hazeGlow.)
function glow(g, x, y, r, c, a, sy = 1) {
  g.save();
  g.translate(x, y);
  g.scale(1, sy);
  const gr = g.createRadialGradient(0, 0, 0, 0, 0, r);
  gr.addColorStop(0, rgba(c, a));
  gr.addColorStop(0.4, rgba(c, a * 0.45));
  gr.addColorStop(1, rgba(c, 0));
  g.fillStyle = gr;
  g.fillRect(-r, -r, 2 * r, 2 * r);
  g.restore();
}

// London's hour: night 0 — grey London daylight, 0.5 — dusk, the gas lit, 1 — night.
const at3 = (u, a, b, c) => (u < 0.5 ? mixc(a, b, u * 2) : mixc(b, c, u * 2 - 1));
// gas: unlit by day, lit from dusk
const gas = night => anim.ease.smooth(anim.span(anim.clamp(night ?? 1, 0, 1), 0.3, 0.6));
// London's colours at an hour → { night, high, low, gas }: the fog high up and low over the street, where the lamps
// light it (what a sky's shader is given), and how much the gas is lit (0…1). (The houses are painted in their daylight
// colours; the look on the hour darkens them.)
function london(night) {
  const d = anim.clamp(night ?? 1, 0, 1);
  return {
    night: d,
    high: at3(d, '#aeb6ba', '#5f7088', '#334459'),
    low: at3(d, '#c9ccc8', '#9b938b', '#7f8b98'),
    gas: gas(d),
  };
}
// A colour as a shader takes it: linear 0…1 ([r, g, b] of #rrggbb or [r, g, b] 0…255) — into `out` if given (an
// animate's own array, nothing made each frame)
const toLin = v => { const c = v / 255; return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
function lin(c, out = [0, 0, 0]) {
  const v = Array.isArray(c) ? c : hex(c);
  out[0] = toLin(v[0]); out[1] = toLin(v[1]); out[2] = toLin(v[2]);
  return out;
}

// A London gas lamp, its foot at (0, 0): a slender iron post, a glass globe and its flame — e.light, named `name` if
// given ("lamps#door"), as strong as the gas fully lit: the element's animate sets it to the hour (e.glow(name,
// gas(night))), and the scene may take it into `lights` with `of` and give it a `reach` (the haze round it lit by
// the scene's light.hazeGlow). Painted in its daylight colours: the scene's light makes the evening.
function gasLamp(g, e, name) {
  g.fillStyle = '#1d2024';
  g.beginPath();
  g.moveTo(-0.14, 0);
  g.lineTo(-0.06, -3.6);
  g.lineTo(0.06, -3.6);
  g.lineTo(0.14, 0);
  g.closePath();
  g.fill();
  g.fillRect(-0.2, -0.5, 0.4, 0.5);
  // the lantern's cap and the globe (frosted glass, its flame inside it)
  g.fillRect(-0.09, -3.66, 0.18, 0.08);
  g.fillStyle = 'rgba(207,211,210,0.55)';
  g.beginPath();
  g.arc(0, -3.95, 0.32, 0, Math.PI * 2);
  g.fill();
  e.light(0, -3.95, 0.9, '#ffd08a', 2.2, name);
}

return { mixc, css, rgba, lin, glow, london, gas, gasLamp };
