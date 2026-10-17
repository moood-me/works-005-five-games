
// One row of seats from behind (the eight rows are its copies): velvet backs on iron standards. In 1988 two layers:
// the bare frames (ruin) and, over them, the seats as they were — shown only in the memory (`past`).
const P = e.lib;
if (e.state.era !== 'ruin') { P.seatRow(g, false); return; }
e.layer('ruin', {}, r => P.seatRow(r, true));
e.layer('whole', {}, w => P.seatRow(w, false));
