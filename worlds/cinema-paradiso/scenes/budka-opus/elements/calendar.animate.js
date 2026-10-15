
const w = Math.max(0, Math.min(1, e.state.written || 0));
for (let k = 0; k < 4; k++) e.layer('line' + k).alpha = Math.max(0, Math.min(1, w * 4 - k));
