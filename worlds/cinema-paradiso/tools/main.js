// The scene «Площадь» (scenes/main) is built here: its scene.json and every file in elements/ come out of this. Edit
// this (and the hand-written scenes/main/lib.js, script.js, showcase.js, notes.md) — never scene.json or elements/.
//   node tools/main.js
const fs = require('fs'), path = require('path');
const { anim, wgsl } = require('./lib');
const DIR = path.join(__dirname, '..', 'scenes', 'main');
// the scene's lib as the engine runs it: the fronts round the square and the beats' order come from it
const LIB = new Function('anim', 'kit', fs.readFileSync(path.join(DIR, 'lib.js'), 'utf8'))(anim, { cast: { characters: new Proxy({}, { get: (t, p) => ({ who: p }) }) } });
const objects = [], files = {};
const el = (o, code, animate) => {
  objects.push(o);
  if (code) files[`elements/${o.id}.js`] = code;
  if (animate) files[`elements/${o.id}.animate.js`] = animate;
};

// the sky, the ground, the sea at the lane's end
el({ id: 'sky', name: 'Небо', sky: true }, 'e.kit.nebo.sky(g, e, e.lib.SKY);');
el({ id: 'ground', name: 'Площадь', plane: true, across: 0, distance: 6, elevation: 0, width: 44, depth: 100 }, 'e.lib.ground(g);');
el({ id: 'sea_end', name: 'Море', across: 10.5, distance: 80, elevation: -10, facing: 180, height: 11.7, box: [-30, -11.8, 30, 0.1] }, 'e.lib.seaEnd(g, e);');

// the fronts round the square: [id, name, x, z, facing, f]
const fronts = [
  ['alfredo_door', 'Дом Альфредо', -12, 0, 90, 'f_alf'], ['f_w2', 'Дом', -12, 20, 90, 'f_w2'],
  ['f_n1', 'Дом с аркой', -12, 26, 180, 'f_n1'], ['f_e3', 'Дом', 12, 26, 270, 'f_e3'], ['f_e1', 'Дом', 12, 8, 270, 'f_e1'],
  ['f_se', 'Дом', 12, 0, 0, 'f_se'], ['f_sw', 'Дом', -5, 0, 0, 'f_sw'],
  ['f_lane_w', 'Улица к морю', 9.1, 26.3, 90, 'f_lane_w'], ['f_lane_e', 'Улица к морю', 12, 48.3, 270, 'f_lane_e'],
  ['f_st_w', 'Улица', -5, -34, 90, 'f_st_w'], ['f_st_e', 'Улица', 5, 0, 270, 'f_st_e'], ['f_st_end', 'Остановка', 5, -34, 0, 'f_st_end'],
];
const FR = Object.fromEntries(Object.entries(LIB.FRONTS).map(([k, v]) => [k, { w: v.w, h: v.h, lit: (v.windows || []).filter(w => w[6]).length }]));
fronts.forEach(([id, name, x, z, facing, key], i) => {
  const f = FR[key];
  el({ id, name, across: x, distance: z, facing, height: f.h, box: [-0.3, -f.h - 0.6, f.w + 0.3, 0.05], shadow: true },
    `e.lib.front(g, e, e.lib.FRONTS.${key});`);
  if (f.lit) el({ id: `${id}_win`, name: 'Окна', across: x, distance: z, facing, glows: true, inFront: [id], height: f.h, box: [-0.3, -f.h - 0.6, f.w + 0.3, 0.05] },
    `e.lib.litWindows(g, e, e.lib.FRONTS.${key});`, `e.lib.windowsMove(e, ${f.lit}, ${i * 7 + 3});`);
});

// the «Парадизо»: its front, the canopy, the booth's room, the house behind it; its beam
el({ id: 'paradiso', name: '«Парадизо»', across: -12, distance: 6, facing: 90, height: 10, box: [-0.4, -11.4, 14.4, 12], shadow: true },
  'e.lib.paradisoPaint(g, e);', 'e.lib.paradisoMove(e);');
el({ id: 'par_back', name: 'Задняя стена', across: -18.5, distance: 6, facing: 90, height: 8, box: [-0.6, -8.4, 14.6, 0.6] }, 'e.lib.backWall(g);');
el({ id: 'rubble', name: 'Обломки', across: -12.6, distance: 6, facing: 90, height: 3, box: [-0.5, -3.5, 14.5, 0.3] }, 'e.lib.rubble(g, e);',
  "const c = Math.max(0, Math.min(1, ((e.state.collapse ?? 0) - 0.35) / 0.65)), l = e.layer('heap'); l.alpha = c > 0 ? 1 : 0; l.scaleY = Math.max(0.01, c); l.y = 0;");
