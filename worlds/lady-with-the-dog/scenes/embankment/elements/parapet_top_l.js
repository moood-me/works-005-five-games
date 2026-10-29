const W = 30;
// the parapet's top (the dog runs and sits on it)
g.fillStyle = '#e4ddcd'; g.fillRect(-W / 2, -0.225, W, 0.45);
g.fillStyle = 'rgba(150,138,118,0.4)'; for (let x = -W / 2; x < W / 2; x += 2.4) g.fillRect(x, -0.225, 0.03, 0.45);
