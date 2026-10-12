// The low stone wall along the quay's edge: open at the steps down to the water, at the pier and at the landing.
const P = e.lib.plan;
g.fillStyle = '#8c8880';
for (const [a, b] of P.parapet) g.fillRect(a, -0.85, b - a, 0.85);
g.fillStyle = 'rgba(0,0,0,0.12)';
for (const [a, b] of P.parapet) for (let x = a + 1.2; x < b; x += 1.2) g.fillRect(x, -0.85, 0.03, 0.85);
e.at(-18, -0.9, 'parapet');
