// What the look port shows: the hall's screen from the booth — the film, and in its upper right corner the
// changeover cue (a layer: `cue`); round the port, a rim of the screen's light that blinks with the cue
const k = e.kit.cinema, G = e.lib.G, w = G.LOOK[3], h = G.LOOK[2] - G.LOOK[1];
g.fillStyle = '#100e0c'; g.fillRect(-w / 2, -h, w, h);
k.screen(g, e, { x: -w / 2 + 0.03, y: -h + 0.04, w: w - 0.06, h: h - 0.08, frames: ['romance', 'white'], sheet: '#1a1714' });
e.layer('cue', {}, l => k.cue(l, -w / 2 + 0.03, -h + 0.04, w - 0.06, h - 0.08));
e.layer('blink', {}, l => {
  const r = l.createRadialGradient(0, -h / 2, 0.05, 0, -h / 2, 0.36);
  r.addColorStop(0, 'rgba(255,236,200,0.9)'); r.addColorStop(1, 'rgba(255,236,200,0)');
  l.fillStyle = r; l.fillRect(-0.36, -h / 2 - 0.36, 0.72, 0.72);
  l.strokeStyle = 'rgba(255,246,226,1)'; l.lineWidth = 0.025; l.strokeRect(-w / 2 - 0.01, -h - 0.01, w + 0.02, h + 0.02);
});
e.at(0, -h / 2);
