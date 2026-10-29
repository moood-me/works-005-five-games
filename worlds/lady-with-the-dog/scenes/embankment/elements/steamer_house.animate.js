// its lights by the evening (`steamer_lit`)
const k = Math.max(0, Math.min(1, Number(e.state.steamer_lit) || 0));
for (let i = 0; i < 6; i++) e.glow(`w${i}`, k);
