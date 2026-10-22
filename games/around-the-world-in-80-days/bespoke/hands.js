// What the minigames (minigames/*.js) wait for and send, on the language of mini-games (bespoke.minigame — a
// vocabulary: marks, gestures that report, responses; what happens is each minigame's own code). A wait settles with
// nothing once the mini-game is left (skipped, the step left).
//   until(mg, fn) → true once fn({t, dt}) is truthy on a frame of the mini-game; false if it ends first
//   once(mg, h, event, test) → the first data of the word h's event that test passes (true if it has none); null if
//     the mini-game ends first
//   shown(b, mg, gestures, marks) → true once the player has touched, false if the mini-game ends first: the ghost
//     shows the gestures as they come up — every time, not only the first in the play — and again whenever the player
//     stands still (tricks.teach), once the marks given are placed on the screen (a rhythm's ghost with no place yet
//     would tap the middle); what the hands are to do there is not timed until the player has touched
//   keys(g) → send(key, value) — a key of the scene set when it differs by more than 0.01 from what the scene has now
//     (g.get — a key the game set directly too), reaching 0 or 1 always
export const until = (mg, fn) => new Promise(ok => {
  const offs = [mg.on('frame', e => { if (fn(e)) { offs.forEach(f => f()); ok(true); } }), mg.on('end', () => { offs.forEach(f => f()); ok(false); })];
});
export const once = (mg, h, event, test = () => true) => new Promise(ok => {
  const offs = [h.on(event, x => { if (test(x)) { offs.forEach(f => f()); ok(x ?? true); } }), mg.on('end', () => { offs.forEach(f => f()); ok(null); })];
});
export async function shown(b, mg, gestures, marks = []) {
  if (marks.length && !(await until(mg, () => marks.every(m => m.pos)))) return false;
  b.minigame.tricks.teach(mg, gestures);
  return new Promise(ok => {
    const offs = [mg.on('down', () => done(true)), mg.on('end', () => done(false))];
    const done = v => { offs.forEach(f => f()); ok(v); };
  });
}
export function keys(g) {
  return (key, value) => {
    const was = g.get(key);
    if (typeof was === 'number' && Math.abs(value - was) <= 0.01 && !((value === 0 || value === 1) && value !== was)) return;
    g.set(key, value);
  };
}
