const s = e.state;
const d = Math.max(0, Math.min(1, Number(s.dawn) || 0));
const mist = Math.max(0, Math.min(1, Number(s.mist ?? 1)));
e.layer('dawn').alpha = d;
e.layer('stars').alpha = Math.max(0, 1 - d * 1.6);
e.layer('clouds_d').alpha = d;
e.layer('glints').alpha = 0.12 + 0.88 * d;
e.layer('mist').alpha = mist * (0.9 - 0.35 * d);
e.glow('venus', Math.max(0.15, 1 - 0.8 * d));