el({ id: 'canopy', name: 'Козырёк', plane: true, across: -11.25, distance: 12, elevation: 3.3, width: 1.5, depth: 7.4 },
  "e.layer('all', {}, l => { l.fillStyle = '#4a3a2e'; l.fillRect(-0.75, -3.7, 1.5, 7.4); l.fillStyle = 'rgba(0,0,0,0.3)'; l.fillRect(-0.75, -3.7, 0.1, 7.4); });",
  "e.layer('all').alpha = (e.state.collapse ?? 0) > 0.25 ? 0 : 1;");
el({ id: 'canopy_front', name: 'Вывеска', across: -10.5, distance: 8.3, elevation: 2.75, facing: 90, height: 0.6, box: [-0.2, -1.3, 7.6, 0.9] },
  'e.lib.canopyFront(g, e);', 'e.lib.canopyMove(e);');
el({ id: 'booth_in', name: 'Будка', across: -12.3, distance: 16, facing: 90, glows: true, height: 1.4, box: [-1, -6.8, 1, -5.2] },
  'e.lib.boothRoom(g, e);', 'e.lib.boothMove(e);');
objects.push({ id: 'beam_anchor', name: 'Луч', unseen: true, across: -11.85, distance: 16, elevation: 6, facing: 104, tilt: -55, place: { facing: 'beam_turn', tilt: 'beam_pitch' } });
el({ id: 'beam', name: 'Луч', on: 'beam_anchor', across: 0, distance: 0, elevation: 0, facing: 270, glows: true, height: 2,
  box: [-0.3, -2.4, 18.4, 2.4], uniforms: { on: 0 } },
  'e.kit.kino.beam(e, { len: e.lib.BEAM_LEN, top: -0.75, bot: 0.75, mouth: 0.14, dust: 300, drift: 1.2, tipRadius: 1.5, tipStrength: 1.1 });',
  `const on = Math.max(0, Math.min(1, e.state.beam_on ?? 0));
e.uniform('on', on); e.glow('mouth', on); e.glow('tip', 0);`);

// the north side: the white wall and its film, the chapel, the steps, the mother's room
el({ id: 'wall', name: 'Белая стена', across: -5, distance: 26, facing: 180, height: 8.5, box: [-0.2, -8.8, 10.7, 0.05], shadow: true }, 'e.lib.whiteWall(g, e);');
el({ id: 'screen', name: 'Кино на стене', across: 2, distance: 25.96, facing: 180, glows: true, height: 4, box: [-3.1, -6.6, 3.1, -2.4] },
  `const k = e.kit.kino, W = 6, H = 4, x = -3, y = -6.5;
e.layer('blur', {}, l => { l.filter = 'blur(0.18px)'; k.frame(l, 'comedy', x, y, W, H); l.filter = 'none'; });
e.layer('sharp', { flicker: 0.12 }, l => k.frame(l, 'comedy', x, y, W, H));
e.layer('white', { flicker: 0.1 }, l => k.frame(l, 'white', x, y, W, H));
const BL = [[-0.8, -4.9, 1.0], [1.2, -3.6, 0.8], [0.4, -5.6, 0.7], [-1.9, -3.4, 0.6]];
BL.forEach(([cx, cy, R0], i) => e.layer('burn' + i, { pivot: [cx, cy], box: [-3.1, -6.6, 3.1, -2.4] }, l => {
  l.save(); l.beginPath(); l.rect(-3, -6.5, 6, 4); l.clip();
  const ring = (rad, col) => { l.fillStyle = col; l.beginPath(); for (let k = 0; k <= 24; k++) { const a = k / 24 * Math.PI * 2, r = rad * (0.8 + 0.35 * e.anim.hash(k + i * 31, 7)); l.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r * 0.9); } l.fill(); };
  ring(R0 * 1.15, 'rgba(70,40,18,0.9)'); ring(R0, '#c8783a'); ring(R0 * 0.82, '#f2d9a8'); ring(R0 * 0.6, '#fbf4e4');
  l.restore();
}));`,
  `const S = e.state, on = S.wall_film !== 'none' ? Math.max(0, Math.min(1, S.beam_on ?? 0)) : 0, f = Math.max(0, Math.min(1, S.beam_focus ?? 0));
const film = S.wall_film === 'comedy' ? 1 : 0;
e.layer('sharp').alpha = on * film * f; e.layer('blur').alpha = on * film * (1 - f) * 0.85;
e.layer('white').alpha = S.wall_film === 'white' ? on : 0;
const b = Math.max(0, Math.min(1, S.wall_burn ?? 0)), on2 = film || S.wall_film === 'white' ? 1 : 0;
[0, 0.18, 0.35, 0.5].forEach((d, i) => { const u = Math.max(0, Math.min(1, (b - d) / (1 - d))), l = e.layer('burn' + i); l.alpha = u > 0 ? on2 : 0; l.scale = 0.05 + 1.6 * u; });`);
el({ id: 'church', name: 'Церковь', across: 5.5, distance: 26.3, facing: 180, height: 12.4, box: [-0.3, -12.6, 3.9, 0.05], shadow: true }, 'e.lib.chapel(g, e);');
for (let k = 1; k <= 4; k++) {
  const z0 = 23 + 0.75 * (k - 1);
  objects.push({ id: `step${k}`, name: 'Ступени', plane: true, across: 5.5, distance: (z0 + 26) / 2, elevation: 0.25 * k, width: 5, depth: 26 - z0, walk: true, color: '#b9a57f' });
}
el({ id: 'steps', name: 'Ступени церкви', across: 5.5, distance: 23, facing: 180, height: 0.25, box: [-2.55, -0.27, 2.55, 0.02],
  copies: [0, 1, 2, 3].map(k => ({ across: 5.5, distance: 23 + 0.75 * k, elevation: 0.25 * k })) }, 'e.lib.riser(g);');
