// lit as the night comes
const on = e.lib.townLit(e.state);
e.layer("lit").alpha = on;
for (let i = 0; i < 4; i++) e.glow(`lamp${i}`, on);
