// Fogg's watch, close, alive: the hand sways with the carriage and his breath (a little turn about the watch, a
// little way aside), trembling as the train runs; the seconds' hand ticks, going with the hand it lies on.
const L = e.lib, C = L.CLOSE, n = e.anim.noise, t = e.t;
const run = e.anim.clamp(e.state.speed ?? 0, 0, 1);
const turn = 0.012 * n(t * 0.45, 1) + 0.004 * n(t * 2.1, 2) * run;
const dx = 0.006 * n(t * 0.6, 3) + 0.0012 * n(t * 6.5, 4) * run;
const dy = 0.004 * Math.sin(t * 1.25) + 0.004 * n(t * 0.5, 5) + 0.0012 * n(t * 7.3, 6) * run;
const hand = e.layer('hand'), second = e.layer('second');
hand.rotate = turn;
hand.x = dx;
hand.y = dy;
// (the seconds' hand's axle, carried round the watch's middle as the hand turns)
const w = L.closeAt(C.watch), s = L.closeAt([C.watch[0] + C.seconds[0], C.watch[1] + C.seconds[1]]);
const c = Math.cos(turn), q = Math.sin(turn), rx = s[0] - w[0], ry = s[1] - w[1];
second.x = w[0] + c * rx - q * ry - s[0] + dx;
second.y = w[1] + q * rx + c * ry - s[1] + dy;
const whole = Math.floor(t);
second.rotate = turn + ((whole + e.anim.ease.out(e.anim.clamp((t - whole) / 0.12, 0, 1))) * Math.PI) / 30;