el({ id: 'mother_window', name: 'Окно матери', across: -9, distance: 26.75, facing: 180, glows: true, height: 2, box: [-0.85, -6.0, 0.85, -4.0] },
  'e.lib.motherRoom(g, e);', "const k = Math.max(0, Math.min(1, e.state.mother_light ?? 0)); e.layer('lit').alpha = k; e.glow('lamp', k);");
objects.push({ id: 'mother_floor', name: 'Пол комнаты', plane: true, unseen: true, walk: true, across: -9, distance: 26.5, elevation: 4.05, width: 1.6, depth: 0.7 });

// the east side: the bank, its balcony, the chalk wall, the chair, the garland
el({ id: 'bank', name: 'Банк', across: 12, distance: 22, facing: 270, height: 11, box: [-0.3, -11.6, 14.3, 0.05], shadow: true }, 'e.lib.bank(g, e);');
el({ id: 'balcony_room', name: 'Окно Елены', across: 11.975, distance: 13.7, facing: 270, glows: true, inFront: ['bank'], height: 2.4, box: [-0.05, -6.8, 1.45, -4.3] },
  'e.lib.balconyRoom(g, e);', "const k = Math.max(0, Math.min(1, e.state.elena_window ?? 0)); e.layer('room').alpha = Math.min(1, k * 1.5); e.glow('room', k);");
el({ id: 'balcony', name: 'Балкон Елены', across: 11.95, distance: 13.7, facing: 270, inFront: ['balcony_room', 'bank'], height: 2.4, box: [-0.6, -6.8, 2.0, -4.3] },
  'e.lib.balconyLeaves(g, e);', "const k = Math.max(0, Math.min(1, e.state.elena_window ?? 0)); e.layer('sl').scaleX = 1 - 0.82 * k; e.layer('sr').scaleX = 1 - 0.82 * k;");
el({ id: 'balcony_rail', name: 'Перила балкона', across: 11.32, distance: 13.9, facing: 270, height: 1.1, box: [-0.05, -5.35, 1.85, -4.15] }, 'e.lib.balconyRail(g);');
objects.push({ id: 'balcony_slab', name: 'Балкон', plane: true, across: 11.66, distance: 13.0, elevation: 4.2, width: 0.68, depth: 1.9, color: '#a8957a' });
el({ id: 'chalk_wall', name: 'Стена с мелом', across: 11.97, distance: 16.8, facing: 270, inFront: ['bank'], height: 1.7, box: [-0.05, -1.75, 1.65, 0.05] }, 'e.lib.chalkMarks(g, e);');
el({ id: 'chair', name: 'Стул Тото', across: 11.3, distance: 15.6, height: 0.95, box: [-0.3, -1.0, 0.3, 0.03], shadow: true },
  'if (e.state.chair_on) e.lib.chairPaint(g, false);');
el({ id: 'alfredo_chair', name: 'Стул Альфредо', across: -11.4, distance: 3.12, height: 0.95, box: [-0.3, -1.0, 0.3, 0.03], shadow: true },
  "if (e.state.paradiso_state === 'new' && e.state.era === 'past') e.lib.chairPaint(g, true);");
el({ id: 'garland', name: 'Гирлянда', across: 11.4, distance: 21, facing: 270, glows: true, height: 7, box: [-0.2, -7, 12.2, -5.4] }, 'e.lib.garlandPaint(g, e);', 'e.lib.garlandMove(e);');

