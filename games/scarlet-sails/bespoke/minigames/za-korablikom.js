// «За корабликом» (I, «Лес у моря», the beat `chase`): Assol runs along the stream after her yacht. Held (a finger,
// a button, or Space) she runs; let go, she stands where she is. A short touch (under TAP ms) or a tap of Space is a
// jump. The yacht's place is the game's own number `toy`: it goes down the stream by its own clock (sent to the scene
// under the key `toy`, with time, so that it glides) and the game keeps it itself, never reading it back. Held, she runs on to where the
// yacht is (a little ahead of it at most, never in front of it by more); the scene walks her there (`run`) and says
// where she is (`run_at`). Left behind too far, the yacht sticks in the reeds (`reeds`) and waits; caught up, it goes
// on. The scene stops her before a snag (`chase:snag`); the hint is shown again then. All in `run`'s units: 0 — where
// the yacht was set afloat, 1 — the mouth.
//   → { seconds, lost (how many times the yacht stuck), jumps }
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const SPEED = 1 / 34; // the yacht's way a second, off the reeds
const AHEAD = 0.1, WITH = 0.04; // she is sent no further than this before where she is, nor before the yacht
const STUCK = 0.2, FREE = 0.06; // left behind this far, the yacht sticks; caught up this near, it frees
const END = 0.98;
const TAP = 220, LEAP = 300; // ms: a touch shorter than TAP is a jump; the jump lasts LEAP
const GLIDE = 0.34; // s: the scene glides the yacht between the places sent
const STEP = 0.01; // a key is sent when it has changed more than this (but an exact 1 is always sent, and so is the place on release)

const skipped = { seconds: 0, lost: 0, jumps: 0 };

export default {
  title: 'За корабликом', // (as the author's ☰ lists it)
  about: 40,
  skipped,
  run: (g, b, opts, signal) => new Promise(done => {
    const veil = document.createElement('div');
    veil.style.cssText = 'position:absolute;inset:0;touch-action:none';
    b.layer.append(veil);
    const at = () => clamp(+g.get('run_at') || 0); // where she is (the scene keeps it)
    let toy = 0, stuck = false, wasHeld = false;
    const sent = { toy: null, run: null };
    const send = (key, value, seconds) => {
      if (sent[key] !== null && Math.abs(value - sent[key]) <= STEP && !(value === 1 && sent[key] !== 1)) return;
      g.set(key, (sent[key] = value), seconds);
    };
    let finger = null, key = false, pressed = 0, lost = 0, jumps = 0, raf = 0, leap = 0, leaping = false, over = false;
    let off = g.hint('Держи — бежит. Коснись — прыжок');
    const first = () => { off(); off = () => {}; };
    const held = () => finger !== null || key;
    const press = at0 => { pressed = at0; first(); };
    const release = at0 => {
      if (at0 - pressed >= TAP) return;
      jumps++;
      g.set('jump', 1);
      leaping = true;
      clearTimeout(leap);
      leap = setTimeout(() => { leaping = false; g.set('jump', 0); }, LEAP);
    };
    const down = e => {
      if (e.button > 0 || finger !== null) return;
      finger = e.pointerId;
      veil.setPointerCapture(e.pointerId);
      press(e.timeStamp);
    };
    const up = jump => e => {
      if (e.pointerId !== finger) return;
      finger = null;
      if (jump) release(e.timeStamp);
    };
    const keydown = e => {
      if (e.code !== 'Space') return;
      e.preventDefault();
      if (e.repeat || key) return;
      key = true;
      press(e.timeStamp);
    };
    const keyup = e => {
      if (e.code !== 'Space') return;
      e.preventDefault();
      if (!key) return;
      key = false;
      release(e.timeStamp);
    };
    const lift = up(true), cancel = up(false);
    veil.addEventListener('pointerdown', down);
    veil.addEventListener('pointerup', lift);
    veil.addEventListener('pointercancel', cancel);
    addEventListener('keydown', keydown);
    addEventListener('keyup', keyup);

    // the scene stops her before a snag and says so: the hint again (waiting set before the cause, and again after each)
    (async () => {
      while (!over) {
        const told = g.told('chase:snag');
        if (!(await told) || over) continue;
        off();
        off = g.hint('Держи — бежит. Коснись — прыжок');
      }
    })();

    const t0 = performance.now();
    let last = t0;
    const frame = now => {
      const dt = Math.min(0.1, (now - last) / 1000), here = at();
      last = now;
      if (!stuck) toy = Math.min(1, toy + SPEED * dt);
      send('toy', toy, GLIDE);
      if (!stuck && toy - here > STUCK) {
        stuck = true;
        lost++;
        g.set('reeds', 1);
        g.trouble();
        g.sound.splash();
      } else if (stuck && toy - here < FREE) {
        stuck = false;
        g.set('reeds', 0);
      }
      const hold = held();
      if (wasHeld && !hold) sent.run = null; // a release always tells the scene where she is
      wasHeld = hold;
      send('run', hold ? Math.min(here + AHEAD, toy + WITH, 1) : here);
      if (here >= END) {
        end();
        done({ seconds: Math.round((now - t0) / 1000), lost, jumps });
        return;
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    function end() {
      over = true;
      cancelAnimationFrame(raf);
      clearTimeout(leap);
      if (leaping) g.set('jump', 0);
      veil.removeEventListener('pointerdown', down);
      veil.removeEventListener('pointerup', lift);
      veil.removeEventListener('pointercancel', cancel);
      removeEventListener('keydown', keydown);
      removeEventListener('keyup', keyup);
      veil.remove();
      off();
      g.withdraw();
    }
    signal.addEventListener('abort', () => {
      if (over) return;
      end();
      done(skipped);
    });
  }),
};
