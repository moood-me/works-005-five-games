const s = e.state, L = e.lib;
e.glow("light", L.lampLit(s) * L.capeMist(s) * ((s.light3 ?? 2) > 1 ? 0.45 : 1));
