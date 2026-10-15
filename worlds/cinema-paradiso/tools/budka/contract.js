// the «Контракт для проверки» block of notes.md, from the code (lib.js film, scene.json)
const fs = require('fs'), path = require('path');
const dir = path.join(__dirname, '..', '..', 'scenes', 'budka');
const src = fs.readFileSync(path.join(dir, 'lib.js'), 'utf8'), spec = JSON.parse(fs.readFileSync(path.join(dir, 'scene.json'), 'utf8'));
const SECONDS = { cutting: 12, splice_in: 2, frames: 9, tin_shut: 6, pocket: 8, deal: 17, slate_in: 2, slate_out: 5, lesson: 10,
  motor: 13, window: 9, jam: 9, smoke_in: 5, story_booth: 26, reels: 15, six: 7, changeover: 2, alfredo_comes: 12, knock: 9,
  runs: 6, note: 24, note_close: 4, morning: 8, autumn: 16, ruins: 13, calendar: 5, window_strip: 3, strip_end: 7 };
const start = src.indexOf('const FILM = {'), body = src.slice(start);
const names = [...body.matchAll(/^  ([a-z_]+): \{$/gm)].map(m => [m[1], m.index]);
const beats = {};
names.forEach(([n, i], k) => {
  const chunk = body.slice(i, k + 1 < names.length ? names[k + 1][1] : undefined);
  const after = (chunk.match(/after: (\[[^\]]*\]|'[a-z_]+')/) || [])[1];
  beats[n] = { after: after ? [].concat(eval(after)) : [], tells: [...chunk.matchAll(/s\.tell\('([^']+)'\)/g)].map(m => m[1]), seconds: SECONDS[n], show: false };
});
const contract = {
  beats,
  points: ['tin', 'toto', 'alfredo', 'elena', 'projector', 'projector#motor', 'projector#lever', 'projector#gate', 'projector#lens', 'projector#side', 'projector#top',
    'projector2', 'projector2#motor', 'projector2#lever', 'projector2#gate', 'projector2#lens', 'projector2#side', 'projector2#top', 'floor#path0', 'floor#path1',
    'toto#hand_r', 'wall_calendar#page', 'booth_door#edge', 'bench#pencil', 'press#press', 'lamp', 'look_port', 'clock#face', 'square_window',
    'slate_nail', 'p1_side#reel',
    'splice#cut1', 'splice#cut2', 'splice#cut3', 'splice#cut1_end', 'splice#cut2_end', 'splice#cut3_end', 'splice#glue1', 'splice#glue2', 'splice#glue3',
    'slate#start', 'slate#end', 'thread#p0', 'thread#p1', 'thread#p2', 'thread#p3', 'thread#p4', 'thread#p5', 'calendar#fold', 'strip#hand_l', 'strip#hand_r'],
  offers: ['tin', 'toto', 'elena', 'alfredo'],
  party: { alfredo_here: 0, jumps: 0, slate_letters: '00000000' },
  keys: {},
};
for (const k of ['beat_next', 'cue', 'motor1', 'motor2', 'active', 'white', 'clock', 'drag', 'cough', 'stutter', 'cut1', 'cut2', 'cut3', 'glue1', 'glue2', 'glue3',
  'bent1', 'bent2', 'bent3', 'boy_reach', 'chalk_x', 'letters', 'crooked', 'wobble', 'threaded', 'pull', 'loop', 'pages', 'fold', 'dust', 'strip_x',
  'splice', 'slate', 'thread', 'calendar', 'strip']) {
  if (!(k in spec.states)) throw new Error('no state ' + k);
  contract.keys[k] = spec.state[k];
}
const block = '```json\n' + JSON.stringify(contract) .replace(/\},"/g, '},\n"') + '\n```\n';
const notes = fs.readFileSync(path.join(dir, 'notes.md'), 'utf8').replace(/## Контракт для проверки[\s\S]*$/, '## Контракт для проверки\n\n' + block);
fs.writeFileSync(path.join(dir, 'notes.md'), notes);
console.log(Object.keys(beats).length, 'beats');
