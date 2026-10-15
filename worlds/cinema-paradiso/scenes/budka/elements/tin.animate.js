if (e.state.tin_at !== 'bench' || e.state.era === 'ruin') return;
const o = Math.max(0, Math.min(1, e.state.tin_open || 0)), l = e.layer('lid');
l.rotate = -o * 2.6; l.y = -o * 0.02;
