// lit from dusk till the morning (lib.lampLit) — unseen while the mist of the night of waiting lies on the cape's end
// (lib.capeMist: it parts as `light3` comes to 1); a flash every eight seconds as the lamp turns, its beam sweeping out
// to one side and the other, longer in the mist
const s = e.state, A = e.anim;
const on = e.lib.lampLit(s) * (1 - e.lib.capeMist(s));
const turn = (e.t / 8) * 2 * Math.PI;
const flash = Math.max(0, Math.cos(turn)) ** 8;
e.glow("lamp", on * (0.35 + 0.65 * flash));
const side = Math.sin(turn);
const reach = on * (0.4 + 0.6 * A.clamp(s.mist ?? 0, 0, 1));
const right = Math.max(0, side) * reach, left = Math.max(0, -side) * reach;
e.layer("right").scaleX = Math.max(0.01, right);
e.layer("right").alpha = right > 0.01 ? on : 0;
e.layer("left").scaleX = Math.max(0.01, left);
e.layer("left").alpha = left > 0.01 ? on : 0;
e.layer("lamp").alpha = on;
