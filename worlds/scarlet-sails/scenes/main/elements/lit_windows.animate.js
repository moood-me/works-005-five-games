const A = e.anim, names = e.lib.WINDOW_NAMES, last = names.length - 1;
const lit = A.clamp(e.state.windows ?? 0, 0, 1);
for (let n = 0; n < last; n++) e.glow(names[n], lit >= 1 ? 1 : A.clamp((lit - A.hash(n, 5)) * 20, 0, 1));
e.glow(names[last], A.clamp(e.state.longren_window ?? 0, 0, 1));
