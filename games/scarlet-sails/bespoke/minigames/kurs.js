// «Курс» (V, the ship on its way to Kaperna; played in three legs, `opts.leg` 0, 1, 2): Grey at the helm, the bow on
// Kaperna. Gusts push the bow off; the player leads sideways across the screen (the helm) and keeps it, so the sails
// stay full. The scene (`helm`) shows it all by three keys: `helm`, `heading`, `luff`. A leg is 20 s from the player's
// first move (or from the 4th second if they have not moved); steady is the share of it spent with the bow within 0.2.
//   opts: { leg: 0…2, sea: the sea scale, onSteady(u) — four times a second, the share kept steady over the last 3 s }
//   → { steady: 0…1 }
const LEG = 20, WAIT = 4, REACH = 0.25; // seconds of a leg; seconds before it starts by itself; the helm's reach, in frame widths
const STEADY = 0.2, LUFF_FROM = 0.25, LUFF_SPAN = 0.5; // |heading| counted steady; where the sails start to luff
const TURN = 0.5, EASE = 0.5; // heading's speed; seconds for the helm to return
const SAMPLES = 12; // 3 s of quarter-seconds
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));

const kurs = {
  title: 'Курс', // (as the author's ☰ lists it)
  about: 22,
  skipped: { steady: 0.5 },
  run: (g, b, opts, signal) => new Promise(done => {
    const leg = opts.leg, sea = opts.sea;
    const A = (0.5 - 0.06 * sea) * (0.8 + 0.2 * leg);
    const veil = document.createElement('div');
    veil.style.cssText = 'position:absolute;inset:0;touch-action:none';
    b.layer.append(veil);
    const off = g.hint('Веди вбок — это штурвал. Нос — на Каперну');
    let finger = null, from = 0, helm = 0, pointed = 0, heading = 0, luff = 0;
    let sent = { helm: 0, heading: 0, luff: 0 };
    let began = 0, waited = 0, steadyFor = 0, tick = 0, last = 0, raf = 0, over = false;
    const ticks = [];
    const send = (key, value) => {
      if (Math.abs(value - sent[key]) <= 0.01) return;
      sent[key] = value;
      g.set(key, value);
    };
    const moved = () => { began ||= performance.now(); off(); };
    const down = e => {
      if (e.button > 0) return;
      finger = e.pointerId;
      from = e.clientX;
      pointed = 0;
      veil.setPointerCapture(e.pointerId);
    };
    const move = e => {
      if (e.pointerId !== finger) return;
      pointed = clamp((e.clientX - from) / (b.frame().w * REACH), -1, 1);
      if (pointed) moved();
    };
    const up = e => {
      if (e.pointerId !== finger) return;
      finger = null;
      pointed = 0;
    };
    veil.addEventListener('pointerdown', down);
    veil.addEventListener('pointermove', move);
    veil.addEventListener('pointerup', up);
    veil.addEventListener('pointercancel', up);
    const step = now => {
      const dt = Math.min(0.1, (now - (last || now)) / 1000);
      last = now;
      waited += dt;
      if (!began && waited >= WAIT) began = now;
      // the helm: where the finger is from where it pressed; let go, it returns in half a second
      if (finger !== null) helm = pointed;
      else helm -= Math.sign(helm) * Math.min(Math.abs(helm), dt / EASE);
      if (began) {
        const t = (now - began) / 1000, T = t + LEG * leg;
        const gust = A * (0.6 * Math.sin(2 * Math.PI * T / 7) + 0.4 * Math.sin(2 * Math.PI * T / 2.9 + 1));
        heading = clamp(heading + (0.7 * helm + gust) * dt * TURN, -1, 1);
        const was = luff;
        luff = clamp((Math.abs(heading) - LUFF_FROM) / LUFF_SPAN, 0, 1);
        if (was <= 0.5 && luff > 0.5) g.sound.rigging();
        const ok = Math.abs(heading) < STEADY;
        if (ok) steadyFor += dt;
        tick += dt;
        while (tick >= 0.25) {
          tick -= 0.25;
          ticks.push(ok ? 1 : 0);
          if (ticks.length > SAMPLES) ticks.shift();
          opts.onSteady?.(ticks.reduce((a, v) => a + v, 0) / ticks.length);
        }
        if (t >= LEG) {
          end();
          done({ steady: clamp(steadyFor / LEG) });
          return;
        }
      }
      send('helm', helm);
      send('heading', heading);
      send('luff', luff);
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    function end() {
      if (over) return;
      over = true;
      cancelAnimationFrame(raf);
      off();
      veil.remove();
    }
    signal.addEventListener('abort', () => {
      end();
      done(kurs.skipped);
    });
  }),
};

export default kurs;
