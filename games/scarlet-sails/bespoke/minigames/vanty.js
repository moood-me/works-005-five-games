// «Ванты» (II, the deck): the boy climbs the shrouds. The scene «Палуба» (beat `shrouds`, the insert
// `ropes`) shows it all; this moves its keys: hand_l / hand_r (1 — the hand grips, the default; 0 — lifted),
// climb (0…1), slip (a pulse), roll (the ship's heel, which the insert's horizon follows).
// A press on the left half of the screen lifts the left hand while it is down, on the right half the
// right one. A hand let go after 0.3 s up grips higher: climb + 1/12. In the heel
// (|roll| > 0.6) a hand must not be up: lifted longer than 0.25 s then, or both up, and the hands slip.
//   → { slips, seconds }
const STEP = 1 / 12; // a regrip
const FALL = 2 / 12; // a slip
const EASE = STEP / 0.4; // climb per second while it moves to its target
const HELD = 0.3; // s a hand must be up for the regrip to count
const HEEL = 0.6; // |roll| above which a lifted hand is a danger
const GRACE = 0.25; // s of a hand up in the heel before it slips
const SEND = 0.01; // a key goes to the scene when it has changed by more than this

export default {
  title: 'Ванты', // (as the author's ☰ lists it)
  about: 40,
  skipped: { slips: 1, seconds: 0 },
  async run(g, b, opts, signal) {
    if (signal.aborted) return this.skipped;
    const hands = [
      { key: 'hand_l', up: false, held: 0, bad: 0, spent: false },
      { key: 'hand_r', up: false, held: 0, bad: 0, spent: false },
    ];
    const sent = { roll: 0, climb: 0, wind: -1 };
    let t = 0, last = null, target = 0, shown = 0, slips = 0, pointer = null, warned = false, frame = 0, finish;
    const off = g.hint('Нажми слева или справа — рука перехватит выше. В крен — замри');
    let hinted = true;
    const acted = () => { if (hinted) { hinted = false; off(); } };

    hands.forEach(h => g.set(h.key, 1));
    g.set('climb', 0);
    g.set('roll', 0);

    const lift = (h) => {
      if (h.up) return;
      acted();
      h.up = true; h.held = 0; h.bad = 0; h.spent = false;
      g.set(h.key, 0);
    };
    const grip = (h) => {
      if (!h.up) return;
      h.up = false;
      g.set(h.key, 1);
      if (!h.spent && h.held >= HELD) target = Math.min(1, target + STEP);
    };
    const slip = () => {
      slips++;
      hands.forEach(h => { if (h.up) { h.spent = true; g.set(h.key, 1); } });
      target = Math.max(0, target - FALL);
      g.set('slip', 1);
      g.set('slip', 0, 0.8);
      g.sound.burn();
      g.trouble();
    };

    const half = e => { const f = b.frame(); return e.clientX < f.x + f.w / 2 ? 0 : 1; };
    const pad = document.createElement('div');
    pad.style.cssText = 'position:absolute;inset:0;touch-action:none';
    b.layer.append(pad);
    let side = null;
    const down = e => {
      if (e.button > 0 || pointer !== null) return;
      e.preventDefault();
      pointer = e.pointerId;
      pad.setPointerCapture?.(e.pointerId);
      side = half(e);
      lift(hands[side]);
    };
    const release = e => {
      if (e.pointerId !== pointer) return;
      pointer = null;
      grip(hands[side]);
      side = null;
    };
    pad.addEventListener('pointerdown', down);
    pad.addEventListener('pointerup', release);
    pad.addEventListener('pointercancel', release);

    const tick = now => {
      frame = requestAnimationFrame(tick);
      const dt = last === null ? 0 : Math.min(0.1, (now - last) / 1000);
      last = now;
      t += dt;
      const roll = 0.8 * Math.sin((2 * Math.PI * t) / 6);
      if (Math.abs(roll) > HEEL && !warned) g.sound.rigging();
      warned = Math.abs(roll) > HEEL;
      if (Math.abs(roll - sent.roll) > SEND) { sent.roll = roll; g.set('roll', roll); }

      hands.forEach(h => {
        if (!h.up) return;
        h.held += dt;
        if (Math.abs(roll) > HEEL) h.bad += dt;
      });
      if (hands.every(h => h.up && !h.spent) || hands.some(h => h.up && !h.spent && h.bad > GRACE)) slip();

      const step = EASE * dt;
      shown = Math.abs(target - shown) <= step ? target : shown + Math.sign(target - shown) * step;
      if (Math.abs(shown - sent.climb) > SEND || (shown === target && shown !== sent.climb)) {
        sent.climb = shown;
        g.set('climb', shown);
      }
      const wind = 0.3 + 0.5 * shown;
      if (Math.abs(wind - sent.wind) > SEND) { sent.wind = wind; g.sound.wind(wind, 0.5); }
      if (shown >= 1) finish();
    };
    frame = requestAnimationFrame(tick);

    await new Promise(ok => {
      finish = ok;
      signal.addEventListener('abort', ok);
    });
    cancelAnimationFrame(frame);
    pad.remove();
    acted();
    if (signal.aborted) {
      g.withdraw();
      return this.skipped;
    }
    return { slips, seconds: Math.round(t) };
  },
};
