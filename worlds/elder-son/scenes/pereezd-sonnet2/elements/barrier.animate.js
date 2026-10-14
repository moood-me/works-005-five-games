// стрела: 0 — поднята (почти вертикально), 1 — лежит поперёк дороги
const b = e.state.barrier || 0, a = -(1 - b) * 1.35;
e.layer('arm').rotate = a;
e.at(2.5 * Math.cos(a), -1.15 + 2.5 * Math.sin(a));
e.glow('tip', 0.35 + 0.65 * (e.state.sig_a || 0));
