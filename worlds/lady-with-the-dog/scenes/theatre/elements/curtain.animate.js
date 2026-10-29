// the curtain gathered to the sides as it opens (`curtain` 0 down … 1 up)
const c = e.lib.clamp01(e.state.curtain), k = 1 - 0.8 * c;
e.layer('left').scaleX = k;
e.layer('right').scaleX = k;