// the fountain: its basin and its column (forms), its water
el({ id: 'fountain', name: 'Фонтан', across: 0, distance: 13, height: 0.5, box: [-4.6, -0.55, 4.6, 0.02], shadow: true },
  `g.fillStyle = '#b3a07c'; g.fillRect(-4.6, -0.55, 9.2, 0.57);
g.fillStyle = 'rgba(60,45,30,0.25)'; for (let i = 0; i < 20; i++) g.fillRect(-4.6 + i * 0.46, -0.55, 0.03, 0.57);
g.fillStyle = '#c8b690'; g.fillRect(-4.6, -0.55, 9.2, 0.08);
e.form(e.kit.revolve([[1.42, 0.5], [1.45, 0.47], [1.45, 0.05], [1.5, 0]]), { closed: 'u' });
e.at(0, -0.5);`);
el({ id: 'fountain_col', name: 'Фонтан', across: 0, distance: 13, height: 1.9, box: [-1.2, -1.95, 1.2, 0.02], shadow: true },
  `g.fillStyle = '#b9a67f'; g.fillRect(-1.2, -1.95, 2.4, 1.97);
g.fillStyle = 'rgba(60,45,30,0.3)'; for (let i = 0; i < 8; i++) g.fillRect(-1.2 + i * 0.3, -1.95, 0.02, 1.97);
e.form(e.kit.revolve([[0.05, 1.9], [0.38, 1.62], [0.4, 1.55], [0.1, 1.45], [0.13, 0.5], [0.22, 0.4], [0.22, 0.42]]), { closed: 'u' });`);
el({ id: 'fountain_water', name: 'Вода', plane: true, across: 0, distance: 13, elevation: 0.42, width: 2.9, depth: 2.9 },
  "g.fillStyle = '#26323a'; g.beginPath(); g.arc(0, 0, 1.42, 0, Math.PI * 2); g.fill(); g.strokeStyle = 'rgba(200,210,220,0.18)'; g.lineWidth = 0.02; for (const r of [0.6, 0.9, 1.2]) { g.beginPath(); g.arc(0, 0, r, 0, Math.PI * 2); g.stroke(); }");
objects.push({ id: 'fountain_spout', name: 'Струйки', particles: { kind: 'splashes', at: [0, 13, 1.8], rate: 26, speed: [0.6, 1.0], spread: 40, direction: [0, 0, 1], size: [0.02, 0.01], life: [0.6, 0.9], color: '#c8d4dc', opacity: 0.5 } });

// lampposts of the square
el({ id: 'lamppost', name: 'Фонарь', across: -5.5, distance: 21.5, height: 4.1, box: [-0.3, -4.15, 0.3, 0.02], shadow: true,
  copies: [{ across: -5.5, distance: 21.5 }, { across: 6.5, distance: 8.5 }, { across: 2.5, distance: -14 }, { across: -7.2, distance: 0.4 }] }, 'e.lib.lamppost(g, e);');

// the painted crowds (standing, sitting), moved to where a beat wants them
el({ id: 'crowd_far', name: 'Толпа', across: 0, distance: -60, facing: 180, place: { across: 'crowd_x', distance: 'crowd_z', facing: 'crowd_f' }, height: 1.7, box: [-6.3, -2.0, 6.6, 0.1] },
  'e.lib.crowdRows(g, e, false);', 'e.lib.crowdMove(e, false);');
el({ id: 'crowd_sit', name: 'Толпа на камнях', across: 0, distance: -60, facing: 180, place: { across: 'crowd_x', distance: 'crowd_z', facing: 'crowd_f' }, height: 1.1, box: [-6.3, -1.4, 6.6, 0.1] },
  'e.lib.crowdRows(g, e, true);', 'e.lib.crowdMove(e, true);');

// the hearse: an anchor moved along its way, its parts on it (laid out as if it went south: its back north)
objects.push({ id: 'hearse_anchor', name: 'Катафалк', unseen: true, across: -9.6, distance: -8, place: { across: 'hearse_a', distance: 'hearse_d', facing: 'hearse_f' } });
el({ id: 'hearse', name: 'Повозка с гробом', on: 'hearse_anchor', across: 0, distance: 1.2, facing: 0, height: 1.5, box: [-1.0, -1.65, 1.0, 0.03], shadow: true }, 'e.lib.hearseBack(g, e);');
el({ id: 'hearse_l', name: 'Повозка с гробом', on: 'hearse_anchor', across: 0.58, distance: 0, facing: 90, height: 1.5, box: [-1.25, -1.6, 1.25, 0.03], shadow: true }, 'e.lib.hearseSide(g);');
el({ id: 'hearse_r', name: 'Повозка с гробом', on: 'hearse_anchor', across: -0.58, distance: 0, facing: 270, height: 1.5, box: [-1.25, -1.6, 1.25, 0.03], shadow: true }, 'e.lib.hearseSide(g);');
el({ id: 'hearse_front', name: 'Повозка с гробом', on: 'hearse_anchor', across: 0, distance: -1.2, facing: 180, height: 1.5, box: [-1.0, -1.65, 1.0, 0.03] }, 'e.lib.hearseBack(g, { at() {} });');
el({ id: 'hearse_top', name: 'Гроб', on: 'hearse_anchor', plane: true, across: 0, distance: 0, elevation: 1.42, width: 0.8, depth: 2.1 }, 'e.lib.hearseTop(g);');

