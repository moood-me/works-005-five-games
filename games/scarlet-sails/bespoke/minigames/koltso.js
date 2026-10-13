// «Кольцо» (Лес, кусок `ring`): Грей на коленях, кольцо в пальцах; он надевает его спящей Ассоль на палец. Игрок
// держит (палец, кнопка, пробел) — рука тянется: сцена показывает её по ключу `ring_at`. Спящая шевелится (`stir`):
// пока держат, она шевелится всё сильнее, пока нет — успокаивается, и время от времени вздыхает. Дошло до края — она
// почти проснулась: рука отходит, и надо замереть, пока дыхание не выровняется. Когда `ring_at` дошёл до 1, сцена
// говорит `ring:on` — это конец. Всё видимое — сцены; здесь только подсказка.
// → { on: true, stirs: сколько раз она почти проснулась, seconds: от первого нажатия до конца }
const REACH = 0.11; // ring_at в секунду, пока держат
const SPOOK = 0.25; // stir в секунду, пока держат
const CALM = 0.35; // stir в секунду, пока нет
const SIGH = [4, 7]; // раз в столько секунд — вздох
const SIGH_BY = 0.3; // на сколько вздох прибавляет stir
const WAKING_STIR = 0.6; // stir после «почти проснулась»
const RECOIL = 0.15; // на сколько рука отходит
const STILL = 1; // секунд, пока после этого держать нельзя
const ON_WITHIN = 3000; // сколько ждать от сцены `ring:on`, мс
const BREATH = [0.2, 0.8]; // дыхание: g.sound.breath(BREATH[0] + BREATH[1] * stir, 0.2)
const SEND = 0.01; // ключ шлётся, когда изменился больше чем на это

export default {
  title: 'Кольцо', // (как её зовёт ☰ автора)
  about: 25,
  skipped: { on: false, stirs: 0, seconds: 0 },
  async run(g, b, opts, signal) {
    const pad = document.createElement('div');
    pad.style.cssText = 'position: absolute; inset: 0; touch-action: none;';
    b.layer.append(pad);
    const off = g.hint('Держи. Шевельнётся — отпусти и замри');
    const aborted = new Promise(ok => signal.addEventListener('abort', ok, { once: true }));
    let finger = null, keyed = false, started = 0, hinted = true;
    const held = () => finger !== null || keyed;
    const begin = now => {
      started ||= now;
      if (hinted) { hinted = false; off(); }
    };
    const down = e => {
      if (e.button > 0 || finger !== null) return;
      finger = e.pointerId;
      pad.setPointerCapture(e.pointerId);
    };
    const up = e => { if (e.pointerId === finger) finger = null; };
    const key = on => e => {
      if (e.code !== 'Space') return;
      e.preventDefault();
      keyed = on;
    };
    const keydown = key(true), keyup = key(false);
    pad.addEventListener('pointerdown', down);
    pad.addEventListener('pointerup', up);
    pad.addEventListener('pointercancel', up);
    addEventListener('keydown', keydown);
    addEventListener('keyup', keyup);

    let ring = Math.min(1, +b.get('ring_at') || 0), stir = 0, stirs = 0, still = 0, sent = { ring_at: ring, stir };
    let last = performance.now(), sigh = last / 1000 + SIGH[0] + (SIGH[1] - SIGH[0]) * Math.random();
    // a key goes to the scene when it has changed by more than SEND (and always on reaching 0 or 1)
    const send = (name, value) => {
      if (Math.abs(value - sent[name]) <= SEND && !((value === 0 || value === 1) && value !== sent[name])) return;
      sent[name] = value;
      g.set(name, value);
    };
    const frame = () => new Promise(ok => requestAnimationFrame(ok));
    try {
      while (ring < 1) {
        if (await Promise.race([frame().then(() => false), aborted.then(() => true)])) return this.skipped;
        const now = performance.now(), dt = Math.min(0.1, (now - last) / 1000), t = now / 1000;
        last = now;
        still = Math.max(0, still - dt);
        const hold = held() && still === 0;
        if (held()) begin(now);
        if (hold) ring = Math.min(1, ring + REACH * dt);
        stir = Math.max(0, Math.min(1, stir + (hold ? SPOOK : -CALM) * dt));
        if (t > sigh) {
          stir = Math.min(1, stir + SIGH_BY);
          sigh = t + SIGH[0] + (SIGH[1] - SIGH[0]) * Math.random();
        }
        if (hold && stir >= 1 && ring < 1) { // she is almost awake: the hand draws back, and must be still
          ring = Math.max(0, ring - RECOIL);
          stir = WAKING_STIR;
          still = STILL;
          stirs++;
          g.trouble();
        }
        g.sound.breath(BREATH[0] + BREATH[1] * stir, 0.2);
        send('ring_at', ring);
        send('stir', stir);
      }
      const on = g.told('ring:on', ON_WITHIN); // (asked before its cause)
      send('ring_at', 1);
      const heard = await Promise.race([on, aborted.then(() => null)]);
      if (heard === null) return this.skipped;
      return { on: heard, stirs, seconds: Math.round((performance.now() - started) / 1000) };
    } finally {
      pad.remove();
      removeEventListener('keydown', keydown);
      removeEventListener('keyup', keyup);
      off();
      if (signal.aborted) {
        g.withdraw();
        g.sound.breath(BREATH[0], 0.5); // (the bed as the chapter set it before the game)
      }
    }
  },
};
