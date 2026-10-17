// the curtain's free edge, where it is drawn to now (`curtain` 0 gathered at the left … 1 across)
const L = e.lib, c = L.clamp01(e.state.curtain);
const x0 = L.HER_WIN - L.WIN.w / 2;
e.at(x0 + 0.1 + c * (L.WIN.w - 0.16), (L.WIN.y0 + L.WIN.y1) / 2 + 0.05, 'curtain');