// particles: the booth's smoke, the fireworks, the rain, the dust of the demolition
objects.push({ id: 'smoke_booth', name: 'Дым', particles: { kind: 'smoke', at: 'paradiso#booth_window', amount: 'smoke', rate: 14, size: [0.6, 3.2], life: [4, 7], speed: [0.4, 0.9], direction: [1, 0, 0.6], spread: 30, gravity: -0.5, color: '#3a3532', opacity: 0.75, shadow: 0.6 } });
objects.push({ id: 'fireworks', name: 'Фейерверк', particles: { kind: 'sparks', at: [6, -2, 11], source: [10, 4, 3], burst: { on: 'fw', count: 220 }, speed: [4, 8], spread: 180, direction: [0, 0, 1], gravity: 2.2, drag: 0.6, life: [1.2, 2.2], ground: 'pass', colors: ['#ffd28a', '#ff8a6a', '#a8c8ff', '#fff2d8'], glow: [7, 1] } });
objects.push({ id: 'rain_fall', name: 'Дождь', particles: { kind: 'rain', amount: 'rain', count: 18000, reach: 18, color: '#cdd6e6', opacity: 0.6 } });
objects.push({ id: 'demolition_dust', name: 'Пыль', particles: { kind: 'puff', at: [-12.5, 13, 2.5], source: [3, 14, 5], burst: { on: 'dust_burst', count: 700, over: 3 }, size: [3, 9], life: [14, 22], speed: [1, 4], spread: 120, direction: [1, 0, 0.3], gravity: -0.05, drag: 1.2, color: '#b9b1a4', opacity: 0.55, shadow: 0.4 } });

// the viewfinder (the world's closeups)
el({ id: 'viewfinder', name: 'Видоискатель', insert: 'viewfinder' }, 'e.kit.closeups.viewfinder(g, e);', 'e.kit.closeups.viewfinderMove(e);');

// the people
const PEOPLE = [
  ['toto', 'Тото', 'toto_boy'], ['alfredo', 'Альфредо', 'alfredo'], ['maria', 'Мария', 'maria'], ['elena', 'Елена', 'elena'],
  ['daughter', 'Девушка', 'daughter'], ['madman', 'Сумасшедший', 'madman'], ['anna', 'Анна', 'anna'],
  ['bearer1', 'Носильщик', 'villager_m', { colors: { top: '#2a2826', bottom: '#1e1c1b', hat: '#1a1918' } }],
  ['bearer2', 'Носильщик', 'old_m', { colors: { garment: '#262422', hat: '#1a1918' } }],
  ['c1', 'Мужчина', 'villager_m', { colors: { top: '#7a6a58', bottom: '#3a3530' } }], ['c2', 'Женщина', 'villager_w', { colors: { top: '#6e5a62', garment: '#3a2e34' } }],
  ['c3', 'Старик', 'old_m', { colors: { garment: '#5a5246' } }], ['c4', 'Старуха', 'old_w', {}], ['c5', 'Мальчишка', 'kid', { colors: { top: '#8a7a5a' } }],
  ['c6', 'Мужчина', 'villager_m', { colors: { top: '#5a6670', bottom: '#2e2c2a', hat: '#4a4038' } }], ['c7', 'Женщина', 'villager_w', { colors: { top: '#7a6a4a', garment: '#4a3a2a' } }],
  ['c8', 'Старик', 'old_m', { colors: { garment: '#3e3a36' } }], ['c9', 'Парень', 'villager_m', { colors: { top: '#a29a86', bottom: '#3a3530', hat: '#2a2826' } }],
  ['c10', 'Женщина', 'villager_w', { colors: { top: '#5e5248' } }],
];
for (const [id, name, who, look] of PEOPLE) {
  const p = { id, name, person: { cast: 'cast', who, ...(look ? { look } : {}) }, across: 0, distance: -40, place: { across: `${id}_a`, distance: `${id}_d` }, shadow: true };
  objects.push(p);
}

