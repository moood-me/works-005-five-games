// «The route» outside games: the way inked chapter by chapter, the view going with it, from London round to London;
// the day won at the 180th meridian at the end.
const SHARE = [0.04, 0.22, 0.55, 0.78, 0.97, 1];
const NAMES = ['prologue', 'India', 'Hong Kong', 'America', 'the Atlantic', 'epilogue'];
return SHARE.map((u, i) => ({
  name: NAMES[i],
  run: async s => {
    s.set('shown', i);
    await s.wait(1.2);
    await s.move('route', u, { over: 3, ease: 'inOut' });
    if (i === SHARE.length - 1) await s.move('dateline', 1, { over: 1 });
    await s.wait(1.5);
  },
}));
