// A catenary mast between the tracks: a concrete pole from the bed, its arms out over both tracks, the insulators.
g.fillStyle = '#7d7f84';
g.fillRect(-0.15, -8.6, 0.3, 8.6);
g.fillStyle = '#5c5e63';
g.fillRect(-2.6, -7.9, 5.2, 0.12);
g.fillRect(-2.4, -7.0, 4.8, 0.08);
g.fillStyle = '#3a3c40';
for (const x of [-2.2, 2.2]) g.fillRect(x - 0.05, -7.9, 0.1, 0.5);
g.fillStyle = '#e4eaf2';
g.fillRect(-2.6, -8.0, 5.2, 0.05);