// ── the scene ─────────────────────────────────────────────────────────────────────────────────────────────────────
const lights = [
  { id: 'moon', from: 'sky#disc', color: '#c4d0ff', strength: 0.55 },
  { id: 'booth_light', of: 'booth_in#win', color: '#ffc27a', strength: 1.3, reach: 9, flicker: 0.1 },
  { id: 'marquee', of: 'canopy_front#marquee', color: '#ffcf8a', strength: 1.1, reach: 7, flicker: 0.05 },
  { id: 'wall_light', across: 2, distance: 23.6, elevation: 4.2, color: '#ffe0b0', strength: 1.4, reach: 12, on: 'wall_lit', flicker: 0.15 },
  { id: 'mother_light', of: 'mother_window#lamp', color: '#ffbf75', strength: 0.8, reach: 6, on: 'mother_light' },
  { id: 'alf_lamp', of: 'alfredo_door#lamp', color: '#e8dcc4', strength: 1.0, reach: 7 },
  { id: 'bank_lamp', of: 'bank#lamp', color: '#e4e0d4', strength: 1.3, reach: 9 },
  { id: 'elena_light', of: 'balcony_room#room', color: '#ffc882', strength: 0.9, reach: 7, on: 'elena_window' },
  { id: 'lamp0', across: -5.5, distance: 21.5, elevation: 3.8, color: '#e2e0d6', strength: 1.0, reach: 8 },
  { id: 'lamp2', across: 6.5, distance: 8.5, elevation: 3.8, color: '#e2e0d6', strength: 1.5, reach: 12 },
  { id: 'par_lamp', of: 'paradiso#lamp', color: '#e8e2d2', strength: 1.3, reach: 8 },
  { id: 'lamp4', across: -7.2, distance: 0.4, elevation: 3.8, color: '#e2e0d6', strength: 1.0, reach: 8 },
  { id: 'porch_fill', across: -6.2, distance: 8.0, elevation: 4.2, color: '#c9d0e4', strength: 0.8, reach: 8 },
  { id: 'beam_tip', across: -8.6, distance: 15.2, elevation: 1.1, place: { across: 'tip_x', distance: 'tip_z', elevation: 'tip_y' }, color: '#ffd9a0', strength: 1.6, reach: 3.2, on: 'tip_on', flicker: 0.12 },
  { id: 'flash', across: 4, distance: 4, elevation: 14, color: '#ffe6c8', strength: 2.2, reach: 45, on: 'flash' },
];
const light = {
  ambient: 0.58, ambientColor: '#7486c0', tint: '#22305e', tintStrength: 0.06, vignette: 0.34, grain: 0.13,
  haze: 0.06, hazeColor: '#2e4470', hazeGlow: 0.8, shafts: 0.2, bounce: 0.62, brightness: 1.16, saturation: 0.95,
  wind: [0.6, 0.3, 0.3],
  looks: {
    dusk_k: { ambient: 0.72, ambientColor: '#c0a8b0', tint: '#c88a66', tintStrength: 0.09, hazeColor: '#b89a96', lights: { moon: 0.35 } },
    now_k: { ambientColor: '#8c8eaa', saturation: 0.6, tint: '#7b7ca4', tintStrength: 0.09, hazeColor: '#5a5c74' },
    morning_k: { ambient: 0.95, ambientColor: '#c6c8ce', saturation: 0.5, haze: 0.22, hazeColor: '#a8aab2', brightness: 1.04, lights: { moon: 0 } },
    rain: { ambient: 0.36, haze: 0.22, hazeColor: '#26304a', hazeGlow: 1.1, wind: [1.6, 0.6, 1.2], lights: { moon: 0.25 } },
    wind_k: { wind: [2.2, 0.4, 1.6] },
    cold_k: { ambientColor: '#6a80c8', saturation: 0.8, tint: '#203466', tintStrength: 0.1 },
    dust: { haze: 0.9, hazeColor: '#bdb5a8', ambient: 1.0, ambientColor: '#c4beb4', lights: { moon: 0 } },
  },
};
const num = (range, means, smooth) => ({ range, means, ...(smooth ? { smooth: true } : {}) });
const states = {
  beat: { type: 'string', means: 'кусок, который играет сцена (ставит игра): ' + LIB.ORDER.join(', ') },
  beat_next: { type: 'string', means: 'кусок, снимок начала которого готовить (ставит игра); пусто — следующий по таблице' },
  era: { values: ['past', 'now'], means: 'время: past — тёплая ночь прошлого (1949–1958), now — прохладный 1988' },
  hour: num([0, 1], 'час: 0.3 утро, 0.78–0.8 сумерки, 0.9 ночь'),
  dusk_k: num([0, 1], 'служебный: свет сумерек (ставит кусок из hour)', true),
  now_k: num([0, 1], 'служебный: свет 1988 года (ставит кусок из era)', true),
  morning_k: num([0, 1], 'служебный: серое утро 1988 года', true),
  past: num([0, 1], 'переход в прошлое (только rewind, слоями): 0 — 1988, 1 — прошлое; куски настоящего держат 0, прошлого 1', true),
  paradiso_state: { values: ['old', 'burnt', 'new', 'shut', 'charged'], means: '«Парадизо»: старый, сгоревший, новый, заколоченный, с зарядами' },
  poster: { values: [0, 1], means: 'афиша «Унесённые ветром» у дверей' },
  full_sign: { values: [0, 1], means: 'табличка «Мест нет» на дверях' },
  mother_light: num([0, 1], 'свет в окне матери', true),
  beam_on: num([0, 1], 'луч из окошка будки', true),
  beam_aim: num([0, 1], 'конец луча: 0 — пятно на камне и головах под окошком, 1 — белая стена (двигает игра)', true),
  beam_turn: { type: 'number', means: 'служебный: куда луч смотрит в плане, градусы (сцена из beam_aim)' },
  beam_pitch: { type: 'number', means: 'служебный: наклон луча, градусы (+ вверх; сцена из beam_aim)' },
  tip_x: { type: 'number', means: 'служебный: пятно света на конце луча, поперёк' }, tip_z: { type: 'number', means: 'служебный: пятно, вглубь' }, tip_y: { type: 'number', means: 'служебный: пятно, высота' },
  tip_on: num([0, 1], 'служебный: пятно на конце луча горит', true),
  beam_sky: { values: [0, 1], means: 'служебный: луч вверх над площадью (пролог)' },
  beam_focus: num([0, 1], 'резкость фильма на стене (двигает игра)', true),
  wall_film: { values: ['none', 'comedy', 'white'], means: 'кадр на стене' },
  wall_lit: { values: [0, 1], means: 'свет стены с фильмом (ставит сцена)' },
  wall_burn: num([0, 1], 'кадр на стене горит', true),
  smoke: num([0, 1], 'дым из окошка будки', true),
  fireworks: { values: [0, 1], means: 'фейерверк идёт' },
  fw: { type: 'number', means: 'служебный: счётчик залпов фейерверка' },
  flash: num([0, 1], 'служебный: вспышка (фейерверк, переход в прошлое)', true),
  chalk: num([0, 99], 'палочки мелом на стене банка (рисунок; меняется пачками)'),
  mark_chalk: { values: [0, 1], means: 'импульс: Тото ставит палочку (сцена играет chalk_mark и сбрасывает в 0)' },
  night_kind: { values: ['clear', 'rain', 'wind', 'feast', 'cold'], means: 'какая ночь недели' },
  rain: num([0, 1], 'служебный: дождь (из night_kind)', true),
  wind_k: num([0, 1], 'служебный: ветер (из night_kind)', true),
  cold_k: num([0, 1], 'служебный: холод (из night_kind)', true),
  garland: num([0, 1], 'служебный: праздничная гирлянда (из night_kind)', true),
  elena_window: num([0, 1], 'ставня балкона Елены и свет за ней', true),
  viewfinder: num([0, 1], 'вставка «видоискатель»', true),
  pan: num([-1, 1], 'видоискатель: куда смотрит камера', true),
  elena_x: num([-1, 1], 'видоискатель: где девушка', true),
  madman_x: num([-1, 1], 'видоискатель: где сумасшедший (виден при |x| < 0.97)', true),
  rec: { values: [0, 1], means: 'видоискатель: камера пишет' },
  cart: num([0, 1], 'катафалк на пути с юга вдоль западной стороны к ступеням церкви', true),
  hearse_a: { type: 'number', means: 'служебный: где катафалк поперёк (из cart)' },
  hearse_d: { type: 'number', means: 'служебный: где катафалк вглубь (из cart)' },
  hearse_f: { type: 'number', means: 'служебный: куда катафалк едет, градусы (из cart)' },
  follow: { values: [0, 1], means: 'служебный: процессия идёт за катафалком' },
  sal_rail: { values: [0, 1], means: 'служебный: Сальваторе идёт у повозки, рука на ней' },
  collapse: num([0, 1], 'фасад «Парадизо» оседает (слоями)', true),
  dust: num([0, 1], 'пыль сноса в воздухе', true),
  dust_burst: { type: 'number', means: 'служебный: облако пыли (вспышка частиц)' },
  booth_flash: num([0, 1], 'служебный: окошко будки вспыхивает', true),
  booth_fig: num([0, 1], 'служебный: Альфредо и мальчик в окошке будки (дальние)', true),
  crowd_k: num([0, 1], 'служебный: нарисованная толпа видна', true),
  crowd_sit: num([0, 1], 'служебный: нарисованная толпа сидит', true),
  crowd_x: { type: 'number', means: 'служебный: где нарисованная толпа поперёк' },
  crowd_z: { type: 'number', means: 'служебный: где нарисованная толпа вглубь' },
  crowd_f: { type: 'number', means: 'служебный: куда она смотрит' },
  chair_on: { values: [0, 1], means: 'служебный: стул Тото у стены банка' },
  bulbs: num([0, 1], 'служебный: лампочки новой вывески загораются', true),
  warm: num([0, 1], 'ключ партии: тепло окон площади в прошлом (0.3 + 0.6·warm)', true),
  place: { values: ['crowd', 'apart'], means: 'ключ партии: где Сальваторе на сносе' },
  with_mother: { values: [0, 1], means: 'ключ партии: старая Мария рядом с ним на сносе' },
};
const state = { beat: '', beat_next: '', era: 'past', hour: 0.9, dusk_k: 0, now_k: 0, morning_k: 0, past: 1, paradiso_state: 'old', poster: 0, full_sign: 0,
  mother_light: 0, beam_on: 0, beam_aim: 0, beam_turn: 103.6, beam_pitch: -55.3, tip_x: -8.6, tip_z: 15.2, tip_y: 1.1, tip_on: 0, beam_sky: 0, beam_focus: 0, wall_film: 'none', wall_lit: 0, wall_burn: 0, smoke: 0,
  fireworks: 0, fw: 0, flash: 0, chalk: 0, mark_chalk: 0, night_kind: 'clear', rain: 0, wind_k: 0, cold_k: 0, garland: 0, elena_window: 0,
  viewfinder: 0, pan: 0, elena_x: 1, madman_x: -1, rec: 0, cart: 0, hearse_a: -9.6, hearse_d: -8, hearse_f: 0, follow: 0, sal_rail: 0,
  collapse: 0, dust: 0, dust_burst: 0, booth_flash: 0, booth_fig: 0, crowd_k: 0, crowd_sit: 0, crowd_x: 0, crowd_z: -60, crowd_f: 180,
  chair_on: 0, bulbs: 1, warm: 0.5, place: 'crowd', with_mother: 0, camera_x: 0, camera_z: -4, camera_yaw: -8, camera_h: 0.3, camera_pitch: 2 };
