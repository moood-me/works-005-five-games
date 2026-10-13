// «Оснастка» (глава I, Дом, кусок `rig`): вставка `rig` открыта, лоскут Ассоль уже взяла. Четыре крепления по порядку
// (грот, гика-шкот, кливер, его шкот): игрок нажимает и держит у точки текущего — `rigN` растёт. Первое делается вместе
// с отцом (`guide` = 1); на остальных отпустить раньше времени — срыв: крепление падает к нулю, отцова рука (`guide` = 1)
// помогает до конца этого крепления. Всё видимое — ключи сцены; здесь только они и прозрачный слой для указателя.
//   opts: { onGuide() — отец говорит (глава ставит реплику), один раз, в начале; не ждётся }
//   → { slips: сколько раз сорвалось }
const TOTAL = 4;
const GROW = 0.5; // в секунду, пока держат
const HELPED = 2; // во сколько раз быстрее с рукой отца
const FALL = 0.8; // в секунду, после срыва
const GUIDE = 0.6; // с: рука отца приходит и уходит
const REACH = 0.1; // высоты кадра: у точки крепления
const NEAR = 44; // px: не меньше
const STEP = 0.01; // ключ шлётся, когда изменился больше
const HINT = 'Нажми и держи — парус встанет';

export default {
  title: 'Оснастка', // как её зовёт ☰ автора
  about: 20,
  skipped: { slips: 0 },
  async run(g, b, opts, signal) {
    if (signal.aborted) return this.skipped;
    const v = Array(TOTAL + 1).fill(0), sent = Array(TOTAL + 1).fill(0);
    let at = 1, slips = 0, spacing = false, helped = false, falling = false;
    let last = performance.now(), raf = 0, acting = null, off = null, finish;

    // рука отца: ключ идёт сценой; прежний ход снимается
    const guide = value => {
      acting?.cancel();
      acting = b.act('state', 'move', 'guide', value, { over: GUIDE });
    };
    const send = (n, force) => {
      if (force ? v[n] === sent[n] : Math.abs(v[n] - sent[n]) <= STEP) return;
      sent[n] = v[n];
      g.set(`rig${n}`, v[n]);
    };

    const veil = document.createElement('div');
    veil.style.cssText = 'position:absolute;inset:0;touch-action:none';
    b.layer.append(veil);

    let pointer = null; // { id, x, y }
    const point = () => b.where(`closeup#rig${at}`);
    const reach = () => Math.max(REACH * b.frame().h, NEAR);
    // указатель у точки текущего крепления (порядок задан, значит, считается только она)
    const holding = () => {
      if (spacing) return true;
      const p = pointer && point();
      return !!p && Math.hypot(pointer.x - p.x, pointer.y - p.y) <= reach();
    };

    const begin = () => { off?.(); off = null; };
    const down = e => {
      if (e.button > 0 || pointer) return;
      e.preventDefault();
      veil.setPointerCapture?.(e.pointerId);
      pointer = { id: e.pointerId, x: e.clientX, y: e.clientY };
    };
    const move = e => {
      if (pointer?.id !== e.pointerId) return;
      pointer.x = e.clientX; pointer.y = e.clientY;
    };
    const up = e => { if (pointer?.id === e.pointerId) pointer = null; };
    const keydown = e => {
      if (e.code !== 'Space') return;
      e.preventDefault();
      spacing = true;
    };
    const keyup = e => { if (e.code === 'Space') spacing = false; };
    veil.addEventListener('pointerdown', down);
    veil.addEventListener('pointermove', move);
    veil.addEventListener('pointerup', up);
    veil.addEventListener('pointercancel', up);
    addEventListener('keydown', keydown);
    addEventListener('keyup', keyup);

    const frame = now => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      const held = point() && holding();
      if (held) {
        begin();
        falling = false;
        v[at] = Math.min(1, v[at] + dt * GROW * (helped ? HELPED : 1));
      } else if (v[at] > 0 && v[at] < 1) {
        // отпустил раньше времени: на первом креплении (отец рядом) и с его рукой ничего не падает, дальше — срыв
        if (at > 1 && !helped) {
          falling = true;
          slips++;
          helped = true;
          guide(1);
          g.trouble();
        }
      }
      if (falling && !held) v[at] = Math.max(0, v[at] - dt * FALL);
      send(at, v[at] === 0 || v[at] === 1);
      if (v[at] < 1) return;
      g.sound.silk();
      if (at === 1 || helped) guide(0);
      if (at === TOTAL) { cancelAnimationFrame(raf); finish(); return; }
      at++;
      helped = false;
      falling = false;
    };

    // первое крепление — с отцом
    guide(1);
    opts.onGuide?.();
    off = g.hint(HINT);
    raf = requestAnimationFrame(frame);

    await new Promise(ok => {
      finish = ok;
      signal.addEventListener('abort', ok);
    });
    cancelAnimationFrame(raf);
    acting?.cancel();
    off?.();
    g.withdraw();
    veil.remove();
    removeEventListener('keydown', keydown);
    removeEventListener('keyup', keyup);
    return signal.aborted ? this.skipped : { slips };
  },
};
