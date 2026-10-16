// "The Beam" (II.2, the square, after the beat `beam_out`; the shot WALL): with Alfredo's hands — the beam from the booth's port across the square
// onto the white wall of the house opposite. Phase 1 — lead (anywhere): the arrow — the beam's end (a spot of light on the stone and the heads), the zone —
// the white wall (`beam_aim` 1). Pressed and led sideways: the aim of `beam_aim` — the finger's shift (a quarter of the window's width = 1) from
// `beam_aim` at the moment of the press; `beam_aim` itself goes to the aim no faster than 0.25 a second — the projector is heavy; let go — the beam
// stands. Half a second in the zone (`beam_aim` ≥ 0.95) — the latch: `beam_aim` 1, a clang, a blurred patch on the wall (`wall_film`
// comedy, `beam_focus` 0). Phase 2 — turn: a ring with a dotted circle on `wall#screen`; one and a half turns clockwise —
// the focus 0 → 1; anticlockwise — back (the mistake "against").
//   The feeling: Alfredo gives the cinema to those who got no seats; he wants the whole square to see; mischief and pride;
//   the player — generosity.
//   opts: { onFocus(u) — four times a second in the second phase: the focus (the chapter keeps the whirr) }
//   → { seconds: from the beginning to the end }
import { until, keys } from '../hands.js';

const SPEED = 0.25; // beam_aim a second, no faster
const ZONE = 0.95, LATCH = 0.5; // in the zone — how many seconds to the latch
const TURNS = 1.5; // turns to the full focus
const TELL = 0.25; // s between onFocus
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));

export default {
  file: 'beam',
  title: 'The Beam', // as the author's ☰ lists it
  about: 14,
  skipped: { seconds: 0 },
  async run(g, b, opts, signal) {
    const mg = g.minigame({ phrase: tr('The white wall of the house opposite is empty. The projector is heavy, the beam creeps slowly') });
    const send = keys(g), t0 = mg.t;
    mg.plate.set({ notches: [0.5] });
    // ── phase 1: lead the beam onto the wall ──
    let aim = clamp(+g.get('beam_aim') || 0), target = aim, from = aim, inZone = 0;
    const lead = mg.lead({ zone: { at: 1 - aim, width: 0.1 }, release: 'return' });
    b.minigame.tricks.teach(mg, [lead], { id: 'lead' });
    lead.on('down', () => { from = aim; lead.set({ zone: { at: ZONE + (1 - ZONE) / 2 - from, width: 1 - ZONE } }); });
    const aimed = await until(mg, ({ dt }) => {
      const s = lead.state;
      target = s.held ? clamp(from + s.knob) : aim;
      aim += clamp(target - aim, -SPEED * dt, SPEED * dt);
      send('beam_aim', aim);
      inZone = aim >= ZONE ? inZone + dt : 0;
      mg.plate.set({ fill: aim / 2, glow: s.held ? (Math.abs(target - aim) > 0.01 ? 'good' : 'idle') : 'idle' });
      return inZone >= LATCH;
    });
    if (!aimed) return this.skipped;
    send('beam_aim', 1);
    g.sound.clunk();
    mg.snap({});
    lead.remove();
    send('wall_film', 'comedy');
    send('beam_focus', 0);
    // ── phase 2: bring it into focus ──
    mg.plate.set({ phrase: tr('On the wall they\'re laughing already, and the picture\'s still blurred') });
    const ring = mg.mark({ at: 'wall#screen', kind: 'dash' });
    const knob = mg.turn({ on: ring, dir: 1 });
    b.minigame.tricks.teach(mg, [knob], { id: 'turn' });
    knob.on('against', () => mg.error('against', { at: knob }));
    let told = 0, focus = 0;
    const sharp = await until(mg, ({ t }) => {
      focus = clamp(knob.state.turns / TURNS);
      send('beam_focus', focus);
      if (t - told >= TELL) { told = t; opts.onFocus?.(focus); }
      mg.plate.set({ fill: 0.5 + focus / 2, glow: 'good' });
      return focus >= 1;
    });
    if (!sharp) return this.skipped;
    send('beam_focus', 1);
    opts.onFocus?.(1);
    mg.snap({ at: ring });
    const seconds = Math.round(mg.t - t0);
    await mg.end({ as: 'clean' });
    return { seconds };
  },
};