for (const [id] of PEOPLE) {
  state[`${id}_a`] = 0; state[`${id}_d`] = -40; state[`${id}_here`] = false;
  states[`${id}_a`] = { type: 'number', means: `служебный: где ${id} поперёк, м` };
  states[`${id}_d`] = { type: 'number', means: `служебный: где ${id} вглубь, м` };
}
// the first pose: the beat now_open's (the square of 1988 at dusk)
const spec = {
  engine: 3, title: 'Площадь', caption: 'Джанкальдо. Площадь «Парадизо»', horizon: 0.5,
  camera: { mode: 'roam', area: [-12, 12, -14, 26] },
  light, lights, state, states, modules: ['cast', 'kino', 'closeups', 'beats', 'nebo'],
  music: { prompts: [
    { text: 'quiet night ambience of a Sicilian town square, distant cicadas, faint murmur of voices, no melody', weight: 1 },
    { text: 'soft warm drone, slow and sparse, a little wind, nostalgic, no rhythm', weight: 0.4 },
    { text: 'gentle sea far away, a slow wash of waves behind stone houses', weight: 0.3 },
    { text: 'distant church bell reverb tail, very sparse', weight: 0 }, { text: 'faint accordion far away, almost inaudible', weight: 0 },
  ], bpm: 70, density: 0.15, brightness: 0.3, scale: 'E_MAJOR_D_FLAT_MINOR' },
  objects,
};
// the world's shaders: the sky's (tools/nebo-sky.wgsl) and the beam's (tools/kino-beam.wgsl)
const sky = objects.find(o => o.id === 'sky'); sky.sky = true;
files['elements/sky.wgsl'] = wgsl('nebo-sky');
const beam = objects.find(o => o.id === 'beam'); beam.glows = true; beam.uniforms = { on: 0, ...(beam.uniforms || {}) };
files['elements/beam.wgsl'] = wgsl('kino-beam');
fs.writeFileSync(path.join(DIR, 'scene.json'), JSON.stringify(spec, null, 2) + '\n');
fs.rmSync(path.join(DIR, 'elements'), { recursive: true, force: true });
for (const [f, text] of Object.entries(files)) {
  fs.mkdirSync(path.dirname(path.join(DIR, f)), { recursive: true });
  fs.writeFileSync(path.join(DIR, f), text.endsWith('\n') ? text : text + '\n');
}
console.log(objects.length, 'objects', Object.keys(files).length, 'files');
